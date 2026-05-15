"use client";

import { useEffect, useState, useRef } from "react";
import { memberService, Member } from "@/services/memberService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

export default function IDCardGenerator() {
  const params = useParams();
  const id = params.id as string;
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      memberService.getMemberById(id).then((data) => {
        setMember(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleDownloadPNG = async () => {
    if (!cardRef.current || !member) return;
    try {
      const toastId = toast.loading("Generating PNG...");
      const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `TVK_ID_${member.memberId}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Downloaded successfully!", { id: toastId });
    } catch (err) {
      toast.error("Failed to generate image.");
    }
  };

  const handleDownloadPDF = async () => {
    if (!cardRef.current || !member) return;
    try {
      const toastId = toast.loading("Generating PDF...");
      const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Add card centered at the top
      pdf.addImage(imgData, "PNG", 15, 15, 60, (canvas.height * 60) / canvas.width);
      pdf.save(`TVK_ID_${member.memberId}.pdf`);
      toast.success("Downloaded successfully!", { id: toastId });
    } catch (err) {
      toast.error("Failed to generate PDF.");
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading ID Card data...</div>;
  }

  if (!member) {
    return <div>Member not found.</div>;
  }

  // The QR code URL points to the public verification page
  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/member/${member.id}` 
    : `https://tvk-verify.in/member/${member.id}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/admin/members">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">ID Card Generator</h1>
            <p className="text-slate-500">Generate and download official TVK membership ID card.</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" /> PDF
          </Button>
          <Button className="bg-[#7A0019] hover:bg-[#9c0020]" onClick={handleDownloadPNG}>
            <Download className="h-4 w-4 mr-2" /> PNG Image
          </Button>
        </div>
      </div>

      <div className="bg-slate-100 p-8 rounded-xl border flex justify-center overflow-x-auto">
        
        {/* Actual Printable ID Card Component */}
        <div 
          ref={cardRef} 
          className="w-[350px] bg-white rounded-xl overflow-hidden relative shadow-[0_0_20px_rgba(0,0,0,0.1)]"
          style={{ width: "350px", height: "550px", display: "flex", flexDirection: "column" }}
        >
          {/* Header */}
          <div className="bg-[#7A0019] pt-6 pb-8 px-4 flex flex-col items-center text-white relative">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
            <ShieldCheck className="h-10 w-10 text-[#FFD700] relative z-10 mb-2" />
            <h2 className="text-xl font-bold tracking-widest relative z-10">TVK</h2>
            <p className="text-[10px] uppercase tracking-wider opacity-80 relative z-10">Official Member Identity</p>
          </div>
          
          {/* Photo overlapping header */}
          <div className="flex justify-center -mt-10 relative z-20">
            <img 
              src={member.photoUrl || "https://ui-avatars.com/api/?name=" + member.fullName} 
              alt={member.fullName} 
              className="h-28 w-28 rounded-md border-4 border-white object-cover shadow-md bg-white"
            />
          </div>

          {/* Body Content */}
          <div className="px-6 pt-4 pb-2 text-center flex-1">
            <h3 className="text-2xl font-bold text-slate-900 uppercase">{member.fullName}</h3>
            <p className="text-sm font-semibold text-[#7A0019] mt-1">{member.role}</p>
            
            <div className="mt-4 grid grid-cols-2 gap-y-2 text-left text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="text-slate-500 font-medium">Member ID:</div>
              <div className="text-slate-900 font-bold">{member.memberId}</div>
              
              <div className="text-slate-500 font-medium">District:</div>
              <div className="text-slate-900 font-bold">{member.district}</div>
              
              <div className="text-slate-500 font-medium">Validity:</div>
              <div className="text-slate-900 font-bold">Lifetime</div>
            </div>
          </div>

          {/* QR Code and Footer Area */}
          <div className="px-6 pb-6 flex items-end justify-between mt-auto">
            <div className="flex flex-col items-center">
              <div className="bg-white p-1 border rounded-md shadow-sm">
                <QRCodeSVG value={verificationUrl} size={70} level="H" />
              </div>
              <p className="text-[8px] text-slate-400 mt-1">Scan to Verify</p>
            </div>
            
            <div className="flex flex-col items-center">
              {/* Authorized Signature Placeholder */}
              <div className="h-10 w-24 border-b border-slate-800 flex items-end justify-center pb-1">
                <span className="font-['Brush_Script_MT',cursive] text-lg text-blue-900">Sign</span>
              </div>
              <p className="text-[8px] font-semibold text-slate-600 mt-1 uppercase">Auth. Signatory</p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="h-3 bg-[#FFD700] w-full mt-auto"></div>
        </div>

      </div>
    </div>
  );
}
