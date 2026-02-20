import alerts from "../components/Alerts";
import appointmentsController from "../controllers/Appointements";

interface ComponentProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    form_data: any;
    setFormData: (data: any) => void;
    fetchAppointments: Function;
    submit_type: string;
    rehab_center_id: any;
}

const ModalAppointments: React.FC<ComponentProps> = ({
    showModal,
    setShowModal,
    form_data,
    setFormData,
    fetchAppointments,
    submit_type,
    rehab_center_id
}) => {

    const handleChange = (e: any) => {
        setFormData((prevData: any) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        let response;
        const formdata = { ...form_data, rehab_center_id };

        if (submit_type === "add") {
            response = await appointmentsController.add(formdata);
        } else if (submit_type === "update") {
            response = await appointmentsController.update(formdata);
        }

        if (response === 1) {
            submit_type === "add" ? alerts.success_add() : alerts.success_update();
            setShowModal(false);
            fetchAppointments();
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
                            {submit_type === "add" ? "Add New Appointment" : "Update Appointment"}
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
                            {/* <input type="hidden" name="appointment_id" value={form_data.appointment_id || ''} /> */}

                            <div className="mb-3">
                                <label className="form-label">Appointment Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="appointment_date"
                                    value={form_data.appointment_date || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>


                            <div className="mb-3">
                                <label className="form-label">Remarks</label>
                                <textarea
                                    className="form-control"
                                    placeholder="Enter remarks"
                                    name="remarks"
                                    value={form_data.remarks || ''}
                                    onChange={handleChange}
                                    rows={3}
                                ></textarea>
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

export default ModalAppointments;