'use client'

import { useEffect, useState } from "react";
import { LuBookHeart, LuFileText } from "react-icons/lu";
import admissionController from "./controllers/Admission";
import servicesController from "./controllers/Services";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Home: React.FC = () => {

  const { data: session, status } = useSession()
  let session_user: any = session?.user

  if (status === "unauthenticated") {
    redirect('/login')
  }

  const [totalServices, setTotalServices] = useState(0);
  const [totalAdmissions, setTotalAdmissions] = useState(0);

  const fetchCounts = async () => {
    try {
      const servicesRes = await servicesController.total_services();
      const admissionsRes = await admissionController.total_admission();
      setTotalServices(servicesRes?.data || 0);
      setTotalAdmissions(admissionsRes?.data || 0);
    } catch (err) {
      console.error("Error fetching dashboard counts", err);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <h2 className="page-title">Home</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row g-4 mb-4">

            {/* Total Services */}
            <div className="col-md-6">
              <div className="card h-100 border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center">
                    <div className="me-4">
                      <span className="avatar avatar-lg bg-azure text-white rounded-3 d-flex align-items-center justify-content-center">
                        <LuBookHeart size={26} />
                      </span>
                    </div>
                    <div>
                      <div className="text-secondary fw-semibold small mb-1">Total Services</div>
                      <h2 className="fw-bold mb-1">{totalServices}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Admission */}
            <div className="col-md-6">
              <div className="card h-100 border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center">
                    <div className="me-4">
                      <span className="avatar avatar-lg bg-success text-white rounded-3 d-flex align-items-center justify-content-center">
                        <LuFileText size={26} />
                      </span>
                    </div>
                    <div>
                      <div className="text-secondary fw-semibold small mb-1">Total Admission</div>
                      <h2 className="fw-bold mb-1">{totalAdmissions}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
