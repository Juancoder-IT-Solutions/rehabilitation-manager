'use client';

import { useEffect, useState } from 'react';
import { FaPencilAlt, FaPlus, FaTrashAlt } from 'react-icons/fa';
import Footer from '../components/Footer';
import galleryController from '../controllers/RehabGallery';
import DataTable from 'react-data-table-component';
import { Spinner, Button } from 'react-bootstrap';
import globals from '../controllers/Globals';
import ModalGallery from './modalGallery';

const ServicesPage = () => {
  const [listServices, setListServices] = useState([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [form_data, setFormData] = useState({});
  const [submit_type, setSubmitType] = useState('add');

  const [showModal, setShowModal] = useState(false);
  const no_image = `data:image/svg+xml;charset=UTF-8, 
  <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-photo-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8h.01" /><path d="M13 21h-7a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v7" /><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3 3" /><path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0" /><path d="M22 22l-5 -5" /><path d="M17 22l5 -5" /></svg>`;


  const fetchEntry = async () => {
    try {
      const response = await galleryController.fetch();
      setListServices(response.data);
    } catch (error) {
      console.error('Failed to fetch entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { name: '#', selector: (row:any) => row.count, sortable: true },
    {
      name: 'Image',
      cell: (row:any) => (
        <img
          src={row.file_b64 ? `data:image/jpeg;base64,${row.file_b64}` : no_image}
          alt="Image"
          style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px', padding: '5px' }}
          onError={(e) => { e.currentTarget.src = no_image; }}
        />
      ),
    },
    {
      name: 'Date Last Modified',
      selector: (row:any) => row.date_added, // Fix to show the correct date
      sortable: true
    },
    {
      name: 'Actions',
      cell: (row:any) => (
        <div className="btn-list flex-nowrap">
          <a href="#" onClick={() => handleUpdate(row)} className="btn btn-primary">
            <FaPencilAlt />
          </a>
        </div>
      ),
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
    fetchEntry();
  }, []);

  const handleDelete = () => {
    if (selectedRows.length === 0) {
      alert('Please select at least one entry to delete.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} selected entries?`)) {
      console.log('Delete these rows: ', selectedRows.map((row: any) => row.id));
      // Add delete logic here
      deleteEntry(selectedRows.map((row: any) => row.id));
    }
  };

  const deleteEntry = async (selectedRows: any) => {
    console.log("select ", selectedRows);
    // setLoading(true);
    try {
      const response = await galleryController.delete_all(selectedRows);
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
              <div className='page-pretitle'>Manage Rehab Gallery</div>
              <h2 className='page-title'>Gallery</h2>
            </div>
            <div className='col-auto ms-auto d-print-none'>
              <div className='btn-list'>
                <Button variant='success' onClick={addModal}>
                  <FaPlus /> &nbsp; Add
                </Button>
                <Button variant='danger' onClick={handleDelete}>
                  <FaTrashAlt />&nbsp; Delete
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
      <Footer />

      <ModalGallery showModal={showModal} setShowModal={setShowModal} form_data={form_data} setFormData={setFormData} fetchEntry={fetchEntry} submit_type={submit_type} />
    </div>
  );
};

export default ServicesPage;
