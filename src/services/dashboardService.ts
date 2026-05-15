import { Member } from "./memberService";

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  districtsCovered: number;
  dailyVerifications: number;
}

export interface GrowthDataPoint {
  month: string;
  members: number;
}

// Temporary Mock Data for Spring Boot future integration
const mockStats: DashboardStats = {
  totalMembers: 125430,
  activeMembers: 120100,
  districtsCovered: 38,
  dailyVerifications: 432,
};

const mockGrowthData: GrowthDataPoint[] = [
  { month: "Jan", members: 45000 },
  { month: "Feb", members: 52000 },
  { month: "Mar", members: 61000 },
  { month: "Apr", members: 68000 },
  { month: "May", members: 75000 },
  { month: "Jun", members: 82000 },
  { month: "Jul", members: 89000 },
  { month: "Aug", members: 95000 },
  { month: "Sep", members: 105000 },
  { month: "Oct", members: 112000 },
  { month: "Nov", members: 118000 },
  { month: "Dec", members: 125430 },
];

export const dashboardService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { ...mockStats };
  },

  getGrowthChartData: async (): Promise<GrowthDataPoint[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return [...mockGrowthData];
  },

  getRecentRegistrations: async (): Promise<Member[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Simulate real-time by randomizing slightly if needed or just return standard list
    return [
      {
        id: "101",
        memberId: "TVK-2024-892",
        fullName: "R. Karthik",
        district: "Chennai",
        thoguthi: "Velachery",
        role: "Member",
        joinDate: new Date().toISOString(),
        status: "Active",
        photoUrl: "https://ui-avatars.com/api/?name=R+Karthik&background=7A0019&color=fff",
      },
      {
        id: "102",
        memberId: "TVK-2024-893",
        fullName: "M. Sneha",
        district: "Madurai",
        thoguthi: "Madurai Central",
        role: "Coordinator",
        joinDate: new Date(Date.now() - 3600000).toISOString(),
        status: "Active",
        photoUrl: "https://ui-avatars.com/api/?name=M+Sneha&background=7A0019&color=fff",
      },
      {
        id: "103",
        memberId: "TVK-2024-894",
        fullName: "V. Prakash",
        district: "Coimbatore",
        thoguthi: "Coimbatore South",
        role: "Member",
        joinDate: new Date(Date.now() - 7200000).toISOString(),
        status: "Active",
        photoUrl: "https://ui-avatars.com/api/?name=V+Prakash&background=7A0019&color=fff",
      }
    ];
  }
};
