import NextAuth from 'next-auth';
import {NextAuthOptions} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {z} from 'zod';
import {query} from '@/lib/db';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      async authorize(credentials) {
        const schema = z.object({
          email: z.string().email(),
          password: z.string().min(6),
        });

        const validatedCredentials = schema.safeParse(credentials);
        if (validatedCredentials.success) {
          const { email, password } = validatedCredentials.data;

          // Fetch staff from the database based on email
          const staffResult: any = await query('SELECT * FROM staff WHERE email = ?', [email]);

          if (!staffResult || staffResult.length === 0) {
            return null;
          }

          const staff = staffResult[0];

          // Compare the provided password with the hashed password in the database
          const passwordsMatch = await bcrypt.compare(password, staff.password);

          if (passwordsMatch) {
            return {
              id: staff.id,
              name: staff.name,
              email: staff.email,
              role: staff.role,
              permissions: staff.permissions, // Make sure to fetch and include permissions
            };
          }
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: user.permissions, // Persist permissions in the token
        };
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      return true;
    },
  },
  pages: {
    signIn: '/signin', // Specify the custom sign-in page
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
