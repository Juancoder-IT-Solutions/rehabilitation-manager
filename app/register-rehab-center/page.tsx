"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import users from "../controllers/Users";
import alerts from "../components/Alerts";

const GoogleMapComponent = dynamic(
  () => import("../components/GoogleMapComponent"),
  {
    ssr: false,
  }
);

export default function RegisterRehabCenter() {
  const [formData, setFormData] = useState<any>({});
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      alerts.warning_alert("Password and Confirm Password do not match.");
      return;
    }

    const response = await users.register(formData);
    if (response === 1) {
      alerts.success_add("Registration successful! Redirecting to login...");

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } else if (response === 2) {
      alerts.already_exists_alert("Rehab center already exists.");
    } else if (response === 3) {
      alerts.already_exists_alert("Username already exists.");
    } else {
      alerts.failed_query();
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="mb-4 text-center text-primary fw-bold">
                Register Rehabilitation Center
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="form-label">Rehab Center Name</label>
                    <input
                      type="text"
                      name="rehab_center_name"
                      className="form-control"
                      required
                      value={formData.rehab_center_name || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Hospital Code</label>
                    <input
                      type="text"
                      name="hospital_code"
                      className="form-control"
                      required
                      value={formData.hospital_code || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Medical Record No.</label>
                    <input
                      type="text"
                      name="med_record_no"
                      className="form-control"
                      required
                      value={formData.med_record_no || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="rehab_center_city"
                      className="form-control"
                      required
                      value={formData.rehab_center_city || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Complete Address</label>
                    <textarea
                      name="rehab_center_complete_address"
                      className="form-control"
                      rows={2}
                      required
                      value={formData.rehab_center_complete_address || ""}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      required
                      value={formData.username || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      required
                      value={formData.password || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Pin Location on Map</label>
                    <GoogleMapComponent
                      coordinates={formData.rehab_center_coordinates}
                      setCoordinates={(val: string) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          rehab_center_coordinates: val,
                        }))
                      }
                    />
                  </div>

                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary w-100 mt-3"
                    >
                      Submit Registration
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
