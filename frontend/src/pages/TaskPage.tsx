import { useState } from "react";
import TaskCreateModal from "../components/TaskCreateModal.tsx";
import ArrowRight from "../assets/arrow_right.svg";
import Checkbox from "../components/ui/Checkbox.tsx";
import Dot from "../assets/dot.svg";
import Timer from "../components/Timer.tsx";
import ViewTaskModal from "../components/ViewTaskModal.tsx";
import { useTimerStore } from "../lib/hooks/useTimerStore.ts";

const TaskPage = () => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showViewTaskModal, setShowViewTaskModal] = useState<boolean>(false);
  const [tasks, setTasks] = useState<
    Array<{
      id: number;
      task: string;
      status: string;
      project: string;
      estDuration: string;
      estDurationUnit: string;
      startDate: string;
      dueDate: string;
      startTime: string;
      subtasks: Array<{ id: number; subtask: string }>;
    }>
  >([
    {
      id: 1111,
      task: "FIX: Resolve login issue",
      status: "In Progress",
      project: "Project Alpha",
      estDuration: "2.5",
      estDurationUnit: "hours",
      startDate: "10 April, 2026",
      dueDate: "10 April, 2026",
      startTime: "9:00 AM",
      subtasks: [
        { id: 2278, subtask: "Work on frontend" },
        { id: 2279, subtask: "Work on backend" },
      ],
    },
    {
      id: 1112,
      task: "ADD: Implement user profile page",
      status: "To Do",
      project: "Project Alpha",
      estDuration: "2.5",
      estDurationUnit: "hours",
      startDate: "10 April, 2026",
      dueDate: "10 April, 2026",
      startTime: "9:00 AM",
      subtasks: [],
    }
  ]);

  const [viewTask, setViewTask] = useState<any>(null);
  const { activeTaskId, getTaskTimer, patchTaskTimer, activateTask } = useTimerStore();

  const activeTask = tasks.find((t) => t.id === activeTaskId) ?? null;
  const activeTimerRecord = activeTaskId !== null ? getTaskTimer(activeTaskId) : null;

  const handleToggleCreateTaskModal = () => {
    setShowViewTaskModal(false);
    setShowCreateModal(true);
  };

  const handleToggleViewTaskModal = (task: any) => {
    setShowCreateModal(false);
    setViewTask(task);
    setShowViewTaskModal(true);
  };

  const closeViewTaskModal = () => {
    setShowViewTaskModal(false);
  };

  const closeCreateTaskModal = () => {
    setShowCreateModal(false);
  };

  return (
    <div className={`grid grid-cols-3 bg-white`}>
      <div
        className={`w-full h-[calc(100vh-53px)] mt-[53px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-cyan-100 [&::-webkit-scrollbar-track]:bg-gray-100/40 relative ${showCreateModal || showViewTaskModal ? "border-r border-gray-200" : ""} ${showCreateModal ? "col-span-2" : showViewTaskModal ? "col-span-2" : "col-span-3"}`}
      >
        <div
          className={`${showCreateModal ? "mx-30" : showViewTaskModal ? "mx-30" : "w-[50%] max-w-[1050px] mx-auto"} my-10`}
        >
          {activeTask && activeTimerRecord ? (
            <Timer
              value={Number(activeTask.estDuration) }
              unit={activeTask.estDurationUnit as "minutes" | "hours"}
              label={`#TASK-${activeTask.id}: ${activeTask.task}`}
              timerRecord={activeTimerRecord}
              onStateChange={(record) => patchTaskTimer(activeTask.id, record)}
              onStop={(result) => console.log(result)}
            />
          ) : (
            <div className="">
             <Timer value={0} unit="hours"/>
            </div>
          )}
        </div>

        <div className="bg-slate-50 w-[90%] max-w-[1050px] my-10 rounded-lg p-1 shadow mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-inter text-gray-800 font-bold mt-3 mb-2 mx-2 flex items-center">
              Next Task{" "}
              <img src={ArrowRight} alt="Arrow Right" className="invert-80 h-7 w-7" />
            </h1>
            <div className="w-fit p-1 rounded-md hover:bg-neutral-100 cursor-pointer mr-2 transition-all duration-200 ease-in-out">
              <img src={Dot} alt="Dot" className="" />
            </div>
          </div>
          <div className="border border-gray-200 rounded-md w-full bg-white overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:h-0.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead className="text-sm text-neutral-800 font-inter">
                <tr>
                  <th className="w-[110px] border-r border-b border-gray-200 text-left px-1 py-2">
                    <span className="flex items-center gap-1.5">
                      <Checkbox size="sm" />
                      <span className="ml-2">Id</span>
                    </span>
                  </th>
                  <th className="w-[320px] border-r border-b border-gray-200 text-center py-2">Task</th>
                  <th className="w-[100px] border-r border-b border-gray-200 text-center py-2">Status</th>
                  <th className="w-[100px] border-r border-b border-gray-200 text-center py-2">Project</th>
                  <th className="w-[110px] border-r border-b border-gray-200 text-center py-2">Duration</th>
                  <th className="w-[110px] border-r border-b border-gray-200 text-center py-2">Start Date</th>
                  <th className="w-[110px] border-r border-b border-gray-200 text-center py-2">Due Date</th>
                  <th className="w-[110px] border-b border-gray-200 text-center py-2">Start Time</th>
                </tr>
              </thead>
              <tbody className="text-[12px] text-gray-600 font-poppins">
                {tasks.map((task,index) => (
                  <> 
                  <tr
                    key={task.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleToggleViewTaskModal(task)}
                  >
                    <td className="w-[110px] text-left px-1 py-2">
                      <span className="flex items-center gap-1.5">
                        <Checkbox size="sm" />
                        <span>#TASK-{task.id}</span>
                      </span>
                    </td>
                    <td className="w-[320px] text-center px-2 py-2">{task.task}</td>
                    <td className="w-[100px] text-center py-2">{task.status}</td>
                    <td className="w-[100px] text-center py-2">{task.project}</td>
                    <td className="w-[110px] text-center py-2">
                      {task.estDuration}{task.estDurationUnit === "hours" ? "h" : "m"}
                    </td>
                    <td className="w-[110px] text-center py-2">{task.startDate}</td>
                    <td className="w-[110px] text-center py-2">{task.dueDate}</td>
                    <td className="w-[110px] text-center py-2">{task.startTime}</td>
                  </tr>
                   {index !== tasks.length - 1 && (
                      <tr key={`divider-${task.id}`}>
                        <td colSpan={9}>
                          <div className="h-px w-full bg-gray-200" />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-50 w-[90%] max-w-[1050px] my-20 rounded-lg p-1 shadow mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-inter text-gray-800 font-bold mt-3 mb-2 mx-2 flex items-center">
              Today's Tasks{" "}
              <img src={ArrowRight} alt="Arrow Right" className="invert-80 h-7 w-7" />
            </h1>
            <div className="w-fit p-1 rounded-md hover:bg-neutral-100 cursor-pointer mr-2 transition-all duration-200 ease-in-out">
              <img src={Dot} alt="Dot" className="" />
            </div>
          </div>
          <div className="border border-gray-200 rounded-md w-full bg-white overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:h-0.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead className="text-sm text-neutral-800 font-inter">
                <tr>
                  <th className="w-[110px] border-r border-b border-gray-200 text-left px-1 py-2">
                    <span className="flex items-center gap-1.5">
                      <Checkbox size="sm" />
                      <span className="ml-2">Id</span>
                    </span>
                  </th>
                  <th className="w-[320px] border-r border-b border-gray-200 text-center py-2">Task</th>
                  <th className="w-[100px] border-r border-b border-gray-200 text-center py-2">Status</th>
                  <th className="w-[100px] border-r border-b border-gray-200 text-center py-2">Project</th>
                  <th className="w-[110px] border-r border-b border-gray-200 text-center py-2">Duration</th>
                  <th className="w-[110px] border-r border-b border-gray-200 text-center py-2">Start Date</th>
                  <th className="w-[110px] border-r border-b border-gray-200 text-center py-2">Due Date</th>
                  <th className="w-[110px] border-b border-gray-200 text-center py-2">Start Time</th>
                </tr>
              </thead>
              <tbody className="text-[12px] text-gray-600 font-poppins">
                {tasks.map((task,index) => (
                  <>
                  <tr
                    key={task.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleToggleViewTaskModal(task)}
                  >
                    <td className="w-[110px] text-left px-1 py-2">
                      <span className="flex items-center gap-1.5">
                        <Checkbox size="sm" />
                        <span>#TASK-{task.id}</span>
                      </span>
                    </td>
                    <td className="w-[320px] text-center px-2 py-2">{task.task}</td>
                    <td className="w-[100px] text-center py-2">{task.status}</td>
                    <td className="w-[100px] text-center py-2">{task.project}</td>
                    <td className="w-[110px] text-center py-2">{task.estDuration}</td>
                    <td className="w-[110px] text-center py-2">{task.startDate}</td>
                    <td className="w-[110px] text-center py-2">{task.dueDate}</td>
                    <td className="w-[110px] text-center py-2">{task.startTime}</td>
                  </tr>
                  {index !== tasks.length - 1 && (
                      <tr key={`divider-${task.id}`}>
                        <td colSpan={9}>
                          <div className="h-px w-full bg-gray-200" />
                        </td>
                      </tr>
                    )}
                    </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-50 w-[90%] max-w-[1050px] my-10 rounded-lg p-1 shadow mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-inter text-gray-800 font-bold mt-3 mb-2 mx-2 flex items-center">
              This Month{" "}
              <img src={ArrowRight} alt="Arrow Right" className="invert-80 h-7 w-7" />
            </h1>
            <div className="w-fit p-1 rounded-md hover:bg-neutral-100 cursor-pointer mr-2 transition-all duration-200 ease-in-out">
              <img src={Dot} alt="Dot" className="" />
            </div>
          </div>
          <div className="border border-gray-200 rounded-md w-full bg-white overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:h-0.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead className="text-sm text-neutral-800 font-inter">
                <tr>
                  <th className="w-[110px] border-r border-b border-gray-200 text-left px-1 py-2">
                    <span className="flex items-center gap-1.5">
                      <Checkbox size="sm" />
                      <span className="ml-2">Id</span>
                    </span>
                  </th>
                  <th className="w-[320px] border-r border-b border-gray-200 text-center py-2">Task</th>
                  <th className="w-[100px] border-r border-b border-gray-200 text-center py-2">Status</th>
                  <th className="w-[100px] border-r border-b border-gray-200 text-center py-2">Project</th>
                  <th className="w-[110px] border-r border-b border-gray-200 text-center py-2">Duration</th>
                  <th className="w-[110px] border-r border-b border-gray-200 text-center py-2">Start Date</th>
                  <th className="w-[110px] border-r border-b border-gray-200 text-center py-2">Due Date</th>
                  <th className="w-[110px] border-b border-gray-200 text-center py-2">Start Time</th>
                </tr>
              </thead>
              <tbody className="text-[12px] text-gray-600 font-poppins">
                {tasks.map((task,index) => (
                  <>
                  <tr
                    key={task.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleToggleViewTaskModal(task)}
                  >
                    <td className="w-[110px] text-left px-1 py-2">
                      <span className="flex items-center gap-1.5">
                        <Checkbox size="sm" />
                        <span>#TASK-{task.id}</span>
                      </span>
                    </td>
                    <td className="w-[320px] text-center px-2 py-2">{task.task}</td>
                    <td className="w-[100px] text-center py-2">{task.status}</td>
                    <td className="w-[100px] text-center py-2">{task.project}</td>
                    <td className="w-[110px] text-center py-2">{task.estDuration}</td>
                    <td className="w-[110px] text-center py-2">{task.startDate}</td>
                    <td className="w-[110px] text-center py-2">{task.dueDate}</td>
                    <td className="w-[110px] text-center py-2">{task.startTime}</td>
                  </tr>
                   {index !== tasks.length - 1 && (
                      <tr key={`divider-${task.id}`}>
                        <td colSpan={9}>
                          <div className="h-px w-full bg-gray-200" />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="col-span-1 mt-[53px]">
          <TaskCreateModal onCancel={closeCreateTaskModal} />
        </div>
      )}
      {showViewTaskModal && (
        <div className="col-span-1 mt-[53px]">
          <ViewTaskModal
            task={viewTask}
            onClose={closeViewTaskModal}
            activeTaskId={activeTaskId}
            getTaskTimer={getTaskTimer}
            patchTaskTimer={patchTaskTimer}
            activateTask={activateTask}
          />
        </div>
      )}
    </div>
  );
};

export default TaskPage;