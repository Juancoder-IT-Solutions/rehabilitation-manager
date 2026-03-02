'use client';

import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import DataTable from 'react-data-table-component';
import { Spinner, Button } from 'react-bootstrap';
import paymentsController from '../controllers/Payments';
import globals from '../controllers/Globals';
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';

const PaymentsPage = () => {
    const { data: session, status } = useSession();
    const rehab_center_id = session?.user?.rehab_center_id;

    const [listPayments, setListPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState('');

    if (status === "unauthenticated") {
        redirect('/login');
    }

    const fetchPayments = async () => {
        try {
            const res = await paymentsController.fetch(rehab_center_id);
            setListPayments(res.data || []);
        } catch (e) {
            console.error("Fetch payments failed", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated" && rehab_center_id) {
            fetchPayments();
        }
    }, [status, rehab_center_id]);

    const columns = [
        { name: "#", selector: (row: any) => row.payment_id, sortable: true },
        {
            name: "Processed By",
            selector: (row: any) => {
                const fname = row.user_fname?.trim() || "";
                const lname = row.user_lname?.trim() || "";
                const fullName = `${fname} ${lname}`.trim();
                return fullName || "Unknown"; 
            },
            wrap: true
        },
        {
            name: "Method",
            selector: (row: any) => row.payment_method?.toUpperCase() || "---", 
            sortable: true
        },
        { name: "Payment Date", selector: (row: any) => row.payment_date, sortable: true },
        {
            name: "Status",
            selector: (row: any) => row.status === "S" ? "PENDING" : "ACCEPTED",
            sortable: true,
            cell: (row: any) => (
                <span className={`badge ${row.status === "S" ? "bg-secondary" : "bg-success"}`}>
                    {row.status === "S" ? "Pending" : "Accepted"}
                </span>
            )
        },
        { name: "Date Added", selector: (row: any) => row.date_added, sortable: true },
    ];

    const filteredItems = listPayments.filter((item) =>
        Object.values(item).some((value) =>
            value?.toString().toLowerCase().includes(filterText.toLowerCase())
        )
    );

    return (
        <div className='page-wrapper bg-light min-vh-100'>
            <div className='page-header d-print-none'>
                <div className='container-xl'>
                    <h2 className='page-title'>Payments</h2>
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
                                pagination
                                highlightOnHover
                                progressPending={loading}
                                progressComponent={
                                    <div className='text-center my-4'>
                                        <Spinner animation='border' variant='primary' />
                                        <p className='mt-2'>Loading payments...</p>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PaymentsPage;