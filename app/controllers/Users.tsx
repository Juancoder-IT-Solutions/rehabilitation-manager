import query from "./Sql";

class Users {

    async fetch(params = "", rehab_center_id = '') {
        try {
            const response = await query.get("show_user", {
                input: {
                    param: params,
                    rehab_center_id: rehab_center_id
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

    async delete_all(ids: any) {
        const data = await query.post("delete_users", {
            input: {
                ids: ids
            }
        })

        return data.data
    }

    async register(form_data: FormData) {
        const data = await query.post("register_rehab_center", {
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

    async update_status(user_id: any, status: any) {
        const data = await query.post("update_user_status", {
            input: {
                user_id: user_id,
                status: status
            }
        })

        return data.data
    }

    async login(form_data: any) {
        try {
            const response = await query.post("login_user", {
                input: form_data
            })
            console.log("fetching", response.data)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error);
            return error
        }
    }

    async update_password(user_id: any, oldPassword: string, newPassword: string, rehab_center_id: any) {
        try {
            const response = await query.post("update_password", {
                input: {
                    user_id: user_id,
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    rehab_center_id:rehab_center_id
                }
            });

            return response.data;
        } catch (error: any) {
            console.error("Error updating password:", error);
            return 0;
        }
    }

    async view_rehab(user_id: any, rehab_center_id: any) {
        try {
            const response = await query.get("view_rehab", {
                input: {
                    user_id: user_id,
                    rehab_center_id: rehab_center_id
                }
            });
            return response;
        } catch (error: any) {
            console.error("Error fetching profile:", error);
            return null;
        }
    }

    async update_profile(form_data: any) {
        try {
            const response = await query.post("update_profile", {
                input: form_data
            });
            return response.data;
        } catch (error: any) {
            console.error("Error updating profile:", error);
            return 0;
        }
    }

}

let users = new Users
export default users