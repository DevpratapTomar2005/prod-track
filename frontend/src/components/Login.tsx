
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";


interface LoginInputs {
  email: string;
  password: string;
}

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    
  } = useForm<LoginInputs>();

 

  const onSubmit: SubmitHandler<LoginInputs> = (data) => console.log(data);

  return (
    <div className="flex ">
      <div className="w-full  border-r border-gray-200  min-h-[calc(100vh-61px)]">
        <div className="m-10 mb-0">
          <h1 className="font-inter text-8xl font-bold text-neutral-800 px-3">
            Login!
          </h1>
          <div className="max-w-[280px] mx-1 h-3 bg-cyan-200"></div>
        </div>
        <div>
          <p className="text-xl mx-11 mt-5 tracking-wide font-poppins text-gray-500 font-light">
            Ready to crush your goals today?
          </p>
        </div>
        <div className="w-[250%] bg-gray-200 h-px  relative left-[-100%] z-0 mt-10"></div>
        <div className="w-full h-[300px] bg-[repeating-linear-gradient(45deg,transparent,transparent_15px,#e5e7eb_15px,#e5e7eb_16px)]"></div>
        <div className="w-[250%] bg-gray-200 h-px  relative left-[-100%] mb-10 z-0 "></div>
      </div>
      <div className="w-2/3 bg-white relative z-1">
        <div className="mx-10 mb-6 mt-15">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col my-2">
              <label
                htmlFor="email"
                className="text-lg font-inter font-semibold text-neutral-800"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="font-poppins appearance-none  focus:outline-none text-gray-500 placeholder:text-gray-600 ring-2 ring-slate-600 focus:ring-neutral-700 rounded-md p-2 focus:text-neutral-700 placeholder:text-sm transition-all duration-200 ease-in-out "
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="flex flex-col my-2">
              <label
                htmlFor="password"
                className="text-lg font-inter font-semibold text-neutral-800"
              >
                Password
              </label>

              <div className="relative mt-1">
                <input
                  type="password"
                  id="password"
                  placeholder="Enter password"
                  className="w-full font-poppins appearance-none focus:outline-none text-gray-500 placeholder:text-gray-600 ring-2 ring-slate-600 focus:ring-neutral-700 rounded-md p-2 pr-10 focus:text-neutral-700 placeholder:text-sm transition-all duration-200 ease-in-out"
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                      message:
                        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
                    },
                    minLength: {
                      value: 8,
                      message: "Minimum 8 characters are required",
                    },
                  })}
                />

                
              </div>

              {errors.password && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="w-full">
              <button
                type="submit"
                className="rounded-lg w-full bg-neutral-800 px-10 py-3 font-bold text-white cursor-pointer mt-5 shadow hover:bg-neutral-700 transition-colors duration-150 ease-in-out"
              >
                Submit
              </button>
            </div>
          </form>
          <div>
            <p className="text-sm mt-3 text-neutral-500 text-center">Or</p>
          </div>
          <div className="mt-3">
            <button className="group relative flex h-10 w-full max-w-[400px] cursor-pointer items-center justify-center overflow-hidden rounded-[4px] border border-[#747775] bg-white px-3 py-0 text-center font-roboto text-sm font-medium tracking-[0.25px] text-[#1f1f1f] outline-none transition-all duration-200 align-middle whitespace-nowrap disabled:opacity-50">
              <div className="absolute inset-0 transition-opacity duration-200 opacity-0 group-hover:bg-[#1f1f1f] group-hover:opacity-[0.08] group-active:bg-[#1f1f1f] group-active:opacity-[0.12]"></div>

              <div className="relative flex items-center justify-center">
                <div className="mr-3 h-5 w-5 min-w-[20px]">
                  <svg viewBox="0 0 48 48" className="block w-full h-full">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    ></path>
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    ></path>
                  </svg>
                </div>
                <span className="text-sm">Sign in with Google</span>
              </div>
            </button>
          </div>
        </div>
        <div className="w-[1000%] bg-gray-200 h-px mb-10 relative left-0"></div>
      </div>
    </div>
  );
};

export default Register;
