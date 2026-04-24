import { useState } from "react";
import { Button } from "@/components/ui/button";
import Timer from "../components/Timer.tsx";
import { Trash2 } from "lucide-react";
import Checkbox from "./ui/Checkbox.tsx";
const ViewTaskModal = ({onClose = () => {}, task}) => {
const [subtasks, setSubtasks] = useState<Array<{ id: number; subtask: string }>>(
    task.subtasks
  );
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
 
  const allSelected =
    subtasks.length > 0 && selectedIds.size === subtasks.length;
 
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(subtasks.map((s) => s.id)));
    }
  };
 
  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
 
  const deleteSelected = (e: React.MouseEvent) => {
    e.preventDefault();
    setSubtasks((prev) => prev.filter((s) => !selectedIds.has(s.id)));
    setSelectedIds(new Set());
  };

  return (
    <div className="p-4 w-full bg-white h-[calc(100vh-53px)] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-cyan-100 [&::-webkit-scrollbar-track]:bg-gray-100/40">
      <div>
        <div className="text-lg font-inter font-semibold text-neutral-800 ">
          <h2>Task ID</h2>
        </div>
        <div className="text-sm tracking-widest font-roboto text-cyan-400 mt-1 border border-cyan-100 rounded px-1 bg-cyan-50/30 w-fit">
          <p>#TASK-{task.id}</p>
        </div>
      </div>
      <div>
        <div className="text-lg font-inter font-semibold text-neutral-800 mt-5">
          <h2>Task</h2>
        </div>
        <div className="text-sm font-poppins text-neutral-500 p-2 border border-gray-300 rounded-lg border-dotted border-2 mt-1 italic bg-cyan-50/20">
          <p>{task.task}</p>
        </div>
      </div>
      <div className="mt-8">
        
        <Timer value={task.estDuration}  unit={task.estDurationUnit} label="Allocated Time" onStop={() => {}} />
      </div>
       {/* Subtasks table */}
      {subtasks.length > 0 && (
        <div className="mt-6">
          <div className="text-lg font-inter font-semibold text-neutral-800 mb-3">
            <h2>Subtasks</h2>
          </div>
          <div className="w-full border rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="text-[13px] text-neutral-800 font-inter">
                  <th className="w-[100px] border-r text-left px-2 my-1.5">
                    <div className="flex items-center gap-1.5">
                      <Checkbox
                        size="xs"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                      />
                      <span>Id</span>
                    </div>
                  </th>
                  <th className="text-center py-1.5">Subtask</th>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <div className="h-px w-full bg-gray-200" />
                  </td>
                </tr>
              </thead>
              <tbody className="text-[10px] text-gray-600 font-poppins">
                {subtasks.map((item, index) => (
                  <>
                    <tr key={item.id}>
                      <td className="w-[100px] px-2 py-1.5 border-r">
                        <div className="flex items-center gap-1.5">
                          <Checkbox
                            size="xs"
                            checked={selectedIds.has(item.id)}
                            onChange={() => toggleSelect(item.id)}
                          />
                          <span>#SUB-{item.id}</span>
                        </div>
                      </td>
                      <td className="px-2 text-center">{item.subtask}</td>
                    </tr>
                    {index !== subtasks.length - 1 && (
                      <tr key={`divider-${item.id}`}>
                        <td colSpan={2}>
                          <div className="h-px w-full bg-gray-200" />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
 
          {/* Delete button — only shown when rows are selected */}
          {selectedIds.size > 0 && (
            <div className="flex justify-end">
              <button
                onClick={deleteSelected}
                disabled={selectedIds.size === 0}
                  className={`flex items-center gap-1 text-[11px] font-poppins font-semibold px-2.5 py-1 rounded border transition-colors duration-150 bg-gray-800 border-neutral-200 text-white hover:bg-gray-600 cursor-pointer mt-1
                `}
              >
                <Trash2 size={13} />
                <span>Delete ({selectedIds.size})</span>
              </button>
            </div>
          )}
        </div>
      )}
      <div className="flex items-center mt-5 justify-between gap-2">
        <div className="w-1/3">
        <div className="text-md font-inter font-semibold text-neutral-800 mt-5">
          <h2>Project</h2>
        </div>
        <div className="text-sm font-poppins text-neutral-500 p-2 border border-gray-300 rounded-lg mt-1">
          <p>{task.project}</p>
        </div>
        </div>
        <div className="w-1/3">
        <div className="text-md font-inter font-semibold text-neutral-800 mt-5 ">
          <h2>Status</h2>
        </div>
        <div className="text-sm font-poppins text-neutral-500 p-2 border border-gray-300 rounded-lg mt-1">
          <p>{task.status}</p>
        </div>
        </div>
        <div className="w-1/3">
        <div className="text-md font-inter font-semibold text-neutral-800 mt-5">
          <h2>Start Time</h2>
        </div>
        <div className="text-sm font-poppins text-neutral-500 p-2 border border-gray-300 rounded-lg  mt-1">
          <p>{task.startTime}</p>
        </div>
        </div>
      </div>
      <div className="flex items-center mt-5 justify-between gap-2">
      <div className="w-1/2">
        
        <div className="text-md font-inter font-semibold text-neutral-800 mt-5">
          <h2>Start Date</h2>
        </div>
        <div className="text-sm font-poppins text-neutral-500 p-2 border border-gray-300 rounded-lg  mt-1">
          <p>{task.startDate}</p>
        </div>
        </div>
      
      <div className="w-1/2">
        <div className="text-md font-inter font-semibold text-neutral-800 mt-5">
          <h2>Due Date</h2>
        </div>
        <div className="text-sm font-poppins text-neutral-500 p-2 border border-gray-300 rounded-lg  mt-1">
          <p>{task.dueDate}</p>
        </div>
      </div>
      </div>
      <div className="w-full flex items-center justify-end mt-10 gap-2">
          <Button variant="outline" onClick={onClose} className="px-4 py-4 m-0 text-neutral-800">
            Close
          </Button>
          <Button
           
            className="mt-10 bg-cyan-400 hover:bg-cyan-500 px-4 py-4 transition-all duration-200 ease-in-out cursor-pointer text-white m-0"
          >
            Delete
          </Button>
        </div>
    </div>
  )
}

export default ViewTaskModal;