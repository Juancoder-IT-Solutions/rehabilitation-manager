import query from "./Sql";

class Users {
   
    async fetch(params=""){
        try {
            const response = await query.get("show_users",{
                input: {
                    param: params
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
        const data = await query.post("delete_users", {
            input: {
                ids: ids
            }
        })

        return data.data
    }

    async add(form_data: FormData) {
        const data = await query.post("add_user", {
            input: form_data
        })
    
        return data.data;
    }

    async update(form_data: any) {
        const data = await query.post("update_user", {
            input: form_data
        })

        return data.data
    }

    async update_status(user_id : any, status : any) {
        const data = await query.post("update_user_status", {
            input: {
                user_id:user_id,
                status:status
            }
        })

        return data.data
    }

    async login(form_data: any) {
        try {
            const response = await query.get("login_user", {
                input: form_data
            })
            console.log("fetching", response.data)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error);
            return error
        }
    }

}

let users = new Users
export default users