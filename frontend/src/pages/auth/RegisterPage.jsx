import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  User,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { registerSchema } from "@/schemas/auth";
import {
  registerUser,
  sendRegisterOtp,
  verifyRegisterOtp,
} from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, otpStatus } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
    },
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
      const result = await dispatch(
        verifyRegisterOtp({ email: emailValue, otp: otpValue })
      ).unwrap();
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
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#d97642] via-[#e08a4f] to-[#d97642] p-12 items-center justify-center relative overflow-hidden">
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
              Join Our Reading Community
            </h2>
            <p className="text-xl text-white/95 leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Create your account and unlock access to thousands of books, exclusive deals, personalized recommendations, and a seamless shopping experience.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-lg">✓</span>
                </div>
                <span className="font-medium">Personalized Library</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-lg">✓</span>
                </div>
                <span className="font-medium">Exclusive Offers</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-lg">✓</span>
                </div>
                <span className="font-medium">Fast Delivery</span>
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
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#d97642] to-[#e08a4f] flex items-center justify-center">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-900">BookHive</span>
          </Link>

          {/* Header */}
          <div className="mb-6 sm:mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-sm sm:text-base text-gray-600">Join our reading community today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs sm:text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  autoComplete="name"
                  {...register("name")}
                  className="h-11 sm:h-12 rounded-xl border-gray-200 bg-white pl-10 sm:pl-12 text-sm sm:text-base focus:border-[#d97642] focus:ring-[#d97642]/20"
                />
              </div>
              {errors.name && (
                <p className="text-xs sm:text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs sm:text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    disabled={emailVerified}
                    {...register("email")}
                    className={`h-11 sm:h-12 rounded-xl bg-white pl-10 sm:pl-12 text-sm sm:text-base focus:border-[#d97642] focus:ring-[#d97642]/20 ${
                      emailVerified ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-gray-200"
                    }`}
                  />
                </div>
                {emailVerified ? (
                  <div className="inline-flex h-11 sm:h-12 items-center justify-center gap-2 rounded-xl bg-emerald-100 px-4 text-xs sm:text-sm font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Verified</span>
                  </div>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpStatus === "loading" || !emailValue || resendTimer > 0}
                    className="h-11 sm:h-12 rounded-xl bg-[#d97642] px-4 sm:px-6 text-xs sm:text-sm font-semibold text-white hover:bg-[#c26535]"
                  >
                    {resendTimer > 0 ? `${resendTimer}s` : otpSent ? "Resend" : "Send OTP"}
                  </Button>
                )}
              </div>
              {errors.email && (
                <p className="text-xs sm:text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* OTP Field */}
            {otpSent && !emailVerified && (
              <div className="rounded-xl border border-[#d8e6e1] bg-[#f7faf9] p-4">
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-xs sm:text-sm font-semibold text-gray-700">
                    Verification Code
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <KeyRound className="pointer-events-none absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        {...register("otp")}
                        className="h-11 sm:h-12 rounded-xl border-gray-200 bg-white pl-10 sm:pl-12 text-sm sm:text-base font-mono tracking-widest focus:border-[#d97642] focus:ring-[#d97642]/20"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otpStatus === "loading" || !otpValue || otpValue.length !== 6}
                      className="h-11 sm:h-12 rounded-xl bg-white px-4 sm:px-6 text-xs sm:text-sm font-semibold text-[#d97642] ring-1 ring-[#f5d9c8] hover:bg-[#fef3ed]"
                    >
                      Verify
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600">
                    Check your inbox for the verification code
                  </p>
                </div>
              </div>
            )}

            {/* Password Fields - Only show after email verification */}
            {emailVerified && (
              <>
                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-xs sm:text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      {...register("password")}
                      className="h-11 sm:h-12 rounded-xl border-gray-200 bg-white pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-base focus:border-[#d97642] focus:ring-[#d97642]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d97642] transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs sm:text-sm text-red-600">{errors.password.message}</p>
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
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      {...register("confirmPassword")}
                      className="h-11 sm:h-12 rounded-xl border-gray-200 bg-white pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-base focus:border-[#d97642] focus:ring-[#d97642]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d97642] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs sm:text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="h-11 sm:h-12 w-full rounded-xl bg-gradient-to-r from-[#d97642] to-[#e08a4f] hover:from-[#c26535] hover:to-[#d97642] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Account
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                  )}
                </Button>
              </>
            )}

            {/* Info Message */}
            {!emailVerified && (
              <div className="rounded-xl border border-[#d8e6e1] bg-[#f7faf9] p-4 text-xs sm:text-sm text-gray-600">
                Verify your email first to continue with password setup and account creation.
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="relative my-6 sm:my-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-4 bg-gradient-to-br from-white to-[#f7f5ef] text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#d97642] hover:text-[#c26535] transition-colors"
            >
              Sign in instead
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
