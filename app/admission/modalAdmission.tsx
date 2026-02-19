import React, { useEffect, useState } from "react";

interface InputField {
  input_id: number;
  input_label: string;
  input_type: string;
  input_require: number;
  options?: string[];
}

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  form_data: any;
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  inputs: InputField[];
}

const ModalAdmissionRecord: React.FC<Props> = ({
  showModal,
  setShowModal,
  form_data,
  setFormData,
  handleSubmit,
  inputs
}) => {

  const handleChange = (input_id: number, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [input_id]: value
    }));
  };

  return (
    <div className={`modal modal-blur fade ${showModal ? "show d-block" : "d-none"}`} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Admission Record</h5>
            <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body row">

              {inputs.map((input) => (
                <div className="col-md-6 mb-3" key={input.input_id}>
                  <label className="form-label">
                    {input.input_label}
                    {input.input_require === 1 && <span className="text-danger"> *</span>}
                  </label>

                  {/* TEXT / DATE / NUMBER */}
                  {input.input_type !== 'select' && input.input_type !== 'textarea' && (
                    <input
                      type={input.input_type}
                      className="form-control"
                      required={input.input_require === 1}
                      value={form_data[input.input_id] || ''}
                      onChange={(e) => handleChange(input.input_id, e.target.value)}
                    />
                  )}

                  {/* TEXTAREA */}
                  {input.input_type === 'textarea' && (
                    <textarea
                      className="form-control"
                      required={input.input_require === 1}
                      value={form_data[input.input_id] || ''}
                      onChange={(e) => handleChange(input.input_id, e.target.value)}
                    />
                  )}

                  {/* SELECT */}
                  {input.input_type === 'select' && (
                    <select
                      className="form-select"
                      required={input.input_require === 1}
                      value={form_data[input.input_id] || ''}
                      onChange={(e) => handleChange(input.input_id, e.target.value)}
                    >
                      <option value="">Select {input.input_label}</option>
                      {input.options?.map((opt, idx) => (
                        <option key={idx} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}

            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              {/* <button type="submit" className="btn btn-primary">Save Record</button> */}
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ModalAdmissionRecord;
