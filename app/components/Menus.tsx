'use client'
import { useSession } from 'next-auth/react';
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BiCalendarEvent, BiUserPlus } from "react-icons/bi"
import { BsCashCoin, BsCheck2Circle } from 'react-icons/bs';
import { ImProfile } from "react-icons/im"
import { LuBookImage, LuBookOpen, LuBookUser, LuFileText, LuHouse } from "react-icons/lu"

const Menus = () => {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  const { data: session } = useSession()
  
  const user_category = session?.user?.roles;



  return (
    <header className="navbar-expand-md">
      <div className="collapse navbar-collapse" id="navbar-menu">
        <div className="navbar">
          <div className="container-xl">
            <ul className="navbar-nav">

              {/* Home – everyone */}
              <li className={isActive("/") ? "nav-item active" : "nav-item"}>
                <Link className="nav-link" href="/">
                  <span className="nav-link-icon d-md-none d-lg-inline-block">
                    <LuHouse size={24} />
                  </span>
                  <span className="nav-link-title">Home</span>
                </Link>
              </li>

              {/* Admission – everyone */}
              <li className={isActive("/admission") ? "nav-item active" : "nav-item"}>
                <Link className="nav-link" href="/admission">
                  <span className="nav-link-icon d-md-none d-lg-inline-block">
                    <LuBookUser size={24} />
                  </span>
                  <span className="nav-link-title">Admission</span>
                </Link>
              </li>

              {/* Everything below – ADMIN only */}
              {user_category === "R" && (
                <>
                  <li className={isActive("/appointments") ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" href="/appointments">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <BiCalendarEvent size={24} />
                      </span>
                      <span className="nav-link-title">Appointments</span>
                    </Link>
                  </li>

                  <li className={isActive("/forms") ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" href="/forms">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <LuFileText size={24} />
                      </span>
                      <span className="nav-link-title">Forms</span>
                    </Link>
                  </li>

                  <li className={isActive("/services") ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" href="/services">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <LuBookOpen size={24} />
                      </span>
                      <span className="nav-link-title">Services</span>
                    </Link>
                  </li>

                  <li className={isActive("/rehab-gallery") ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" href="/rehab-gallery">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <LuBookImage size={24} />
                      </span>
                      <span className="nav-link-title">Gallery</span>
                    </Link>
                  </li>

                  <li className={isActive("/clientprofile") ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" href="/clientprofile">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <ImProfile size={24} />
                      </span>
                      <span className="nav-link-title">Client Profile</span>
                    </Link>
                  </li>

                  <li className={isActive("/payments") ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" href="/payments">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <BsCashCoin size={24} />
                      </span>
                      <span className="nav-link-title">Payments</span>
                    </Link>
                  </li>

                  <li className={isActive("/verify") ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" href="/verify">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <BsCheck2Circle size={24} />
                      </span>
                      <span className="nav-link-title">Verify Certificates</span>
                    </Link>
                  </li>

                  <li className={isActive("/users") ? "nav-item active" : "nav-item"}>
                    <Link className="nav-link" href="/users">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <BiUserPlus size={24} />
                      </span>
                      <span className="nav-link-title">Users</span>
                    </Link>
                  </li>
                </>
              )}

            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Menus