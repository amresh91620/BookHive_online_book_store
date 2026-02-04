import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  BookOpenCheck,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthModal = ({ isOpen, onClose, type, setType }) => {
  const navigate = useNavigate();
  const {
    login,
    register,
    sendRegisterOtp,
    verifyRegisterOtp,
    sendForgotPasswordOtp,
    resetPassword,
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [registerResendTimer, setRegisterResendTimer] = useState(0);
  const registerOtpRefs = useRef([]);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStage, setForgotStage] = useState("email");
  const [forgotForm, setForgotForm] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotResendTimer, setForgotResendTimer] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);
  const forgotOtpRefs = useRef([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleForgotChange = (e) => {
    setForgotForm({ ...forgotForm, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextOtp = otp.split("");
    while (nextOtp.length < 6) nextOtp.push("");
    nextOtp[index] = digit;
    const joined = nextOtp.join("").trimEnd();
    setOtp(joined);
    if (digit && registerOtpRefs.current[index + 1]) {
      registerOtpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && registerOtpRefs.current[index - 1]) {
      registerOtpRefs.current[index - 1].focus();
    }
  };

  const handleForgotOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextOtp = forgotForm.otp.split("");
    while (nextOtp.length < 6) nextOtp.push("");
    nextOtp[index] = digit;
    const joined = nextOtp.join("").trimEnd();
    setForgotForm({ ...forgotForm, otp: joined });
    if (digit && forgotOtpRefs.current[index + 1]) {
      forgotOtpRefs.current[index + 1].focus();
    }
  };

  const handleForgotOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !forgotForm.otp[index] && forgotOtpRefs.current[index - 1]) {
      forgotOtpRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    if (registerResendTimer <= 0) return;
    const timer = setInterval(() => {
      setRegisterResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [registerResendTimer]);

  useEffect(() => {
    if (forgotResendTimer <= 0) return;
    const timer = setInterval(() => {
      setForgotResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [forgotResendTimer]);

  // --- OTP Logic (Register) ---
  const handleSendOtp = async () => {
    if (!form.email) return toast.error("Please enter email first");
    if (registerResendTimer > 0) return;
    setLoading(true);
    try {
      await sendRegisterOtp(form.email);
      setOtpSent(true);
      setRegisterResendTimer(30);
      toast.success("OTP sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      await verifyRegisterOtp(form.email, otp);
      setIsVerified(true);
      toast.success("Email Verified!");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (type === "register") {
      if (!isVerified) return toast.error("Please verify your email first");
      if (form.password !== form.confirmPassword) return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      if (type === "login") {
        const data = await login(
          { email: form.email, password: form.password },
          rememberMe
        );
        toast.success(`Welcome back, ${data.user.name}!`);
        onClose();
        setForm({ email: "", password: "", confirmPassword: "", name: "" });
        data.user.role === "admin" ? navigate("/admin") : navigate("/");
      } else {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
        });
        toast.success("Registration Successful! Please login.");
        setForm({ ...form, password: "", confirmPassword: "" });
        setType("login");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Authentication Failed");
    } finally {
      setLoading(false);
    }
  };

  const openForgotModal = () => {
    setForgotForm({
      email: form.email || "",
      otp: "",
      password: "",
      confirmPassword: "",
    });
    setForgotStage("email");
    setForgotResendTimer(0);
    setShowForgotModal(true);
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotStage("email");
    setForgotResendTimer(0);
    setForgotForm({ email: "", otp: "", password: "", confirmPassword: "" });
    setShowForgotPassword(false);
    setShowForgotConfirmPassword(false);
  };

  const handleForgotSendOtp = async () => {
    if (!forgotForm.email) return toast.error("Please enter email first");
    if (forgotResendTimer > 0) return;
    setForgotLoading(true);
    try {
      await sendForgotPasswordOtp(forgotForm.email);
      setForgotStage("reset");
      setForgotResendTimer(30);
      toast.success("OTP sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to send OTP");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!forgotForm.otp) return toast.error("Please enter OTP");
    if (!forgotForm.password || forgotForm.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    if (forgotForm.password !== forgotForm.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setForgotLoading(true);
    try {
      await resetPassword({
        email: forgotForm.email,
        otp: forgotForm.otp,
        password: forgotForm.password,
        confirmPassword: forgotForm.confirmPassword,
      });
      toast.success("Password reset successful! Please login.");
      closeForgotModal();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Password reset failed");
    } finally {
      setForgotLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose}></div>

      <div className="bg-white w-full max-w-[780px] min-h-[480px] md:min-h-[540px] max-h-[88vh] md:max-h-none rounded-[24px] shadow-2xl shadow-slate-900/30 relative z-10 overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300 ring-1 ring-slate-200/70">
        <button onClick={onClose} className="absolute top-5 right-5 z-20 text-slate-400 hover:text-slate-900 transition-colors p-1 hover:bg-slate-100 rounded-full">
          <X size={24} />
        </button>

        {/* Left Section */}
        <div className="hidden md:flex w-1/3 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-15 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-24 -right-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-16 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-xs uppercase tracking-[0.2em] text-white/80">
              Classic Series
            </div>
            <div className="flex items-center gap-3 mt-6 mb-10">
              <div className="bg-white/15 p-3 rounded-2xl backdrop-blur-sm ring-1 ring-white/20">
                <BookOpenCheck className="text-white" size={28} />
              </div>
              <span className="text-2xl font-semibold tracking-wide font-serif">BookHive</span>
            </div>
            <h2 className="text-4xl font-semibold leading-tight mb-4 font-serif">
              {type === "login" ? "Welcome Back" : "Join the Hive"}
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              A refined reading journey, crafted with care.
            </p>
          </div>
        </div>

        {/* Right Section: Form */}
        <div className="flex-1 p-6 pt-10 md:p-15 bg-gradient-to-b from-white via-slate-50/60 to-white flex flex-col justify-center overflow-y-auto md:overflow-visible md:max-h-[82vh] min-h-0">
          <div className="mb-4 md:mb-6">
            <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-[0.2em]">
              Secure Access
              <span className="h-[1px] w-10 bg-slate-300"></span>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 mt-2 font-serif leading-tight">
            {type === "login" ? "Sign In" : "Create Account"}
            </h3>
          </div>

          <form className="space-y-2 md:space-y-2" onSubmit={handleSubmit}>
            {type === "register" && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 ml-1 uppercase tracking-wider">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input required name="name" type="text" value={form.name} onChange={handleChange} placeholder="John Doe" className="w-full pl-12 pr-4 py-2 md:py-2 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none transition-all shadow-sm" />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 ml-1 uppercase tracking-wider">Email Address</label>
              <div className="relative flex gap-2">
                <div className="relative flex-1 group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input required disabled={isVerified} name="email" type="email" value={form.email} onChange={handleChange} placeholder="name@example.com" className="w-full pl-12 pr-4 py-2 md:py-2 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none transition-all disabled:opacity-60 shadow-sm" />
                </div>
                {type === "register" && !isVerified && (
                  <button type="button" onClick={handleSendOtp} disabled={registerResendTimer > 0} className="px-3 bg-blue-50 text-blue-800 font-semibold rounded-2xl hover:bg-blue-100 disabled:opacity-60 transition-colors text-xs uppercase tracking-wider border border-blue-200">
                    {registerResendTimer > 0 ? `Resend in ${registerResendTimer}s` : (otpSent ? "Resend" : "Verify")}
                  </button>
                )}
              </div>
            </div>

            {/* OTP BOX - Only shows if OTP is sent and not yet verified */}
            {type === "register" && otpSent && !isVerified && (
              <div className="space-y-1 animate-in slide-in-from-top-2">
                <label className="text-xs font-semibold text-blue-700 ml-1 uppercase tracking-wider">Enter OTP</label>
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <div className="relative flex-1">
                    <ShieldCheck className="absolute -left-1 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
                    <div className="flex items-center gap-2 pl-6">
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (registerOtpRefs.current[idx] = el)}
                          inputMode="numeric"
                          maxLength={1}
                          value={otp[idx] || ""}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="h-9 w-8 md:h-12 md:w-11 text-center text-base font-semibold rounded-xl border border-blue-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-700 outline-none"
                        />
                      ))}
                    </div>
                  </div>
                  <button type="button" onClick={handleVerifyOtp} className="px-5 py-2.5 bg-blue-700 text-white font-semibold rounded-2xl hover:bg-blue-800 transition-colors text-xs uppercase tracking-wider shadow-lg shadow-blue-900/20">
                    Confirm
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Password</label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input required name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="********" className="w-full pl-12 pr-12 py-2 md:py-2 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none shadow-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-slate-900">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {type === "register" && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 ml-1 uppercase tracking-wider">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input required name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={form.confirmPassword} onChange={handleChange} placeholder="********" className="w-full pl-12 pr-12 py-2 md:py-2 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none shadow-sm" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-slate-900">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {type === "login" && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-700"
                  />
                  Keep me signed in
                </label>
                <button type="button" onClick={openForgotModal} className="text-xs font-semibold text-blue-700 hover:text-blue-800 uppercase tracking-wider">
                  Forgot password?
                </button>
              </div>
            )}

            <button disabled={loading || (type === "register" && !isVerified)} type="submit" className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white font-semibold py-3 md:py-4 rounded-2xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all mt-3 md:mt-4 uppercase tracking-wider">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>{type === "login" ? "Sign In" : "Create Account"} <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button type="button" onClick={() => { setType(type === "login" ? "register" : "login"); setOtpSent(false); setIsVerified(false); setOtp(""); setRegisterResendTimer(0); }} className="text-slate-500 hover:text-blue-700 transition-colors text-sm">
              {type === "login" ? "New here? " : "Already a member? "}
              <span className="font-semibold text-blue-700 underline">
                {type === "login" ? "Create an account" : "Log in"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {showForgotModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={closeForgotModal}></div>
          <div className="bg-white w-full max-w-[560px] rounded-[26px] shadow-2xl shadow-slate-900/30 relative z-10 overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-slate-200/70">
            <button onClick={closeForgotModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors p-1 hover:bg-slate-100 rounded-full">
              <X size={22} />
            </button>

            <div className="p-8 bg-gradient-to-b from-white via-slate-50/60 to-white">
              <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-[0.2em]">
                Password Recovery
                <span className="h-[1px] w-10 bg-slate-300"></span>
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-2 mt-2 font-serif">Reset Password</h3>
              <p className="text-sm text-slate-500 mb-6">
                {forgotStage === "email" ? "Enter your registered email to receive an OTP." : "Enter OTP and set a new password."}
              </p>

              {forgotStage === "email" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 ml-1 uppercase tracking-wider">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input name="email" type="email" value={forgotForm.email} onChange={handleForgotChange} placeholder="name@example.com" className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none shadow-sm" />
                    </div>
                  </div>
                  <button type="button" disabled={forgotLoading} onClick={handleForgotSendOtp} className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white font-semibold py-3 rounded-2xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all uppercase tracking-wider">
                    {forgotLoading ? <Loader2 className="animate-spin" size={18} /> : "Send OTP"}
                  </button>
                </div>
              )}

              {forgotStage === "reset" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 ml-1 uppercase tracking-wider">OTP</label>
                    <div className="relative">
                      <ShieldCheck className="absolute -left-1 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
                      <div className="flex items-center gap-2 pl-6">
                        {Array.from({ length: 6 }).map((_, idx) => (
                          <input
                            key={idx}
                            ref={(el) => (forgotOtpRefs.current[idx] = el)}
                            inputMode="numeric"
                            maxLength={1}
                            value={forgotForm.otp[idx] || ""}
                            onChange={(e) => handleForgotOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleForgotOtpKeyDown(idx, e)}
                          className="h-9 w-8 md:h-12 md:w-11 text-center text-base font-semibold rounded-xl border border-blue-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-700 outline-none"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 ml-1 uppercase tracking-wider">New Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input name="password" type={showForgotPassword ? "text" : "password"} value={forgotForm.password} onChange={handleForgotChange} placeholder="********" className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none shadow-sm" />
                      <button type="button" onClick={() => setShowForgotPassword(!showForgotPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-slate-900">
                        {showForgotPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 ml-1 uppercase tracking-wider">Confirm Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input name="confirmPassword" type={showForgotConfirmPassword ? "text" : "password"} value={forgotForm.confirmPassword} onChange={handleForgotChange} placeholder="********" className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-700 focus:border-blue-700 outline-none shadow-sm" />
                      <button type="button" onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-slate-900">
                        {showForgotConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button type="button" onClick={handleForgotSendOtp} disabled={forgotResendTimer > 0 || forgotLoading} className="text-xs font-semibold text-blue-700 hover:text-blue-800 disabled:opacity-60 uppercase tracking-wider">
                      {forgotResendTimer > 0 ? `Resend OTP in ${forgotResendTimer}s` : "Resend OTP"}
                    </button>
                    <button type="button" onClick={handleResetPassword} disabled={forgotLoading} className="bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all uppercase tracking-wider">
                      {forgotLoading ? <Loader2 className="animate-spin" size={18} /> : "Reset Password"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthModal;
