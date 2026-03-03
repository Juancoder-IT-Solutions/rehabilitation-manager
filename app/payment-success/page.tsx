// app/payment-success/page.tsx
import { Suspense } from "react";
import PaymentSuccessClient from "./PaymentSuccess";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessClient />
    </Suspense>
  );
}