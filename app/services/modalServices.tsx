import servicesController from "../controllers/Services";

interface ComponentProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    form_data: any;
    setFormData: (data: any) => void;
    fetchServices: Function;
    submit_type: string;
}

const ModalServices: React.FC<ComponentProps> = ({ showModal, setShowModal, form_data, setFormData, fetchServices, submit_type }) => {

    const handleChange = (e: any) => {
        setFormData((prevData: any) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        
        let response;
        if (submit_type === "add") {
            response = await servicesController.add(form_data);
        } else if (submit_type === "update") {
            response = await servicesController.update(form_data);
        }

        if (response === 1) {
            alert(submit_type === "add" ? 'Successfully added entry.' : 'Successfully updated entry.');
            setShowModal(false);
            fetchServices();
        } else if (response === -2) {
            alert('Service already exists.');
        } else {
            alert('Failed query.');
        }
    };

    return (
        <div
            id="modal-entry"
            tabIndex={-1}
            className={`modal modal-blur fade ${showModal ? "show d-block" : "d-none"}`}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
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
                                <input type="text" className="form-control" placeholder="Enter service name" name="service_name" value={form_data.service_name || ''} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Service Fee</label>
                                <input type="number" className="form-control" placeholder="Enter service fee" name="service_fee" value={form_data.service_fee || ''} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" placeholder="Enter service description" name="service_desc" value={form_data.service_desc || ''} onChange={handleChange}></textarea>
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
