import { useRef } from "react";
import alerts from "../components/Alerts";
import galleryController from "../controllers/RehabGallery";

interface ComponentProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    form_data: any;
    setFormData: (data: any) => void;
    fetchEntry: Function;
    submit_type: string;
    rehab_center_id: any;
}

const ModalGallery: React.FC<ComponentProps> = ({
    showModal,
    setShowModal,
    form_data,
    setFormData,
    fetchEntry,
    submit_type,
    rehab_center_id
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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
        const formdata = { ...form_data, rehab_center_id };

        if (submit_type === "add") {
            response = await galleryController.add(formdata);
        } else if (submit_type === "update") {
            response = await galleryController.update(formdata);
        }

        if (response == 1) {
            submit_type === "add" ? alerts.success_add() : alerts.success_update();

            setFormData([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }


            setShowModal(false);
            fetchEntry();
        } else if (response === -2) {
            alert("Service already exists.");
        } else {
            alert("Failed query.");
        }
    };

    return (
        <div
            id="modal-entry"
            tabIndex={-1}
            className={`modal modal-blur fade ${showModal ? "show d-block" : "d-none"}`}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content shadow-lg border-0 rounded-3">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">
                            {submit_type === "add" ? "Add New File" : "Update File"}
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
                            <input type="hidden" name="file_id" value={form_data.id || ""} />

                            {/* Show preview if updating */}
                            {submit_type === "update" && form_data.file_b64 && (
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Current File</label>
                                    <div className="p-2 border rounded text-center">
                                        <img
                                            src={`data:image/*;base64,${form_data.file_b64}`}
                                            alt="Current file"
                                            style={{ maxWidth: "200px", borderRadius: "8px" }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Upload new file */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    {submit_type === "add" ? "Upload File" : "Replace File"}
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    name="file"
                                    onChange={handleChange}
                                    ref={fileInputRef}
                                    required
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="btn btn-light me-auto"
                            >
                                Close
                            </button>
                            <button type="submit" className="btn btn-primary px-4">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalGallery;
