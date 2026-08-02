import { useRef, useState, useEffect, Fragment } from "react";

const TOTAL_DIGITS = 6;

const VerifyOTP = () => {
  const [otp, setOtp] = useState<string[]>(Array(TOTAL_DIGITS).fill(""));
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer === 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const updated = [...otp];
    updated[index] = digit;
    setOtp(updated);
    if (digit && index < TOTAL_DIGITS - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const updated = [...otp];
        updated[index] = "";
        setOtp(updated);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0)
      inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < TOTAL_DIGITS - 1)
      inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, TOTAL_DIGITS);
    const updated = Array(TOTAL_DIGITS).fill("");
    pasted.split("").forEach((char, i) => (updated[i] = char));
    setOtp(updated);
    const focusIndex = Math.min(pasted.length, TOTAL_DIGITS - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = () => {
    if (otp.join("").length < TOTAL_DIGITS) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    console.log("OTP submitted:", otp.join(""));
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(Array(TOTAL_DIGITS).fill(""));
    setResendTimer(30);
    setCanResend(false);
    inputRefs.current[0]?.focus();
    console.log("OTP resent");
  };

  const isFilled = otp.join("").length === TOTAL_DIGITS;

  return (
    <div className="flex justify-center max-[700px]:flex-col max-[700px]:min-h-screen max-[1050px]:justify-between">
      <div className="w-[30%] border-r border-gray-200 min-h-[calc(100vh-61px)] bg-[repeating-linear-gradient(45deg,transparent,transparent_15px,#e5e7eb_15px,#e5e7eb_16px)] max-[700px]:w-full max-[700px]:min-h-[80px] max-[700px]:border-b max-[700px]:border-r-0 max-[800px]:w-[15%] max-[1050px]:w-[20%] max-[500px]:min-h-[80px] max-[350px]:min-h-[80px]"></div>

      <div className="w-[45%] max-[700px]:w-full max-[1050px]:w-[60%] bg-white relative z-1">
        <div className="mx-10 mb-6 mt-10 max-[700px]:max-w-[350px] max-[800px]:mx-auto max-[850px]:mx-7 max-[500px]:mx-4 max-[500px]:max-w-full max-[380px]:mx-3 max-[380px]:mt-6 max-[350px]:mx-2.5 max-[350px]:mt-4">
          <div className="mb-8 max-[380px]:mb-5 max-[350px]:mb-4">
            <h2 className="font-inter text-3xl font-bold text-neutral-800 mb-1 max-[500px]:text-2xl max-[380px]:text-xl max-[350px]:text-lg">
              Check your inbox
            </h2>
            <p className="font-poppins text-gray-500 text-sm leading-relaxed max-[500px]:text-xs max-[380px]:text-[11px] max-[380px]:leading-snug max-[350px]:text-[10px]">
              We sent a 6-digit code to your email address.
              <br />
              Enter it below to verify your account.
            </p>
          </div>

          <div className="mb-2">
            <label className="text-lg font-inter font-semibold text-neutral-800 block mb-3 max-[500px]:text-base max-[380px]:text-sm max-[380px]:mb-2 max-[350px]:text-xs max-[350px]:mb-1.5">
              One-Time Password
            </label>
            <div
              className={`flex items-center gap-2 max-[500px]:w-full max-[380px]:gap-1 max-[350px]:gap-0.5 ${shake ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
              onPaste={handlePaste}
              style={
                shake
                  ? {
                      animation: "shake 0.4s ease-in-out",
                    }
                  : {}
              }
            >
              {Array.from({ length: TOTAL_DIGITS }).map((_, i) => (
                <Fragment key={i}>
                  {i === 3 && (
                    <span className="text-gray-300 font-light text-2xl select-none shrink-0 max-[500px]:text-lg max-[380px]:text-base max-[350px]:text-sm">
                      —
                    </span>
                  )}
                  <input
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[i]}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`
                      h-14 w-12 text-center text-xl font-bold font-inter shrink-0
                      max-[500px]:h-auto max-[500px]:w-auto max-[500px]:flex-1
                      max-[500px]:aspect-square max-[500px]:shrink
                      max-[500px]:max-w-[48px] max-[500px]:min-w-[38px]
                      max-[500px]:text-base max-[380px]:text-sm
                      max-[350px]:min-w-[32px] max-[350px]:text-xs
                      appearance-none focus:outline-none
                      text-neutral-800 placeholder:text-gray-300
                      ring-2 rounded-md
                      transition-all duration-200 ease-in-out
                      ${
                        otp[i]
                          ? "ring-cyan-400 bg-cyan-50 text-cyan-600"
                          : "ring-slate-300 focus:ring-neutral-700 bg-white"
                      }
                    `}
                    placeholder="·"
                  />
                </Fragment>
              ))}
            </div>
          </div>

          <div className="flex gap-1 mb-8 mt-3 max-[380px]:mb-5 max-[380px]:mt-2 max-[350px]:mb-4 max-[350px]:mt-1.5 max-[350px]:gap-0.5">
            {Array.from({ length: TOTAL_DIGITS }).map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ease-in-out ${
                  otp[i]
                    ? "w-6 bg-cyan-400 max-[380px]:w-4 max-[350px]:w-3"
                    : "w-3 bg-gray-200 max-[380px]:w-2 max-[350px]:w-1.5"
                }`}
              />
            ))}
          </div>

          <div className="w-full mb-4">
            <button
              onClick={handleVerify}
              className={`
                rounded-lg w-full px-10 py-3 font-bold font-inter text-white cursor-pointer shadow
                transition-colors duration-150 ease-in-out max-[800px]:w-[360px] max-[800px]:mx-auto
                max-[500px]:w-full max-[500px]:px-4 max-[500px]:py-2.5 max-[500px]:text-sm
                max-[380px]:px-2 max-[380px]:py-2 max-[380px]:text-xs
                max-[350px]:px-1.5 max-[350px]:py-1.5 max-[350px]:text-[11px]
                ${
                  isFilled
                    ? "bg-neutral-800 hover:bg-neutral-700"
                    : "bg-neutral-300 cursor-not-allowed"
                }
              `}
            >
              Verify & Continue
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-neutral-500 font-poppins max-[500px]:text-xs max-[380px]:text-[11px] max-[350px]:text-[10px]">
              Didn't receive a code?{" "}
              <button
                onClick={handleResend}
                disabled={!canResend}
                className={`font-semibold transition-colors duration-150 ${
                  canResend
                    ? "text-cyan-500 hover:text-cyan-600 cursor-pointer"
                    : "text-gray-300 cursor-not-allowed"
                }`}
              >
                Resend
              </button>
              {!canResend && (
                <span className="text-gray-400 ml-1">in {resendTimer}s</span>
              )}
            </p>
          </div>
          <div className="mt-6 text-center max-[380px]:mt-4 max-[350px]:mt-3">
            <p className="text-sm text-neutral-500 font-poppins max-[500px]:text-xs max-[380px]:text-[11px] max-[350px]:text-[10px]">
              Wrong email?{" "}
              <a
                href="/register"
                className="font-semibold text-neutral-700 hover:text-neutral-900 underline underline-offset-2 transition-colors duration-150"
              >
                Go back & change it
              </a>
            </p>
          </div>
        </div>

        <div className="w-full bg-gray-200 h-px mb-10 relative left-0 max-[700px]:mb-0"></div>
      </div>
      <div className="w-[30%] border-l border-gray-200 min-h-[calc(100vh-61px)] bg-[repeating-linear-gradient(45deg,transparent,transparent_15px,#e5e7eb_15px,#e5e7eb_16px)] max-[700px]:w-full max-[700px]:min-h-[60px] max-[700px]:flex-1 max-[700px]:border-t max-[700px]:border-l-0 max-[800px]:w-[15%] max-[1050px]:w-[20%]"></div>

      {/* Shake keyframe injected inline */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};

export default VerifyOTP;
