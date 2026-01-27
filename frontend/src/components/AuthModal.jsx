import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  BookOpenCheck,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthModal = ({ isOpen, onClose, type, setType }) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let data;

      if (type === "login") {
        data = await login({ email: form.email, password: form.password });
      } else {
        data = await register({
          name: form.name,
          email: form.email,
          password: form.password,
        });
      }

      // Success Toast
      toast.success(
        type === "login"
          ? `Welcome back, ${data.user.name}!`
          : "Registration Successful!",
      );

      onClose(); // Close modal
      setForm({ email: "", password: "", name: "" });

      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Authentication Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white w-full max-w-[850px] min-h-[550px] rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 text-gray-400 hover:text-slate-900 transition-colors p-1 hover:bg-slate-100 rounded-full"
        >
          <X size={24} />
        </button>

        {/* Left Section */}
        <div className="hidden md:flex w-2/5 bg-gradient-to-br from-blue-700 to-indigo-900 p-12 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <BookOpenCheck className="text-white" size={28} />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                BookHive
              </span>
            </div>
            <h2 className="text-4xl font-extrabold leading-tight mb-4">
              {type === "login"
                ? "Welcome Back to the Hive!"
                : "Start Your Reading Journey."}
            </h2>
            <p className="text-blue-100 opacity-80">
              {type === "login"
                ? "Join the community and pick up where you left off."
                : "Manage your library and discover your next favorite book."}
            </p>
          </div>
        </div>

        {/* Right Section: Form */}
        <div className="flex-1 p-8 md:p-14 bg-white flex flex-col justify-center">
          <h3 className="text-3xl font-bold text-slate-900 mb-2">
            {type === "login" ? "Sign In" : "Create Account"}
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {type === "register" && (
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"
                    size={20}
                  />
                  <input
                    required
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"
                  size={20}
                />
                <input
                  required
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>
                {type === "login" && (
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"
                  size={20}
                />
                <input
                  required
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {type === "login" ? "Sign In" : "Register Now"}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>
          <div className="mt-5">
            <p className="text-slate-500">
              {type === "login" ? "New here?" : "Already a member?"}{" "}
              <button
                type="button"
                onClick={() => setType(type === "login" ? "register" : "login")}
                className="text-blue-600 font-bold hover:underline ml-1"
              >
                {type === "login"
                  ? "Create an account"
                  : "Log in to your account"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
