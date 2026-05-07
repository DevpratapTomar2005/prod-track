import React, { useState } from 'react'
import ArrowRight from "../assets/arrow_right.svg";
import Checkbox from "../components/ui/Checkbox.tsx";
import Dot from "../assets/dot.svg";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([
    {
      id: 2001,
      project: "Project Alpha",
      status: "Done",
      progress: 100,
      startDate: "1 May, 2026",
      estEndDate: "1 May, 2026",
      
    },
    {
      id: 2002,
      project: "Nexis Quiz App",
      status: "In Progress",
      progress: 90,
      startDate: "2 May, 2026",
      estEndDate: "4 May, 2026",
      
    },
    {
      id: 2003,
      project: "Fintech Dashboard",
      status: "Done",
      progress: 100,
      startDate: "5 May, 2026",
      estEndDate: "7 May, 2026",
      
    },
    {
      id: 2004,
      project: "E-commerce Website",
      status: "To Do",
      progress: 0,
      startDate: "6 May, 2026",
      estEndDate: "8 May, 2026",
      
    },
    {
      id: 2995,
      project: "AI Chatbot",
      status: "In Progress",
      progress: 2,
      startDate: "7 May, 2026",
      estEndDate: "9 May, 2026",
      
    },
    {
      id: 2006,
      project: "Social Media App",
      status: "Done",
      progress: 100,
      startDate: "8 May, 2026",
      estEndDate: "10 May, 2026",
      
    },
      {
      id: 2007,
      project: "Portfolio Website",
      status: "To Do",
      progress: 0,
      startDate: "9 May, 2026",
      estEndDate: "11 May, 2026",
    },
    {
      id: 2008,
      project: "E-commerce Website",
      status: "To Do",
      progress: 0,
      startDate: "10 May, 2026",
      estEndDate: "12 May, 2026",
    },
      {
      id: 2009,
      project: "AI Extension",
      status: "To Do",
      progress: 0,
      startDate: "11 May, 2026",
      estEndDate: "13 May, 2026",
    },
     {
      id: 2010,
      project: "Social Media App",
      status: "To Do",
      progress: 0,
      startDate: "12 May, 2026",
      estEndDate: "14 May, 2026",
    },
  ]);

  const handleToggleViewTaskModal = (project: any) => {
    // hook up to your modal logic as needed
    console.log("View project:", project);
  };

  return (
    <div className=''>
      <div className="w-full h-[calc(100vh-53px)] mt-[53px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-cyan-100 [&::-webkit-scrollbar-track]:bg-gray-100/40">
       <div className="bg-slate-50 w-[90%] max-w-[1050px] my-30 rounded-lg p-1 shadow mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-inter text-gray-800 font-bold mt-3 mb-2 mx-2 flex items-center">
              Projects{" "}
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
                  <th className="w-[120px] border-r border-b border-gray-200 text-center py-2">Project</th>
                  <th className="w-[100px] border-r border-b border-gray-200 text-center py-2">Status</th>
                  <th className="w-[200px] border-r border-b border-gray-200 text-center py-2">Progress</th>
                  <th className="w-[110px] border-r border-b border-gray-200 text-center py-2">Start Date</th>
                  <th className="w-[110px] border-b border-gray-200 text-center py-2">Est. End Date</th>
                  
                </tr>
              </thead>
              <tbody className="text-[12px] text-gray-600 font-poppins">
                {projects.map((project,index) => (
                  <> 
                  <tr
                    key={project.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleToggleViewTaskModal(project)}
                  >
                    <td className="w-[110px] text-left px-1 py-2" onClick={(e) => e.stopPropagation()}>
                      <span className="flex items-center gap-1.5">
                        <Checkbox size="sm" />
                        <span>#PROJECT-{project.id}</span>
                      </span>
                    </td>
                    <td className="w-[120px] text-center px-2 py-2">{project.project}</td>
                    <td className="w-[100px] text-center py-2">{project.status}</td>
                    <td className="w-[200px] text-center py-2 px-3">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-linear-to-r from-cyan-200 via-rose-200 to-fuchsia-400  h-1.5 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="w-[110px] text-center py-2">{project.startDate}</td>
                    <td className="w-[110px] text-center py-2">{project.estEndDate}</td>
                    
                  </tr>
                   {index !== projects.length - 1 && (
                      <tr key={`divider-${project.id}`}>
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
          <div className="flex items-center justify-between my-3 mx-2">
            <div className="text-[10px] text-gray-600 font-poppins">
              Showing 1 to {projects.length} of {projects.length} entries
            </div>
            <div className="flex items-center justify-center gap-2 mt-3 mr-2">
              <span className="text-[12px] font-poppins text-white bg-gray-800 p-2 rounded-lg cursor-pointer">Previous</span>
              <span className="text-[12px] font-semibold text-gray-600 font-poppins px-4 py-1 bg-white rounded border border-dotted border-gray-300">1</span>
              <span className="text-[12px] font-poppins text-white bg-gray-800 p-2 px-5 rounded-lg cursor-pointer">Next</span>
            </div>
          </div>
        </div>

       </div> 
    </div>
  )
}

export default ProjectsPage