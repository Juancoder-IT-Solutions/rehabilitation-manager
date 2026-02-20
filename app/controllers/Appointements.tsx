import globals from "./Globals";
import query from "./Sql";

class AppointmentsController {
    constructor() {
        console.log("AppointmentsController loaded successfully");
    }

    async fetch(rehab_center_id: any) {
        try {
            const response = await query.get("show_appointments_admin", {
                input: {
                    rehab_center_id
                }
            });
            console.log("fetching appointments", response);
            return response;
        } catch (error) {
            console.error("Error fetching appointments:", error);
            return error;
        }
    }

    // Add a new appointment
    async add(form_data: any) {
        try {
            const data = await query.post("add_appointment", {
                input: form_data
            });
            return data.data;
        } catch (error) {
            console.error("Error adding appointment:", error);
            return -1;
        }
    }

    // Update an existing appointment
    async update(form_data: any) {
        try {
            const data = await query.post("update_appointment", {
                input: form_data
            });
            return data.data;
        } catch (error) {
            console.error("Error updating appointment:", error);
            return -1;
        }
    }

    async delete_all(ids: any, rehab_center_id: any) {
        try {
            const data = await query.post("delete_appointments", {
                input: {
                    ids,
                    rehab_center_id
                }
            });
            return data.data;
        } catch (error) {
            console.error("Error deleting appointments:", error);
            return -1;
        }
    }

    async update_status(ids: any[], status: string, rehab_center_id: any) {
        const data = await query.post("update_appointment_status", {
            input: {
                ids,
                status,
                rehab_center_id
            }
        });

        return data.data;
    }
}

let appointmentsController = new AppointmentsController();
export default appointmentsController;