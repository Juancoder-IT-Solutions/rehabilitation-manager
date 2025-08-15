import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                id: {label: "Id", type: "text"},
                username: {label: "Username", type: "text"},
                password: { label: "Password", type: "password"}
            },
            async authorize(credentials){
                const { username, password } = credentials ?? {};
                const user = {
                    id: `${credentials?.id}`,
                    name: credentials?.username,
                    username: credentials?.username
                }

                if(username && password){
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
        async jwt({token, user}) {
            if(user){
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            // Add id from token to session.user
            if (token.id) {
                let session_user: any = session.user
                session_user.id = token.id;
            }
            return session;
        },
    }
}

const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}