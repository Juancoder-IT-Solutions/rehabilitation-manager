import { useState } from "react";
import alerts from "../components/Alerts";
import servicesController from "../controllers/Services";
import { FaPlusCircle, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

interface ComponentProps {
    showStagesModal: boolean;
    setShowStagesModal: (show: boolean) => void;
    form_stages_data: any;
    setFormStagesData: (data: any) => void;
    fetchServices: Function;
    serviceID: any;
    listStages: any;
    fetchStages: any;
    rehab_center_id: any
}

const ModalStages: React.FC<ComponentProps> = ({
    showStagesModal,
    setShowStagesModal,
    form_stages_data,
    setFormStagesData,
    fetchServices,
    serviceID,
    listStages,
    fetchStages,
    rehab_center_id
}) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedStage, setSelectedStage] = useState<any>({});

    // Task modal state
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [taskName, setTaskName] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [tasks, setTasks] = useState([]);

    // Inline edit states
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState("");
    const [editingDesc, setEditingDesc] = useState("");

    const [editingStageId, setEditingStageId] = useState<number | null>(null);
    const [editingStageName, setEditingStageName] = useState("");


    const handleChange = (e: any) => {
        setFormStagesData((prevData: any) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formdata = { ...form_stages_data, service_id: serviceID, rehab_center_id: rehab_center_id };
        const response = await servicesController.add_stages(formdata);
        if (response === 1) {
            alerts.success_add();
            fetchStages(serviceID);
            setFormStagesData({ stage_name: "" });
        } else if (response === -2) {
            alerts.already_exists_alert("Service stage already exists.");
        } else {
            alerts.failed_query();
        }
    };

    const startEditingStage = (stage: any) => {
        setEditingStageId(stage.stage_id);
        setEditingStageName(stage.stage_name);
    };

    const cancelEditingStage = () => {
        setEditingStageId(null);
        setEditingStageName("");
    };

    const saveEditingStage = async () => {
        if (!editingStageId) return;

        const formdata = {
            stage_id: editingStageId,
            stage_name: editingStageName,
            service_id:serviceID,
            rehab_center_id
        };

        const response = await servicesController.update_stages(formdata);

        if (response === 1) {
            alerts.success_update();
            fetchStages(serviceID);
            cancelEditingStage();
        } else if (response === -2) {
            alerts.already_exists_alert("Stage already exists.");
        } else {
            alerts.failed_query();
        }
    };


    const handleDelete = (id: any) => {
        alerts.confirm_action("Are you sure you want to delete this entry?", "Yes, delete it", "No, cancel")
            .then((result: any) => {
                if (result.isConfirmed) {
                    deleteEntry(id);
                } else {
                    alerts.confirm_action_cancel();
                }
            });
    };

    const deleteEntry = async (id: any) => {
        try {
            const response = await servicesController.delete_stages(id, rehab_center_id);
            if (response <= 0) {
                alerts.failed_query();
            } else {
                alerts.success_delete('Successfully deleted selected entry.');
                fetchStages(serviceID);
            }
        } catch (error) {
            console.error('Failed to fetch services:', error);
        }
    };

    // === TASK HANDLERS ===
    const fetchTasks = async (id: any) => {
        try {
            const response = await servicesController.fetch_task(id, rehab_center_id);
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            return null;
        }
    };

    const handleOpenTaskModal = (stage: any) => {
        setSelectedStage(stage);
        fetchTasks(stage.stage_id);
        setTaskName("");
        setTaskDesc("");
        setShowTaskModal(true);
    };

    const handleAddTask = async () => {
        const formdata = {
            task_name: taskName,
            task_desc: taskDesc,
            stage_id: selectedStage.stage_id,
            rehab_center_id: rehab_center_id
        };

        const response = await servicesController.add_task(formdata);

        if (response === 1) {
            alerts.success_add();
            fetchTasks(selectedStage.stage_id);
            setTaskName("");
            setTaskDesc("");
        } else if (response === -2) {
            alerts.already_exists_alert("Task already exists.");
        } else {
            alerts.failed_query();
        }
    };

    const startEditingTask = (task: any) => {
        setEditingTaskId(task.task_id);
        setEditingName(task.task_name);
        setEditingDesc(task.task_desc);
    };

    const cancelEditingTask = () => {
        setEditingTaskId(null);
        setEditingName("");
        setEditingDesc("");
    };

    const saveEditingTask = async () => {
        if (!editingTaskId) return;

        const formdata = {
            task_id: editingTaskId,
            task_name: editingName,
            task_desc: editingDesc,
            rehab_center_id
        };

        const response = await servicesController.update_task(formdata);

        if (response === 1) {
            alerts.success_update();
            fetchTasks(selectedStage.stage_id);
            cancelEditingTask();
        } else if (response === -2) {
            alerts.already_exists_alert("Task already exists.");
        } else {
            alerts.failed_query();
        }
    };

    const handleDeleteTask = async (id: any) => {
        alerts.confirm_action("Are you sure you want to delete this task?", "Yes, delete it", "No, cancel")
            .then((result: any) => {
                if (result.isConfirmed) {
                    deleteTask(id);
                } else {
                    alerts.confirm_action_cancel();
                }
            });
    };

    const deleteTask = async (id: any) => {
        try {
            const response = await servicesController.delete_task(id, rehab_center_id);
            if (response <= 0) {
                alerts.failed_query();
            } else {
                alerts.success_delete('Successfully deleted selected task.');
                fetchTasks(selectedStage.stage_id);
            }
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    }

    return (
        <>
            {/* Main Modal */}
            <div className={`modal modal-blur fade ${showStagesModal ? "show d-block" : "d-none"}`}>
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Manage Stages</h5>
                            <button type="button" className="btn-close" onClick={() => setShowStagesModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit} className="border p-3 mb-3 rounded bg-light">
                                <div className="mb-2">
                                    <label className="form-label">Stage Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter stage name"
                                        name="stage_name"
                                        value={form_stages_data.stage_name || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="d-flex justify-content-end">
                                    <button type="submit" className="btn btn-success">Save</button>
                                </div>
                            </form>

                            {/* Table of Stages */}
                            <table className="table table-bordered mt-3">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Stage Name</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listStages.length > 0 ? (
                                        listStages.map((stage: any, index: any) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    {editingStageId === stage.stage_id ? (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={editingStageName}
                                                            onChange={(e) => setEditingStageName(e.target.value)}
                                                        />
                                                    ) : (
                                                        stage.stage_name
                                                    )}
                                                </td>
                                                <td style={{ width: '200px' }}>
                                                    {editingStageId === stage.stage_id ? (
                                                        <>
                                                            <button className="btn btn-primary me-1" onClick={saveEditingStage}>
                                                                <FaCheck />
                                                            </button>
                                                            <button className="btn btn-secondary" onClick={cancelEditingStage}>
                                                                <FaTimes />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="btn-group">
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary"
                                                                onClick={() => handleOpenTaskModal(stage)}
                                                            >
                                                                <FaPlusCircle />&nbsp; Task
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-info"
                                                                onClick={() => startEditingStage(stage)}
                                                            >
                                                                <FaPencil />&nbsp; Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger"
                                                                onClick={() => handleDelete(stage.stage_id)}
                                                            >
                                                                <FaTrash />&nbsp; Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="text-center text-muted">No record found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={() => setShowStagesModal(false)} className="btn me-auto">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Task Modal */}
            {showTaskModal && (
                <div className="modal modal-blur fade show d-block">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Manage Tasks for {selectedStage.stage_name}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowTaskModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {/* Add Task */}
                                <form
                                    className="row g-2 align-items-start mb-3"
                                    onSubmit={(e) => { e.preventDefault(); handleAddTask(); }}
                                >
                                    <div className="col-12 col-md-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter task name"
                                            value={taskName}
                                            onChange={(e) => setTaskName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-12 col-md-5">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter task description"
                                            value={taskDesc}
                                            onChange={(e) => setTaskDesc(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-12 col-md-3">
                                        <button type="submit" className="btn btn-success w-100">
                                            Add Task
                                        </button>
                                    </div>
                                </form>

                                {/* Task Table */}
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Task Name</th>
                                            <th>Description</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.length > 0 ? tasks.map((task: any, idx: number) => (
                                            <tr key={task.task_id}>
                                                <td>{idx + 1}</td>
                                                <td>
                                                    {editingTaskId === task.task_id ? (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={editingName}
                                                            onChange={(e) => setEditingName(e.target.value)}
                                                        />
                                                    ) : (
                                                        task.task_name
                                                    )}
                                                </td>
                                                <td>
                                                    {editingTaskId === task.task_id ? (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={editingDesc}
                                                            onChange={(e) => setEditingDesc(e.target.value)}
                                                        />
                                                    ) : (
                                                        task.task_desc
                                                    )}
                                                </td>
                                                <td style={{ width: '150px' }}>
                                                    {editingTaskId === task.task_id ? (
                                                        <>
                                                            <button className="btn btn-primary me-1" onClick={saveEditingTask}>
                                                                <FaCheck />
                                                            </button>
                                                            <button className="btn btn-secondary" onClick={cancelEditingTask}>
                                                                <FaTimes />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button className="btn btn-info me-1" onClick={() => startEditingTask(task)}>
                                                                <FaPencil />
                                                            </button>
                                                            <button className="btn btn-danger" onClick={() => handleDeleteTask(task.task_id)}>
                                                                <FaTrash />
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} className="text-center text-muted">No tasks found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn me-auto" onClick={() => setShowTaskModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ModalStages;
