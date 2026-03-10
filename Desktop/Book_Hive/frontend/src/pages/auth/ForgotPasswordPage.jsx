import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { sendForgotPasswordOtp, resetPassword } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, KeyRound, ArrowLeft, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { passwordStatus } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1); // 1: Email, 2: OTP & Password
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      await dispatch(sendForgotPasswordOtp({ email: formData.email })).unwrap();
      toast.success("OTP sent to your email");
      setStep(2);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!formData.otp) {
      toast.error("Please enter the OTP");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await dispatch(resetPassword(formData)).unwrap();
      toast.success("Password reset successful! Please login");
      navigate("/login");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleResendOtp = async () => {
    try {
      await dispatch(sendForgotPasswordOtp({ email: formData.email })).unwrap();
      toast.success("OTP resent to your email");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] relative flex justify-center  px-4">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2378350f' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`}}></div>
      <div className="w-full max-w-md relative z-10">
        <Card className="bg-white border-[#E5E5E5] shadow-lg mt-10">
          <CardHeader className="space-y-1 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-[#D97706] hover:text-[#B45309] hover:bg-[#FEF3C7]/50 -ml-2">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
            <CardTitle className="text-2xl font-serif font-bold text-center text-[#451a03]">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center font-serif italic text-[#78350F]">
              {step === 1
                ? "Enter your email to receive a password reset OTP"
                : "Enter the OTP and your new password"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 pb-20">
            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="font-medium text-gray-700">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 focus-visible:ring-[#D97706]"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#78350F] hover:bg-[#92400E] text-[#FEF3C7] font-serif tracking-wide transition-colors"
                  disabled={passwordStatus === "loading"}
                >
                  {passwordStatus === "loading" ? "Sending..." : "Send OTP"}
                </Button>
               </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email" className="font-medium text-gray-700">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="pl-10 bg-gray-50 cursor-not-allowed opacity-75 text-gray-500 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="otp" className="font-medium text-gray-700">OTP Code</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="otp"
                      name="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={formData.otp}
                      onChange={handleChange}
                      className="pl-10 font-mono tracking-widest text-center focus-visible:ring-[#D97706]"
                      maxLength={6}
                      required
                    />
                  </div>
                  <div className="flex justify-end mt-1">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-sm text-[#D97706] hover:text-[#B45309] hover:underline transition-colors"
                      disabled={passwordStatus === "loading"}
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password" className="font-medium text-gray-700">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10 focus-visible:ring-[#D97706]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-[#78350F] italic font-serif mt-1">
                    Password must be at least 6 characters
                  </p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="confirmPassword" className="font-medium text-gray-700">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 pr-10 focus-visible:ring-[#D97706]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#78350F] hover:bg-[#92400E] text-[#FEF3C7] font-serif tracking-wide transition-colors"
                    disabled={passwordStatus === "loading"}
                  >
                    {passwordStatus === "loading" ? "Resetting..." : "Reset Password"}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-5 text-center text-sm border-t border-gray-100 pt-4">
              <span className="text-gray-600">Remember your password? </span>
              <Link to="/login" className="text-[#D97706] hover:text-[#B45309] font-semibold transition-colors hover:underline">
                Login here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
