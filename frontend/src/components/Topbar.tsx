import Plus from "../assets/plus.svg";
import { useLocation, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { setGlobalModalState } from "../slices/globalModalStateSlice.ts";
const Topbar = () => {
  const location = useLocation();
  const { name } = useParams();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setGlobalModalState({ isOpen: true, type: location.pathname === `/${name}/tasks` ? "createTask" : location.pathname === `/${name}/projects` ? "createProject" : null }));
  }

  return (
    <div className='p-4 border-b border-gray-200 w-full bg-white fixed top-0 z-3 h-[66px]  max-w-[calc(100%-200px)] flex items-center justify-end gap-4'>
      {
        location.pathname === `/${name}/tasks` || location.pathname === `/${name}/projects`? <button className='text-white bg-gray-800 px-4 py-1.5 text-[11px] font-poppins hover:bg-gray-700 rounded-md cursor-pointer    transition-colors duration-150 ease-in-out flex items-center gap-1' onClick={handleClick}>
        <img src={Plus} alt="plus" className='h-3.4 w-3 invert-100' />
        <p>Create {location.pathname === `/${name}/tasks` ? "Task" : location.pathname === `/${name}/projects` ? "Project" : ""}</p>
      </button> : null
      }
     
    </div>
  )
}

export default Topbar