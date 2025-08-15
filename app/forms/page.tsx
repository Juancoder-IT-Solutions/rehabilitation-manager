'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaTasks, FaTrashAlt } from 'react-icons/fa';
import Footer from '../components/Footer';
import inputsController from '../controllers/Inputs';
import DataTable from 'react-data-table-component';
import { Spinner, FormControl, InputGroup, Button } from 'react-bootstrap';
import ModalInputs from './modalInputs';
import { LuEqual, LuPencil } from 'react-icons/lu';
import alerts from '../components/Alerts';
import ModalInputOptions from './ModalInputOptions';

const FormPage = () => {
  const [listServices, setListServices] = useState([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [form_data, setFormData] = useState({});
  const [submit_type, setSubmitType] = useState('add');
  const [showModal, setShowModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [currentInputId, setCurrentInputId] = useState<number | null>(null);

  const openOptionsModal = (input_id: number) => {
    setCurrentInputId(input_id);
    setShowOptionsModal(true);
  };

  const fetchInputs = async () => {
    try {
      const response = await inputsController.fetch();
      setListServices(response.data);
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
        <div className="relative">
          <div className="dropdown">
            <button
              className="btn p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-all"
              data-bs-toggle="dropdown"
              aria-expanded="true"
              aria-label="Options"
            >
              <LuEqual className="text-gray-600" size={18} />
            </button>
            <div className="dropdown-menu dropdown-menu-end mt-2 p-2 rounded-lg shadow-lg bg-white w-40 right-0">
              {/* Edit */}
              <a
                href="#"
                className="dropdown-item cursor-pointer px-3 py-2 hover:bg-gray-600 rounded"
                onClick={() => handleUpdate(row)}
              >
                <LuPencil />&nbsp; Edit
              </a>

              {row.input_type === 'select' && (
                <a
                  href="#"
                  className="dropdown-item cursor-pointer px-3 py-2 hover:bg-gray-600 rounded"
                  onClick={() => openOptionsModal(row.input_id)}
                >
                  <FaTasks /> &nbsp; Add Options
                </a>
              )}

            </div>
          </div>
        </div>
      )
    },
    { name: <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>#</div>, selector: (row: any) => row.count, sortable: true, wrap: true },
    { name: <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>Label</div>, selector: (row: any) => row.input_label, sortable: true, wrap: true },
    { name: <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>Type</div>, selector: (row: any) => row.input_type, sortable: true },
    { name: <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>Required</div>, selector: (row: any) => row.input_require == 1 ? "Yes" : "No", sortable: true, wrap: true },
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
    fetchInputs();
  }, []);


  const handleDelete = () => {
    if (selectedRows.length === 0) {
      alerts.warning('Please select at least one entry to delete.');
      return;
    }

    alerts.confirm_action("Are you sure you want to delete selected entries?", "Yes, delete it", "No, cancel")
      .then((result: any) => {
        if (result.isConfirmed) {
          deleteEntry(selectedRows.map((row: any) => row.input_id));
        } else {
          alerts.confirm_action_cancel();
        }
      });
  };

  const deleteEntry = async (selectedRows: any) => {
    try {
      const response = await inputsController.delete_all(selectedRows);
      if (response <= 0) {
        alerts.warning('Failed to delete selected entries.');
      } else {
        alerts.success_delete();
        fetchInputs();
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
              <div className='page-pretitle'>Manage Form Inputs</div>
              <h2 className='page-title'>Inputs</h2>
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

      <ModalInputs showModal={showModal} setShowModal={setShowModal} form_data={form_data} setFormData={setFormData} fetchInputs={fetchInputs} submit_type={submit_type} />

      <ModalInputOptions
        show={showOptionsModal}
        setShow={setShowOptionsModal}
        input_id={currentInputId}
        fetchInputs={fetchInputs}
      />


      <Footer />
    </div>
  );
};

export default FormPage;
