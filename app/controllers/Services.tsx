import globals from "./Globals";
import query from "./Sql";

class ServicesController {
    constructor() {
        console.log("successfully loaded sample controller")
    }

    async fetch() {
        try {
            const response = query.get("show_services", {
                input: {
                    rehab_center_id: 19
                }
            });

            // const data = await response.json();  // Parse the JSON response
            console.log("fetching", response)
            return response
        } catch (error) {
            console.error('Error fetching data:', error);
            return error
        }
    }

    async fetch_stages(service_id: any) {
        try {
            const response = query.get("show_service_stages", {
                input: {
                    service_id: service_id
                }
            });

            console.log("fetching", response)
            return response
        } catch (error) {
            console.error('Error fetching data:', error);
            return error
        }
    }

     async fetch_task(stage_id: any) {
        try {
            const response = query.get("show_service_task", {
                input: {
                    stage_id: stage_id
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
        const data = await query.post("delete_services", {
            input: {
                ids: ids
            }
        })

        return data.data
    }

    async add(form_data: any) {
        const data = await query.post("add_services", {
            input: form_data
        })

        return data.data;
    }

    async update(form_data: any) {
        const data = await query.post("update_services", {
            input: form_data
        })

        return data.data
    }

    async add_stages(form_data: any) {
        const data = await query.post("add_service_stages", {
            input: form_data
        })

        return data.data;
    }

    async update_stages(form_data: any) {
        const data = await query.post("update_service_stages", {
            input: form_data
        });

        return data.data;
    }

    async delete_stages(id: any) {
        const data = await query.post("delete_service_stages", {
            input: {
                id: id
            }
        })

        return data.data
    }

    async add_task(form_data: any) {
        const data = await query.post("add_service_stages_task", {
            input: form_data
        })

        return data.data;
    }

    async update_task(form_data: any) {
        const data = await query.post("update_service_stages_task", {
            input: form_data
        })

        return data.data;
    }

    async delete_task(id: any) {
        const data = await query.post("delete_service_stages_task", {
            input: {
                id: id
            }
        })

        return data.data
    }

    
    async total_services(){
        try {
            const response  = query.get("total_services",{
                input: {
                }
            });
      
            console.log("fetching",response)
            return response
        } catch (error) {
            console.error('Error fetching data:', error);
            return error
        }
    }

}

let servicesController = new ServicesController
export default servicesController