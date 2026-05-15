"use client";

import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { memberService, Member } from "@/services/memberService";
import { CheckCircle2, XCircle, MapPin, Calendar, Briefcase, User } from "lucide-react";
import { useParams } from "next/navigation";

export default function MemberProfile() {
  const params = useParams();
  const id = params.id as string;
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      memberService.getMemberById(id).then((data) => {
        setMember(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7A0019]"></div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-red-200">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Verification Failed</h2>
              <p className="text-slate-500">This member ID is invalid or does not exist in our database.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="overflow-hidden border-0 shadow-2xl bg-white relative">
            {/* Header pattern */}
            <div className="h-32 bg-gradient-to-r from-[#7A0019] to-[#9c0020] relative">
              <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-20"></div>
            </div>
            
            <CardContent className="relative px-6 pb-8 pt-0">
              {/* Profile Image */}
              <div className="flex justify-center -mt-16 mb-4">
                <div className="relative">
                  <img 
                    src={member.photoUrl || "https://ui-avatars.com/api/?name=" + member.fullName} 
                    alt={member.fullName} 
                    className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg bg-white"
                  />
                  {member.status === "Active" && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="absolute bottom-0 right-0 bg-white rounded-full p-0.5"
                    >
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge variant={member.status === "Active" ? "success" : "danger"} className="mb-3">
                    {member.status === "Active" ? "Verified TVK Member" : "Inactive Member"}
                  </Badge>
                  <h1 className="text-3xl font-bold text-slate-900">{member.fullName}</h1>
                  <p className="text-[#7A0019] font-medium mt-1 text-lg">{member.memberId}</p>
                </motion.div>
              </div>

              {/* Details List */}
              <div className="space-y-4 border-t border-slate-100 pt-6">
                <DetailRow icon={<Briefcase />} label="Role" value={member.role} />
                <DetailRow icon={<MapPin />} label="District" value={member.district} />
                <DetailRow icon={<Calendar />} label="Joined" value={new Date(member.joinDate).toLocaleDateString()} />
              </div>
            </CardContent>
            
            <div className="bg-slate-50 border-t p-4 text-center">
              <p className="text-xs text-slate-400">
                This digital ID is securely verified by the TVK Official Database.
              </p>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center text-slate-700">
      <div className="w-8 flex justify-center text-slate-400 mr-3">
        {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5" })}
      </div>
      <div className="flex-1">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
