'use client';

import React, { useEffect, useState } from "react";
import alerts from "../components/Alerts";
import users from "../controllers/Users";
import admissionController from "../controllers/Admission";
import { FaUserCircle } from "react-icons/fa";
import { MdMedicalInformation } from "react-icons/md";

interface ComponentProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  form_data: any;
  setFormData: (data: any) => void;
  fetchClients: Function;
  submit_type: string;
  rehab_center_id: any;
  profileImage?: string;
}

const ModalUsers: React.FC<ComponentProps> = ({
  showModal,
  setShowModal,
  form_data,
  setFormData,
  fetchClients,
  submit_type,
  rehab_center_id,
  profileImage
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const handleChange = (e: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formdata = { 
      ...form_data, 
      rehab_center_id,
      user_category: 'U'
    };

    const response = await users.update(formdata);

    if (response === 1) {
      submit_type === "add" ? alerts.success_add() : alerts.success_update();
      setShowModal(false);
      fetchClients();
    } else if (response === -2) {
      alerts.already_exists_alert('User already exists.');
    } else {
      alerts.failed_query();
    }
  };

  const fetchHistory = async () => {
    if (!form_data?.user_id) return;

    try {
      setHistoryLoading(true);
      const res = await admissionController.fetch_admission_history(
        form_data.user_id,
        rehab_center_id
      );
      setHistory(res.data || []);
    } catch (err) {
      console.error("Failed to fetch history", err);
      alert("Failed to load history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  return (
    <div className={`modal modal-blur fade ${showModal ? "show d-block" : "d-none"}`} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">
              {submit_type === "add" ? "Add New Client" : "Update Client Profile"}
            </h5>
            <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ background: "linear-gradient(to bottom, #f8f9fa, #ffffff)" }}>

              {/* Profile Header */}
              <div className="card shadow-sm mb-4">
                <div className="card-body d-flex align-items-center">
                  <div className="me-3">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="rounded-circle border"
                        style={{ width: 90, height: 90, objectFit: 'cover' }}
                      />
                    ) : (
                      <FaUserCircle size={90} className="text-secondary" />
                    )}
                  </div>

                  <div className="flex-grow-1">
                    <h5 className="mb-1 fw-bold">
                      {form_data.user_fname} {form_data.user_mname} {form_data.user_lname}
                    </h5>

                    <span className="badge bg-primary">
                      <MdMedicalInformation /> Personal Information
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                  >
                    Personal Information
                  </button>
                </li>

                {submit_type !== "add" && (
                  <li className="nav-item">
                    <button
                      type="button"
                      className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                      onClick={() => setActiveTab('history')}
                    >
                      History
                    </button>
                  </li>
                )}
              </ul>

              <div className="border border-top-0 p-3">

                {/* Personal Info Form */}
                {activeTab === 'info' && (
                  <>
                    <input type="hidden" name="user_id" value={form_data.user_id || ''} />

                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">First Name</label>
                        <input type="text" className="form-control" name="user_fname"
                          value={form_data.user_fname || ''} onChange={handleChange} readOnly required />
                      </div>

                      <div className="col-md-4 mb-3">
                        <label className="form-label">Middle Name</label>
                        <input type="text" className="form-control" name="user_mname"
                          value={form_data.user_mname || ''} onChange={handleChange} readOnly />
                      </div>

                      <div className="col-md-4 mb-3">
                        <label className="form-label">Last Name</label>
                        <input type="text" className="form-control" name="user_lname"
                          value={form_data.user_lname || ''} onChange={handleChange} required readOnly />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Permanent Address</label>
                      <textarea className="form-control" name="permanent_address"
                        value={form_data.permanent_address || ''} onChange={handleChange} required readOnly />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Contact Number</label>
                        <input type="text" className="form-control" name="contact_number"
                          value={form_data.contact_number || ''} onChange={handleChange} readOnly />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Birthdate</label>
                        <input type="date" className="form-control" name="birthdate"
                          value={form_data.birthdate || ''} onChange={handleChange} required readOnly />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Birth Place</label>
                        <input type="text" className="form-control" name="birth_place"
                          value={form_data.birth_place || ''} onChange={handleChange} readOnly />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Nationality</label>
                        <input type="text" className="form-control" name="nationality"
                          value={form_data.nationality || ''} onChange={handleChange} readOnly />
                      </div>
                    </div>

                    {/* keep your other fields here (religion, occupation, parents, etc.) */}
                  </>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                  <>
                    {historyLoading && (
                      <div className="text-center py-4 text-muted">Loading history...</div>
                    )}

                    {!historyLoading && history.length === 0 && (
                      <div className="text-muted text-center py-4">
                        No history available.
                      </div>
                    )}

                    {!historyLoading && history.length > 0 && (
                      <ul className="list-group list-group-flush">
                        {history.map((item: any, index: number) => (
                          <li key={index} className="list-group-item">
                            <div className="fw-semibold">{item.action}</div>
                            <div className="small text-muted">{item.description}</div>
                            <div className="small text-secondary">
                              {new Date(item.created_at).toLocaleString()}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}

              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Close
              </button>
              {/* <button type="submit" className="btn btn-primary">
                Save
              </button> */}
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ModalUsers;