'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BiCalendarEvent, BiUserPlus } from "react-icons/bi"
import { ImProfile } from "react-icons/im"
import { LuBookCheck, LuBookImage, LuBookOpen, LuBookUser, LuFile, LuFileArchive, LuFileText, LuHouse, LuNotebookText } from "react-icons/lu"

const Menus = () => {
    
    const pathname = usePathname()
    const isActive = (path: string) => pathname === path
    
    return (
        <header className="navbar-expand-md">
            <div className="collapse navbar-collapse" id="navbar-menu">
                <div className="navbar">
                    <div className="container-xl">
                        <ul className="navbar-nav">
                            <li className={isActive("/") ? "nav-item active" : "nav-item"}>
                                <Link className="nav-link" href="/" >
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                                        <LuHouse size={24} />
                                    </span>
                                    <span className="nav-link-title">Home</span>
                                </Link>
                            </li>
                            <li className={isActive("/admission") ? "nav-item active" : "nav-item"}>
                                <a className="nav-link" href="/admission">
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                                        <LuBookUser size={24} />
                                    </span>
                                    <span className="nav-link-title">
                                        Admission
                                    </span>
                                </a>
                            </li>
                            <li className={isActive("/appointments") ? "nav-item active" : "nav-item"}>
                                <a className="nav-link" href="/appointments">
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                                        <BiCalendarEvent size={24} />
                                    </span>
                                    <span className="nav-link-title">
                                        Appointments
                                    </span>
                                </a>
                            </li>
                            
                            <li className={isActive("/forms") ? "nav-item active" : "nav-item"}>
                                <a className="nav-link" href="/forms">
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                                        <LuFileText size={24} />
                                    </span>
                                    <span className="nav-link-title">
                                        Forms
                                    </span>
                                </a>
                            </li>
                            <li className={isActive("/services") ? "nav-item active" : "nav-item"}>
                                <a className="nav-link" href="/services">
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                                        <LuBookOpen size={24} />
                                    </span>
                                    <span className="nav-link-title">
                                        Services
                                    </span>
                                </a>
                            </li>
                            <li className={isActive("/gallery") ? "nav-item active" : "nav-item"}>
                                <a className="nav-link" href="/rehab-gallery">
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                                        <LuBookImage size={24} />
                                    </span>
                                    <span className="nav-link-title">
                                        Gallery
                                    </span>
                                </a>
                            </li>
                            <li className={isActive("/clientprofile") ? "nav-item active" : "nav-item"}>
                                <a className="nav-link" href="/clientprofile">
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                                        <ImProfile size={24} />
                                    </span>
                                    <span className="nav-link-title">
                                        Client Profile
                                    </span>
                                </a>
                            </li>
                            
                            <li className={isActive("/users") ? "nav-item active" : "nav-item"}>
                                <a className="nav-link" href="/users">
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                                        <BiUserPlus size={24} />
                                    </span>
                                    <span className="nav-link-title">
                                        Users
                                    </span>
                                </a>
                            </li>
                            {/* <li className="nav-item">
                                <a className="nav-link" href="/rehab-gallery">
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                                        <LuNotebookText size={24} />
                                    </span>
                                    <span className="nav-link-title">
                                        Smart Contract
                                    </span>
                                </a>
                            </li> */}
                            {/* <li className="nav-item dropdown">
                                <Link href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false" >
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" /><path d="M12 12l8 -4.5" /><path d="M12 12l0 9" /><path d="M12 12l-8 -4.5" /><path d="M16 5.25l-8 4.5" /></svg>
                                    </span>
                                    <span className="nav-link-title">Interface</span>
                                </Link>
                                <div className="dropdown-menu">
                                    <div className="dropdown-menu-columns">
                                        <div className="dropdown-menu-column">
                                            <Link className="dropdown-item" href="/sample">Sample page</Link>
                                            <Link className="dropdown-item" href="/about">About</Link>
                                            <div className="dropend">
                                                <Link className="dropdown-item dropdown-toggle" href="#sidebar-cards" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false" >Cards
                                                    <span className="badge badge-sm bg-green-lt text-uppercase ms-auto">New</span>
                                                </Link>
                                                <div className="dropdown-menu">
                                                    <Link href="/" className="dropdown-item">Sample cards</Link>
                                                    <Link href="/" className="dropdown-item">Card actions<span className="badge badge-sm bg-green-lt text-uppercase ms-auto">New</span></Link>
                                                    <Link href="/" className="dropdown-item">Cards Masonry</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" href="#navbar-help" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false" >
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M15 15l3.35 3.35" /><path d="M9 15l-3.35 3.35" /><path d="M5.65 5.65l3.35 3.35" /><path d="M18.35 5.65l-3.35 3.35" /></svg>
                                    </span>
                                    <span className="nav-link-title">Help</span>
                                </Link>
                                <div className="dropdown-menu">
                                    <Link className="dropdown-item" href="/" rel="noopener">Documentation</Link>
                                    <Link className="dropdown-item" href="/">Changelog</Link>
                                    <Link className="dropdown-item" href="/" rel="noopener">Source code</Link>
                                </div>
                            </li> */}
                        </ul>
                        <div className="my-2 my-md-0 flex-grow-1 flex-md-grow-0 order-first order-md-last">
                            <form action="/" method="get" autoComplete="off" noValidate>
                                <div className="input-icon">
                                    {/* <span className="input-icon-addon">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
                                    </span>
                                    <input type="text" className="form-control" placeholder="Search…" aria-label="Search in website" /> */}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Menus