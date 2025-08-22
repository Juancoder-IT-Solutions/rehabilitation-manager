'use client';

import { useState, useEffect } from 'react';
import { FaPencilAlt, FaTrashAlt, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import inputsController from '../controllers/Inputs';
import alerts from '../components/Alerts';
import { Button, Spinner, FormControl, InputGroup } from 'react-bootstrap';

interface ModalInputOptionsProps {
  show: boolean;
  setShow: (show: boolean) => void;
  input_id: number | null;
  fetchInputs: Function;
  rehab_center_id: any
}

const ModalInputOptions: React.FC<ModalInputOptionsProps> = ({ show, setShow, input_id, fetchInputs, rehab_center_id }) => {
  const [optionsList, setOptionsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newOption, setNewOption] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const response = await inputsController.fetchOptions(input_id, rehab_center_id);
      setOptionsList(response.data || []);
    } catch (error) {
      console.error('Failed to fetch options:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) fetchOptions();
  }, [show, input_id]);

  const handleAdd = async () => {
    if (!newOption.trim()) return;
    try {
      const response = await inputsController.add_option({ input_id, input_option_label: newOption, rehab_center_id });
      if (response === 1) {
        alerts.success_add();
        setNewOption('');
        fetchOptions();
      } else if (response === -2) {
        alerts.already_exists_alert('Option already exists.');
      } else {
        alerts.failed_query();
      }
    } catch (error) {
      console.error('Failed to add option:', error);
      alerts.failed_query();
    }
  };

  const handleDelete = (option_id: number) => {
    alerts.confirm_action('Are you sure you want to delete this option?', 'Yes, delete it', 'No, cancel')
      .then(async (result: any) => {
        if (result.isConfirmed) {
          try {
            const response = await inputsController.delete_option(option_id, rehab_center_id);
            if (response == 1) {
              alerts.success_delete();
              fetchOptions();
            } else {
              alerts.warning('Failed to delete option.');
            }
          } catch (error) {
            console.error('Delete failed:', error);
            alerts.failed_query();
          }
        }
      });
  };

  const handleUpdate = async (option_id: number) => {
    if (!editingValue.trim()) return;
    try {
      const response = await inputsController.update_option({
        input_option_id: option_id,
        input_option_label: editingValue,
        rehab_center_id
      });
      if (response === 1) {
        alerts.success_update();
        setEditingId(null);
        setEditingValue('');
        fetchOptions();
      } else if (response === -2) {
        alerts.already_exists_alert('Option already exists.');
      } else {
        alerts.failed_query();
      }
    } catch (error) {
      console.error('Update failed:', error);
      alerts.failed_query();
    }
  };

  if (!show) return null;

  return (
    <div className="modal modal-blur fade show d-block" tabIndex={-1}>
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Manage Options</h5>
            <button type="button" className="btn-close" onClick={() => setShow(false)}></button>
          </div>

          <div className="modal-body">
            {/* Add new option */}
            <div className="mb-3 d-flex">
              <InputGroup>
                <FormControl
                  placeholder="Add new option..."
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  required
                />
                <Button variant="primary" onClick={handleAdd}>
                  <FaPlus />&nbsp; Add
                </Button>
              </InputGroup>
            </div>

            {loading ? (
              <div className="text-center my-4">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading options...</p>
              </div>
            ) : (
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Option Label</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {optionsList.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center">No options available</td>
                    </tr>
                  ) : (
                    optionsList.map((option, index) => (
                      <tr key={option.input_option_id}>
                        <td>{index + 1}</td>
                        <td>
                          {editingId === option.input_option_id ? (
                            <FormControl
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                            />
                          ) : (
                            option.input_option_label
                          )}
                        </td>
                        <td style={{ width: '150px' }}>
                          {editingId === option.input_option_id ? (
                            <>
                              <Button variant="warning" onClick={() => handleUpdate(option.input_option_id)}>
                                <FaCheck />
                              </Button>{' '}
                              <Button variant="secondary" onClick={() => { setEditingId(null); setEditingValue(''); }}>
                                <FaTimes />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="success"
                                onClick={() => { setEditingId(option.input_option_id); setEditingValue(option.input_option_label); }}
                              >
                                <FaPencilAlt />
                              </Button>{' '}
                              <Button variant="danger" onClick={() => handleDelete(option.input_option_id)}>
                                <FaTrashAlt />
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="modal-footer">
            <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalInputOptions;
