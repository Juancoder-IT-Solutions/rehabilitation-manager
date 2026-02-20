import React, { useState } from "react";
import servicesController from "../controllers/Services";
import alerts from "../components/Alerts";

interface Props {
    show: boolean;
    onHide: () => void;
    services: any;
    admission_data: any
    getServicesAvail: any
}

const AddServiceModal: React.FC<Props> = ({ show, onHide, services, admission_data, getServicesAvail }) => {
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    if (!show) return null;

    const handleAdd = async () => {

        setLoading(true);
        try {
            const response = await servicesController.add_service_admission(selectedServiceId, admission_data.admission_id, admission_data.rehab_center_id);
            if (response > 0) {
                setSelectedServiceId(null);
                onHide();
                alerts.success_add();
                getServicesAvail(admission_data.admission_id);
            }else if(response < 0){
                alerts.already_exists_alert();
            } else {
                alerts.failed_query()
            }
        } catch (err) {
            console.error("Error adding service:", err);
            alert("An error occurred while adding service.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Service</h5>
                        <button className="btn-close" onClick={onHide} />
                    </div>
                    <div className="modal-body">
                        <select
                            className="form-select"
                            value={selectedServiceId || ""}
                            onChange={e => setSelectedServiceId(Number(e.target.value))}
                            disabled={loading}
                        >
                            <option value="">-- Select Service --</option>
                            {services.map((s: any) => (
                                <option key={s.service_id} value={s.service_id}>{s.service_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onHide} disabled={loading}>Cancel</button>
                        <button className="btn btn-primary" disabled={!selectedServiceId || loading} onClick={handleAdd}>
                            {loading ? "Adding..." : "Add"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddServiceModal;
