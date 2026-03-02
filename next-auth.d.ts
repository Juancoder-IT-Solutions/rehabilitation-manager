import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string,
            roles: string,
            rehab_center_id: string,
        } & DefaultSession['user']
    }

    interface User extends DefaultUser {
        id: string,
        roles: string,
        rehab_center_id: string
    }
}

declare module "next/auth/jwt" {
    interface JWT {
        id: string,
        roles: string,
        rehab_center_id: string
    }
}