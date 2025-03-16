
class Globals {
    constructor() {
        console.log("loaded global class")
    }

    // public is_signed_in = localStorage.getItem("rm_is_signed_in")
    public user_id = 1//localStorage.getItem("rm_user_id")
    public rehab_center_id = 1 //localStorage.getItem("rm_rehab_center_id")
    // public user_token = localStorage.getItem("rm_user_token")
    // public user_category = localStorage.getItem("rm_user_category")
    public host = "http://localhost/rehabilitation-manager-be"
    public api = `${this.host}/api/api.php?authUserId=${this.user_id}&authRehabCenterId=${this.rehab_center_id}&action=`;


    setAuth(authData: any) {
        localStorage.setItem("rm_is_signed_in", "1")
        localStorage.setItem("rm_user_id", authData.user_id)
        localStorage.setItem("rm_user_token", authData.user_token)
        localStorage.setItem("rm_user_category", authData.user_category)
    }


    formatNumber = (value: any) => {
        if (!value) return "0";
        const num = typeof value === "string" ? parseFloat(value) : value;
        return num.toLocaleString("en-US"); 
    };


}
let globals = new Globals
export default globals