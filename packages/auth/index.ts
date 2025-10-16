import { getServerSession } from "next-auth";
import { authOptions } from "./nextauth";

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export { authOptions } from "./nextauth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}
