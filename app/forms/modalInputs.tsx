import alerts from "../components/Alerts";
import inputsController from "../controllers/Inputs";

interface ComponentProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    form_data: any;
    setFormData: (data: any) => void;
    fetchInputs: Function;
    submit_type: string;
    rehab_center_id: any;
}

const ModalInputs: React.FC<ComponentProps> = ({ showModal, setShowModal, form_data, setFormData, fetchInputs, submit_type, rehab_center_id }) => {

    const handleChange = (e: any) => {
        setFormData((prevData: any) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        let response;
        const formdata = { ...form_data, rehab_center_id: rehab_center_id };
        if (submit_type === "add") {
            response = await inputsController.add(formdata);
        } else if (submit_type === "update") {
            response = await inputsController.update(formdata);
        }

        if (response === 1) {
            submit_type === "add" ? alerts.success_add() : alerts.success_update();
            setShowModal(false);
            fetchInputs();
        } else if (response === -2) {
            alerts.already_exists_alert('Input Label already exists.');
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
                        <h5 className="modal-title">
                            {submit_type === "add" ? "Add New Input Field" : "Update Input Field"}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowModal(false)}
                            aria-label="Close"
                        ></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <input type="hidden" name="type" value={submit_type} />
                            <input type="hidden" name="input_id" value={form_data.input_id || ''} />

                            {/* Input Label */}
                            <div className="mb-3">
                                <label className="form-label">Input Label</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter input label"
                                    name="input_label"
                                    value={form_data.input_label || ''}
                                    onChange={handleChange}
                                    required
                                    autoComplete="off"
                                />
                            </div>

                            {/* Input Type */}
                            <div className="mb-3">
                                <label className="form-label">Input Type</label>
                                <select
                                    className="form-control"
                                    name="input_type"
                                    value={form_data.input_type || 'text'}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="text">Text</option>
                                    <option value="textarea">Textarea</option>
                                    <option value="select">Select</option>
                                </select>
                            </div>

                            {/* Required Field */}
                            <div className="mb-3">
                                <label className="form-label">Required?</label>
                                <select
                                    className="form-control"
                                    name="input_require"
                                    value={form_data.input_require || 1}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value={1}>Yes</option>
                                    <option value={0}>No</option>
                                </select>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" onClick={() => setShowModal(false)} className="btn me-auto">
                                Close
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalInputs;
