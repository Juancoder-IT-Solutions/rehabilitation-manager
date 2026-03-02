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
}

let paymentsController = new PaymentsController
export default paymentsController