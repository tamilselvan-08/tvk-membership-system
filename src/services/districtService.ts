export interface District {
  id: string;
  name: string;
}

export interface Constituency {
  id: string;
  name: string;
  districtId: string;
}

// Mock Data representing backend database tables
const mockDistricts: District[] = [
  { id: "d1", name: "Chennai" },
  { id: "d2", name: "Coimbatore" },
  { id: "d3", name: "Madurai" },
  { id: "d4", name: "Salem" },
];

const mockConstituencies: Constituency[] = [
  { id: "c1", name: "Chepauk-Thiruvallikeni", districtId: "d1" },
  { id: "c2", name: "Velachery", districtId: "d1" },
  { id: "c3", name: "Anna Nagar", districtId: "d1" },
  { id: "c4", name: "Coimbatore South", districtId: "d2" },
  { id: "c5", name: "Singanallur", districtId: "d2" },
  { id: "c6", name: "Madurai Central", districtId: "d3" },
  { id: "c7", name: "Madurai West", districtId: "d3" },
  { id: "c8", name: "Salem North", districtId: "d4" },
  { id: "c9", name: "Salem South", districtId: "d4" },
];

export const districtService = {
  getDistricts: async (): Promise<District[]> => {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 400));
    return [...mockDistricts];
  },

  getConstituenciesByDistrict: async (districtId: string): Promise<Constituency[]> => {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockConstituencies.filter(c => c.districtId === districtId);
  }
};
