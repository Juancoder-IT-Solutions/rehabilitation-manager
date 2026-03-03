'use client'

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import paymentsController from "../controllers/Payments";

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const payment_intent_id = searchParams.get("payment_intent_id") || "";
  const rehab_id = searchParams.get("rehab_id") || "";

  const [paymentStatus, setPaymentStatus] = useState<"pending" | "succeeded" | "failed">("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!payment_intent_id || !rehab_id) return;

    const init = async () => {
      setLoading(true);
      try {
        const statusRes: any = await paymentsController.check_status(payment_intent_id, rehab_id);
        setPaymentStatus(statusRes.status || "pending");
      } catch (err: any) {
        setError("Unable to check payment status.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [payment_intent_id, rehab_id]);

  return (
    <div className="page-wrapper">
      <div className="page-header d-print-none">
        <div className="container-xl">
          <h2 className="page-title">
            {loading ? "Checking payment..." : error ? error : paymentStatus === "succeeded" ? "Payment Successful" : "Waiting for confirmation"}
          </h2>
        </div>
      </div>
      <div className="page-body">
        <div className="container-xl">
          <div className={`card ${paymentStatus === "succeeded" ? "bg-success text-white" : ""}`}>
            <div className="card-body">
              {loading ? "Please wait..." : error ? error : "You can now go back to RehabManager Application."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}