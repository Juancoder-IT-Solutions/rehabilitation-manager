import alerts from "../components/Alerts";
import servicesController from "../controllers/Services";

interface ComponentProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    form_data: any;
    setFormData: (data: any) => void;
    fetchServices: Function;
    submit_type: string;
    rehab_center_id: any;
}

const ModalServices: React.FC<ComponentProps> = ({ showModal, setShowModal, form_data, setFormData, fetchServices, submit_type, rehab_center_id }) => {

    const handleChange = (e: any) => {
        setFormData((prevData: any) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        let response;
        const formdata = { ...form_data, rehab_center_id:rehab_center_id };
        if (submit_type === "add") {
            response = await servicesController.add(formdata);
        } else if (submit_type === "update") {
            response = await servicesController.update(formdata);
        }

        if (response === 1) {
            submit_type === "add" ? alerts.success_add() : alerts.success_update();
            setShowModal(false);
            fetchServices();
        } else if (response === -2) {
            alerts.already_exists_alert('Service already exists.');
        } else {
            alerts.failed_query();
        }
    };

    return (
        <div
            id="modal-entry"
            tabIndex={-1}
            className={`modal modal-blur fade ${showModal ? "show d-block" : "d-none"}`}
        >
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{submit_type == "add" ? "Add New Service" : "Update Service Details"}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowModal(false)}
                            aria-label="Close"
                        ></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <input type="hidden" className="form-control" name="type" value={submit_type} />
                            <input type="hidden" className="form-control" name="service_id" value={form_data.service_id || ''} />
                            <div className="mb-3">
                                <label className="form-label">Service Name</label>
                                <input type="text" className="form-control" placeholder="Enter service name" name="service_name" value={form_data.service_name || ''} onChange={handleChange} required autoComplete="off" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Service Fee</label>
                                <input type="number" className="form-control" placeholder="Enter service fee" name="service_fee" value={form_data.service_fee || ''} onChange={handleChange} required autoComplete="off" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" placeholder="Enter service description" name="service_desc" value={form_data.service_desc || ''} onChange={handleChange} autoComplete="off"></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={() => setShowModal(false)} className="btn me-auto">
                                Close
                            </button>
                            <button type="submit" className="btn btn-primary">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalServices;
