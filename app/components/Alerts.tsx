import Swal from "sweetalert2";
import './styles.css'

class Alerts {

    private Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        iconColor: "white",
        customClass: {
            popup: "colored-toast",
        },
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });
      
    async success_add(message = "Successfully added!") {
        await this.Toast.fire({
            icon: "success",
            title: message,
        });
    }

    async success_update(message = "Successfully updated!") {
        await this.Toast.fire({
            icon: "success",
            title: message,
        });
    }

    async success_finished(message = "Successfully finished!") {
        Swal.fire({
            title: "Success!",
            text: message,
            icon: "success"
        });
    }

    async success_delete(message = "Successfully deleted!") {
        // Swal.fire({
        //     title: "Deleted!",
        //     text: message,
        //     icon: "success"
        // });
        await this.Toast.fire({
            icon: "warning",
            title: message,
        });
    }

    async warning(message = "Something went wrong! Please try again.") {
       await this.Toast.fire({
            icon: "warning",
            title: message,
        });
    }

    async error(message = "Oops! Please try again.") {
        // Swal.fire({
        //     title: "Deleted!",
        //     text: message,
        //     icon: "success"
        // });
        await this.Toast.fire({
            icon: "error",
            title: message,
        });
    }

    

    async failed_query(message = "Something went wrong! Please contact Juancoder IT Solutions for assistance.") {
        Swal.fire({
            title: "Oops!",
            text: message,
            icon: "warning"
        });
    }

    async confirm_action(message = "Are you sure you want to proceed?", confirmButtonText = "Yes, proceed", cancelButtonText = "Cancel") {
        return Swal.fire({
            title: "Are you sure?",
            text: message,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText
        });
    }

    async confirm_action_cancel() {
        return Swal.fire({
            title: "Action Cancelled",
            text: "No changes were made.",
            icon: "error"
        });
    }

    async already_exists_alert(message = "Entry already exists.") {
        // return Swal.fire({
        //     title: "Oops!",
        //     text: "Entry already exists.",
        //     icon: "warning"
        // });
        await this.Toast.fire({
            icon: "warning",
            title: message,
        });
    }
    


    async warning_alert(message = "Warning! Please check your input or action.") {
        Swal.fire({
            title: "Warning!",
            text: message,
            icon: "warning"
        });
    }


}
let alerts = new Alerts
export default alerts