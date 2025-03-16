import galleryController from "../controllers/RehabGallery";

interface ComponentProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    form_data: any;
    setFormData: (data: any) => void;
    fetchEntry: Function;
    submit_type: string;
}

const ModalGallery: React.FC<ComponentProps> = ({ showModal, setShowModal, form_data, setFormData, fetchEntry, submit_type }) => {

    const handleChange = (e: any) => {
        const { name, files } = e.target;
        
        if (files && files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(files[0]); // Convert to Base64
            
            reader.onload = () => {
                setFormData((prevData: any) => ({
                    ...prevData,
                    [name]: reader.result, // Store Base64 string
                }));
            };
        }
    };
    

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        let response;
        if (submit_type === "add") {
            response = await galleryController.add(form_data);
        } else if (submit_type === "update") {
            response = await galleryController.update(form_data);
        }

        if (response === 1) {
            alert(submit_type === "add" ? 'Successfully added entry.' : 'Successfully updated entry.');
            setShowModal(false);
            fetchEntry();
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
                        <h5 className="modal-title">{submit_type == "add" ? "Add New File" : "Upload new File"}</h5>
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
                            <input type="hidden" className="form-control" name="file_id" value={form_data.id || ''} />
                            <div className="mb-3">
                                <label className="form-label">File</label>
                                <input type="file" className="form-control" name="file" onChange={handleChange} required />
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

export default ModalGallery;
