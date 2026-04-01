import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import LedgerEdge from "@/components/LedgerEdge";
import ColdOpen from "@/components/ColdOpen";
import HallOfTrophies from "@/components/HallOfTrophies";
import Informants from "@/components/Informants";
import Dossier from "@/components/Dossier";
import InformantsPage from "@/components/InformantsPage";
import ActionAgent from "@/components/ActionAgent";
import CasesPage from "@/components/CasesPage";
import CaseStudy from "@/components/CaseStudy";
import CaseMilesOne from "@/components/cases/CaseMilesOne";
import CaseMasterclass from "@/components/cases/CaseMasterclass";
import CaseEngage from "@/components/cases/CaseEngage";
import CaseSuperbot from "@/components/cases/CaseSuperbot";
import CaseActionAgents from "@/components/cases/CaseActionAgents";
import CaseAnalytics from "@/components/cases/CaseAnalytics";
import CaseMasterclassAnalytics from "@/components/cases/CaseMasterclassAnalytics";
import CaseResolution from "@/components/cases/CaseResolution";
import { CrosshairCursor, GlobalCursorStyles } from "@/components/GlobalCursor";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";

const HomePage = () => {
  return (
    <div className="forensic-ledger global-cursor">
      {/* Film grain noise overlay */}
      <div className="noise-overlay" />

      {/* Sidebar navigation */}
      <LedgerEdge />

      {/* Main content area */}
      <main className="min-h-screen bg-[#141A21] relative">
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
                className="text-[10px] text-[#F4ECD8]/50 tracking-[0.35em] uppercase"
                style={{ fontFamily: "'Julius Sans One', sans-serif" }}
              >
                The Forensic Ledger
              </span>
            </div>
            <Separator className="bg-[#1A1A1A] mb-5" />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p
                className="text-[9px] text-[#F4ECD8]/40 tracking-[0.25em] uppercase"
                style={{ fontFamily: "'Special Elite', cursive" }}
              >
                &copy; 2025 Satyajit Mall. All cases classified.
              </p>
              <p
                className="text-[9px] text-[#F4ECD8]/30 tracking-[0.2em] uppercase"
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

const DossierPage = () => (
  <div className="forensic-ledger global-cursor">
    <div className="noise-overlay" />
    <LedgerEdge />
    <main className="min-h-screen bg-[#141A21] relative">
      <Dossier />
    </main>
  </div>
);

const ComingSoon = ({ title, codename }) => (
  <div className="forensic-ledger global-cursor">
    <div className="noise-overlay" />
    <LedgerEdge />
    <main className="min-h-screen bg-[#111318] relative flex items-center justify-center">
      <div className="text-center px-6">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div style={{ width: 32, height: 1, background: 'rgba(220,38,38,0.5)' }} />
          <span
            className="text-[10px] tracking-[0.45em] uppercase"
            style={{ fontFamily: "'Courier New', monospace", color: 'rgba(220,38,38,0.7)' }}
          >
            {codename}
          </span>
          <div style={{ width: 32, height: 1, background: 'rgba(220,38,38,0.5)' }} />
        </div>
        <h1
          className="text-[clamp(32px,5vw,52px)] font-bold text-[#F3F4F6] tracking-tight leading-none mb-6"
          style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
        >
          {title}
        </h1>
        <div
          className="inline-block border border-gray-700 rounded-full px-8 py-3 mb-8"
          style={{ fontFamily: "'Courier New', monospace" }}
        >
          <span className="text-sm tracking-[0.25em] uppercase text-[#D1D5DB]">
            Coming Soon
          </span>
        </div>
        <p
          className="text-xs tracking-[0.2em] uppercase"
          style={{ fontFamily: "'Courier New', monospace", color: '#D1D5DB' }}
        >
          Under construction
        </p>
      </div>
    </main>
  </div>
);

const InformantsRoute = () => (
  <div className="forensic-ledger global-cursor">
    <div className="noise-overlay" />
    <LedgerEdge />
    <main className="min-h-screen bg-[#111318] relative">
      <InformantsPage />
    </main>
  </div>
);

const CasesRoute = () => (
  <div className="forensic-ledger global-cursor">
    <div className="noise-overlay" />
    <LedgerEdge />
    <main className="min-h-screen relative">
      <CasesPage />
    </main>
  </div>
);

const CaseStudyRoute = () => (
  <div className="forensic-ledger global-cursor">
    <div className="noise-overlay" />
    <LedgerEdge />
    <main className="min-h-screen relative">
      <CaseStudy />
    </main>
  </div>
);

function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dossier" element={<DossierPage />} />
          <Route path="/informants" element={<InformantsRoute />} />
          <Route path="/cases" element={<CasesRoute />} />
          <Route path="/case" element={<CasesRoute />} />
          <Route path="/cases/the-universal-gtm-identity-registry" element={
            <div className="forensic-ledger global-cursor"><div className="noise-overlay" /><LedgerEdge /><main className="min-h-screen relative"><CaseMilesOne /></main></div>
          } />
          <Route path="/cases/behavioral-ott-architecture" element={
            <div className="forensic-ledger global-cursor"><div className="noise-overlay" /><LedgerEdge /><main className="min-h-screen relative"><CaseMasterclass /></main></div>
          } />
          <Route path="/cases/the-attribution-recovery-engine" element={
            <div className="forensic-ledger global-cursor"><div className="noise-overlay" /><LedgerEdge /><main className="min-h-screen relative"><CaseEngage /></main></div>
          } />
          <Route path="/cases/agentic-voice-qualification" element={
            <div className="forensic-ledger global-cursor"><div className="noise-overlay" /><LedgerEdge /><main className="min-h-screen relative"><CaseSuperbot /></main></div>
          } />
          <Route path="/cases/transactional-llm-orchestration" element={
            <div className="forensic-ledger global-cursor"><div className="noise-overlay" /><LedgerEdge /><main className="min-h-screen relative"><CaseActionAgents /></main></div>
          } />
          <Route path="/cases/product-data-unification" element={
            <div className="forensic-ledger global-cursor"><div className="noise-overlay" /><LedgerEdge /><main className="min-h-screen relative"><CaseAnalytics /></main></div>
          } />
          <Route path="/cases/ott-product-forensics" element={
            <div className="forensic-ledger global-cursor"><div className="noise-overlay" /><LedgerEdge /><main className="min-h-screen relative"><CaseMasterclassAnalytics /></main></div>
          } />
          <Route path="/cases/csat-engineering" element={
            <div className="forensic-ledger global-cursor"><div className="noise-overlay" /><LedgerEdge /><main className="min-h-screen relative"><CaseResolution /></main></div>
          } />
          <Route path="/cases/:slug" element={<CaseStudyRoute />} />
          <Route path="/labs" element={<ComingSoon title="The Labs" codename="R&D Division" />} />
          <Route path="/lab" element={<ComingSoon title="The Labs" codename="R&D Division" />} />
        </Routes>
        {/* Global crosshair cursor — rendered outside Routes so it persists on all pages */}
        <GlobalCursorStyles />
        <CrosshairCursor />
        {/* Omnipresent chatbot — rendered outside Routes so it persists on all pages */}
        <ActionAgent />
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;
