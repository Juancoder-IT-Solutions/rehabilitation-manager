import query from "./Sql";

class InputsController {
   
    async fetch(rehab_center_id: any){
        try {
            const response = await query.get("show_inputs",{
                input: {
                    rehab_center_id: rehab_center_id
                }
            });
      
            console.log("fetching",response)
            return response
        } catch (error) {
            console.error('Error fetching data:', error);
            return error
        }
    }

     async fetchOptions(input_id: any, rehab_center_id: any){
        try {
            const response = await query.get("show_input_options",{
                input: {
                    input_id: input_id,
                    rehab_center_id:rehab_center_id
                }
            });
      
            console.log("fetching",response)
            return response
        } catch (error) {
            console.error('Error fetching data:', error);
            return error
        }
    }

    async delete_all(ids: any, rehab_center_id: any) {
        const data = await query.post("delete_inputs", {
            input: {
                ids: ids,
                rehab_center_id:rehab_center_id
            }
        })

        return data.data
    }
    
    async delete_option(id: any, rehab_center_id: any) {
        const data = await query.post("delete_input_options", {
            input: {
                id: id,
                rehab_center_id:rehab_center_id
            }
        })

        return data.data
    }

    async update(form_data: any) {
        const data = await query.post("update_inputs", {
            input: form_data
        })

        return data.data
    }

    async add(form_data: any) {
        const data = await query.post("add_inputs", {
            input: form_data
        })

        return data.data;
    }

    async add_option(form_data: any) {
        const data = await query.post("add_input_option", {
            input: form_data
        })

        return data.data;
    }

    async update_option(form_data: any) {
        const data = await query.post("update_input_option", {
            input: form_data
        })

        return data.data
    }

}

let inputscontroller = new InputsController
export default inputscontroller