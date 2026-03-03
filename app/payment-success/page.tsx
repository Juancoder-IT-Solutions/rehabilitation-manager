'use client'

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import paymentsController from "../controllers/Payments";

const PaymentSuccess = () => {
    const searchParams = useSearchParams();

    const payment_intent_id = searchParams.get("payment_intent_id");
    const intent_id = searchParams.get("intent_id");
    const rehab_id = searchParams.get("rehab_id");

    const [payment_status, setPaymentStatus] = useState("pending")
    
    useEffect(() => {
        const init = async () => {
            console.log("checkout intent", payment_intent_id)
            if (payment_intent_id && rehab_id) {
                const statusRes: any = await paymentsController.check_status(payment_intent_id, rehab_id)
                console.log("checkout res", statusRes.status)
                setPaymentStatus(statusRes.status)
            }
        }

        init()
    }, []);

    return (
        <div className="page-wrapper">
            <div className="page-header d-print-none">
                <div className="container-xl">
                    <div className="row g-2 align-items-center">
                        <div className="col">
                            {
                                (payment_status == "succeeded") ?
                                    <h2 className="page-title text-green">Payment Successful</h2>
                                : <h2 className="page-title text-gray">Waiting for confirmation</h2>
                            }
                            
                            {/* <h2>Reference: {payment_intent_id}</h2> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-body">
                <div className="container-xl">
                    <div className="card">
                        <div className="card-body bg-success text-white">
                            You can now go back to RehabManager Application.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentSuccess