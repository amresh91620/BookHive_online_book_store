import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, BookOpen, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { loginSchema } from "@/schemas/auth";
import { loginUser } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error(error || "Login failed");
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
              Welcome to Your Literary Haven
            </h2>
            <p className="text-xl text-white/95 leading-relaxed mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Dive into a world of endless stories. BookHive brings you carefully curated collections, exclusive deals, and a seamless reading experience tailored just for you.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-lg">✓</span>
                </div>
                <span className="font-medium">Authentic Books</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-lg">✓</span>
                </div>
                <span className="font-medium">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-lg">✓</span>
                </div>
                <span className="font-medium">24/7 Support</span>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-sm sm:text-base text-gray-600">Sign in to continue your reading journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {/* Email Field */}
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
                  {...register("email")}
                  className="h-11 sm:h-12 rounded-xl border-gray-200 bg-white pl-10 sm:pl-12 text-sm sm:text-base focus:border-[#0b7a71] focus:ring-[#0b7a71]/20"
                />
              </div>
              {errors.email && (
                <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                  {errors.email.message}
                </p>
              )}
            </div>

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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register("password")}
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
              {errors.password && (
                <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs sm:text-sm font-medium text-[#0b7a71] hover:text-[#095f59] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={status === "loading"}
              className="h-11 sm:h-12 w-full rounded-xl bg-gradient-to-r from-[#0b7a71] to-[#0d8a7f] hover:from-[#095f59] hover:to-[#0b7a71] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {status === "loading" ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6 sm:my-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-4 bg-gradient-to-br from-white to-[#f7f5ef] text-gray-500">
                New to BookHive?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0b7a71] hover:text-[#095f59] transition-colors"
            >
              Create an account
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
