import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import LedgerEdge from "@/components/LedgerEdge";
import ColdOpen from "@/components/ColdOpen";
import HallOfTrophies from "@/components/HallOfTrophies";
import Informants from "@/components/Informants";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";

const HomePage = () => {
  return (
    <div className="forensic-ledger">
      {/* Film grain noise overlay */}
      <div className="noise-overlay" />

      {/* Sidebar navigation */}
      <LedgerEdge />

      {/* Main content area */}
      <main className="lg:ml-[15vw] min-h-screen bg-[#0F1419] relative">
        {/* Hero - The Cold Open */}
        <ColdOpen />

        {/* Evidence Grid - Hall of Trophies */}
        <div className="relative">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 800px 400px at 30% 50%, rgba(244, 236, 216, 0.02) 0%, transparent 100%)",
            }}
          />
          <div className="relative z-10">
            <HallOfTrophies />
          </div>
        </div>

        {/* Testimonials - The Informants */}
        <div className="relative">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 600px 300px at 60% 40%, rgba(178, 34, 34, 0.015) 0%, transparent 100%)",
            }}
          />
          <div className="relative z-10">
            <Informants />
          </div>
        </div>

        {/* Footer */}
        <footer className="py-16 px-8 md:px-12 border-t border-[#1A1A1A]">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5 mb-4">
              <FileText
                size={14}
                strokeWidth={1.5}
                className="text-[#B22222]"
              />
              <span
                className="text-[10px] text-[#F4ECD8]/30 tracking-[0.35em] uppercase"
                style={{ fontFamily: "'Julius Sans One', sans-serif" }}
              >
                The Forensic Ledger
              </span>
            </div>
            <Separator className="bg-[#1A1A1A] mb-5" />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p
                className="text-[9px] text-[#F4ECD8]/15 tracking-[0.25em] uppercase"
                style={{ fontFamily: "'Special Elite', cursive" }}
              >
                &copy; 2025 Satyajit Mall. All cases classified.
              </p>
              <p
                className="text-[9px] text-[#F4ECD8]/10 tracking-[0.2em] uppercase"
                style={{ fontFamily: "'Special Elite', cursive" }}
              >
                Built with forensic precision
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;
