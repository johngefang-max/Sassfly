import type { NextRequest } from "next/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@saasfly/auth";
import { ZodError } from "zod";

import { transformer } from "./transformer";

interface CreateContextOptions {
  req?: NextRequest;
}

// 创建 tRPC 上下文
export const createTRPCContext = async (opts: {
  headers: Headers;
}) => {
  const session = await getServerSession(authOptions);
  
  return {
    userId: session?.user?.id,
    user: session?.user,
    ...opts,
  };
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

export const t = initTRPC.context<TRPCContext>().create({
  transformer,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const procedure = t.procedure;
export const mergeRouters = t.mergeRouters;

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  // Make ctx.userId non-nullable in protected procedures
  return next({ 
    ctx: { 
      userId: ctx.userId,
      user: ctx.user 
    } 
  });
});


export const protectedProcedure = procedure.use(isAuthed);