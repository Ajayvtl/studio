
import { NextApiRequest } from 'next';

export async function getSession() {
    return null;
}

export async function getCurrentUser() {
  return null;
}

export async function getCurrentStaff() {
  return null;
}

//verifyPermissions
export async function verifyPermissions(module: string, permission: string) {
  return true;
}
