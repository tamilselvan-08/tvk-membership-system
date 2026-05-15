export interface Member {
  id: string;
  memberId: string;
  fullName: string;
  district: string;
  thoguthi?: string;
  role: string;
  description?: string;
  joinDate: string;
  status: "Active" | "Inactive";
  photoUrl?: string;
}

// Temporary Mock Data
const mockMembers: Member[] = [
  {
    id: "1",
    memberId: "TVK-2024-001",
    fullName: "K. Vijay",
    district: "Chennai",
    thoguthi: "Chepauk-Thiruvallikeni",
    role: "President",
    description: "Founding member and president.",
    joinDate: "2024-02-02",
    status: "Active",
    photoUrl: "https://ui-avatars.com/api/?name=K+Vijay&background=7A0019&color=fff&size=200",
  },
  {
    id: "2",
    memberId: "TVK-2024-002",
    fullName: "A. Rahman",
    district: "Coimbatore",
    role: "District Secretary",
    joinDate: "2024-02-10",
    status: "Active",
    photoUrl: "https://ui-avatars.com/api/?name=A+Rahman&background=7A0019&color=fff&size=200",
  },
  {
    id: "3",
    memberId: "TVK-2024-003",
    fullName: "S. Priya",
    district: "Madurai",
    role: "Member",
    joinDate: "2024-03-15",
    status: "Active",
    photoUrl: "https://ui-avatars.com/api/?name=S+Priya&background=7A0019&color=fff&size=200",
  },
];

// In the future, these will make real HTTP requests to the Spring Boot backend
export const memberService = {
  getAllMembers: async (): Promise<Member[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return [...mockMembers];
  },

  getMemberById: async (id: string): Promise<Member | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const member = mockMembers.find((m) => m.id === id || m.memberId === id);
    return member || null;
  },

  searchMembers: async (query: string): Promise<Member[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const lowerQuery = query.toLowerCase();
    return mockMembers.filter(
      (m) =>
        m.fullName.toLowerCase().includes(lowerQuery) ||
        m.memberId.toLowerCase().includes(lowerQuery) ||
        m.district.toLowerCase().includes(lowerQuery)
    );
  },
};
