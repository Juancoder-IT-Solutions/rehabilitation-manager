'use client';

import { useEffect, useState } from 'react';
import { FaCheck, FaPencilAlt, FaPlus, FaTimes, FaTrashAlt } from 'react-icons/fa';
import Footer from '../components/Footer';
import admissionController from '../controllers/Admission';
import DataTable from 'react-data-table-component';
import { Spinner, FormControl, InputGroup, Button } from 'react-bootstrap';
import ModalAdmision from './modalAdmission';
import globals from '../controllers/Globals';

const AdmissionPage = () => {
  const [listServices, setListServices] = useState([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [form_data, setFormData] = useState({});
  const [submit_type, setSubmitType] = useState('add');

  const [showModal, setShowModal] = useState(false);

  const fetchEntry = async () => {
    try {
      const response = await admissionController.fetch();
      setListServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { name: '#', selector: (row: any) => row.count, sortable: true },
    { name: 'Name', selector: (row: any) => row.user, sortable: true },
    { name: 'Service', selector: (row: any) => globals.formatNumber(row.service), sortable: true },
    { name: 'Admitting Physician', selector: (row: any) => row.admitting_physician, sortable: true },
    { name: 'Date Last Modified', selector: (row: any) => row.date_updated, sortable: true }, {
      name: 'Actions',
      cell: (row: any) => (
        <div className="btn-list flex-nowrap">
          <a href="#" onClick={() => handleUpdate(row)} className="btn btn-primary">
            <FaPencilAlt />
          </a>
        </div>
      )
    }
  ];

  const handleUpdate = (row: any) => {
    setFormData(row);
    setShowModal(true);
    setSubmitType('update');
  };


  const filteredItems = listServices.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  useEffect(() => {
    // fetchEntry();
  }, []);

  const handleDelete = () => {
    if (selectedRows.length === 0) {
      alert('Please select at least one entry to delete.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} selected entries?`)) {
      console.log('Delete these rows: ', selectedRows.map((row: any) => row.service_id));
      // Add delete logic here
      deleteEntry(selectedRows.map((row: any) => row.service_id));
    }
  };

  const deleteEntry = async (selectedRows: any) => {
    console.log("select ", selectedRows);
    // setLoading(true);
    try {
      const response = await admissionController.delete_all(selectedRows);
      if (response <= 0) {
        alert('Failed to delete selected entries.');
      } else {
        alert('Successfully deleted selected entries.');
        fetchEntry();
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      // setLoading(false);
    }
  }

  const addModal = () => {
    setShowModal(true);
    setSubmitType('add');
    setFormData([]);
  }

  return (
    <div className='page-wrapper bg-light min-vh-100'>
      <div className='page-header d-print-none'>
        <div className='container-xl'>
          <div className='row g-2 align-items-center'>
            <div className='col'>
              <div className='page-pretitle'>Manage Admission</div>
              <h2 className='page-title'>Admission</h2>
            </div>
            <div className='col-auto ms-auto d-print-none'>
              <div className='btn-list'>
                <Button variant='primary' onClick={addModal}>
                  <FaCheck /> &nbsp; Approved
                </Button>
                <Button variant='warning' onClick={handleDelete}>
                  <FaTimes />&nbsp; Declined
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='page-body'>
        <div className='container-xl'>
          <div className='card shadow-sm'>
            <div className='card-body'>
              <div className='d-flex justify-content-between mb-3'>
                <div></div>
                <div className="input-icon mb-3">
                  <input type="text" className="form-control" placeholder="Search…" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
                  <span className="input-icon-addon">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M21 21l-6 -6"></path></svg>
                  </span>
                </div>
              </div>

              <DataTable
                columns={columns}
                data={filteredItems}
                selectableRows
                onSelectedRowsChange={({ selectedRows }) => setSelectedRows(selectedRows)}
                pagination
                highlightOnHover
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 25, 50]}
                selectableRowsHighlight
                progressPending={loading}
                progressComponent={
                  <div className='text-center my-4'>
                    <Spinner animation='border' variant='primary' />
                    <p className='mt-2'>Loading, please wait...</p>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>

      <ModalAdmision showModal={showModal} setShowModal={setShowModal} form_data={form_data} setFormData={setFormData} handleSubmit={submit_type} />

      <Footer />
    </div>
  );
};

export default AdmissionPage;
