import query from "./Sql";

class InputsController {
   
    async fetch(params=""){
        try {
            const response = await query.get("show_inputs",{
                input: {
                    param: params
                }
            });
      
            console.log("fetching",response)
            return response
        } catch (error) {
            console.error('Error fetching data:', error);
            return error
        }
    }

     async fetchOptions(input_id: any){
        try {
            const response = await query.get("show_input_options",{
                input: {
                    input_id: input_id
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
        const data = await query.post("delete_inputs", {
            input: {
                ids: ids
            }
        })

        return data.data
    }
    
    async delete_option(id: any) {
        const data = await query.post("delete_input_options", {
            input: {
                id: id
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