import { createKysely } from "@vercel/postgres-kysely";

import type { DB } from "./prisma/types";

export { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";

export * from "./prisma/types";
export * from "./prisma/enums";

// 添加环境变量检查和错误处理
if (!process.env.POSTGRES_URL) {
  console.warn("POSTGRES_URL environment variable is not set");
}

export const db = createKysely<DB>({
  connectionString: process.env.POSTGRES_URL,
});
