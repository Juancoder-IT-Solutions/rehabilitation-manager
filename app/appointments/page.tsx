'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import { FaPlus, FaTrashAlt, FaPencilAlt, FaCheckDouble, FaCheck } from 'react-icons/fa';
import DataTable from 'react-data-table-component';
import { Spinner, Button } from 'react-bootstrap';
import alerts from '../components/Alerts';
import Footer from '../components/Footer';
import appointmentsController from '../controllers/Appointements';
import ModalAppointments from './ModalAppointments';
import { FaX } from 'react-icons/fa6';

const AppointmentsPage = () => {
    const { data: session, status } = useSession();
    const rehab_center_id = session?.user?.rehab_center_id;

    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState('');
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [submitType, setSubmitType] = useState<'add' | 'update'>('add');

    if (status === "unauthenticated") {
        redirect('/login');
    }

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await appointmentsController.fetch(rehab_center_id);
            setAppointments(response.data || []);
        } catch (err) {
            console.error('Failed to fetch appointments', err);
            alerts.error('Unable to fetch appointments.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        if (selectedRows.length === 0) {
            alerts.warning('Please select at least one appointment to delete.');
            return;
        }

        alerts.confirm_action(
            'Are you sure you want to delete selected appointments?',
            'Yes, delete',
            'No, cancel'
        ).then((result: any) => {
            if (result.isConfirmed) {
                deleteAppointments(selectedRows.map((row: any) => row.appointment_id));
            } else {
                alerts.confirm_action_cancel();
            }
        });
    };

    const deleteAppointments = async (ids: number[]) => {
        try {
            const response = await appointmentsController.delete_all(ids, rehab_center_id);
            if (response > 0) {
                alerts.success_delete();
                fetchAppointments();
            } else {
                alerts.failed_query();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = () => {
        setSubmitType('add');
        setFormData({});
        setShowModal(true);
    };

    // Open modal to edit appointment
    const handleEdit = (row: any) => {
        setSubmitType('update');
        setFormData(row);
        setShowModal(true);
    };

    const filteredAppointments = appointments.filter((item) =>
        Object.values(item).some((val: any) =>
            val?.toString().toLowerCase().includes(filterText.toLowerCase())
        )
    );

    useEffect(() => {
        if (status === 'authenticated' && rehab_center_id) {
            fetchAppointments();
        }
    }, [status, rehab_center_id]);

    const columns = [
        {
            name: 'Actions',
            cell: (row: any) => (
                <div className="btn-group">
                    <button className='btn btn-primary' onClick={() => handleEdit(row)}>
                        <FaPencilAlt />&nbsp;
                    </button>
                </div>
            ),
        },
        { name: '#', selector: (row: any) => row.appointment_id, sortable: true },
        { name: 'Admission ID', selector: (row: any) => row.admission_id, sortable: true },
        { name: 'Date', selector: (row: any) => row.appointment_date, sortable: true },
        {
            name: 'Status',
            selector: (row: any) => row.status, 
            sortable: true,
            cell: (row: any) => {
                let label = 'Pending';
                let className = 'badge bg-secondary';

                if (row.status === 'A') {
                    label = 'Approved';
                    className = 'badge bg-success';
                } else if (row.status === 'P') {
                    label = 'Pending';
                    className = 'badge bg-warning text-dark';
                } else if (row.status === 'C') {
                    label = 'Rejected';
                    className = 'badge bg-danger';
                } else {
                    label = 'Pending';
                    className = 'badge bg-secondary';
                }

                return <span className={className}>{label}</span>;
            },
        },
        { name: 'Remarks', selector: (row: any) => row.remarks, sortable: false, wrap: true },
        { name: 'Last Modified', selector: (row: any) => row.date_added, sortable: true },
    ];

    const handleApproveSelected = () => {
        if (selectedRows.length === 0) {
            alerts.warning('Please select at least one appointment to approve.');
            return;
        }

        alerts.confirm_action(
            'Approve selected appointments?',
            'Yes, approve',
            'No, cancel'
        ).then(async (result: any) => {
            if (result.isConfirmed) {
                const ids = selectedRows.map((row: any) => row.appointment_id);
                const res = await appointmentsController.update_status(ids, 'A', rehab_center_id);

                if (res > 0) {
                    alerts.success_update('Appointments approved.');
                    fetchAppointments();
                } else {
                    alerts.failed_query();
                }
            }
        });
    };

    const handleRejectSelected = () => {
        if (selectedRows.length === 0) {
            alerts.warning('Please select at least one appointment to reject.');
            return;
        }

        alerts.confirm_action(
            'Reject selected appointments?',
            'Yes, reject',
            'No, cancel'
        ).then(async (result: any) => {
            if (result.isConfirmed) {
                const ids = selectedRows.map((row: any) => row.appointment_id);
                const res = await appointmentsController.update_status(ids, 'C', rehab_center_id);

                if (res > 0) {
                    alerts.success_update('Appointments rejected.');
                    fetchAppointments();
                } else {
                    alerts.failed_query();
                }
            }
        });
    };

    return (
        <div className="page-wrapper bg-light min-vh-100">
            <div className="page-header d-print-none">
                <div className="container-xl">
                    <div className="row g-2 align-items-center">
                        <div className="col">
                            <div className="page-pretitle">Manage Appointments</div>
                            <h2 className="page-title">Appointments</h2>
                        </div>
                        <div className='col-auto ms-auto d-print-none'>
                            <div className='btn-list'>
                                <Button variant='success' onClick={() => handleApproveSelected()}>
                                    <FaCheck /> &nbsp;  Approve Selected
                                </Button>
                                <Button variant='danger' onClick={() => handleRejectSelected()}>
                                    <FaX />&nbsp; Reject Selected
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
                                data={filteredAppointments}
                                selectableRows
                                onSelectedRowsChange={({ selectedRows }) => setSelectedRows(selectedRows)}
                                pagination
                                highlightOnHover
                                progressPending={loading}
                                progressComponent={
                                    <div className="text-center my-4">
                                        <Spinner animation="border" variant="primary" />
                                        <p className="mt-2">Loading, please wait...</p>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            <ModalAppointments
                showModal={showModal}
                setShowModal={setShowModal}
                form_data={formData}
                setFormData={setFormData}
                submit_type={submitType}
                fetchAppointments={fetchAppointments}
                rehab_center_id={rehab_center_id}
            />

            <Footer />
        </div>
    );
};

export default AppointmentsPage;