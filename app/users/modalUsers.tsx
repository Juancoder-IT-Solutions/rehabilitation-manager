import alerts from "../components/Alerts";
import usersController from "../controllers/Users";

interface ComponentProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  form_data: any;
  setFormData: (data: any) => void;
  fetchUsers: Function;
  submit_type: string;
  rehab_center_id: any;
}

const ModalUsers: React.FC<ComponentProps> = ({
  showModal,
  setShowModal,
  form_data,
  setFormData,
  fetchUsers,
  submit_type,
  rehab_center_id,
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
      response = await usersController.add(formdata);
    } else {
      delete formdata.password;
      response = await usersController.update(formdata);
    }

    if (response === 1) {
      submit_type === "add" ? alerts.success_add() : alerts.success_update();
      setShowModal(false);
      fetchUsers();
    } else if (response === -2) {
      alerts.already_exists_alert("User already exists.");
    } else {
      alerts.failed_query();
    }
  };

  return (
    <div
      id="modal-users"
      tabIndex={-1}
      className={`modal modal-blur fade ${showModal ? "show d-block" : "d-none"}`}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {submit_type === "add" ? "Add New User" : "Update User Details"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal(false)}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <input type="hidden" name="user_id" value={form_data.user_id || ""} />

              <div className="mb-3">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="user_fname"
                  value={form_data.user_fname || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Middle Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="user_mname"
                  value={form_data.user_mname || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="user_lname"
                  value={form_data.user_lname || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={form_data.username || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Permanent Address</label>
                <textarea
                  className="form-control"
                  name="permanent_address"
                  value={form_data.permanent_address || ""}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Contact Number</label>
                <input
                  type="text"
                  className="form-control"
                  name="contact_number"
                  value={form_data.contact_number || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Password only when ADD */}
              {submit_type === "add" && (
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={form_data.password || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn me-auto"
              >
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