import { NextApiRequest } from 'next';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()

  return session?.user
}

export async function getCurrentStaff() {
    const session = await getSession();
    if (!session?.user?.email) {
        return null;
    }

    // Dummy staff data - replace with database call in production
    const staffData = {
        id: 'staff1',
        name: session.user.name || 'Unknown Staff',
        email: session.user.email,
        role: 'Editor', // Default role
        permissions: {
            users: ['read', 'update'],
            clients: ['create', 'read'],
            settings: [],
            countries: ['read'],
            exchanges: ['read'],
            permissions: ['read'],
            staff: ['read', 'update'],
            patterns: ['read'],
            charts: ['read'],
            marketSentiment: ['read'],
            stockAnalysis: ['read'],
            dataVisualization: ['read'],
            customization: ['read'],
            rssFeed: ['read'],
            widgets: ['read'],
        }
    };

    return staffData;
}

//verifyPermissions
export async function verifyPermissions(module: string, permission: string) {
    const staff = await getCurrentStaff();

    if (!staff || !staff.permissions || !staff.permissions[module]) {
        return false; // No permissions at all
    }

    return staff.permissions[module].includes(permission);
}
