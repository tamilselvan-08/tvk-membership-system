"use client";

import { useState } from "react";
import { authService } from "@/services/authService";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Eye, EyeOff, Lock } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await authService.login(email, password);
    
    setIsLoading(false);
    if (result.success && result.token) {
      toast.success("Login successful!");
      login(result.token);
    } else {
      toast.error(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
      <Toaster position="top-center" />
      {/* Background styling */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7A0019]/10 to-slate-50 z-0"></div>
      
      <div className="z-10 w-full max-w-md px-4">
        <div className="flex justify-center mb-8">
          <div className="bg-[#7A0019] p-3 rounded-xl shadow-lg">
            <ShieldCheck className="h-10 w-10 text-[#FFD700]" />
          </div>
        </div>
        
        <Card className="glass border-white/60 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center font-bold text-slate-800">Admin Login</CardTitle>
            <CardDescription className="text-center text-slate-500">
              Access the TVK Membership Dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <Input 
                  type="email" 
                  required
                  placeholder="admin@tvk.in" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/50 pr-10"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-[#7A0019] focus:ring-[#7A0019]" />
                  <span className="text-slate-600">Remember me</span>
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-[#7A0019] hover:bg-[#9c0020] text-white mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span className="flex items-center"><Lock className="mr-2 h-4 w-4" /> Secure Login</span>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-xs text-slate-500">
              <p>Demo Credentials: admin@tvk.in / admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
