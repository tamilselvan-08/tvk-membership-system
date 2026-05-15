"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Upload, AlertCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { districtService, District, Constituency } from "@/services/districtService";

export default function AddMemberPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [districts, setDistricts] = useState<District[]>([]);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [loadingConstituencies, setLoadingConstituencies] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    dob: "",
    gender: "",
    districtId: "",
    constituencyId: "",
    role: "",
    description: "",
  });

  // Validation Errors State
  const [errors, setErrors] = useState<{ role?: string; description?: string }>({});

  useEffect(() => {
    districtService.getDistricts().then((data) => {
      setDistricts(data);
      setLoadingDistricts(false);
    });
  }, []);

  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dId = e.target.value;
    setFormData(prev => ({ ...prev, districtId: dId, constituencyId: "" }));
    
    if (dId) {
      setLoadingConstituencies(true);
      const data = await districtService.getConstituenciesByDistrict(dId);
      setConstituencies(data);
      setLoadingConstituencies(false);
    } else {
      setConstituencies([]);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: { role?: string; description?: string } = {};

    // Role Validation
    const trimmedRole = formData.role.trim();
    if (!trimmedRole) {
      newErrors.role = "Role is required.";
      isValid = false;
    } else if (trimmedRole.length < 3 || trimmedRole.length > 80) {
      newErrors.role = "Role must be between 3 and 80 characters.";
      isValid = false;
    } else if (!/^[a-zA-Z0-9\s-]+$/.test(trimmedRole)) {
      newErrors.role = "Role can only contain letters, numbers, spaces, and hyphens.";
      isValid = false;
    }

    // Description Validation
    if (formData.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Clean up data before sending to backend
    const submissionData = {
      ...formData,
      role: formData.role.trim(),
      description: formData.description.trim(),
    };

    setIsSubmitting(true);
    
    // Simulate API call to Spring Boot backend
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Member added successfully!");
      // Reset form or redirect
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/members">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:bg-slate-200">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add New Member</h1>
          <p className="text-slate-500">Register a new TVK party member into the dynamic system.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="glass shadow-xl border-white/50">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-1/3 flex flex-col items-center space-y-3">
                <div className="h-32 w-32 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer relative overflow-hidden group">
                  <Upload className="h-8 w-8 opacity-50 group-hover:scale-110 transition-transform" />
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/jpeg, image/png" />
                </div>
                <Button type="button" variant="outline" size="sm" className="w-full bg-white">Upload Photo</Button>
                <p className="text-xs text-slate-400 text-center">JPG or PNG. Max 2MB.</p>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Full Name <span className="text-red-500">*</span></label>
                  <Input 
                    required 
                    placeholder="Enter full name" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="bg-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Mobile Number <span className="text-red-500">*</span></label>
                  <Input 
                    required 
                    placeholder="+91" 
                    type="tel" 
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    className="bg-white/50"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Date of Birth</label>
                <Input 
                  type="date" 
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  className="bg-white/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Gender</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A0019]"
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-6 border-t border-slate-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Membership Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">District <span className="text-red-500">*</span></label>
                  <select 
                    required 
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A0019] disabled:opacity-50"
                    value={formData.districtId}
                    onChange={handleDistrictChange}
                    disabled={loadingDistricts}
                  >
                    <option value="">{loadingDistricts ? "Loading Districts..." : "Select District"}</option>
                    {districts.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Thoguthi (Constituency) <span className="text-red-500">*</span></label>
                  <select 
                    required 
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A0019] disabled:opacity-50"
                    value={formData.constituencyId}
                    onChange={(e) => setFormData({...formData, constituencyId: e.target.value})}
                    disabled={!formData.districtId || loadingConstituencies}
                  >
                    <option value="">
                      {!formData.districtId 
                        ? "Select District First" 
                        : loadingConstituencies 
                          ? "Loading..." 
                          : "Select Constituency"}
                    </option>
                    {constituencies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Role / Position <span className="text-red-500">*</span></label>
                <Input 
                  required 
                  placeholder="e.g. District Secretary" 
                  value={formData.role}
                  onChange={(e) => {
                    setFormData({...formData, role: e.target.value});
                    if (errors.role) setErrors({...errors, role: undefined});
                  }}
                  className={`bg-white/50 ${errors.role ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {errors.role && (
                  <p className="text-xs text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" /> {errors.role}
                  </p>
                )}
                <p className="text-xs text-slate-400">Letters, numbers, spaces, and hyphens only (3-80 chars).</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-700">About Member / Description</label>
                  <span className={`text-xs ${formData.description.length > 500 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                    {formData.description.length} / 500
                  </span>
                </div>
                <Textarea 
                  placeholder="Additional notes about the member..."
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({...formData, description: e.target.value});
                    if (errors.description) setErrors({...errors, description: undefined});
                  }}
                  className={`bg-white/50 min-h-[120px] resize-y ${errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {errors.description && (
                  <p className="text-xs text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" /> {errors.description}
                  </p>
                )}
              </div>

            </div>
          </CardContent>
          <CardFooter className="bg-slate-50/80 flex justify-end space-x-3 rounded-b-xl border-t p-6">
            <Link href="/admin/members">
              <Button type="button" variant="outline" className="bg-white">Cancel</Button>
            </Link>
            <Button type="submit" className="bg-[#7A0019] hover:bg-[#9c0020] px-8 shadow-md" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              ) : <Save className="h-4 w-4 mr-2" />}
              {isSubmitting ? "Saving..." : "Save Member"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
