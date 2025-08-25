'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaTasks, FaTrashAlt } from 'react-icons/fa';
import Footer from '../components/Footer';
import servicesController from '../controllers/Services';
import DataTable from 'react-data-table-component';
import { Spinner, FormControl, InputGroup, Button } from 'react-bootstrap';
import ModalServices from './modalServices';
import globals from '../controllers/Globals';
import { LuEqual, LuPencil } from 'react-icons/lu';
import ModalStages from './modalStages';
import alerts from '../components/Alerts';
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';

const ServicesPage = () => {
  const { data: session, status } = useSession()
  // let session_user: any = session?.user
  const rehab_center_id = session?.user?.rehab_center_id;

  const [listServices, setListServices] = useState([]);
  const [listStages, setListStages] = useState([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [form_data, setFormData] = useState({});
  const [form_stages_data, setFormStagesData] = useState({});
  const [submit_type, setSubmitType] = useState('add');
  const [showModal, setShowModal] = useState(false);
  const [showStagesModal, setShowStagesModal] = useState(false);
  const [serviceID, setServiceID] = useState(0);

  if (status === "unauthenticated") {
    redirect('/login')
  }

  const fetchServices = async () => {
    console.log("rehab id", rehab_center_id);
    try {
      const response = await servicesController.fetch(rehab_center_id);
      setListServices(response.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStages = async (id: any) => {
    try {
      const response = await servicesController.fetch_stages(id, rehab_center_id);
      setListStages(response.data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };


  const columns = [
    {
      name: <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>Actions</div>,
      cell: (row: any) => (
        <div className="btn-group">
          <button
            className="btn btn-primary"
            onClick={() => handleUpdate(row)}
          >
            <LuPencil size={14} />&nbsp; Edit
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => showStages(row.service_id)}
          >
            <FaTasks size={14} />&nbsp; Stages
          </button>
        </div>
      )
    },
    { name: <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>#</div>, selector: (row: any) => row.count, sortable: true, wrap: true },
    { name: <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>Service</div>, selector: (row: any) => row.service_name, sortable: true, wrap: true },
    { name: <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>Fee</div>, selector: (row: any) => globals.formatNumber(row.service_fee), sortable: true },
    { name: <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>Description</div>, selector: (row: any) => row.service_desc, sortable: true, wrap: true },
    { name: <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>Date Last Modified</div>, selector: (row: any) => row.date_updated, sortable: true, wrap: true }
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
    if (status === "authenticated" && rehab_center_id) {
      fetchServices();
    }
  }, [status, session]);


  const handleDelete = () => {
    if (selectedRows.length === 0) {
      alerts.warning('Please select at least one entry to delete.');
      return;
    }

    alerts.confirm_action("Are you sure you want to delete selected entries?", "Yes, delete it", "No, cancel")
      .then((result: any) => {
        if (result.isConfirmed) {
          deleteEntry(selectedRows.map((row: any) => row.service_id));
        } else {
          alerts.confirm_action_cancel();
        }
      });
  };

  const deleteEntry = async (selectedRows: any) => {
    console.log("select ", selectedRows);
    // setLoading(true);
    try {
      const response = await servicesController.delete_all(selectedRows, rehab_center_id);
      if (response <= 0) {
        alerts.warning('Failed to delete selected entries.');
      } else {
        alerts.success_delete();
        fetchServices();
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

  const showStages = (id: any) => {
    setServiceID(id);
    fetchStages(id);
    setShowStagesModal(true);
  }

  return (
    <div className='page-wrapper bg-light min-vh-100'>
      <div className='page-header d-print-none'>
        <div className='container-xl'>
          <div className='row g-2 align-items-center'>
            <div className='col'>
              <div className='page-pretitle'>Manage Services</div>
              <h2 className='page-title'>Services</h2>
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

      <ModalServices showModal={showModal} setShowModal={setShowModal} form_data={form_data} setFormData={setFormData} fetchServices={fetchServices} submit_type={submit_type} rehab_center_id={rehab_center_id} />

      <ModalStages showStagesModal={showStagesModal} setShowStagesModal={setShowStagesModal} form_stages_data={form_stages_data} setFormStagesData={setFormStagesData} fetchServices={fetchServices} serviceID={serviceID} listStages={listStages} fetchStages={fetchStages} rehab_center_id={rehab_center_id} />

      <Footer />
    </div>
  );
};

export default ServicesPage;
