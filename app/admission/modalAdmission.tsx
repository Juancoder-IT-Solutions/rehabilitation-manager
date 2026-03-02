import React, { useEffect, useState } from "react";
import { FaCheck, FaPrint, FaTrash, FaUserCircle } from "react-icons/fa";
import { FaFileCircleCheck } from "react-icons/fa6";
import AddServiceModal from "./AddServiceModal";
import StagesModal from "./StagesModal";
import admissionController from "../controllers/Admission";
import { BiPlusMedical, BiTask } from "react-icons/bi";
import { GoTasklist } from "react-icons/go";
import { MdMedicalInformation } from "react-icons/md";
import alerts from "../components/Alerts";
import { generateCertificate } from "../components/generateCertificate";
import Swal from "sweetalert2";

interface InputField {
  input_id: number;
  input_label: string;
  input_type: string;
  input_require: number;
  options?: string[];
  services: any;
  listServices: any;
  getServicesAvail: any;
}

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  form_data: any;
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  inputs: InputField[];
  profileImage?: string;
  admission_data: any;
  services: any;
  listServices: any;
  getServicesAvail: any;
  rehab_center_id: any;
}

const ModalAdmissionRecord: React.FC<Props> = ({
  showModal,
  setShowModal,
  form_data,
  inputs,
  profileImage,
  admission_data,
  services,
  listServices,
  getServicesAvail,
  rehab_center_id
}) => {
  const [activeTab, setActiveTab] = useState<'services' | 'history' | 'certificate'>('services');
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showStagesModal, setShowStagesModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedAdmissionServiceId, setSelectedAdmissionServiceId] = useState(0);

  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchStages = async (admission_service_id: any) => {
    setSelectedAdmissionServiceId(admission_service_id);
    try {
      const res = await admissionController.fetch_admission_tasks(
        admission_data.admission_id,
        admission_service_id,
        rehab_center_id
      );
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch services available", err);
      alert("Failed to load services available.");
    }
  };

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await admissionController.fetch_admission_history(admission_data.user_id, rehab_center_id);
      console.log("res.data", res.data);
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


  const printCertificate = (admissionId: number, rehabCenterId: any) => {
    if (!admissionId || !rehabCenterId) {
      alert("Invalid admission or rehab center ID.");
      return;
    }

    if (!confirm("Do you want to print this certificate?")) return;

    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = `/api/generate_certificate.php?admission_id=${admissionId}&rehab_center_id=${rehabCenterId}&print=1`;

    // Add to document
    document.body.appendChild(iframe);

    // Wait for it to load, then print
    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  };

  const finishAdmission = async () => {
    if (!confirm("Are you sure you want to finish this admission?")) return;

    try {
      await admissionController.finish_admission(admission_data.admission_id, rehab_center_id);
      alerts.success_add("Admission marked as finished.");
      getServicesAvail(admission_data.admission_id);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to finish admission.");
    }
  };

  const handleDeleteService = async (admission_service_id: number) => {
    if (!admission_service_id) return;

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will delete the service and all its tasks!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) return;

    try {
      await admissionController.deleteService(admission_service_id, rehab_center_id);

      await Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Service and its tasks have been deleted.',
        timer: 2000,
        showConfirmButton: false,
      });

      // Refresh the services list
      getServicesAvail(admission_data.admission_id);
    } catch (err) {
      console.error("Failed to delete service", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete service.',
      });
    }
  };


  return (
    <>
      <div className={`modal modal-blur fade ${showModal ? "show d-block" : "d-none"}`} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Admission Record</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
            </div>

            <div
              className="modal-body"
              style={{ background: "linear-gradient(to bottom, #f8f9fa, #ffffff)" }}
            >

              <div className="card shadow-sm mb-4">
                <div className="card-body d-flex align-items-center">

                  <div className="me-3 position-relative">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="rounded-circle border cursor-pointer"
                        style={{ width: 100, height: 100, objectFit: 'cover' }}
                        onClick={() => window.open(profileImage, '_blank')}
                      />
                    ) : (
                      <FaUserCircle size={100} className="text-secondary" />
                    )}

                    <span
                      className={`badge rounded-pill ${admission_data.status === 'A' ? 'bg-success text-white' :
                          admission_data.status === 'O' ? 'bg-primary text-white' :
                            admission_data.status === 'F' ? 'bg-secondary text-white' :
                              admission_data.status === 'D' ? 'bg-danger text-white' :
                                'bg-warning text-dark'
                        }`}
                    >
                      {
                        admission_data.status === 'A' ? 'Accepted' :
                          admission_data.status === 'O' ? 'Ongoing' :
                            admission_data.status === 'F' ? 'Finished' :
                              admission_data.status === 'D' ? 'Denied' :
                                'Pending'
                      }
                    </span>
                  </div>

                  <div className="flex-grow-1">
                    <h5 className="mb-1 fw-bold">{admission_data.user || 'Patient Name'}</h5>

                    <div className="text-muted small mb-2">
                      Admission ID: #{admission_data.admission_id}
                      {/* <button
                        className="btn btn-sm btn-link"
                        onClick={() => navigator.clipboard.writeText(admission_data.admission_id.toString())}
                      >
                        Copy
                      </button> */}
                    </div>

                    <div className="d-flex gap-2 flex-wrap">
                      <span className="badge bg-primary">
                        <MdMedicalInformation /> Medical Record
                      </span>

                      <span className="badge bg-info">
                        <BiTask /> {services.length} Services
                      </span>

                      <span className="badge bg-secondary">
                        <FaFileCircleCheck /> Documents
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              <div className="row">

                <div className="col-md-5">
                  <div className="row">
                    {inputs.map((input) => (
                      <div className="col-md-6 mb-2" key={input.input_id}>
                        <label className="form-label text-muted">{input.input_label}</label>
                        <div className="fw-semibold">
                          {form_data[input.input_id] || '-'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-md-7">
                  <ul className="nav nav-tabs">
                    <li className="nav-item">
                      <button
                        type="button"
                        className={`nav-link ${activeTab === 'services' ? 'active' : ''}`}
                        onClick={() => setActiveTab('services')}
                      >
                        Services
                      </button>
                    </li>

                    <li className="nav-item">
                      <button
                        type="button"
                        className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                      >
                        History
                      </button>
                    </li>

                    <li className="nav-item">
                      <button
                        type="button"
                        className={`nav-link ${activeTab === 'certificate' ? 'active' : ''}`}
                        onClick={() => setActiveTab('certificate')}
                      >
                        Certificate
                      </button>
                    </li>
                  </ul>

                  <div className="border border-top-0 p-3">

                    {activeTab === 'services' && (
                      <div>
                        <div className="d-flex justify-content-between mb-3">
                          <h6 className="mb-0">Assigned Services</h6>

                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => setShowAddServiceModal(true)}
                            disabled={admission_data.status !== "O"}
                          >
                            <BiPlusMedical />&nbsp; Add Service
                          </button>
                        </div>

                        {services.length === 0 && (
                          <div className="text-muted">No services added yet.</div>
                        )}

                        <div className="list-group">
                          {services.map((service: any) => (
                            <div
                              key={service.admission_service_id}
                              className="list-group-item d-flex justify-content-between align-items-center"
                            >
                              <span
                                className="cursor-pointer"
                                onClick={() => {
                                  setSelectedService(service);
                                  setShowStagesModal(true);
                                  fetchStages(service.admission_service_id);
                                }}
                              >
                                {service.service_name}
                              </span>

                              <div className="d-flex gap-2">
                                <span className="badge bg-info" title="Tasks">
                                  <GoTasklist size={18}
                                    onClick={() => {
                                      setSelectedService(service);
                                      setShowStagesModal(true);
                                      fetchStages(service.admission_service_id);
                                    }} />
                                </span>

                                {admission_data.status === "A" || admission_data.status === "O" ? (
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDeleteService(service.admission_service_id)}
                                  >
                                    <FaTrash />
                                  </button>
                                ) : null}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'history' && (
                      <div>
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
                                <div className="small text-muted">
                                  {item.description}
                                </div>
                                <div className="small text-secondary">
                                  {new Date(item.created_at).toLocaleString()}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    {activeTab === 'certificate' && (
                      <div>
                        <h6 className="mb-3">Certificate</h6>

                        <div className="d-flex gap-2 flex-wrap">
                          <button className="btn btn-outline-primary btn-sm" onClick={() => generateCertificate({
                            rehabCenter: admission_data.rehab_center_name,
                            address: admission_data.rehab_center_address,
                            participant: admission_data.user,
                            startDate: admission_data.start_date,
                            endDate: admission_data.end_date,
                            programType: admission_data.program_type || "",
                            location: admission_data.location || "",
                            adminName: admission_data.admin_name || "",
                            // logoUrl: "/logo.png"
                          })} disabled={admission_data.status !== "F"}>
                            <FaFileCircleCheck />&nbsp; Generate / Download
                          </button>


                          {
                            admission_data.status != "F" || admission_data.status != "D" && (
                              <button className="btn btn-success btn-sm" onClick={finishAdmission}>
                                <FaCheck />&nbsp; Finish Admission
                              </button>
                            )
                          }

                        </div>

                        <div className="text-muted small mt-2">
                          Finishing the admission will lock further changes.
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>

          </div>
        </div>
      </div>

      <AddServiceModal
        show={showAddServiceModal}
        onHide={() => setShowAddServiceModal(false)}
        services={listServices}
        admission_data={admission_data}
        getServicesAvail={getServicesAvail}
      />

      <StagesModal
        show={showStagesModal}
        onHide={() => setShowStagesModal(false)}
        service={selectedService}
        tasks={tasks}
        admission_id={admission_data.admission_id}
        rehab_center_id={rehab_center_id}
        reload={() => getServicesAvail(admission_data.admission_id)}
        admission_service_id={selectedAdmissionServiceId}
      />
    </>
  );
};

export default ModalAdmissionRecord;