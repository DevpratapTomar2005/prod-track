

const Hero = () => {
  return (
    <div className="mt-30 w-full">
      <div className="max-[400px]:h-[45vh] max-[600px]:h-[50vh] h-[70vh]">
        <div>
          <h1 className="max-[400px]:text-4xl max-[600px]:text-5xl text-7xl font-inter font-[1000] text-neutral-800 text-center max-[600px]:max-w-[400px] max-w-[500px] sm:w-full lg:w-[55%] mx-auto max-[400px]:leading-10 max-[600px]:leading-13 leading-18 tracking-tight text-shadow-md">
            Stop Counting Hours.
          </h1>
          <h1 className="max-[400px]:text-4xl max-[600px]:text-5xl text-7xl font-inter font-[1000] text-neutral-800 text-center mx-auto mt-1 tracking-tight text-shadow-md max-[800px]:mx-5">
            Start Scoring Days.
          </h1>
        </div>
        <div className="max-[600px]:mx-10 max-[800px]:mx-20 mx-auto max-w-[648px] h-3 bg-cyan-200"></div>
        <div className="mt-10 max-w-[500px] lg:w-[50%] max-[600px]:mx-5 max-[400px]:mt-5 mx-auto text-gray-500 font-poppins">
          <p className="max-[400px]:text-[12px] max-[600px]:text-sm text-xl text-center tracking-wide">
            Our productivity tracking app helps you stay focused, manage your
            time effectively, and achieve your goals with ease.
          </p>
        </div>
      </div>
      <div className="w-[1000%] bg-gray-200 h-px my-10 relative left-[-10%]"></div>
    </div>
  );
}

export default Hero
