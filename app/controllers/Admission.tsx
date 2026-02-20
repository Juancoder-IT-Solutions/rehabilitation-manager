import globals from "./Globals";
import query from "./Sql";

class AdmissionController {

    async fetch(rehab_center_id: any) {
        try {
            const response = query.get("show_admissions", {
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

    async getServicesAvail(rehab_center_id: any, admission_id: number) {
        try {
            const response = await query.get("get_services_avail", {
                input: { rehab_center_id, admission_id }
            });
            return response;
        } catch (error) {
            console.error("Error fetching details:", error);
            throw error;
        }
    }

    async fetch_admission_tasks(admission_id: any, admission_service_id: any, rehab_center_id: any) {
        try {
            const response = await query.get("fetch_admission_tasks", {
                input: { admission_id, admission_service_id, rehab_center_id }
            });
            return response;
        } catch (error) {
            console.error("Error fetching details:", error);
            throw error;
        }
    }

    async update_admission_tasks(admission_id: any, rehab_center_id: any, checkedTasks: any, admission_service_id: any) {
        const res = await query.post("update_admission_tasks", {
            input: {
                admission_id, rehab_center_id, checkedTasks, admission_service_id
            }
        });
        return res.data
    }

    async fetch_admission_history(user_id: any, rehab_center_id: any) {
        try {
            const response = await query.get("show_admission_history", {
                input: { user_id, rehab_center_id }
            });
            return response;
        } catch (error) {
            console.error("Error fetching history:", error);
            throw error;
        }
    }

    async fetch_admission_history_dashboard(rehab_center_id: any) {
        try {
            const response = await query.get("show_admission_history_dashboard", {
                input: { rehab_center_id }
            });
            return response;
        } catch (error) {
            console.error("Error fetching history:", error);
            throw error;
        }
    }


    async finish_admission(admission_id: number, rehab_center_id: number) {
        try {
            const response = await query.post("finish_admission", {
                input: {
                    admission_id,
                    rehab_center_id
                }
            });
            return response?.data ?? response;
        } catch (error) {
            console.error("Error finishing admission:", error);
            throw error;
        }
    }

    async approve(payload: { rehab_center_id: any; admission_ids: number[]; start_date: string; }) {
        try {
            const res = await query.post("approve_admission", {
                input: payload
            });

            return res?.data ?? res;
        } catch (error) {
            console.error("Error approving admissions:", error);
            throw error;
        }
    }

    async deleteService(admission_service_id: number, rehab_center_id: any) {
        try {
            const response = await query.post("delete_admission_service", {
                input: {
                    admission_service_id,
                    rehab_center_id
                }
            });

            return response?.data ?? response;
        } catch (error) {
            console.error("Error deleting service:", error);
        }
    }

    async admission_trends(rehab_center_id: any, days: number = 7) {
        try {
            const response = await query.get("admission_trends", {
                input: {
                    rehab_center_id,
                    days
                }
            });

            return response?.data ?? [];
        } catch (error) {
            console.error("Error fetching admission trends:", error);
            return [];
        }
    }

}

let admissionController = new AdmissionController
export default admissionController