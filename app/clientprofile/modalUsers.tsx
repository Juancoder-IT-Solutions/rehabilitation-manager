'use client';

import alerts from "../components/Alerts";
import users from "../controllers/Users";

interface ComponentProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    form_data: any;
    setFormData: (data: any) => void;
    fetchClients: Function;
    submit_type: string;
    rehab_center_id: any;
}

const ModalUsers: React.FC<ComponentProps> = ({
    showModal,
    setShowModal,
    form_data,
    setFormData,
    fetchClients,
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
        const formdata = { 
            ...form_data, 
            rehab_center_id: rehab_center_id,
            user_category: 'U'
        };

        response = await users.update(formdata);

        if (response === 1) {
            submit_type === "add" ? alerts.success_add() : alerts.success_update();
            setShowModal(false);
            fetchClients();
        } else if (response === -2) {
            alerts.already_exists_alert('User already exists.');
        } else {
            alerts.failed_query();
        }
    };

    return (
        <div
            tabIndex={-1}
            className={`modal modal-blur fade ${showModal ? "show d-block" : "d-none"}`}
        >
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {submit_type === "add" ? "Add New Client" : "Update Client Profile"}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowModal(false)}
                        ></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">

                            <input type="hidden" name="user_id" value={form_data.user_id || ''} />

                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">First Name</label>
                                    <input type="text" className="form-control" name="user_fname"
                                        value={form_data.user_fname || ''} onChange={handleChange} required />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Middle Name</label>
                                    <input type="text" className="form-control" name="user_mname"
                                        value={form_data.user_mname || ''} onChange={handleChange} />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Last Name</label>
                                    <input type="text" className="form-control" name="user_lname"
                                        value={form_data.user_lname || ''} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Permanent Address</label>
                                <textarea className="form-control" name="permanent_address"
                                    value={form_data.permanent_address || ''} onChange={handleChange} required />
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Contact Number</label>
                                    <input type="text" className="form-control" name="contact_number"
                                        value={form_data.contact_number || ''} onChange={handleChange} />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Birthdate</label>
                                    <input type="date" className="form-control" name="birthdate"
                                        value={form_data.birthdate || ''} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Birth Place</label>
                                    <input type="text" className="form-control" name="birth_place"
                                        value={form_data.birth_place || ''} onChange={handleChange} />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Nationality</label>
                                    <input type="text" className="form-control" name="nationality"
                                        value={form_data.nationality || ''} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Religion</label>
                                    <input type="text" className="form-control" name="religion"
                                        value={form_data.religion || ''} onChange={handleChange} />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Occupation</label>
                                    <input type="text" className="form-control" name="occupation"
                                        value={form_data.occupation || ''} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Employer</label>
                                    <input type="text" className="form-control" name="employer"
                                        value={form_data.employer || ''} onChange={handleChange} />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Employer Address</label>
                                    <input type="text" className="form-control" name="employer_address"
                                        value={form_data.employer_address || ''} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Father's Name</label>
                                    <input type="text" className="form-control" name="father_name"
                                        value={form_data.father_name || ''} onChange={handleChange} />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Father's Address</label>
                                    <input type="text" className="form-control" name="father_address"
                                        value={form_data.father_address || ''} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Mother's Name</label>
                                    <input type="text" className="form-control" name="mother_name"
                                        value={form_data.mother_name || ''} onChange={handleChange} />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Mother's Address</label>
                                    <input type="text" className="form-control" name="mother_address"
                                        value={form_data.mother_address || ''} onChange={handleChange} />
                                </div>
                            </div>

                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn me-auto" onClick={() => setShowModal(false)}>
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

export default ModalUsers;
