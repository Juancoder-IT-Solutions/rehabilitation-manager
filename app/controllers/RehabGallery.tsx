import globals from "./Globals";
import query from "./Sql";

class GalleryController {
    constructor(){
        console.log("successfully loaded sample controller")
    }

    async fetch(){
        try {
            const response  = query.get("show_rahab_gallery",{
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
        const data = await query.post("delete_rehab_gallery", {
            input: {
                ids: ids
            }
        })

        return data.data
    }
    

    async add(form_data: any) {
        const data = await query.post("add_rehab_gallery", {
            input: form_data
        })

        return data.data
    }


    async update(form_data: any) {
        const data = await query.post("update_rahab_gallery", {
            input: form_data
        })

        return data.data
    }

}

let galleryController = new GalleryController
export default galleryController