import Link from "next/link"

const Menus = () => {
    return (
        <header className="navbar-expand-md">
            <div className="collapse navbar-collapse" id="navbar-menu">
                <div className="navbar">
                    <div className="container-xl">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <Link className="nav-link" href="/" >
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l-2 0l9 -9l9 9l-2 0" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></svg>
                                    </span>
                                    <span className="nav-link-title">Home</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/services">
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-message-2-star"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 9h8" /><path d="M8 13h4.5" /><path d="M10 19l-1 -1h-3a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4.5" /><path d="M17.8 20.817l-2.172 1.138a.392 .392 0 0 1 -.568 -.41l.415 -2.411l-1.757 -1.707a.389 .389 0 0 1 .217 -.665l2.428 -.352l1.086 -2.193a.392 .392 0 0 1 .702 0l1.086 2.193l2.428 .352a.39 .39 0 0 1 .217 .665l-1.757 1.707l.414 2.41a.39 .39 0 0 1 -.567 .411l-2.172 -1.138z" /></svg>
                                    </span>
                                    <span className="nav-link-title">
                                        Services
                                    </span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/rehab-gallery">
                                    <span className="nav-link-icon d-md-none d-lg-inline-block">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-book">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
                                            <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
                                            <path d="M3 6l0 13" />
                                            <path d="M12 6l0 13" />
                                            <path d="M21 6l0 13" />
                                        </svg>
                                    </span>
                                    <span className="nav-link-title">
                                        Gallery
                                    </span>
                                </a>
                            </li>
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
                                    <span className="input-icon-addon">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
                                    </span>
                                    <input type="text" className="form-control" placeholder="Search…" aria-label="Search in website" />
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