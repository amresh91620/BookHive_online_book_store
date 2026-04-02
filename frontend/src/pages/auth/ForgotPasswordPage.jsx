import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound, Lock, Mail, BookOpen, ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { sendOtpSchema, resetPasswordSchema } from "@/schemas/auth";
import { resetPassword, sendForgotPasswordOtp } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { passwordStatus } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const emailForm = useForm({
    resolver: zodResolver(sendOtpSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
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
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#0b7a71] via-[#0d8a7f] to-[#0b7a71] p-12 items-center justify-center relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#deb05a]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        {/* Back to Home Button - Top Left */}
        <Link 
          to="/" 
          className="absolute top-8 left-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all text-white"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
        
        <div className="relative z-10 max-w-lg text-white">
          <div className="mb-8">
            <h2 className="text-5xl font-bold mb-6 leading-tight animate-fade-in-up">
              Recover Your Account
            </h2>
            <p className="text-xl text-white/95 leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Don't worry! It happens to the best of us. Enter your email and we'll send you a verification code to reset your password and get you back to reading.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-lg">✓</span>
                </div>
                <span className="font-medium">Secure Process</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-lg">✓</span>
                </div>
                <span className="font-medium">Quick Recovery</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-lg">✓</span>
                </div>
                <span className="font-medium">Email Verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-white to-[#f7f5ef]">
        {/* Mobile Back Button - Top */}
        <div className="lg:hidden p-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all text-gray-700 text-xs font-medium"
          >
            <ArrowRight className="w-3 h-3 rotate-180" />
            <span>Back</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-6 sm:mb-8 animate-fade-in-up">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#0b7a71] to-[#0d8a7f] flex items-center justify-center">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-900">BookHive</span>
          </Link>

          {/* Header */}
          <div className="mb-6 sm:mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {step === 1 ? "Forgot Password?" : "Reset Password"}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {step === 1 
                ? "Enter your email to receive a verification code" 
                : "Enter the code and create a new password"}
            </p>
          </div>

          {/* Step 1: Email Form */}
          {step === 1 ? (
            <form onSubmit={emailForm.handleSubmit(handleSendOtp)} className="space-y-4 sm:space-y-5 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs sm:text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    {...emailForm.register("email")}
                    className="h-11 sm:h-12 rounded-xl border-gray-200 bg-white pl-10 sm:pl-12 text-sm sm:text-base focus:border-[#0b7a71] focus:ring-[#0b7a71]/20"
                  />
                </div>
                {emailForm.formState.errors.email && (
                  <p className="text-xs sm:text-sm text-red-600">{emailForm.formState.errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={passwordStatus === "loading"}
                className="h-11 sm:h-12 w-full rounded-xl bg-gradient-to-r from-[#0b7a71] to-[#0d8a7f] hover:from-[#095f59] hover:to-[#0b7a71] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {passwordStatus === "loading" ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending code...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send Verification Code
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                )}
              </Button>
            </form>
          ) : (
            /* Step 2: Reset Password Form */
            <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-4 sm:space-y-5 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              {/* Change Email Link */}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#0b7a71] hover:text-[#095f59] transition-colors"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                Change email
              </button>

              {/* Email Info */}
              <div className="rounded-xl border border-[#d8e6e1] bg-[#f7faf9] p-4 text-xs sm:text-sm text-gray-600">
                Verification code sent to <span className="font-semibold text-gray-900">{email}</span>
              </div>

              {/* OTP Field */}
              <div className="space-y-2">
                <label htmlFor="otp" className="text-xs sm:text-sm font-semibold text-gray-700">
                  Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    {...resetForm.register("otp")}
                    className="h-11 sm:h-12 rounded-xl border-gray-200 bg-white pl-10 sm:pl-12 text-sm sm:text-base font-mono tracking-widest focus:border-[#0b7a71] focus:ring-[#0b7a71]/20"
                  />
                </div>
                {resetForm.formState.errors.otp && (
                  <p className="text-xs sm:text-sm text-red-600">{resetForm.formState.errors.otp.message}</p>
                )}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || passwordStatus === "loading"}
                    className="text-xs sm:text-sm font-medium text-[#0b7a71] hover:text-[#095f59] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-xs sm:text-sm font-semibold text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a new password"
                    autoComplete="new-password"
                    {...resetForm.register("password")}
                    className="h-11 sm:h-12 rounded-xl border-gray-200 bg-white pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-base focus:border-[#0b7a71] focus:ring-[#0b7a71]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0b7a71] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
                {resetForm.formState.errors.password && (
                  <p className="text-xs sm:text-sm text-red-600">{resetForm.formState.errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-xs sm:text-sm font-semibold text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your new password"
                    autoComplete="new-password"
                    {...resetForm.register("confirmPassword")}
                    className="h-11 sm:h-12 rounded-xl border-gray-200 bg-white pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-base focus:border-[#0b7a71] focus:ring-[#0b7a71]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0b7a71] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
                {resetForm.formState.errors.confirmPassword && (
                  <p className="text-xs sm:text-sm text-red-600">{resetForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={passwordStatus === "loading"}
                className="h-11 sm:h-12 w-full rounded-xl bg-gradient-to-r from-[#0b7a71] to-[#0d8a7f] hover:from-[#095f59] hover:to-[#0b7a71] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {passwordStatus === "loading" ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Resetting password...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Reset Password
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                )}
              </Button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-6 sm:my-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-4 bg-gradient-to-br from-white to-[#f7f5ef] text-gray-500">
                Remember your password?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0b7a71] hover:text-[#095f59] transition-colors"
            >
              Back to login
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
