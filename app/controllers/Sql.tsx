import Axios from "axios"
import globals from "./Globals"

class SQL {
    constructor() {
        console.log("loaded global query class")
    }

    async get(action = "", params: Object = []) {
        try {
            const response: any = await Axios.get(globals.api + action, { params })
            console.log(action, response.data)
            return response.data
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async post(action = "", params: Object = {}) {
        try {
            const isFormData = params instanceof FormData;
    
            const response: any = await await Axios.post(globals.api + action, params)
    
            console.log(action, response.data);
            return response.data;
        } catch (error) {
            console.error("API error:", error);
            return error;
        }
    }
    
    

    async delete(action = "", params: Object = []) {
        try {
            const response: any = await Axios.delete(globals.api + action, { params })
            console.log(action)
            console.log(response.data)
            return response.data
        } catch (error) {
            console.log(error)
            return error
        }
    }
}

let query = new SQL
export default query