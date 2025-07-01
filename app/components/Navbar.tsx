'use client'
import { useEffect } from "react";
import Menus from "./Menus";
import Link from "next/link";

const Navbar = () => {
 
    return(
        <>
        <header className="navbar navbar-expand-md d-print-none" >
            <div className="container-xl">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu" aria-controls="navbar-menu" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
                    <Link href="/">
                        <img src="./static/logo.svg" width="110" height="32" alt="Tabler" className="navbar-brand-image" />
                    </Link>
                </h1>
                <div className="navbar-nav flex-row order-md-last">
                    <div className="d-none d-md-flex">
                        <div className="nav-item dropdown d-none d-md-flex me-3">
                            <Link href="#" className="nav-link px-0" data-bs-toggle="dropdown" aria-label="Show notifications">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" /><path d="M9 17v1a3 3 0 0 0 6 0v-1" /></svg>
                                <span className="badge bg-red"></span>
                            </Link>
                            <div className="dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Last updates</h3>
                                    </div>
                                    <div className="list-group list-group-flush list-group-hoverable">
                                        <div className="list-group-item">
                                            <div className="row align-items-center">
                                                <div className="col-auto"><span className="status-dot status-dot-animated bg-red d-block"></span></div>
                                                <div className="col text-truncate">
                                                    <Link href="#" className="text-body d-block">Example 1</Link>
                                                    <div className="d-block text-muted text-truncate mt-n1">
                                                        Change deprecated html tags to text decoration classNamees (#29604)
                                                    </div>
                                                </div>
                                                <div className="col-auto">
                                                    <Link href="#" className="list-group-item-actions">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon text-muted" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="nav-item dropdown">
                        <Link href="#" className="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown" aria-label="Open user menu">
                            <span className="avatar avatar-sm" style={{'backgroundImage': 'url(./static/avatars/000m.jpg)'}}></span>
                            <div className="d-none d-xl-block ps-2">
                                <div>Juancoder IT Solutions</div>
                                <div className="mt-1 small text-muted">Software Company</div>
                            </div>
                        </Link>
                        <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                            <Link href="/" className="dropdown-item">Status</Link>
                            <Link href="/" className="dropdown-item">Profile</Link>
                            <Link href="/" className="dropdown-item">Feedback</Link>
                            <div className="dropdown-divider"></div>
                            <Link href="/" className="dropdown-item">Settings</Link>
                            <Link href="/" className="dropdown-item">Logout</Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <Menus />
        </>
    )
}

export default Navbar