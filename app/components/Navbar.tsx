'use client'
import { useEffect } from "react";
import Menus from "./Menus";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { useSession } from "next-auth/react";
// import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
    useEffect(() => {
        // Create a <script> element dynamically
        const script = document.createElement('script');
        script.src = 'dist/js/tabler.min.js'; // Path to your minified JS file
        script.async = true;  // Optional: Load the script asynchronously
        script.onload = () => {
            console.log('Minified script loaded successfully');
        };

        const script_list = document.createElement('script');
        script_list.src = 'dist/libs/list.js/dist/list.min.js';
        script_list.async = true;  // Optional: Load the script asynchronously
        script_list.onload = () => {
            console.log('list script loaded successfully');
        };



        // Append the script to the body of the page
        document.body.appendChild(script);

        // Clean up the script when the component unmounts
        return () => {
            document.body.removeChild(script);
        };
    }, []);  // Empty dependency array ensures the effect runs only once
    
    const {data: session, status} = useSession()
    let user_session: any = session?.user

    if(status === "unauthenticated") return null
    

    return (
        <>
            <div className="sticky-top">
                <header className="navbar navbar-expand-md sticky-top d-print-none">
                    <div className="container-xl">
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu" aria-controls="navbar-menu" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
                            <Link href="/">
                                {/* <img src="./static/logo.png" alt="E&S Foods" className="navbar-brand-image" style={{ "height": "3rem" }} /> */}
                                &nbsp;BERM: Blockchain Enhanced Rehabilitation Manager
                            </Link>
                        </h1>

                        <div className="navbar-nav flex-row order-md-last">
                            <div className="d-none d-md-flex">
                                <div className="nav-item dropdown d-none d-md-flex me-3">
                                    <Link href="#" className="nav-link px-0" data-bs-toggle="dropdown" aria-label="Show notifications">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" /><path d="M9 17v1a3 3 0 0 0 6 0v-1" /></svg>
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
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon text-muted" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>
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
                                    <span className="avatar avatar-sm">{<FaUser />}</span>
                                    <div className="d-none d-xl-block ps-2">
                                        <div>Juancoder IT Solutions</div>
                                        <div className="mt-1 small text-muted">Software Company</div>
                                    </div>
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                    <Link href="/profile" className="dropdown-item">Profile</Link>
                                    <div className="dropdown-divider"></div>
                                    <Link href="/settings" className="dropdown-item">Settings</Link>
                                    {/* <Link href="#" className="dropdown-item" onClick={() => signOut()}>Logout</Link> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <Menus />
            </div>
        </>
    )
}

export default Navbar