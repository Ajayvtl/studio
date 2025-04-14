import { NextApiRequest } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

export async function getCurrentStaff() {
  const session = await getSession();
    return session?.user || null;
}

//verifyPermissions
export async function verifyPermissions(module: string, permission: string) {
  const session = await getSession();
  if (!session?.user) {
    return false;
  }
  // Replace this with your actual permission verification logic
  // This is a placeholder implementation
  return true;
}
