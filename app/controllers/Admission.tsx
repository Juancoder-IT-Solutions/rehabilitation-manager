import globals from "./Globals";
import query from "./Sql";

class AdmissionController {
    
    async fetch(){
        try {
            const response  = query.get("show_admissions",{
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

}

let admissionController = new AdmissionController
export default admissionController