'use server'
import { NextApiRequest } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import bcrypt from 'bcryptjs';

import getPool, {query, endPool} from '@/lib/db';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

export async function getCurrentStaff() {
    const session = await getSession();
    // Ensure session and session.user are defined before accessing properties
    return session?.user ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        permissions: session.user.permissions
    } : null;
}

export async function verifyPermissions(module: string, permission: string) {
  return true;
}
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

