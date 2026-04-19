import HeroInputIcon from '../assets/hero-input-icon.svg';
import Play from '../assets/play.svg';
const Hero = () => {
  return (
    <div className="mt-30 w-full">
        <div className="mt-35">
            <div >
                <h1 className="text-7xl font-inter font-[1000] text-neutral-800 text-center w-[55%] mx-auto leading-18 tracking-tight text-shadow-md">Stop Counting Hours.</h1>
                <h1 className="text-7xl font-inter font-[1000] text-neutral-800 text-center mx-auto mt-1 tracking-tight text-shadow-md">Start Scoring Days.</h1>
            </div>
            <div className="mx-auto max-w-[648px] h-3 bg-cyan-200"></div>
            <div className="mt-10 max-w-[50%] mx-auto text-gray-500 font-poppins">
                <p className="text-xl text-center tracking-wide">Our productivity tracking app helps you stay focused, manage your time effectively, and achieve your goals with ease.</p>
            </div>
        </div>
        <div className="border border-cyan-300 rounded w-fit flex justify-center items-center gap-2 my-15 p-2 mx-auto ring-3 ring-cyan-50">
            <div>
                <img src={HeroInputIcon} alt="Hero Input Icon"  className='h-6 w-6 '/>
            </div>
            <div>
                <input type="text" className='p-2 w-80 appearance-none focus:outline-none text-gray-500 placeholder:text-gray-400 font-bold font-inter' placeholder='What are you working on?' />
            </div>
            <div>
                <button className="bg-cyan-400 text-white px-4 py-2 text-md flex items-center gap-2 cursor-pointer hover:bg-cyan-500 transition-all duration-250 ease-in-out shadow"> <img src={Play} alt="Play Icon"  className='h-4 w-4'/>Start Timer</button>
            </div>
        </div>
        <div className='w-[1000%] bg-gray-200 h-px mb-10 relative left-[-10%]'></div>
    </div>
  )
}

export default Hero
