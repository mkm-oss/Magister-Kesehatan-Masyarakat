/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Footer } from './components/Footer';
import { RegistrationModal } from './components/RegistrationFormModal';
import { BrochureModal } from './components/BrochureModal';
import { PortalLoginModal } from './components/PortalLoginModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { AdminDashboard } from './components/AdminDashboard';
import { DosenPortal } from './components/DosenPortal';
import { MahasiswaPortal } from './components/MahasiswaPortal';
import { SimAkreditasiPro } from './components/SimAkreditasiPro';
import { InitialPortalGateway } from './components/InitialPortalGateway';
import { CustomPageViewer } from './components/CustomPageViewer';

function MainAppContent() {
  const { activePortalView, setActivePortalView, currentUser } = useApp();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [isPortalLoginOpen, setIsPortalLoginOpen] = useState(false);
  const [isDriveOpen, setIsDriveOpen] = useState(false);
  const [isSheetsOpen, setIsSheetsOpen] = useState(false);
  const [loginDefaultRole, setLoginDefaultRole] = useState<'superadmin' | 'admin' | 'dosen' | 'mahasiswa'>('superadmin');
  const [preselectedPeminatan, setPreselectedPeminatan] = useState('');

  const handleOpenRegister = (peminatanName = '') => {
    setPreselectedPeminatan(peminatanName);
    setIsRegisterOpen(true);
  };

  const handleOpenBrochure = () => {
    setIsBrochureOpen(true);
  };

  const handleOpenPortalLogin = (role: 'superadmin' | 'admin' | 'dosen' | 'mahasiswa' = 'superadmin') => {
    setLoginDefaultRole(role);
    setIsPortalLoginOpen(true);
  };

  // Route to specific portal, custom page, or SIM-Akreditasi PRO if active
  if (activePortalView === 'custom_page') {
    return <CustomPageViewer onBack={() => setActivePortalView('landing')} />;
  }

  if (activePortalView === 'sim_akreditasi') {
    return <SimAkreditasiPro onBackToPortal={() => setActivePortalView('landing')} />;
  }

  if (activePortalView === 'admin') {
    return <AdminDashboard />;
  }

  if (activePortalView === 'dosen') {
    return <DosenPortal />;
  }

  if (activePortalView === 'mahasiswa') {
    return <MahasiswaPortal />;
  }

  // Public Landing Page: Murni Hanya Portal dan Footer
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] antialiased selection:bg-blue-900 selection:text-white relative">
      {/* Main Page: Tampilan Awal Khusus Portal */}
      <main className="flex-1">
        {/* Tampilan Awal: Logo Institusi & Pilihan Masuk Mahasiswa, Dosen, dan Admin */}
        <InitialPortalGateway
          onOpenPortalLogin={handleOpenPortalLogin}
          onOpenRegister={() => handleOpenRegister('')}
          onOpenBrochure={handleOpenBrochure}
        />
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
