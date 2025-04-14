import NextAuth from 'next-auth';
import {NextAuthOptions} from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    // Removed Google Provider for testing
    // Add other authentication providers here later (e.g., Credentials, Email, etc.)
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Added simple authentication for testing purposes.  Replace this with a real provider later
  callbacks: {
    async signIn({user, account, profile}) {
      // Replace this with your actual user authentication logic (e.g., database check)
      if (user.email === 'test@example.com') {
        return true;
      } else {
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
