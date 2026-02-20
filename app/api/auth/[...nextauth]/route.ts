import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        id: { label: "ID", type: "text" },
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
        rehab_center_id: { label: "Rehab Center ID", type: "text" },
      },

      async authorize(credentials, req) {
        if (!credentials) return null;

        const id = credentials.id as string;
        const username = credentials.username as string;
        const role = credentials.role as string;
        const rehab_center_id = credentials.rehab_center_id as string;

        if (!id || !username) return null;

        // You already validated user from your PHP backend
        return {
          id: String(id),
          name: String(username),
          role: String(role),
          rehab_center_id: String(rehab_center_id),
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.rehab_center_id = user.rehab_center_id;
      }
      return token;
    },

    async session({ session, token }) {
       if (token.id) {
        let session_user: any = session.user
          if (session_user.user) {
            session_user.user.id = token.id!;
            session_user.user.role = token.role;
            session_user.user.rehab_center_id = token.rehab_center_id;
          }
          return session_user;
        }
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };