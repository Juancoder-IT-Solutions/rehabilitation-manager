'use client'


import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar"
import { useAuth } from "./context/AuthContext"

const Home: React.FC = () => {
  return (
    <>
    <div className="page-wrapper">
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <h2 className="page-title">
                Home
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="page-body">
        <div className="container-xl">
          <div className="card">
            <div className="card-body">
              This is home
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Home