import React from "react";

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  form_data: any;
  setFormData: (data: any) => void;
  handleSubmit: any;
}

const ModalAdmissionRecord: React.FC<Props> = ({
  showModal,
  setShowModal,
  form_data,
  setFormData,
  handleSubmit,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={`modal modal-blur fade ${showModal ? "show d-block" : "d-none"}`} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Admission and Discharge Record</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal(false)}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Admitting Physician</label>
                  <input type="text" name="admitting_physician" className="form-control" value={form_data.admitting_physician || ''} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Attending Physician</label>
                  <input type="text" name="attending_physician" className="form-control" value={form_data.attending_physician || ''} onChange={handleChange} />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Ward</label>
                  <input type="text" name="ward" className="form-control" value={form_data.ward || ''} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Type of Admission</label>
                  <select name="type_of_admission" className="form-select" value={form_data.type_of_admission || ''} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="NEW">NEW</option>
                    <option value="OLD">OLD</option>
                    <option value="FORMER OPD">FORMER OPD</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Referred By</label>
                  <input type="text" name="referred_by" className="form-control" value={form_data.referred_by || ''} onChange={handleChange} />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-3">
                  <label className="form-label">Social Service Classification</label>
                  <select name="social_service_classification" className="form-select" value={form_data.social_service_classification || ''} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Allergic To</label>
                  <input type="text" name="allergic_to" className="form-control" value={form_data.allergic_to || ''} onChange={handleChange} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Health Insurance</label>
                  <input type="text" name="health_insurance_name" className="form-control" value={form_data.health_insurance_name || ''} onChange={handleChange} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Medicare</label>
                  <select name="medicare" className="form-select" value={form_data.medicare || ''} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="SSS">SSS</option>
                    <option value="GSIS">GSIS</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Hospitalization Plan</label>
                <input type="text" name="hospitalization_plan" className="form-control" value={form_data.hospitalization_plan || ''} onChange={handleChange} />
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Admission Date</label>
                  <input type="datetime-local" name="admission_date" className="form-control" value={form_data.admission_date || ''} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Discharge Date</label>
                  <input type="datetime-local" name="discharge_date" className="form-control" value={form_data.discharge_date || ''} onChange={handleChange} />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Admission Diagnosis</label>
                <textarea name="admission_diagnosis" className="form-control" value={form_data.admission_diagnosis || ''} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Other Diagnosis</label>
                <textarea name="other_diagnosis" className="form-control" value={form_data.other_diagnosis || ''} onChange={handleChange} />
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Principal Operation</label>
                  <input type="text" name="principal_operation" className="form-control" value={form_data.principal_operation || ''} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Other Operation</label>
                  <input type="text" name="other_operation" className="form-control" value={form_data.other_operation || ''} onChange={handleChange} />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Accident/Injury/Poisoning</label>
                  <input type="text" name="accident_injury_poisoning" className="form-control" value={form_data.accident_injury_poisoning || ''} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Place of Occurrence</label>
                  <input type="text" name="place_of_occurence" className="form-control" value={form_data.place_of_occurence || ''} onChange={handleChange} />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Disposition</label>
                  <select name="disposition" className="form-select" value={form_data.disposition || ''} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="DISCHARGE">DISCHARGE</option>
                    <option value="TRANSFERRED">TRANSFERRED</option>
                    <option value="DAMA">DAMA</option>
                    <option value="ABSCONDED">ABSCONDED</option>
                    <option value="RECOVERED">RECOVERED</option>
                    <option value="DIED">DIED</option>
                    <option value="-48 HOURS">-48 HOURS</option>
                    <option value="+48 HOURS">+48 HOURS</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Result</label>
                  <select name="results" className="form-select" value={form_data.results || ''} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="IMPROVED">IMPROVED</option>
                    <option value="UNIMPROVED">UNIMPROVED</option>
                    <option value="AUTOPSY">AUTOPSY</option>
                    <option value="NO AUTOPSY">NO AUTOPSY</option>
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Data Furnished By</label>
                  <input type="text" name="data_furnish_by" className="form-control" value={form_data.data_furnish_by || ''} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Relation to Patient</label>
                  <input type="text" name="relation_to_patient" className="form-control" value={form_data.relation_to_patient || ''} onChange={handleChange} />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Address of Informant</label>
                <input type="text" name="address_of_informant" className="form-control" value={form_data.address_of_informant || ''} onChange={handleChange} />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              <button type="submit" className="btn btn-primary">Save Record</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalAdmissionRecord;
