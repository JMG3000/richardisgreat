import { createHmac } from "node:crypto";
import { auth } from "@/auth";

export async function accountKey() {
  const session = await auth();
  const subject = session?.accountSubject;
  if (!subject || !process.env.ACCOUNT_HASH_SECRET) return null;
  return createHmac("sha256", process.env.ACCOUNT_HASH_SECRET).update(subject).digest("hex");
}
