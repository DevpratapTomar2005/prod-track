import {useState} from "react";
import TaskCreateModal from "../components/TaskCreateModal.tsx";
import ArrowRight from "../assets/arrow_right.svg";
import Checkbox from "../components/ui/Checkbox.tsx";
import Dot from "../assets/dot.svg";
import Timer from "../components/Timer.tsx";
import ViewTaskModal from "../components/ViewTaskModal.tsx";

const TaskPage = () => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(true);
  const [showViewTaskModal, setShowViewTaskModal] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Array<{ id: number; task: string; status: string; project: string; estDuration: string; startDate: string; dueDate: string; startTIme: string; }>>([
    {
      id: 1111,
      task: "FIX: Resolve login issue",
      status: "In Progress",
      project: "Project Alpha",
      estDuration: "2h",
      startDate: "10 April, 2026",
      dueDate: "10 April, 2026",
      startTIme: "9:00 AM",
      
    }
  ]);

  const handleToggleCreateTaskModal = () => {
    setShowViewTaskModal(false);
    setShowCreateModal(true);
  };

  const handleToggleViewTaskModal = () => {
    setShowCreateModal(false);
    setShowViewTaskModal(true);
  };

  const closeViewTaskModal = () => {
    setShowViewTaskModal(false);
  }

  const closeCreateTaskModal = () => {
    setShowCreateModal(false);
  }

  return (
    <div className={`grid grid-cols-3 bg-white`}>
      <div className={`w-full h-[calc(100vh-53px)] mt-[53px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-cyan-100 [&::-webkit-scrollbar-track]:bg-gray-100/40 relative ${showCreateModal || showViewTaskModal ? "border-r border-gray-200" : ""} ${showCreateModal ? "col-span-2" : showViewTaskModal ? "col-span-2" : "col-span-3"} `}>
        <div className={`${showCreateModal?"mx-30": showViewTaskModal?"mx-30":"w-[50%] max-w-[1050px] mx-auto"} my-10`}>
          <Timer value={1} unit="minutes" label="#TASK-2989: Resolve login issue" onStop={(result) => console.log(result)}/>
        </div>
        <div className="bg-slate-50 w-[90%] max-w-[1050px] my-10 rounded-lg p-1 shadow mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-inter text-gray-800 font-bold mt-3 mb-2 mx-2 flex items-center ">
              Next Task <img src={ArrowRight} alt="Arrow Right" className="invert-80 h-7 w-7"/>
            </h1>
            <div className="w-fit p-1 rounded-md hover:bg-neutral-100 cursor-pointer mr-2 transition-all duration-200 ease-in-out">
              <img src={Dot} alt="Dot" className="" />
            </div>
          </div>
          <div className="border border-gray-200 rounded-md w-full bg-white overflow-x-auto scroll-smooth ">
            <table className="w-full min-w-[1000px] ">
              <div className="text-sm text-neutral-800 font-inter my-2">
                <thead>
                  <th className=" w-[110px] border-r text-left px-1 flex items-center gap-1.5"><Checkbox size="sm"/><span className="ml-2">Id</span></th>
                  <th className="w-[320px] border-r text-center">Task</th>
                  <th className=" w-[100px] border-r text-center">Status</th>
                  <th className=" w-[100px] border-r text-center">Project</th>
                  <th className=" w-[110px] border-r text-center">
                    Duration
                  </th>
                  <th className=" w-[110px] border-r text-center">
                    Start Date
                  </th>
                  <th className=" w-[110px] border-r text-center">Due Date</th>
                  <th className=" w-[110px] text-center">Start Time</th>
                </thead>
              </div>
              <div className="h-px bg-gray-200 w-full"></div>
              <div className="text-[12px] text-gray-600 font-poppins ">
                <tbody className="">
                  {
                    tasks.map((task,index) => {
                return  <>
                  <tr key={task.id} className="hover:bg-gray-50" onClick={()=> handleToggleViewTaskModal()}>
                    <td className=" w-[110px] text-left px-1 flex items-center gap-1.5 py-2"><Checkbox size="sm"/><span className="">#TASK-{task.id}</span></td>
                    <td className="w-[320px]  text-center px-2">{task.task}</td>
                    <td className=" w-[100px]  text-center">{task.status}</td>
                    <td className=" w-[100px]  text-center">{task.project}</td>
                    <td className=" w-[110px] text-center">
                      {task.estDuration}
                    </td>
                    <td className=" w-[110px]  text-center">
                      {task.startDate}
                    </td>
                    <td className=" w-[110px]  text-center">{task.dueDate}</td>
                    <td className=" w-[110px] text-center">{task.startTIme}</td>
                  </tr>
                  </>
                      
                    })
                  }
                </tbody>
              </div>
              
             
            </table>
          </div>
        </div>
        <div className="bg-slate-50 w-[90%] max-w-[1050px] my-20 rounded-lg p-1 shadow mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-inter text-gray-800 font-bold mt-3 mb-2 mx-2 flex items-center ">
              Today's Tasks <img src={ArrowRight} alt="Arrow Right" className="invert-80 h-7 w-7"/>
            </h1>
            <div className="w-fit p-1 rounded-md hover:bg-neutral-100 cursor-pointer mr-2 transition-all duration-200 ease-in-out">
              <img src={Dot} alt="Dot" className="" />
            </div>
          </div>
          <div className="border border-gray-200 rounded-md w-full bg-white overflow-x-auto scroll-smooth ">
            <table className="w-full min-w-[1000px] ">
              <div className="text-sm text-neutral-800 font-inter my-2">
                <thead>
                  <th className=" w-[110px] border-r text-left px-1 flex items-center gap-1.5"><Checkbox size="sm"/><span className="ml-2">Id</span></th>
                  <th className="w-[320px] border-r text-center">Task</th>
                  <th className=" w-[100px] border-r text-center">Status</th>
                  <th className=" w-[100px] border-r text-center">Project</th>
                  <th className=" w-[110px] border-r text-center">
                    Duration
                  </th>
                  <th className=" w-[110px] border-r text-center">
                    Start Date
                  </th>
                  <th className=" w-[110px] border-r text-center">Due Date</th>
                  <th className=" w-[110px] text-center">Start Time</th>
                </thead>
              </div>
              <div className="h-px bg-gray-200 w-full"></div>
              <div className="text-[12px] text-gray-600 font-poppins ">
                <tbody className="">
                  {
                    tasks.map((task,index) => {
                return  <>
                  <tr key={task.id} className="hover:bg-gray-50" onClick={()=> handleToggleViewTaskModal()}>
                    <td className=" w-[110px] text-left px-1 flex items-center gap-1.5 py-2"><Checkbox size="sm"/><span className="">#TASK-{task.id}</span></td>
                    <td className="w-[320px]  text-center px-2">{task.task}</td>
                    <td className=" w-[100px]  text-center">{task.status}</td>
                    <td className=" w-[100px]  text-center">{task.project}</td>
                    <td className=" w-[110px] text-center">
                      {task.estDuration}
                    </td>
                    <td className=" w-[110px]  text-center">
                      {task.startDate}
                    </td>
                    <td className=" w-[110px]  text-center">{task.dueDate}</td>
                    <td className=" w-[110px] text-center">{task.startTIme}</td>
                  </tr>
                  </>
                      
                    })
                  }
                </tbody>
              </div>
              
             
            </table>
          </div>
        </div>
        <div className="bg-slate-50 w-[90%] max-w-[1050px] my-10 rounded-lg p-1 shadow mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-inter text-gray-800 font-bold mt-3 mb-2 mx-2 flex items-center ">
              This Month <img src={ArrowRight} alt="Arrow Right" className="invert-80 h-7 w-7"/>
            </h1>
            <div className="w-fit p-1 rounded-md hover:bg-neutral-100 cursor-pointer mr-2 transition-all duration-200 ease-in-out">
              <img src={Dot} alt="Dot" className="" />
            </div>
          </div>
          <div className="border border-gray-200 rounded-md w-full bg-white overflow-x-auto scroll-smooth ">
            <table className="w-full min-w-[1000px] ">
              <div className="text-sm text-neutral-800 font-inter my-2">
                <thead>
                  <th className=" w-[110px] border-r text-left px-1 flex items-center gap-1.5"><Checkbox size="sm"/><span className="ml-2">Id</span></th>
                  <th className="w-[320px] border-r text-center">Task</th>
                  <th className=" w-[100px] border-r text-center">Status</th>
                  <th className=" w-[100px] border-r text-center">Project</th>
                  <th className=" w-[110px] border-r text-center">
                    Duration
                  </th>
                  <th className=" w-[110px] border-r text-center">
                    Start Date
                  </th>
                  <th className=" w-[110px] border-r text-center">Due Date</th>
                  <th className=" w-[110px] text-center">Start Time</th>
                </thead>
              </div>
              <div className="h-px bg-gray-200 w-full"></div>
              <div className="text-[12px] text-gray-600 font-poppins ">
                <tbody className="">
                  {
                    tasks.map((task,index) => {
                return  <>
                  <tr key={task.id} className="hover:bg-gray-50" onClick={()=> handleToggleViewTaskModal()}>
                    <td className=" w-[110px] text-left px-1 flex items-center gap-1.5 py-2"><Checkbox size="sm"/><span className="">#TASK-{task.id}</span></td>
                    <td className="w-[320px]  text-center px-2">{task.task}</td>
                    <td className=" w-[100px]  text-center">{task.status}</td>
                    <td className=" w-[100px]  text-center">{task.project}</td>
                    <td className=" w-[110px] text-center">
                      {task.estDuration}
                    </td>
                    <td className=" w-[110px]  text-center">
                      {task.startDate}
                    </td>
                    <td className=" w-[110px]  text-center">{task.dueDate}</td>
                    <td className=" w-[110px] text-center">{task.startTIme}</td>
                  </tr>
                  </>
                      
                    })
                  }
                </tbody>
              </div>
              
             
            </table>
          </div>
        </div>
        
      </div>
      {
        showCreateModal && 
        <div className="col-span-1 mt-[53px]">
        <TaskCreateModal onCancel={closeCreateTaskModal} />
      </div>
      }
      {showViewTaskModal && <div className="col-span-1 mt-[53px]"><ViewTaskModal onClose={closeViewTaskModal} /></div>}
      
      
    </div>
  );
};

export default TaskPage;
