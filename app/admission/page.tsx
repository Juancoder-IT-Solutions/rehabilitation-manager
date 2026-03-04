'use client';

import { useEffect, useState } from 'react';
import { FaCheck, FaCheckDouble, FaTimes } from 'react-icons/fa';
import { MdMedicalInformation } from 'react-icons/md';
import { Button, Spinner } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { useSession } from "next-auth/react";

import Footer from '../components/Footer';
import admissionController from '../controllers/Admission';
import servicesController from '../controllers/Services';
import ModalAdmission from './modalAdmission';
import alerts from '../components/Alerts';

const AdmissionPage = () => {
  const { data: session, status } = useSession();
  const rehab_center_id = session?.user?.rehab_center_id;

  // State
  const [listEntry, setListEntry] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [form_data, setFormData] = useState<any>({});
  const [admission_data, setAdmissionData] = useState<any>({});
  const [submit_type, setSubmitType] = useState<'add' | 'update'>('add');
  const [showModal, setShowModal] = useState(false);
  const [inputs, setInputs] = useState<any[]>([]);

  const [servicesAvail, setServicesAvail] = useState<any[]>([]);
  const [listServices, setListServices] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [approvingRows, setApprovingRows] = useState<any[]>([]);

  const fetchEntry = async () => {
    setLoading(true);
    try {
      const response = await admissionController.fetch(rehab_center_id);
      setListEntry(response?.data || []);
    } catch (err) {
      console.error("Failed to fetch admissions", err);
      alerts.warning("Failed to fetch admissions");
    } finally {
      setLoading(false);
    }
  };

  const fetchInputs = async () => {
    try {
      const res = await admissionController.getInputs(rehab_center_id);
      setInputs(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch inputs", err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await servicesController.fetch(rehab_center_id);
      setListServices(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch services", err);
    } finally {
      setServicesLoading(false);
    }
  };

  const getServicesAvail = async (admission_id: any) => {
    try {
      const res = await admissionController.getServicesAvail(rehab_center_id, admission_id);
      setServicesAvail(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch available services", err);
    } finally {
      setServicesLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && rehab_center_id) {
      fetchEntry();
      fetchInputs();
      fetchServices();
    }
  }, [status, rehab_center_id]);

  const handleUpdate = async (row: any) => {
    try {
      const details = await admissionController.getDetails(rehab_center_id, row.admission_id);
      const mapped: any = {};
      inputs.forEach((input) => {
        const found = details.find((d: any) => d.input_id === input.input_id);
        mapped[input.input_id] = found?.input_value || '';
      });

      setAdmissionData(row);
      setFormData(mapped);
      setSubmitType('update');
      getServicesAvail(row.admission_id);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to load admission details", err);
      alerts.warning("Failed to load admission details");
    }
  };

  const handleApproveConfirm = async () => {
    try {
      const admission_ids = approvingRows.map((row) => row.admission_id);
      await admissionController.approve({ rehab_center_id, admission_ids, start_date: startDate });
      alerts.success_update("Admissions approved successfully!");
      setShowApproveModal(false);
      setStartDate('');
      setSelectedRows([]);
      fetchEntry();
    } catch (err) {
      console.error("Approve failed", err);
      alerts.warning("Failed to approve admissions");
    }
  };

  const handleRejectConfirm = async () => {
    if (!selectedRows.length) {
      alerts.warning('Please select at least one entry to reject.');
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to reject ${selectedRows.length} admission(s).`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reject',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const admission_ids = selectedRows.map((row) => row.admission_id);
        await admissionController.reject({ rehab_center_id, admission_ids });

        Swal.fire({
          title: 'Rejected!',
          text: 'Admissions rejected successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        window.location.reload();
      } catch (err) {
        console.error('Reject failed', err);
        Swal.fire({ title: 'Error!', text: 'Failed to reject admissions.', icon: 'error' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await admissionController.update(form_data);
      alerts.success_update("Admission updated successfully!");
      setShowModal(false);
      fetchEntry();
    } catch (err) {
      console.error("Update failed", err);
      alerts.warning("Failed to update admission");
    }
  };

  const columns = [
    {
      name: 'Actions',
      cell: (row: any) => (
        <Button variant="info" onClick={() => handleUpdate(row)}>
          <MdMedicalInformation size={18} /> &nbsp; View
        </Button>
      )
    },
    { name: '#', selector: (row: any) => row.count, sortable: true, width: '60px' },
    { name: 'Name', selector: (row: any) => row.user, sortable: true },
    {
      name: 'Status',
      selector: (row: any) => row.status,
      sortable: true,
      cell: (row: any) => {
        const statusMap: Record<string, { label: string; className: string }> = {
          A: { label: 'Accepted', className: 'bg-success text-white' },
          O: { label: 'Ongoing', className: 'bg-primary text-white' },
          F: { label: 'Finished', className: 'bg-secondary text-white' },
          P: { label: 'Pending', className: 'bg-warning text-dark' },
          D: { label: 'Denied', className: 'bg-danger text-white' },
        };

        const { label, className } = statusMap[row.status || 'P'];
        return <span className={`badge ${className}`}>{label}</span>;
      },
    },
    { name: 'Date Added', selector: (row: any) => row.date_added, sortable: true },
  ];

  // Only allow selection if status = 'P'
  const selectableRowDisabled = (row: any) => row.status !== 'P';

  // Filter rows by search
  const filteredItems = listEntry.filter((item: any) =>
    Object.values(item || {}).some((val: any) =>
      val?.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  return (
    <div className="page-wrapper bg-light min-vh-100">
      <div className="page-header d-print-none py-3 shadow-sm mb-3">
        <div className="container-xl d-flex justify-content-between align-items-center">
          <div>
            <div className="page-pretitle">Manage Admission</div>
            <h2 className="page-title">Admission</h2>
          </div>

          <div className="btn-list">
            <Button
              variant="success"
              onClick={() => {
                if (!selectedRows.length) return alerts.warning('Select at least one pending admission to approve.');
                setApprovingRows(selectedRows);
                setShowApproveModal(true);
              }}
            >
              <FaCheck /> Approve
            </Button>

            <Button variant="danger" onClick={handleRejectConfirm}>
              <FaTimes /> Reject
            </Button>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-end mb-3">
                <input
                  type="text"
                  className="form-control w-25"
                  placeholder="Search…"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>

              <DataTable
                columns={columns}
                data={filteredItems}
                selectableRows
                selectableRowDisabled={selectableRowDisabled}
                onSelectedRowsChange={({ selectedRows }) => setSelectedRows(selectedRows)}
                pagination
                highlightOnHover
                selectableRowsHighlight
                progressPending={loading}
                progressComponent={
                  <div className="text-center my-4">
                    <Spinner animation="border" /> <p>Loading, please wait...</p>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Admission Modal */}
      <ModalAdmission
        showModal={showModal}
        setShowModal={setShowModal}
        form_data={form_data}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        inputs={inputs}
        admission_data={admission_data}
        services={servicesAvail}
        listServices={listServices}
        getServicesAvail={getServicesAvail}
        rehab_center_id={rehab_center_id}
      />

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,.5)' }}>
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Approve Admission</h5>
                <button className="btn-close" onClick={() => setShowApproveModal(false)} />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <small className="text-muted">
                  Selected admissions: {approvingRows.length}
                </small>
              </div>

              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setShowApproveModal(false)}>Cancel</Button>
                <Button variant="success" onClick={handleApproveConfirm} disabled={!startDate}>
                  <FaCheckDouble /> Confirm Approval
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdmissionPage;