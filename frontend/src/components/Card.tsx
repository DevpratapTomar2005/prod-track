import CircleRight from "../assets/circle_right.svg";
import CircleArrowRight from "../assets/circle_arrow_right.svg";
import { Link } from "react-router";

interface CardProps {
  perks: string[];
  title: string;
  subtitle: string;
  buttonText: string;
  img: string;
  btnLink?: string;
}

const Card = ({
  perks,
  title,
  subtitle,
  buttonText,
  img,
  btnLink,
}: CardProps) => {
 

  return (
    <div className="w-full h-full  p-2 mx-auto mt-12 ">
      <div className="flex items-center gap-2 justify-center">
        <img src={img} alt={title} className="h-12 w-12" />
        <h2 className="text-4xl font-bold text-neutral-800 text-center font-inter tracking-wide">
          {title}
        </h2>
      </div>
      <div className="text-center text-neutral-500 mt-3 tracking-wider text-md">
        <p>{subtitle}</p>
      </div>
      <div className={`font-poppins flex flex-col  items-start gap-6 mt-10 w-[450px] h-[400px] ${perks.length > 7? "mask-b-from-0.5":""} mx-auto`}>
        {perks.map((perk, index) => (
          <div className="flex justify-center items-start gap-3" key={index}>
            <img src={CircleRight} alt="Circle Right" className="h-5 w-5" />
            <p className="text-md text-neutral-600">{perk}</p>
          </div>
        ))}
      </div>
      <div className="my-7 mt-15 px-6">
        <Link to={btnLink || "#"} className="flex justify-center">
        <button className="group w-full relative overflow-hidden rounded-full bg-neutral-800 px-10 mx-15 py-3 font-bold text-white transition-colors duration-400 cursor-pointer hover:outline-1 hover:outline-neutral-800 shadow">
          
          <span className="absolute left-1/2 top-[100%] z-0 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-200 transition-all duration-400 ease-out group-hover:top-1/2 group-hover:-translate-y-1/2 group-hover:scale-[2.5]"></span>

        
          <span className="relative z-10 transition-colors duration-500 group-hover:text-neutral-800 group font-inter tracking-wide flex items-center justify-center gap-2">
            <span>{buttonText}</span><img src={CircleArrowRight} alt="Circle Arrow Right" className="h-5 w-5 group-hover:invert-100" />
          </span>
        </button>
        </Link>
      </div>
    </div>
  );
};

export default Card;
