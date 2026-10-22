/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VisionAdvantage } from './components/VisionAdvantage';
import { Concentrations } from './components/Concentrations';
import { Curriculum } from './components/Curriculum';
import { Faculty } from './components/Faculty';
import { FeeCalculator } from './components/FeeCalculator';
import { AdmissionGuide } from './components/AdmissionGuide';
import { Testimonials } from './components/Testimonials';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { RegistrationModal } from './components/RegistrationFormModal';
import { BrochureModal } from './components/BrochureModal';
import { PortalLoginModal } from './components/PortalLoginModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { AdminDashboard } from './components/AdminDashboard';
import { DosenPortal } from './components/DosenPortal';
import { MahasiswaPortal } from './components/MahasiswaPortal';
import { AcademicServicesSection } from './components/AcademicServicesSection';
import { InitialPortalGateway } from './components/InitialPortalGateway';
import { ShieldCheck, UserCheck, GraduationCap, Globe, FolderSync, FileSpreadsheet } from 'lucide-react';

function MainAppContent() {
  const { activePortalView, setActivePortalView, currentUser } = useApp();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isPortalLoginOpen, setIsPortalLoginOpen] = useState(false);
  const [isDriveOpen, setIsDriveOpen] = useState(false);
  const [isSheetsOpen, setIsSheetsOpen] = useState(false);
  const [loginDefaultRole, setLoginDefaultRole] = useState<'admin' | 'dosen' | 'mahasiswa'>('admin');
  const [preselectedPeminatan, setPreselectedPeminatan] = useState('');

  const handleOpenRegister = (peminatanName = '') => {
    setPreselectedPeminatan(peminatanName);
    setIsRegisterOpen(true);
  };

  const handleOpenBrochure = () => {
    setIsBrochureOpen(true);
  };

  const handleOpenPortalLogin = (role: 'admin' | 'dosen' | 'mahasiswa' = 'admin') => {
    setLoginDefaultRole(role);
    setIsPortalLoginOpen(true);
  };

  // Route to specific portal if active
  if (activePortalView === 'admin') {
    return <AdminDashboard />;
  }

  if (activePortalView === 'dosen') {
    return <DosenPortal />;
  }

  if (activePortalView === 'mahasiswa') {
    return <MahasiswaPortal />;
  }

  // Public Landing Page
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] antialiased selection:bg-blue-900 selection:text-white relative">
      
      {/* Top Navigation Bar */}
      <Navbar
        onOpenRegister={() => handleOpenRegister('')}
        onOpenBrochure={handleOpenBrochure}
        onOpenPortalLogin={handleOpenPortalLogin}
        onOpenGoogleDrive={() => setIsDriveOpen(true)}
        onOpenGoogleSheets={() => setIsSheetsOpen(true)}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* Tampilan Awal: Logo Institusi & Pilihan Masuk Mahasiswa, Dosen, dan Admin */}
        <InitialPortalGateway
          onOpenPortalLogin={handleOpenPortalLogin}
          onOpenRegister={() => handleOpenRegister('')}
          onOpenBrochure={handleOpenBrochure}
        />

        {/* 1. Hero Section & Informasi Program Studi */}
        <Hero
          onOpenRegister={() => handleOpenRegister('')}
          onOpenBrochure={handleOpenBrochure}
        />

        {/* 2. Profil, Visi & Keunggulan Riset Lahan Basah Pesisir */}
        <VisionAdvantage />

        {/* 3. Peminatan & Spesialisasi Keahlian */}
        <Concentrations
          onSelectPeminatanForRegistration={(peminatanName) =>
            handleOpenRegister(peminatanName)
          }
        />

        {/* 4. Kurikulum & SKS Tiap Semester */}
        <Curriculum />

        {/* 4b. Menu Pelayanan Mahasiswa & Dosen: Akses Tesis & Pembelajaran Online */}
        <AcademicServicesSection
          onOpenPortalLogin={handleOpenPortalLogin}
          onOpenGoogleDrive={() => setIsDriveOpen(true)}
          onOpenGoogleSheets={() => setIsSheetsOpen(true)}
        />

        {/* 5. Tenaga Pengajar & Pembimbing Tesis */}
        <Faculty />

        {/* 6. Simulasi Biaya Studi & Skema Angsuran */}
        <FeeCalculator onOpenConsultation={() => handleOpenRegister('')} />

        {/* 7. Jadwal PMB & Panduan Pendaftaran */}
        <AdmissionGuide onOpenRegister={() => handleOpenRegister('')} />

        {/* 8. Suara Alumni & Stakeholders */}
        <Testimonials />

        {/* 9. FAQ / Tanya Jawab */}
        <FaqSection onOpenConsultation={() => handleOpenRegister('')} />
      </main>

      {/* Institutional Footer */}
      <Footer
        onOpenRegister={() => handleOpenRegister('')}
        onOpenBrochure={handleOpenBrochure}
        onOpenPortalLogin={handleOpenPortalLogin}
      />

      {/* Modals */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        preselectedPeminatan={preselectedPeminatan}
      />

      <BrochureModal
        isOpen={isBrochureOpen}
        onClose={() => setIsBrochureOpen(false)}
        onOpenRegister={() => handleOpenRegister('')}
      />

      <PortalLoginModal
        isOpen={isPortalLoginOpen}
        onClose={() => setIsPortalLoginOpen(false)}
        defaultRole={loginDefaultRole}
      />

      <GoogleDriveModal
        isOpen={isDriveOpen}
        onClose={() => setIsDriveOpen(false)}
      />

      <GoogleSheetsModal
        isOpen={isSheetsOpen}
        onClose={() => setIsSheetsOpen(false)}
      />

      {/* Quick Portal Switcher Floating Dock */}
      <div className="fixed bottom-4 right-4 z-30 hidden sm:flex items-center gap-1.5 p-1.5 bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700 text-xs">
        <span className="text-[10px] uppercase font-bold text-slate-400 px-2 tracking-wider">
          Akses Portal:
        </span>
        <button
          onClick={() => handleOpenPortalLogin('admin')}
          className="px-2.5 py-1.5 rounded-xl font-bold text-amber-300 hover:bg-slate-800 transition-colors flex items-center gap-1"
          title="Login Admin CMS untuk edit web"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>
        <button
          onClick={() => handleOpenPortalLogin('dosen')}
          className="px-2.5 py-1.5 rounded-xl font-bold text-blue-200 hover:bg-slate-800 transition-colors flex items-center gap-1"
          title="Portal Dosen (Kelas Online & Tesis)"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Dosen</span>
        </button>
        <button
          onClick={() => handleOpenPortalLogin('mahasiswa')}
          className="px-2.5 py-1.5 rounded-xl font-bold text-emerald-300 hover:bg-slate-800 transition-colors flex items-center gap-1"
          title="Portal Mahasiswa (LMS & Tesis)"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Mahasiswa</span>
        </button>
        <div className="h-4 w-px bg-slate-700 mx-0.5" />
        <button
          onClick={() => setIsDriveOpen(true)}
          className="px-2.5 py-1.5 rounded-xl font-bold text-sky-300 hover:bg-slate-800 transition-colors flex items-center gap-1"
          title="Buka Google Drive Akademik MKM"
        >
          <FolderSync className="w-3.5 h-3.5 text-amber-400" />
          <span>Drive</span>
        </button>
        <button
          onClick={() => setIsSheetsOpen(true)}
          className="px-2.5 py-1.5 rounded-xl font-bold text-emerald-300 hover:bg-slate-800 transition-colors flex items-center gap-1"
          title="Buka Google Sheets Akademik MKM"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sheets</span>
        </button>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
