import React from "react";
import { X, Mail, Lock, User, BookOpenCheck, ArrowRight } from "lucide-react";

const AuthModal = ({ isOpen, onClose, type, setType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Premium Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Main Modal Container */}
      <div className="bg-white w-full max-w-[850px] min-h-[550px] rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row transform transition-all animate-in zoom-in-95 duration-300">
        
        {/* CLOSE BUTTON (Mobile & Desktop) */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 z-20 text-gray-400 hover:text-slate-900 transition-colors p-1 hover:bg-slate-100 rounded-full"
        >
          <X size={24} />
        </button>

        {/* LEFT SIDE: Brand & Info (Visible on Desktop) */}
        <div className="hidden md:flex w-2/5 bg-gradient-to-br from-blue-700 to-indigo-900 p-12 text-white flex-col justify-between relative overflow-hidden">
          {/* Background Decorative Circle */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <BookOpenCheck className="text-white" size={28} />
              </div>
              <span className="text-2xl font-bold tracking-tight">BookHive</span>
            </div>
            
            <h2 className="text-4xl font-extrabold leading-tight mb-4">
              {type === "login" ? "Welcome Back to the Hive!" : "Start Your Reading Journey."}
            </h2>
            <p className="text-blue-100 text-lg">
              {type === "login" 
                ? "Login to access your personalized library and saved collections." 
                : "Join thousands of book lovers and manage your reading list effectively."}
            </p>
          </div>

        </div>

        {/* RIGHT SIDE: Auth Form */}
        <div className="flex-1 p-8 md:p-14 bg-white flex flex-col justify-center">
          <div className="mb-10">
            <h3 className="text-3xl font-bold text-slate-900 mb-2">
              {type === "login" ? "Sign In" : "Create Account"}
            </h3>
            <p className="text-slate-500">
              {type === "login" ? "New here?" : "Already a member?"}{" "}
              <button 
                onClick={() => setType(type === "login" ? "register" : "login")}
                className="text-blue-600 font-bold hover:underline ml-1"
              >
                {type === "login" ? "Create an account" : "Log in to your account"}
              </button>
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {type === "register" && (
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                {type === "login" && (
                  <button className="text-xs text-blue-600 hover:underline font-medium">Forgot password?</button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group transition-all active:scale-[0.98] mt-4">
              {type === "login" ? "Sign In" : "Register Now"}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;