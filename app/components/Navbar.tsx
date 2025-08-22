'use client'
import Menus from "./Menus";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
    const { data: session, status } = useSession()
    let user_session: any = session?.user

    if (status === "unauthenticated") return null

    return (
        <div className="sticky-top">
            <header className="navbar navbar-expand-md sticky-top d-print-none">
                <div className="container-xl">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu" aria-controls="navbar-menu" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
                        <Link href="/" className="flex flex-col items-center text-center">
                            <img
                                src="/static/logo.png"
                                alt="BERM Logo"
                                className="navbar-brand-image"
                                style={{ height: "3rem" }}
                            />
                            <span style={{ fontSize: "17px" }}>
                                &nbsp;&nbsp;BERM: Blockchain Enhanced Rehabilitation Manager
                            </span>
                        </Link>
                    </h1>
                    <div className="navbar-nav flex-row order-md-last">
                        <div className="nav-item dropdown">
                            <Link href="#" className="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown" aria-label="Open user menu">
                                <span className="avatar avatar-sm">{<FaUser />}</span>
                                <div className="d-none d-xl-block ps-2">
                                    <div>{session?.user.name}</div>
                                    <div className="mt-1 small text-muted">{session?.user.role}</div>
                                </div>
                            </Link>
                            <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                <Link href="/profile" className="dropdown-item">Profile</Link>
                                <div className="dropdown-divider"></div>
                                <Link href="/settings" className="dropdown-item">Settings</Link>
                                <Link href="#" className="dropdown-item" onClick={() => signOut()}>Logout</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <Menus />
        </div>
    )
}

export default Navbar