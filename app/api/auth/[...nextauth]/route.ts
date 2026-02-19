import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
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

      async authorize(credentials) {
        try {
          if (!credentials?.id || !credentials?.username) {
            return null;
          }

          // You already validated the user in users.login()
          return {
            id: credentials.id,
            name: credentials.username,
            role: credentials.role,
            rehab_center_id: credentials.rehab_center_id,
          };
        } catch (e) {
          console.error("Authorize error:", e);
          return null;
        }
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
        token.role = (user as any).role;
        token.rehab_center_id = (user as any).rehab_center_id;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      (session.user as any).role = token.role;
      (session.user as any).rehab_center_id = token.rehab_center_id;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
