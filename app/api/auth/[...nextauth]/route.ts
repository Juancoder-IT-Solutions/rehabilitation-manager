import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                id: { label: "Id", type: "text" },
                rehab_center_id: { label: "rehab_center_id" },
                roles: { label: "Roles" },
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const { username, password } = credentials ?? {};
                const user = {
                    id: `${credentials?.id}`,
                    rehab_center_id: `${credentials?.rehab_center_id}`,
                    roles: `${credentials?.roles}`,
                    name: credentials?.username,
                    username: credentials?.username
                }

                if (username && password) {
                    return user
                }

                return null
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
        error: "/login"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.rehab_center_id = user.rehab_center_id
            }
            return token
        },
        async session({ session, token }) {
            // Add id from token to session.user
            if (token.id) {
                let session_user: any = session.user
                session_user.id = token.id;
                session_user.rehab_center_id = token.rehab_center_id;
            }
            return session;
        },
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }