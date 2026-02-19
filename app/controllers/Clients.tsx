import globals from "./Globals";
import query from "./Sql";

class ClientsController {
    constructor() {
        console.log("successfully loaded client controller");
    }

    async fetch(rehab_center_id: any) {
        try {
            const response = await query.get("show_clients", {
                input: {
                    rehab_center_id: rehab_center_id
                }
            });

            console.log("fetching clients", response);
            return response;
        } catch (error) {
            console.error('Error fetching clients:', error);
            return error;
        }
    }

    async fetch_profile(client_id: any, rehab_center_id: any) {
        try {
            const response = await query.get("show_client_profile", {
                input: {
                    client_id: client_id,
                    rehab_center_id: rehab_center_id
                }
            });

            console.log("fetching client profile", response);
            return response;
        } catch (error) {
            console.error('Error fetching client profile:', error);
            return error;
        }
    }

    async delete_all(ids: any, rehab_center_id: any) {
        const data = await query.post("delete_clients", {
            input: {
                ids: ids,
                rehab_center_id: rehab_center_id
            }
        });

        return data.data;
    }

    async add(form_data: any) {
        const data = await query.post("add_client", {
            input: form_data
        });

        return data.data;
    }

    async update(form_data: any) {
        const data = await query.post("update_client", {
            input: form_data
        });

        return data.data;
    }

    async total_clients(rehab_center_id: any) {
        try {
            const response = await query.get("total_clients", {
                input: {
                    rehab_center_id: rehab_center_id
                }
            });

            console.log("total clients", response);
            return response;
        } catch (error) {
            console.error('Error fetching total clients:', error);
            return error;
        }
    }

    // OPTIONAL: assign service to client
    async assign_service(form_data: any) {
        const data = await query.post("assign_client_service", {
            input: form_data
        });

        return data.data;
    }

    // OPTIONAL: fetch client services
    async fetch_services(client_id: any, rehab_center_id: any) {
        try {
            const response = await query.get("show_client_services", {
                input: {
                    client_id: client_id,
                    rehab_center_id: rehab_center_id
                }
            });

            console.log("fetching client services", response);
            return response;
        } catch (error) {
            console.error('Error fetching client services:', error);
            return error;
        }
    }

}

let clientsController = new ClientsController();
export default clientsController;
