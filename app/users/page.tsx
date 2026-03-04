'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaTrashAlt, FaUserEdit } from 'react-icons/fa';
import Footer from '../components/Footer';
import usersController from '../controllers/Users';
import DataTable from 'react-data-table-component';
import { Spinner, Button } from 'react-bootstrap';
import ModalUsers from './modalUsers';
import alerts from '../components/Alerts';
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';

const UsersPage = () => {
    const { data: session, status } = useSession()
    const rehab_center_id = session?.user?.rehab_center_id;

    const [listUsers, setListUsers] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState('');
    const [formData, setFormData] = useState<any>({});
    const [submitType, setSubmitType] = useState<'add' | 'update'>('add');
    const [showModal, setShowModal] = useState(false);

    if (status === "unauthenticated") {
        redirect('/login');
    }

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await usersController.fetch("user_category!='U'", rehab_center_id);
            setListUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated" && rehab_center_id) fetchUsers();
    }, [status, session]);

    const handleUpdate = (row: any) => {
        setFormData(row);
        setSubmitType('update');
        setShowModal(true);
    };

    const handleDelete = () => {
        if (selectedRows.length === 0) {
            alerts.warning('Please select at least one user to delete.');
            return;
        }

        alerts.confirm_action(
            "Are you sure you want to delete selected users?",
            "Yes, delete",
            "No, cancel"
        ).then((result: any) => {
            if (result.isConfirmed) {
                deleteUsers(selectedRows.map((row: any) => row.user_id));
            } else {
                alerts.confirm_action_cancel();
            }
        });
    };

    const deleteUsers = async (ids: number[]) => {
        try {
            const response = await usersController.delete_all(ids, rehab_center_id);
            if (response <= 0) {
                alerts.warning('Failed to delete selected users.');
            } else {
                alerts.success_delete();
                fetchUsers();
            }
        } catch (error) {
            console.error('Error deleting users:', error);
        }
    };

    const addModal = () => {
        setFormData({});
        setSubmitType('add');
        setShowModal(true);
    };

    const filteredUsers = (listUsers || []).filter((user) =>
        Object.values(user).some((val) =>
            val?.toString().toLowerCase().includes(filterText.toLowerCase())
        )
    );

    const columns = [
        {
            name: "Actions",
            cell: (row: any) => (
                <div className="btn-group">
                    <button className="btn btn-primary" onClick={() => handleUpdate(row)}>
                        <FaUserEdit size={14} />&nbsp; Edit
                    </button>
                </div>
            )
        },
        { name: "#", selector: (row: any) => row.count, sortable: true },
        { name: "Full Name", selector: (row: any) => `${row.user_fname} ${row.user_mname} ${row.user_lname}`, sortable: true },
        { name: "Username", selector: (row: any) => row.username, sortable: true },
        {
            name: "Category",
            selector: (row: any) => row.user_category,
            cell: (row: any) => {
                const map: any = {
                    R: { label: "Admin", class: "bg-success" },
                    S: { label: "Staff", class: "bg-secondary" },
                    U: { label: "Patient", class: "bg-primary" },
                };

                const config = map[row.user_category] || { label: "Unknown", class: "bg-dark" };

                return (
                    <span className={`badge ${config.class}`}>
                        {config.label}
                    </span>
                );
            },
            sortable: true,
        },
        { name: "Date Added", selector: (row: any) => row.date_added, sortable: true },
    ];

    return (
        <div className='page-wrapper bg-light min-vh-100'>
            <div className='page-header d-print-none'>
                <div className='container-xl'>
                    <div className='row g-2 align-items-center'>
                        <div className='col'>
                            <div className='page-pretitle'>Manage Users</div>
                            <h2 className='page-title'>Users</h2>
                        </div>
                        <div className='col-auto ms-auto d-print-none'>
                            <div className='btn-list'>
                                <Button variant='success' onClick={addModal}>
                                    <FaPlus /> &nbsp; Add User
                                </Button>
                                <Button variant='danger' onClick={handleDelete}>
                                    <FaTrashAlt /> &nbsp; Delete
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
                                data={filteredUsers}
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

            <ModalUsers
                showModal={showModal}
                setShowModal={setShowModal}
                form_data={formData}
                setFormData={setFormData}
                fetchUsers={fetchUsers}
                submit_type={submitType}
                rehab_center_id={rehab_center_id}
            />

            <Footer />
        </div>
    );
};

export default UsersPage;