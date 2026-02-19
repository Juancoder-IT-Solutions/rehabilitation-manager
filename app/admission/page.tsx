'use client';

import { useEffect, useState } from 'react';
import { FaCheck, FaPencilAlt, FaTimes } from 'react-icons/fa';
import Footer from '../components/Footer';
import admissionController from '../controllers/Admission';
import DataTable from 'react-data-table-component';
import { Spinner, Button } from 'react-bootstrap';
import ModalAdmission from './modalAdmission';
import { useSession } from "next-auth/react";

const AdmissionPage = () => {
  const { data: session, status } = useSession()
  const rehab_center_id = session?.user?.rehab_center_id;

  const [listServices, setListServices] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [form_data, setFormData] = useState<any>({});
  const [submit_type, setSubmitType] = useState<'add' | 'update'>('add');
  const [showModal, setShowModal] = useState(false);
  const [inputs, setInputs] = useState<any[]>([]);


  const fetchEntry = async () => {
    setLoading(true);
    try {
      const response = await admissionController.fetch(rehab_center_id);
      setListServices(response?.data || []);
    } catch (error) {
      console.error('Failed to fetch admission:', error);
    } finally {
      setLoading(false);
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
          className="btn btn-primary"
          onClick={() => handleUpdate(row)}
        >
          <FaPencilAlt />
        </button>
      )
    },
    { name: '#', selector: (row: any) => row.count, sortable: true },
    { name: 'Name', selector: (row: any) => row.user, sortable: true },
    { name: 'Date Added', selector: (row: any) => row.date_added, sortable: true }
  ];

  const filteredItems = listServices.filter((item: any) =>
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
                <Button variant="primary">
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
      />

      <Footer />
    </div>
  );
};

export default AdmissionPage;
