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
    <div className='p-4 py-3 border-b border-gray-200 w-full bg-white fixed top-0 z-3'>
      <button className='text-white bg-gray-800 px-3 py-2 text-[13px] font-poppins hover:bg-gray-700 rounded-lg cursor-pointer relative left-[75%]  transition-colors duration-150 ease-in-out flex items-center gap-1' onClick={handleClick}>
        <img src={Plus} alt="plus" className='h-4 w-4 invert-100' />
        <p>Create {location.pathname === `/${name}/tasks` ? "Task" : location.pathname === `/${name}/projects` ? "Project" : ""}</p>
      </button>
    </div>
  )
}

export default Topbar