import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/schemas/auth";
import { sendRegisterOtp, verifyRegisterOtp, registerUser } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Eye, EyeOff, Home } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, otpStatus } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      name: "",
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
    }
  });

  const emailValue = watch("email");
  const otpValue = watch("otp");

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOtp = async () => {
    const isValid = await trigger("email");
    if (!isValid) return;

    try {
      const result = await dispatch(sendRegisterOtp({ email: emailValue })).unwrap();
      toast.success(result.msg || "OTP sent to your email");
      setOtpSent(true);
      setResendTimer(30);
    } catch (error) {
      const errorMsg = error?.msg || error?.message || error || "Failed to send OTP";
      toast.error(errorMsg);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpValue || otpValue.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    try {
      const result = await dispatch(verifyRegisterOtp({ email: emailValue, otp: otpValue })).unwrap();
      toast.success(result.msg || "Email verified successfully");
      setEmailVerified(true);
    } catch (error) {
      const errorMsg = error?.msg || error?.message || error || "Invalid OTP";
      toast.error(errorMsg);
    }
  };

  const onSubmit = async (data) => {
    if (!emailVerified) {
      toast.error("Please verify your email first");
      return;
    }

    try {
      const registerData = {
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        confirmPassword: data.confirmPassword,
      };
      
      const result = await dispatch(registerUser(registerData)).unwrap();
      toast.success(result.msg || "Registration successful! Please login");
      navigate("/login");
    } catch (error) {
      const errorMsg = error?.msg || error?.message || error || "Registration failed";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 right-1/4 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Back to Home Button - Mobile Optimized */}
      <Link 
        to="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white/95 hover:bg-white text-amber-700 rounded-full shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm border border-amber-200 hover:scale-105 text-sm sm:text-base"
      >
        <Home className="w-4 h-4 sm:w-4 sm:h-4" />
        <span className="font-medium hidden xs:inline sm:inline">Back to Home</span>
        <span className="font-medium xs:hidden sm:hidden">Home</span>
      </Link>

      {/* Left Side - Enhanced Gradient Background with Curved Right Edge */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 relative rounded-r-[100px]">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="absolute top-1/4 left-1/4 opacity-10 animate-float">
          <BookOpen className="w-32 h-32 text-white" />
        </div>
        <div className="absolute bottom-1/4 right-1/4 opacity-10 animate-float" style={{ animationDelay: '2s' }}>
          <BookOpen className="w-24 h-24 text-white" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          <div className="mb-8 animate-scale-up">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl"></div>
              <BookOpen className="w-24 h-24 text-white drop-shadow-2xl relative z-10" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 text-center animate-fade-in-up">Join BookHive</h1>
          <p className="text-xl text-amber-100 text-center max-w-md italic animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Create your account and start your reading adventure
          </p>
          
          <div className="mt-16 flex gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="w-16 h-20 bg-white/20 rounded backdrop-blur-sm transform hover:scale-110 transition-transform duration-300"></div>
            <div className="w-16 h-20 bg-white/30 rounded backdrop-blur-sm translate-y-2 transform hover:scale-110 transition-transform duration-300"></div>
            <div className="w-16 h-20 bg-white/20 rounded backdrop-blur-sm transform hover:scale-110 transition-transform duration-300"></div>
          </div>

          <div className="absolute bottom-10 left-10 grid grid-cols-3 gap-2 opacity-30">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 overflow-y-auto relative min-h-screen lg:min-h-0">
        <div className="hidden sm:block absolute top-10 right-10 w-20 h-20 border-2 border-amber-200 rounded-full opacity-50"></div>
        <div className="hidden sm:block absolute bottom-10 left-10 w-16 h-16 border-2 border-amber-300 rounded-lg opacity-50 rotate-45"></div>

        <div className="w-full max-w-md py-8 relative z-10">
          <div className="lg:hidden flex justify-center mb-8 animate-scale-up">
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-6 rounded-full shadow-xl relative">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl"></div>
              <BookOpen className="w-12 h-12 text-amber-700 relative z-10" />
            </div>
          </div>

          <div className="text-center mb-6 sm:mb-8 animate-fade-in-up">
            <div className="inline-block mb-3 sm:mb-4">
              <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full mx-auto"></div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-2 bg-gradient-to-r from-amber-900 to-amber-700 bg-clip-text text-transparent">
              REGISTER
            </h2>
            <p className="text-sm sm:text-base text-stone-600 italic">Create your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="space-y-1.5 group">
              <Input
                type="text"
                placeholder="Full Name"
                autoComplete="name"
                {...register("name")}
                className="h-11 sm:h-12 bg-white border-2 border-stone-200 rounded-xl focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-200 transition-all duration-300 hover:border-amber-300 text-base"
              />
              {errors.name && <p className="text-xs sm:text-sm text-red-600 ml-2 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.name.message}
              </p>}
            </div>

            <div className="space-y-1.5 group">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  {...register("email")}
                  disabled={emailVerified}
                  className={`h-11 sm:h-12 bg-white border-2 rounded-xl focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-200 transition-all duration-300 hover:border-amber-300 text-base ${emailVerified ? 'bg-green-50 border-green-500' : 'border-stone-200'}`}
                />
                {!emailVerified && (
                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpStatus === "loading" || !emailValue || resendTimer > 0}
                    className="bg-amber-600 hover:bg-amber-700 text-white whitespace-nowrap px-4 sm:px-6 disabled:opacity-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
                  >
                    {resendTimer > 0 ? `${resendTimer}s` : otpSent ? "Resend" : "Verify"}
                  </Button>
                )}
                {emailVerified && (
                  <Button type="button" disabled className="bg-green-600 text-white whitespace-nowrap px-4 sm:px-6 rounded-xl shadow-md text-sm sm:text-base">
                    ✓ Verified
                  </Button>
                )}
              </div>
              {errors.email && <p className="text-xs sm:text-sm text-red-600 ml-2 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                {errors.email.message}
              </p>}
            </div>

            {otpSent && !emailVerified && (
              <div className="space-y-1.5 animate-fade-in-up group">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    {...register("otp")}
                    maxLength={6}
                    className="h-12 text-center tracking-widest text-lg font-mono bg-white border-2 border-stone-200 rounded-xl focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-200 transition-all duration-300 hover:border-amber-300"
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpStatus === "loading" || !otpValue || otpValue.length !== 6}
                    className="bg-amber-600 hover:bg-amber-700 text-white whitespace-nowrap px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {otpStatus === "loading" ? "..." : "Verify"}
                  </Button>
                </div>
                <p className="text-xs text-stone-600 italic ml-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-amber-600 rounded-full"></span>
                  Check your email for the 6-digit code
                </p>
              </div>
            )}

            {emailVerified && (
              <>
                <div className="space-y-1.5 animate-fade-in-up group">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      autoComplete="new-password"
                      {...register("password")}
                      className="h-12 pr-12 bg-white border-2 border-stone-200 rounded-xl focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-200 transition-all duration-300 hover:border-amber-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-600 ml-2 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.password.message}
                  </p>}
                </div>

                <div className="space-y-1.5 animate-fade-in-up group">
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                      {...register("confirmPassword")}
                      className="h-12 pr-12 bg-white border-2 border-stone-200 rounded-xl focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-200 transition-all duration-300 hover:border-amber-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-600 ml-2 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.confirmPassword.message}
                  </p>}
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 hover:from-amber-700 hover:via-amber-800 hover:to-amber-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] animate-fade-in-up relative overflow-hidden group"
                  disabled={status === "loading"}
                >
                  <span className="relative z-10">{status === "loading" ? "Creating Account..." : "CREATE ACCOUNT"}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </Button>
              </>
            )}
          </form>

          <div className="mt-6 sm:mt-8 text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-4 bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 text-stone-500">or</span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-stone-600 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-amber-700 hover:text-amber-800 font-semibold hover:underline transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
