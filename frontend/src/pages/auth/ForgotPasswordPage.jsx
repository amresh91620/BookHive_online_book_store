import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendOtpSchema, resetPasswordSchema } from "@/schemas/auth";
import { sendForgotPasswordOtp, resetPassword } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ArrowLeft, KeyRound, Home } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { passwordStatus } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & Password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Email form
  const emailForm = useForm({
    resolver: zodResolver(sendOtpSchema),
    defaultValues: { email: "" }
  });

  // Reset password form
  const resetForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    }
  });

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOtp = async (data) => {
    try {
      await dispatch(sendForgotPasswordOtp(data)).unwrap();
      toast.success("OTP sent to your email");
      setEmail(data.email);
      setStep(2);
      setResendTimer(30);
    } catch (error) {
      const errorMsg = error?.msg || error?.message || error || "Failed to send OTP";
      toast.error(errorMsg);
    }
  };

  const handleResendOtp = async () => {
    try {
      await dispatch(sendForgotPasswordOtp({ email })).unwrap();
      toast.success("OTP resent to your email");
      setResendTimer(30);
    } catch (error) {
      const errorMsg = error?.msg || error?.message || error || "Failed to resend OTP";
      toast.error(errorMsg);
    }
  };

  const handleResetPassword = async (data) => {
    try {
      await dispatch(resetPassword({ email, ...data })).unwrap();
      toast.success("Password reset successful! Please login");
      navigate("/login");
    } catch (error) {
      const errorMsg = error?.msg || error?.message || error || "Password reset failed";
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
          <KeyRound className="w-32 h-32 text-white" />
        </div>
        <div className="absolute bottom-1/4 right-1/4 opacity-10 animate-float" style={{ animationDelay: '2s' }}>
          <KeyRound className="w-24 h-24 text-white" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          <div className="mb-8 animate-scale-up">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl"></div>
              <KeyRound className="w-24 h-24 text-white drop-shadow-2xl relative z-10" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 text-center animate-fade-in-up">Reset Password</h1>
          <p className="text-xl text-amber-100 text-center max-w-md italic animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Don't worry, we'll help you get back to your account
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

      {/* Right Side - Reset Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 relative min-h-screen lg:min-h-0">
        <div className="hidden sm:block absolute top-10 right-10 w-20 h-20 border-2 border-amber-200 rounded-full opacity-50"></div>
        <div className="hidden sm:block absolute bottom-10 left-10 w-16 h-16 border-2 border-amber-300 rounded-lg opacity-50 rotate-45"></div>

        <div className="w-full max-w-md relative z-10 py-8 sm:py-0">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8 animate-scale-up">
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-6 rounded-full shadow-xl relative">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl"></div>
              <KeyRound className="w-12 h-12 text-amber-700 relative z-10" />
            </div>
          </div>

          {/* Back to Login */}
          <Link 
            to="/login"
            className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 mb-6 font-medium transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 animate-fade-in-up">
            <div className="inline-block mb-3 sm:mb-4">
              <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full mx-auto"></div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-2 bg-gradient-to-r from-amber-900 to-amber-700 bg-clip-text text-transparent">
              {step === 1 ? "FORGOT PASSWORD" : "RESET PASSWORD"}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 italic">
              {step === 1 
                ? "Enter your email to receive OTP" 
                : "Enter OTP and new password"}
            </p>
          </div>

          {/* Step 1: Email Form */}
          {step === 1 && (
            <form onSubmit={emailForm.handleSubmit(handleSendOtp)} className="space-y-5 sm:space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="space-y-2 group">
                <Input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  {...emailForm.register("email")}
                  className="h-12 sm:h-14 bg-white border-2 border-stone-200 rounded-xl focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-200 text-base sm:text-lg transition-all duration-300 hover:border-amber-300"
                />
                {emailForm.formState.errors.email && (
                  <p className="text-xs sm:text-sm text-red-600 ml-2 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 sm:h-14 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 hover:from-amber-700 hover:via-amber-800 hover:to-amber-700 text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group"
                disabled={passwordStatus === "loading"}
              >
                <span className="relative z-10">{passwordStatus === "loading" ? "Sending..." : "SEND OTP"}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Button>
            </form>
          )}

          {/* Step 2: OTP & Password Form */}
          {step === 2 && (
            <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {/* Email Display */}
              <div className="space-y-2">
                <Input
                  type="email"
                  value={email}
                  disabled
                  className="h-12 bg-stone-100 border-2 border-stone-200 rounded-xl text-stone-600 cursor-not-allowed"
                />
              </div>

              {/* OTP Field */}
              <div className="space-y-2 group">
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  {...resetForm.register("otp")}
                  maxLength={6}
                  className="h-12 text-center tracking-widest text-lg font-mono bg-white border-2 border-stone-200 rounded-xl focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-200 transition-all duration-300 hover:border-amber-300"
                />
                {resetForm.formState.errors.otp && (
                  <p className="text-sm text-red-600 ml-2 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {resetForm.formState.errors.otp.message}
                  </p>
                )}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || passwordStatus === "loading"}
                    className="text-sm text-amber-700 hover:text-amber-800 hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : "Resend OTP"}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2 group">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    autoComplete="new-password"
                    {...resetForm.register("password")}
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
                {resetForm.formState.errors.password && (
                  <p className="text-sm text-red-600 ml-2 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {resetForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2 group">
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    {...resetForm.register("confirmPassword")}
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
                {resetForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600 ml-2 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                    {resetForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-12 border-2 border-stone-300 text-stone-700 hover:bg-stone-100 rounded-xl transition-all duration-300"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 hover:from-amber-700 hover:via-amber-800 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group"
                  disabled={passwordStatus === "loading"}
                >
                  <span className="relative z-10">{passwordStatus === "loading" ? "Resetting..." : "RESET"}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </Button>
              </div>
            </form>
          )}

          {/* Login Link */}
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
              Remember your password?{" "}
              <Link to="/login" className="text-amber-700 hover:text-amber-800 font-semibold hover:underline transition-colors">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

