import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/auth";
import { loginUser } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Eye, EyeOff, Mail, Lock, Home } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
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
        {/* Animated decorative circles */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Floating book icons */}
        <div className="absolute top-1/4 left-1/4 opacity-10 animate-float">
          <BookOpen className="w-32 h-32 text-white" />
        </div>
        <div className="absolute bottom-1/4 right-1/4 opacity-10 animate-float" style={{ animationDelay: '2s' }}>
          <BookOpen className="w-24 h-24 text-white" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
          <div className="mb-8 animate-scale-up">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl"></div>
              <BookOpen className="w-24 h-24 text-white drop-shadow-2xl relative z-10" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 text-center animate-fade-in-up">Welcome Back</h1>
          <p className="text-xl text-amber-100 text-center max-w-md italic animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Sign in to continue your reading journey with BookHive
          </p>
          
          {/* Enhanced decorative book stack */}
          <div className="mt-16 flex gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="w-16 h-20 bg-white/20 rounded backdrop-blur-sm transform hover:scale-110 transition-transform duration-300"></div>
            <div className="w-16 h-20 bg-white/30 rounded backdrop-blur-sm translate-y-2 transform hover:scale-110 transition-transform duration-300"></div>
            <div className="w-16 h-20 bg-white/20 rounded backdrop-blur-sm transform hover:scale-110 transition-transform duration-300"></div>
          </div>

          {/* Decorative dots pattern */}
          <div className="absolute bottom-10 left-10 grid grid-cols-3 gap-2 opacity-30">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 relative min-h-screen lg:min-h-0">
        {/* Decorative elements - hidden on small mobile */}
        <div className="hidden sm:block absolute top-10 right-10 w-20 h-20 border-2 border-amber-200 rounded-full opacity-50"></div>
        <div className="hidden sm:block absolute bottom-10 left-10 w-16 h-16 border-2 border-amber-300 rounded-lg opacity-50 rotate-45"></div>

        <div className="w-full max-w-md relative z-10 py-8 sm:py-0">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8 animate-scale-up">
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-6 rounded-full shadow-xl relative">
              <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl"></div>
              <BookOpen className="w-12 h-12 text-amber-700 relative z-10" />
            </div>
          </div>

          {/* Login Header */}
          <div className="text-center mb-6 sm:mb-8 animate-fade-in-up">
            <div className="inline-block mb-3 sm:mb-4">
              <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full mx-auto"></div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-2 bg-gradient-to-r from-amber-900 to-amber-700 bg-clip-text text-transparent">
              LOGIN
            </h2>
            <p className="text-sm sm:text-base text-stone-600 italic">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* Email Field */}
            <div className="space-y-2 group">
              <div className="relative">
                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-amber-600 transition-colors" />
                <Input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  {...register("email")}
                  className="pl-10 sm:pl-12 h-12 sm:h-14 bg-white border-2 border-stone-200 rounded-xl focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-200 text-base sm:text-lg transition-all duration-300 hover:border-amber-300"
                />
              </div>
              {errors.email && (
                <p className="text-xs sm:text-sm text-red-600 ml-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2 group">
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-amber-600 transition-colors" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="current-password"
                  {...register("password")}
                  className="pl-10 sm:pl-12 pr-10 sm:pr-12 h-12 sm:h-14 bg-white border-2 border-stone-200 rounded-xl focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-200 text-base sm:text-lg transition-all duration-300 hover:border-amber-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs sm:text-sm text-red-600 ml-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                to="/forgot-password" 
                className="text-xs sm:text-sm text-amber-700 hover:text-amber-800 hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 hover:from-amber-700 hover:via-amber-800 hover:to-amber-700 text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group"
              disabled={status === "loading"}
            >
              <span className="relative z-10">{status === "loading" ? "Signing in..." : "LOGIN"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Button>
          </form>

          {/* Register Link */}
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
              Don't have an account?{" "}
              <Link to="/register" className="text-amber-700 hover:text-amber-800 font-semibold hover:underline transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

