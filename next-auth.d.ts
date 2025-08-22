import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string,
            role: string,
            rehab_center_id: string,
        } & DefaultSession['user']
    }

    interface User extends DefaultUser {
        id: string,
        role: string,
        rehab_center_id: string
    }
}

declare module "next/auth/jwt" {
    interface JWT {
        id: string,
        role: string,
        rehab_center_id: string
    }
}