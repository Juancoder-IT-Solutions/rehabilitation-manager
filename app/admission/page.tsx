'use client';

import { useEffect, useState } from 'react';
import { FaCheck, FaCheckDouble, FaFileMedical, FaNotesMedical, FaPencilAlt, FaTimes } from 'react-icons/fa';
import Footer from '../components/Footer';
import admissionController from '../controllers/Admission';
import DataTable from 'react-data-table-component';
import { Spinner, Button } from 'react-bootstrap';
import ModalAdmission from './modalAdmission';
import { useSession } from "next-auth/react";
import ModalServicesAvail from './ModalServicesAvail';
import servicesController from '../controllers/Services';
import { MdMedicalInformation } from 'react-icons/md';
import alerts from '../components/Alerts';

const AdmissionPage = () => {
  const { data: session, status } = useSession()
  const rehab_center_id = session?.user?.rehab_center_id;

  const [listEntry, setListEntry] = useState<any[]>([]);
  const [listServices, setListServices] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [form_data, setFormData] = useState<any>({});
  const [admission_data, setAdmissionData] = useState<any>({});
  const [submit_type, setSubmitType] = useState<'add' | 'update'>('add');
  const [showModal, setShowModal] = useState(false);
  const [inputs, setInputs] = useState<any[]>([]);

  const [showServicesModal, setShowServicesModal] = useState(false);
  const [servicesAvail, setServicesAvail] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [approvingRows, setApprovingRows] = useState<any[]>([]);

  const fetchEntry = async () => {
    setLoading(true);
    try {
      const response = await admissionController.fetch(rehab_center_id);
      setListEntry(response?.data || []);
    } catch (error) {
      console.error('Failed to fetch admission:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async (row: any) => {
    try {
      const res = await servicesController.fetch(
        rehab_center_id,
        // row.admission_id
      );
      console.log("services", res.data);
      setListServices(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch services available", err);
      alert("Failed to load services available.");
    } finally {
      setServicesLoading(false);
    }
  }

  const getServicesAvail = async (admission_id: any) => {
    try {
      const res = await admissionController.getServicesAvail(
        rehab_center_id,
        admission_id
      );
      console.log("services", res.data);
      setServicesAvail(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch services available", err);
      alert("Failed to load services available.");
    } finally {
      setServicesLoading(false);
    }
  };


  useEffect(() => {
    if (status === "authenticated" && rehab_center_id) {
      fetchEntry();
      fetchInputs();
    }
  }, [status, session]);

  const fetchInputs = async () => {
    try {
      const res = await admissionController.getInputs(rehab_center_id);
      setInputs(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch inputs", err);
    }
  };

  const handleUpdate = async (row: any) => {
    try {
      const details = await admissionController.getDetails(
        rehab_center_id,
        row.admission_id
      );

      const mapped: any = {};

      inputs.forEach((input) => {
        const found = details.find((d: any) => d.input_id === input.input_id);
        mapped[input.input_id] = found?.input_value || '';
      });

      getServicesAvail(row.admission_id);
      fetchServices(row);
      setAdmissionData(row);
      setFormData(mapped);
      setSubmitType('update');
      setShowModal(true);
    } catch (err) {
      console.error("Failed to load admission details", err);
      alert("Failed to load admission details.");
    }
  };


  const columns = [
    {
      name: 'Actions',
      cell: (row: any) => (
        <button
          type="button"
          className="btn btn-info"
          onClick={() => handleUpdate(row)}
        >
          <MdMedicalInformation size={20} />
        </button>
      )
    },
    { name: '#', selector: (row: any) => row.count, sortable: true },
    { name: 'Name', selector: (row: any) => row.user, sortable: true },
    {
      name: 'Status',
      selector: (row: any) => row.status,
      sortable: true,
      cell: (row: any) => {
        let bgColor = '';
        let label = '';

        switch (row.status) {
          case 'A':
            bgColor = 'bg-success text-white';
            label = 'Approved';
            break;
          case 'O':
            bgColor = 'bg-primary text-white';
            label = 'Ongoing';
            break;
          case 'F':
            bgColor = 'bg-secondary text-white';
            label = 'Finished';
            break;
          case 'P':
          case '':
          default:
            bgColor = 'bg-warning text-dark';
            label = 'Pending';
        }

        return <span className={`badge ${bgColor}`}>{label}</span>;
      },
    },
    { name: 'Date Added', selector: (row: any) => row.date_added, sortable: true }
  ];

  const selectableRowDisabled = (row: any) => {
    return row.status != "P" || row.status != "";
  };

  const filteredItems = listEntry.filter((item: any) =>
    Object.values(item || {}).some((value: any) =>
      value?.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const handleDelete = () => {
    if (!selectedRows.length) {
      alert('Please select at least one entry to decline.');
      return;
    }

    if (window.confirm(`Are you sure you want to decline ${selectedRows.length} entries?`)) {
      deleteEntry(selectedRows.map((row: any) => row.service_id));
    }
  };

  const deleteEntry = async (ids: number[]) => {
    try {
      const response = await admissionController.delete_all(ids);
      if (!response || response <= 0) {
        alert('Failed to decline selected entries.');
      } else {
        alert('Successfully declined selected entries.');
        fetchEntry();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  // const addModal = () => {
  //   setSubmitType('add');
  //   setFormData({});
  //   setShowModal(true);
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await admissionController.update(form_data);
      alert('Admission updated successfully!');

      setShowModal(false);
      fetchEntry();
    } catch (error) {
      console.error('Submit failed:', error);
      alert('Failed to save admission record.');
    }
  };

  const handleApproveConfirm = async () => {
    try {
      const admission_ids = approvingRows.map((row) => row.admission_id);

      await admissionController.approve({
        rehab_center_id,
        admission_ids,
        start_date: startDate,
      });

      alerts.success_update('Admissions approved successfully!');
      setShowApproveModal(false);
      setStartDate('');
      fetchEntry();
    } catch (err) {
      console.error('Approve failed', err);
      alerts.warning('Failed to approve admissions.');
    }
  };

  useEffect(() => {
    if (showApproveModal) {
      setStartDate(new Date().toISOString().split('T')[0]);
    }
  }, [showApproveModal]);


  return (
    <div className="page-wrapper bg-light min-vh-100">
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-pretitle">Manage Admission</div>
              <h2 className="page-title">Admission</h2>
            </div>

            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <Button
                  variant="primary"
                  onClick={() => {
                    if (!selectedRows.length) {
                      alerts.warning('Please select at least one entry to approve.');
                      return;
                    }

                    setApprovingRows(selectedRows);
                    setShowApproveModal(true);
                  }}
                >
                  <FaCheck /> &nbsp; Approve
                </Button>

                <Button variant="warning" onClick={handleDelete}>
                  <FaTimes /> &nbsp; Decline
                </Button>
              </div>
            </div>
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
                    <Spinner animation="border" />
                    <p className="mt-2">Loading, please wait...</p>
                  </div>
                }
              />

            </div>
          </div>
        </div>
      </div>

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
                    required
                  />
                </div>

                <small className="text-muted">
                  Selected admissions: {approvingRows.length}
                </small>
              </div>

              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setShowApproveModal(false)}>
                  Cancel
                </Button>

                <Button
                  variant="success"
                  onClick={handleApproveConfirm}
                  disabled={!startDate}
                >
                  <FaCheckDouble /> Confirm Approval
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* <ModalServicesAvail
        show={showServicesModal}
        onHide={() => setShowServicesModal(false)}
        services={servicesAvail}
        loading={servicesLoading}
      /> */}

      <Footer />
    </div>
  );
};

export default AdmissionPage;
