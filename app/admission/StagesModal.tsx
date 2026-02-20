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

  const handleSaveProgress = async () => {
    try {
      setLoading(true);
      await admissionController.update_admission_tasks(admission_id, rehab_center_id, checkedTasks, admission_service_id);
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
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {service.service_name} – Stages & Tasks
            </h5>
            <button className="btn-close" onClick={onHide} />
          </div>

          <div className="modal-body">
            {tasks.length === 0 && <div className="text-muted">No stages found.</div>}

            {Object.entries(grouped).map(([stageId, data]) => (
              <div key={stageId} className="mb-3 border rounded p-2">
                <div className="form-check fw-bold">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={checkedStages.includes(Number(stageId))}
                    onChange={() => toggleStage(Number(stageId))}
                  />
                  <label className="form-check-label">{data.stage_name}</label>
                </div>

                <div className="ms-4 mt-2">
                  {data.tasks.map((task: any) => (
                    <div className="form-check" key={task.admission_task_id}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={checkedTasks.includes(task.admission_task_id)}
                        onChange={() => toggleTask(task.admission_task_id)}
                      />
                      <label className="form-check-label">
                        <strong>{task.task_name}</strong>
                        <p className="text-muted mb-0">{task.task_desc}</p>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onHide}>
              Close
            </button>
            <button className="btn btn-primary" onClick={handleSaveProgress} disabled={loading}>
              {loading ? "Saving..." : "Save Progress"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StagesModal;
