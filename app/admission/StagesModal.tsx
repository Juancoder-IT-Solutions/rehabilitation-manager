import React, { useEffect, useMemo, useState } from "react";
import servicesController from "../controllers/Services";
import admissionController from "../controllers/Admission";
import alerts from "../components/Alerts";

interface Props {
  show: boolean;
  onHide: () => void;
  service: any;
  tasks: any[];
  admission_id: number;
  rehab_center_id: number;
  reload: () => void;
  admission_service_id: any;
}

const StagesModal: React.FC<Props> = ({
  show,
  onHide,
  service,
  tasks = [],
  admission_id,
  rehab_center_id,
  reload,
  admission_service_id
}) => {
  const [checkedTasks, setCheckedTasks] = useState<number[]>([]);
  const [checkedStages, setCheckedStages] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [taskNotes, setTaskNotes] = useState<Record<number, string>>({});

  const grouped = useMemo(() => {
    const map: Record<number, { stage_name: string; tasks: any[] }> = {};
    tasks.forEach((row: any) => {
      if (!map[row.stage_id]) {
        map[row.stage_id] = { stage_name: row.stage_name, tasks: [] };
      }
      map[row.stage_id].tasks.push(row);
    });
    return map;
  }, [tasks]);

  useEffect(() => {
    const initChecked = tasks
      .filter((t: any) => t.status == 1)
      .map((t: any) => t.admission_task_id);

    setCheckedTasks(initChecked);
  }, [tasks]);

  useEffect(() => {
    const newCheckedStages: number[] = [];

    Object.entries(grouped).forEach(([stageId, data]) => {
      const allChecked = data.tasks.every((t: any) =>
        checkedTasks.includes(t.admission_task_id)
      );
      if (allChecked && data.tasks.length > 0) {
        newCheckedStages.push(Number(stageId));
      }
    });

    setCheckedStages(newCheckedStages);
  }, [checkedTasks, grouped]);

  useEffect(() => {
    const initNotes: Record<number, string> = {};
    tasks.forEach((t: any) => {
      initNotes[t.admission_task_id] = t.remarks || "";
    });
    setTaskNotes(initNotes);
  }, [tasks]);

  if (!show || !service) return null;

  const toggleTask = (taskId: number) => {
    setCheckedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const toggleStage = (stageId: number) => {
    const stageTasks = grouped[stageId].tasks.map((t: any) => t.admission_task_id);
    const isChecked = checkedStages.includes(stageId);

    if (isChecked) {
      setCheckedTasks(prev => prev.filter(id => !stageTasks.includes(id)));
    } else {
      setCheckedTasks(prev => [...new Set([...prev, ...stageTasks])]);
    }
  };

  const handleNoteChange = (taskId: number, value: string) => {
    setTaskNotes(prev => ({
      ...prev,
      [taskId]: value
    }));
  };

  const handleSaveProgress = async () => {
    try {
      setLoading(true);

      const payload = checkedTasks.map(id => ({
        admission_task_id: id,
        remarks: taskNotes[id] || ""
      }));

      await admissionController.update_admission_tasks(
        admission_id,
        rehab_center_id,
        payload,
        admission_service_id
      );

      reload();
      onHide();
      alerts.success_update();
    } catch (e) {
      console.error(e);
      alerts.failed_query();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">
              {service.service_name} – Stages & Tasks
            </h5>
            <button className="btn-close" onClick={onHide} />
          </div>

          <div className="modal-body">
            {tasks.length === 0 && (
              <div className="text-muted">No stages found.</div>
            )}

            {Object.entries(grouped).map(([stageId, data]) => {
              const completed = data.tasks.filter((t: any) =>
                checkedTasks.includes(t.admission_task_id)
              ).length;

              return (
                <div key={stageId} className="mb-3 border rounded p-3">

                  {/* Stage Header */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="form-check fw-bold">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={checkedStages.includes(Number(stageId))}
                        onChange={() => toggleStage(Number(stageId))}
                      />
                      <label className="form-check-label">
                        {data.stage_name}
                      </label>
                    </div>

                    <span className="badge bg-primary">
                      {completed}/{data.tasks.length} done
                    </span>
                  </div>

                  {/* Tasks */}
                  <div className="ms-2">
                    {data.tasks.map((task: any) => {
                      const isChecked = checkedTasks.includes(task.admission_task_id);

                      return (
                        <div
                          key={task.admission_task_id}
                          className={`border rounded p-2 mb-2 shadow-sm ${isChecked ? "bg-light" : ""}`}
                        >
                          <div className="d-flex align-items-start gap-2">
                            <input
                              className="form-check-input mt-1"
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleTask(task.admission_task_id)}
                            />

                            <div className="w-100">
                              <div className="d-flex justify-content-between align-items-center">
                                <strong>{task.task_name}</strong>
                                {isChecked && (
                                  <span className="badge bg-success">
                                    Done
                                  </span>
                                )}
                              </div>

                              <p className="text-muted small mb-1">
                                {task.task_desc}
                              </p>

                              <textarea
                                className="form-control form-control-sm"
                                rows={2}
                                placeholder="Add notes here..."
                                value={taskNotes[task.admission_task_id] || ""}
                                disabled={!isChecked}
                                onChange={(e) =>
                                  handleNoteChange(task.admission_task_id, e.target.value)
                                }
                              />

                              {!isChecked && (
                                <small className="text-muted">
                                  Check task to enable notes
                                </small>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Footer */}
          <div className="modal-footer position-sticky bottom-0 bg-white border-top">
            <button className="btn btn-secondary" onClick={onHide}>
              Close
            </button>
            <button
              className="btn btn-primary px-4"
              onClick={handleSaveProgress}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Progress"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StagesModal;