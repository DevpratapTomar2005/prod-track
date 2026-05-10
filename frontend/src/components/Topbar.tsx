import Plus from "../assets/plus.svg";
const Topbar = () => {
  return (
    <div className='p-4 py-3 border-b border-gray-200 w-full bg-white fixed top-0 z-3'>
      <button className='text-white bg-gray-800 px-3 py-2 text-[13px] font-poppins hover:bg-gray-700 rounded-lg cursor-pointer relative left-[75%]  transition-colors duration-150 ease-in-out flex items-center gap-1'>
        <img src={Plus} alt="plus" className='h-5 w-5 invert-100' />
        <p>Create Task</p>
      </button>
    </div>
  )
}

export default Topbar