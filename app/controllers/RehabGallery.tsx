import globals from "./Globals";
import query from "./Sql";

class GalleryController {
    constructor(){
        console.log("successfully loaded sample controller")
    }

    async fetch(rehab_center_id: any){
        try {
            const response  = query.get("show_rahab_gallery",{
                input: {
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
        const data = await query.post("delete_rehab_gallery", {
            input: {
                ids: ids,
                rehab_center_id:rehab_center_id
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