import globals from "./Globals";
import query from "./Sql";

class PaymentsController {
    constructor() {
        console.log("successfully loaded payments controller")
    }

    async fetch(rehab_center_id: any) {
        try {
            const response = await query.get("show_payment_rehab", {
                input: {
                    rehab_center_id: rehab_center_id
                }
            });

            return response
        } catch (error) {
            return error
        }
    }

    async check_status(intent_id: string, rehab_center_id: any) {
        try {
        const status = await query.post("check_status", {
            input: {
                intent_id:intent_id,
                rehab_center_id:rehab_center_id
            }
        });

        // Returns { status: "succeeded" | "awaiting_payment_method" | etc. }
        return status.data;
        } catch (err) {
        console.error("Check status error:", err);
        return { status: "error" };
        }
    }
}

let paymentsController = new PaymentsController
export default paymentsController