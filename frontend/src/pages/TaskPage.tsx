import {useState} from "react";
import TaskCreateModal from "../components/TaskCreateModal.tsx";
import ArrowRight from "../assets/arrow_right.svg";
import Checkbox from "../components/ui/Checkbox.tsx";
import Dot from "../assets/dot.svg";
const TaskPage = () => {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(true);
  return (
    <div className="grid grid-cols-3 bg-white">
      <div className={`w-full ${showCreateModal ? "col-span-2" : "col-span-3"}`}>
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
                  <th className=" w-[100px] border-r text-left px-1 flex items-center"><Checkbox size="sm"/><span className="ml-2">Id</span></th>
                  <th className="w-[320px] border-r text-center">Task</th>
                  <th className=" w-[100px] border-r text-center">Status</th>
                  <th className=" w-[100px] border-r text-center">Project</th>
                  <th className=" w-[110px] border-r text-center">
                    Est. Duration
                  </th>
                  <th className=" w-[110px] border-r text-center">
                    Start Date
                  </th>
                  <th className=" w-[110px] border-r text-center">Due Date</th>
                  <th className=" w-[110px] text-center">Start Time</th>
                </thead>
              </div>
              <div className="h-px bg-gray-200 w-full"></div>
              <div className="text-[12px] text-gray-600 font-poppins my-2">
                <tbody className="">
                  <tr>
                    <td className=" w-[100px] text-left px-1"><Checkbox size="sm"/><span className="ml-2">#TASK-1111</span></td>
                    <td className="w-[320px]  text-center px-2">FIX: Resolve login issue</td>
                    <td className=" w-[100px]  text-center">In Progress</td>
                    <td className=" w-[100px]  text-center">Project Alpha</td>
                    <td className=" w-[110px] text-center">
                      2h
                    </td>
                    <td className=" w-[110px]  text-center">
                      10 April, 2026
                    </td>
                    <td className=" w-[110px]  text-center">10 April, 2026</td>
                    <td className=" w-[110px] text-center">09:00 AM</td>
                  </tr>
                </tbody>
              </div>
              
              <div className="text-sm text-gray-600 font-poppins my-2"></div>
            </table>
          </div>
        </div>
        
      </div>
      {
        showCreateModal && 
        <div className="col-span-1">
        <TaskCreateModal />
      </div>
      }
    </div>
  );
};

export default TaskPage;
