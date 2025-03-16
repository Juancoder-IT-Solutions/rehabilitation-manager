import globals from "./Globals";
import query from "./Sql";

class ServicesController {
    constructor(){
        console.log("successfully loaded sample controller")
    }

    async fetch(){
        try {
            const response  = query.get("show_services",{
                input: {
                }
            });
      
            // const data = await response.json();  // Parse the JSON response
            console.log("fetching",response)
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

    async add(formData: FormData) {
        const data = await query.post("add_services", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    
        return data.data;
    }

    async update(form_data: any) {
        const data = await query.post("update_services", {
            input: form_data
        })

        return data.data
    }

}

let servicesController = new ServicesController
export default servicesController