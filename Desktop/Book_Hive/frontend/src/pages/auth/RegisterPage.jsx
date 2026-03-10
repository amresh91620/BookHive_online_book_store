import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { sendRegisterOtp, verifyRegisterOtp, registerUser } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, otpStatus } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Details
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await dispatch(sendRegisterOtp({ email: formData.email })).unwrap();
      toast.success("OTP sent to your email");
      setStep(2);
    } catch (error) {
      toast.error(error || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await dispatch(verifyRegisterOtp({ email: formData.email, otp: formData.otp })).unwrap();
      toast.success("Email verified successfully");
      setStep(3);
    } catch (error) {
      toast.error(error || "Invalid OTP");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await dispatch(registerUser(formData)).unwrap();
      toast.success("Registration successful! Please login");
      navigate("/login");
    } catch (error) {
      toast.error(error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] relative flex justify-center  px-4">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2378350f' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`}}></div>
      <div className="w-full max-w-md relative z-10">
      <Card className="bg-white border-[#E5E5E5] shadow-lg mt-10">
        <CardHeader className="text-center pb-4 border-b border-gray-100">
          <div className="flex justify-center mb-4">
            <div className="bg-[#FEF3C7] p-3 rounded-full border border-[#FDE68A]">
              <BookOpen className="w-8 h-8 text-[#D97706]" />
            </div>
          </div>
          <CardTitle className="text-2xl font-serif text-[#451a03]">Create Account</CardTitle>
          <CardDescription className="text-[#78350F] font-serif italic">
            {step === 1 && "Enter your email to get started"}
            {step === 2 && "Verify your email with OTP"}
            {step === 3 && "Complete your profile"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="focus-visible:ring-[#D97706]"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#78350F] hover:bg-[#92400E] text-[#FEF3C7] font-serif tracking-wide transition-colors"
                disabled={otpStatus === "loading"}
              >
                {otpStatus === "loading" ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="otp" className="font-medium text-gray-700">Enter OTP</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  maxLength={6}
                  className="text-center tracking-widest text-lg font-mono focus-visible:ring-[#D97706]"
                />
                <p className="text-xs text-[#78350F] text-center mt-2 italic font-serif">
                  Check your email for the verification code.
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-[#78350F] hover:bg-[#92400E] text-[#FEF3C7] font-serif tracking-wide transition-colors"
                  disabled={otpStatus === "loading"}
                >
                  {otpStatus === "loading" ? "Verifying..." : "Verify OTP"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-[#D97706] hover:text-[#B45309] hover:bg-[#FEF3C7]/50"
                  onClick={() => setStep(1)}
                >
                  Change Email
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Complete Registration */}
          {step === 3 && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="font-medium text-gray-700">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="focus-visible:ring-[#D97706]"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="font-medium text-gray-700">Phone (Optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  className="focus-visible:ring-[#D97706]"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="font-medium text-gray-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="focus-visible:ring-[#D97706]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="font-medium text-gray-700">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="focus-visible:ring-[#D97706]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#78350F] hover:bg-[#92400E] text-[#FEF3C7] font-serif tracking-wide transition-colors"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-sm border-t border-gray-100 pt-5">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-[#D97706] hover:text-[#B45309] hover:underline font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
