"use client";

import { useEffect, useState } from "react";
import { dashboardService, DashboardStats, GrowthDataPoint } from "@/services/dashboardService";
import { Member } from "@/services/memberService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, ShieldCheck, MapPin, Activity } from "lucide-react";
import CountUp from "react-countup";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [growthData, setGrowthData] = useState<GrowthDataPoint[]>([]);
  const [recentMembers, setRecentMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [statsData, chartData, recentData] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getGrowthChartData(),
        dashboardService.getRecentRegistrations()
      ]);
      setStats(statsData);
      setGrowthData(chartData);
      setRecentMembers(recentData);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh recent registrations periodically (e.g., every 30 seconds)
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      dashboardService.getRecentRegistrations().then(setRecentMembers);
    }, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back. Here's what's happening with TVK memberships today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading || !stats ? (
          <>
            <Skeleton className="h-[120px] rounded-xl" />
            <Skeleton className="h-[120px] rounded-xl" />
            <Skeleton className="h-[120px] rounded-xl" />
            <Skeleton className="h-[120px] rounded-xl" />
          </>
        ) : (
          <>
            <StatCard 
              title="Total Members" 
              value={stats.totalMembers} 
              icon={<Users className="h-5 w-5 text-blue-600" />} 
              trend="+12% from last month"
            />
            <StatCard 
              title="Active Members" 
              value={stats.activeMembers} 
              icon={<ShieldCheck className="h-5 w-5 text-green-600" />} 
              trend="+5% from last month"
            />
            <StatCard 
              title="Districts" 
              value={stats.districtsCovered} 
              icon={<MapPin className="h-5 w-5 text-purple-600" />} 
              trend="All covered"
            />
            <StatCard 
              title="Recent Activity" 
              value={stats.dailyVerifications} 
              icon={<Activity className="h-5 w-5 text-[#7A0019]" />} 
              trend="Verifications today"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass shadow-lg">
          <CardHeader>
            <CardTitle>Membership Growth (Last 12 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[350px] w-full rounded-xl" />
            ) : (
              <div className="h-[350px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7A0019" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#7A0019" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [value.toLocaleString(), "Members"]}
                    />
                    <Area type="monotone" dataKey="members" stroke="#7A0019" strokeWidth={3} fillOpacity={1} fill="url(#colorMembers)" animationDuration={1500} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card className="glass shadow-lg">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Recent Registrations</span>
                {!loading && <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 p-0">
              {loading ? (
                <div className="space-y-4 p-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
                  {recentMembers.map((member) => (
                    <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <img src={member.photoUrl} alt={member.fullName} className="h-10 w-10 rounded-full bg-slate-200 object-cover" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{member.fullName}</p>
                          <p className="text-xs text-slate-500">{member.district} • {member.thoguthi}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] text-slate-500">{member.memberId}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass shadow-lg">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <Link href="/admin/members/add" className="block w-full text-left px-4 py-3 bg-white hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors border border-slate-200 shadow-sm hover:border-[#7A0019]/30">
                Add New Member
              </Link>
              <button className="w-full text-left px-4 py-3 bg-white hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors border border-slate-200 shadow-sm">
                Generate ID Cards (Bulk)
              </button>
              <button className="w-full text-left px-4 py-3 bg-white hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors border border-slate-200 shadow-sm">
                Export Member Data
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: number, icon: React.ReactNode, trend: string }) {
  return (
    <Card className="glass shadow-md hover:shadow-lg transition-shadow border-t-4 border-t-[#7A0019]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-500">{title}</h3>
          <div className="p-2 bg-slate-50 rounded-md border border-slate-100 shadow-sm">
            {icon}
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-slate-900">
            <CountUp end={value} duration={2.5} separator="," />
          </h2>
          <p className="text-xs text-slate-500 font-medium">{trend}</p>
        </div>
      </CardContent>
    </Card>
  );
}
