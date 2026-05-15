"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Users, ShieldCheck, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { memberService } from "@/services/memberService";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [memberId, setMemberId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState({ totalMembers: 0, activeMembers: 0, districtsCovered: 0 });
  const router = useRouter();

  useEffect(() => {
    memberService.getStats().then(setStats);
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId.trim()) return toast.error("Please enter a Member ID");
    
    setIsSearching(true);
    const member = await memberService.getMemberById(memberId);
    setIsSearching(false);
    
    if (member) {
      toast.success("Member found!");
      router.push(`/member/${member.id}`);
    } else {
      toast.error("Invalid Member ID. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <Toaster position="top-center" />
      
      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="relative overflow-hidden py-20 lg:py-32 bg-gradient-to-br from-[#7A0019] via-[#9c0020] to-[#5c0013] text-white">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
          <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
                <ShieldCheck className="h-5 w-5 text-[#FFD700]" />
                <span className="font-medium">Official TVK Verification Portal</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Verify TVK Membership <br className="hidden md:block" />
                <span className="text-[#FFD700]">Instantly & Securely</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
                Enter the Member ID or scan the QR code to verify the authenticity of a TVK party member.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full max-w-lg"
            >
              <Card className="glass border-white/40 shadow-2xl overflow-hidden p-2">
                <form onSubmit={handleVerify} className="flex space-x-2 p-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input 
                      value={memberId}
                      onChange={(e) => setMemberId(e.target.value)}
                      placeholder="e.g., TVK-2024-001" 
                      className="pl-10 h-12 text-lg bg-white/90 border-slate-200 text-slate-900"
                    />
                  </div>
                  <Button type="submit" size="lg" className="h-12 bg-[#7A0019] hover:bg-[#9c0020] text-white" disabled={isSearching}>
                    {isSearching ? "Verifying..." : "Verify Member"}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 -mt-10 relative z-20 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard icon={<Users className="h-8 w-8 text-[#7A0019]" />} title="Total Members" value={stats.totalMembers.toLocaleString()} delay={0.3} />
            <StatsCard icon={<ShieldCheck className="h-8 w-8 text-[#7A0019]" />} title="Active Members" value={stats.activeMembers.toLocaleString()} delay={0.4} />
            <StatsCard icon={<MapPin className="h-8 w-8 text-[#7A0019]" />} title="Districts Covered" value={stats.districtsCovered.toString()} delay={0.5} />
          </div>
        </section>
      </main>
    </div>
  );
}

function StatsCard({ icon, title, value, delay }: { icon: React.ReactNode, title: string, value: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="border-0 shadow-lg bg-white">
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="p-4 bg-red-50 rounded-2xl">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
