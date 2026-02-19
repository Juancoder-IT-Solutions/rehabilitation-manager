'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaTrashAlt, FaUserEdit } from 'react-icons/fa';
import Footer from '../components/Footer';
import users from '../controllers/Users';
import DataTable from 'react-data-table-component';
import { Spinner, Button } from 'react-bootstrap';
import ModalUsers from './modalUsers';
import alerts from '../components/Alerts';
import globals from '../controllers/Globals';
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';

const ClientsPage = () => {
  const { data: session, status } = useSession();
  const rehab_center_id = session?.user?.rehab_center_id;

  const [listClients, setListClients] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [form_data, setFormData] = useState({});
  const [submit_type, setSubmitType] = useState('add');
  const [showModal, setShowModal] = useState(false);

  if (status === "unauthenticated") {
    redirect('/login');
  }

  const fetchClients = async () => {
    try {
      const response = await users.fetch("user_category !='R'", rehab_center_id);
      setListClients(response.data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && rehab_center_id) {
      fetchClients();
    }
  }, [status, session]);

  const columns = [
    {
      name: 'Actions',
      cell: (row: any) => (
         <button
            className="btn btn-primary" onClick={() => handleUpdate(row)}>
          <FaUserEdit size={14} />&nbsp;
        </button>
      )
    },
    { name: '#', selector: (row: any) => row.count, sortable: true, width: '70px' },
    { name: 'Full Name', selector: (row: any) => `${row.user_fname} ${row.user_mname} ${row.user_lname}`, sortable: true, wrap: true },
    { name: 'Birthdate', selector: (row: any) => row.birthdate, sortable: true },
    { name: 'Contact No.', selector: (row: any) => row.contact_number, sortable: true },
    { name: 'Address', selector: (row: any) => row.permanent_address, sortable: true, wrap: true },
    { name: 'Date Added', selector: (row: any) => row.date_added, sortable: true, wrap: true }
  ];

  const filteredItems = listClients.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const handleUpdate = (row: any) => {
    setFormData(row);
    setShowModal(true);
    setSubmitType('update');
  };

  const addModal = () => {
    setFormData({});
    setSubmitType('add');
    setShowModal(true);
  };

  const handleDelete = () => {
    if (selectedRows.length === 0) {
      alerts.warning('Please select at least one client to delete.');
      return;
    }

    alerts.confirm_action("Are you sure you want to delete selected clients?", "Yes, delete", "Cancel")
      .then((result: any) => {
        if (result.isConfirmed) {
          deleteEntry(selectedRows.map((row: any) => row.client_id));
        } else {
          alerts.confirm_action_cancel();
        }
      });
  };

  const deleteEntry = async (ids: any[]) => {
    try {
    //   const response = await users.delete_all(ids, rehab_center_id);
    //   if (response <= 0) {
    //     alerts.warning('Failed to delete selected clients.');
    //   } else {
    //     alerts.success_delete();
    //     fetchClients();
    //   }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className='page-wrapper bg-light min-vh-100'>
      <div className='page-header d-print-none'>
        <div className='container-xl'>
          <div className='row g-2 align-items-center'>
            <div className='col'>
              <div className='page-pretitle'>Client Records</div>
              <h2 className='page-title'>Client Profiles</h2>
            </div>
            {/* <div className='col-auto ms-auto d-print-none'>
              <div className='btn-list'>
                <Button variant='success' onClick={addModal}>
                  <FaPlus /> &nbsp; Add Client
                </Button>
                <Button variant='danger' onClick={handleDelete}>
                  <FaTrashAlt />&nbsp; Delete
                </Button>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className='page-body'>
        <div className='container-xl'>
          <div className='card shadow-sm'>
            <div className='card-body'>
              <div className='d-flex justify-content-end mb-3'>
                <input
                  type="text"
                  className="form-control w-25"
                  placeholder="Search ..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>

              <DataTable
                columns={columns}
                data={filteredItems}
                // selectableRows
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
                    <p className='mt-2'>Loading clients…</p>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>

      <ModalUsers
        showModal={showModal}
        setShowModal={setShowModal}
        form_data={form_data}
        setFormData={setFormData}
        fetchClients={fetchClients}
        submit_type={submit_type}
        rehab_center_id={rehab_center_id}
      />

      <Footer />
    </div>
  );
};

export default ClientsPage;
