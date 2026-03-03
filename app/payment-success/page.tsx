'use client'

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import paymentsController from "../controllers/Payments";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();

  const payment_intent_id = searchParams.get("payment_intent_id") || "";
  const intent_id = searchParams.get("intent_id") || "";
  const rehab_id = searchParams.get("rehab_id") || "";

  const [paymentStatus, setPaymentStatus] = useState<"pending" | "succeeded" | "failed">("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!payment_intent_id || !rehab_id) return;

    const init = async () => {
      setLoading(true);
      try {
        console.log("Checking checkout intent:", payment_intent_id);
        const statusRes: any = await paymentsController.check_status(payment_intent_id, rehab_id);
        console.log("Checkout response:", statusRes);
        setPaymentStatus(statusRes.status || "pending");
      } catch (err: any) {
        console.error("Error checking payment status:", err);
        setError("Unable to check payment status.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [payment_intent_id, rehab_id]); // include dependencies

  return (
    <div className="page-wrapper">
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              {loading ? (
                <h2 className="page-title text-gray">Checking payment...</h2>
              ) : error ? (
                <h2 className="page-title text-red">{error}</h2>
              ) : paymentStatus === "succeeded" ? (
                <h2 className="page-title text-green">Payment Successful</h2>
              ) : (
                <h2 className="page-title text-gray">Waiting for confirmation</h2>
              )}
              {/* <h2>Reference: {payment_intent_id}</h2> */}
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className={`card ${paymentStatus === "succeeded" ? "bg-success text-white" : ""}`}>
            <div className="card-body">
              {loading
                ? "Please wait while we check your payment..."
                : error
                ? error
                : "You can now go back to RehabManager Application."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;