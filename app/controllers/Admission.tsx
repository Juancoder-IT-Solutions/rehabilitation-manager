import globals from "./Globals";
import query from "./Sql";

class AdmissionController {

    async fetch(rehab_center_id: any) {
        try {
            const response = query.get("show_admissions", {
                input: {
                    rehab_center_id:rehab_center_id
                }
            });

            console.log("fetching", response)
            return response
        } catch (error) {
            console.error('Error fetching data:', error);
            return error
        }
    }

    async delete_all(ids: any) {
        const data = await query.post("delete_admissions", {
            input: {
                ids: ids
            }
        })

        return data.data
    }

    async update(form_data: any) {
        const data = await query.post("update_admissions", {
            input: form_data
        })

        return data.data
    }

    async total_admission(rehab_center_id: any) {
        try {
            const response = await query.get("total_admission", {
                input: {
                    rehab_center_id: rehab_center_id
                }
            });

            console.log("fetching", response)
            return response
        } catch (error) {
            console.error('Error fetching data:', error);
            return error
        }
    }

    async getInputs(rehab_center_id: any) {
        try {
            const response = await query.get("show_admission_inputs", {
                input: {
                    rehab_center_id: rehab_center_id
                }
            });

            console.log("fetching", response);
            return response
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    }

    async getDetails(rehab_center_id: any, admission_id: number) {
        try {
            const response = await query.get("get_details_inputs", {
                input: { rehab_center_id, admission_id }
            });
            return response?.data ?? response;
        } catch (error) {
            console.error("Error fetching details:", error);
            throw error;
        }
    }



}

let admissionController = new AdmissionController
export default admissionController