import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(formData)).unwrap();
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error(error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] relative flex justify-center px-4">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2378350f' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`}}></div>
      <div className="w-full max-w-md relative z-10">
      <Card className="bg-white border-[#E5E5E5] shadow-lg mt-10">
        <CardHeader className="text-center pt-5 border-b border-gray-100">
          <div className="flex justify-center mb-3">
            <div className="bg-[#FEF3C7] p-2 rounded-full border border-[#FDE68A]">
              <BookOpen className="w-8 h-8 text-[#D97706]" />
            </div>
          </div>
          <CardTitle className="text-2xl font-serif text-[#451a03]">Welcome Back</CardTitle>
          <CardDescription className="text-[#78350F] font-serif italic">Sign in to your BookHive account</CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
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
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-medium text-gray-700">Password</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs text-[#D97706] hover:text-[#B45309] hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
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
            <Button
              type="submit"
              className="w-full bg-[#78350F] hover:bg-[#92400E] text-[#FEF3C7] font-serif tracking-wide transition-colors"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-5 text-center text-sm border-t border-gray-100 pt-4">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#D97706] hover:text-[#B45309] hover:underline font-semibold transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
