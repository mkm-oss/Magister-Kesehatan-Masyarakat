import React, { useState } from 'react';
import { Menu, X, ArrowRight, User, ShieldCheck, UserCheck, GraduationCap, LogOut, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  onOpenRegister: () => void;
  onOpenBrochure: () => void;
  onOpenPortalLogin: (defaultRole?: 'admin' | 'dosen' | 'mahasiswa') => void;
  onOpenGoogleDrive?: () => void;
  onOpenGoogleSheets?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRegister,
  onOpenBrochure,
  onOpenPortalLogin,
  onOpenGoogleDrive,
  onOpenGoogleSheets,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { currentUser, logout, setActivePortalView } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-6">
          
          {/* Zone 1: Brand Zone */}
          <a href="#" className="flex items-center gap-3.5 group shrink-0">
            <img
              src="/assets/aistudio/UMPontianak_Logo_Warna_2e912afe.png"
              alt="Logo Universitas Muhammadiyah Pontianak"
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors leading-tight">
                Magister Kesehatan Masyarakat
              </span>
              <span className="text-xs font-semibold text-blue-800 tracking-wide">
                FIKPsi UM Pontianak
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links (Single-line, clean, Peminatan updated) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#profil" className="hover:text-blue-900 transition-colors whitespace-nowrap">
              Profil & Visi
            </a>
            <a href="#peminatan" className="hover:text-blue-900 transition-colors whitespace-nowrap">
              Peminatan
            </a>
            <a href="#kurikulum" className="hover:text-blue-900 transition-colors whitespace-nowrap">
              Kurikulum
            </a>
            <a href="#pelayanan-akademik" className="hover:text-blue-900 text-amber-700 font-bold transition-colors whitespace-nowrap flex items-center gap-1">
              <span>Layanan Tesis & Kuliah</span>
            </a>
            <a href="#biaya" className="hover:text-blue-900 transition-colors whitespace-nowrap">
              Simulasi Biaya
            </a>
            <a href="#pendaftaran" className="hover:text-blue-900 transition-colors whitespace-nowrap">
              Jalur PMB
            </a>
            <a href="#faq" className="hover:text-blue-900 transition-colors whitespace-nowrap">
              FAQ
            </a>
          </nav>

          {/* Zone 3: Primary Actions & User Portal Controls */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            
            {/* If logged in */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/80 hover:bg-blue-100/80 text-blue-950 flex items-center gap-2 text-xs font-bold transition-all shadow-sm"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-900 text-amber-300 flex items-center justify-center text-[10px] font-bold">
                    {currentUser.avatarInitial}
                  </span>
                  <div className="text-left">
                    <span className="block truncate max-w-[120px]">{currentUser.name}</span>
                    <span className="text-[10px] font-semibold text-blue-700 capitalize">
                      Portal {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-blue-800" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="font-bold text-slate-900 truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{currentUser.identifier}</div>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setActivePortalView(currentUser.role as any);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 text-blue-900 font-semibold flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Buka Dashboard {currentUser.role?.toUpperCase()}</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-2 border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Pilihan Masuk Cepat: Mahasiswa, Dosen, Admin */
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase px-2 hidden xl:inline">Masuk:</span>
                <button
                  onClick={() => onOpenPortalLogin('mahasiswa')}
                  className="px-2.5 py-1.5 text-xs font-bold text-blue-900 hover:bg-white rounded-lg transition-all flex items-center gap-1 shadow-none hover:shadow-sm"
                  title="Masuk Portal Mahasiswa (Tesis & Pembelajaran)"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Mahasiswa</span>
                </button>
                <button
                  onClick={() => onOpenPortalLogin('dosen')}
                  className="px-2.5 py-1.5 text-xs font-bold text-amber-900 hover:bg-white rounded-lg transition-all flex items-center gap-1 shadow-none hover:shadow-sm"
                  title="Masuk Portal Dosen (Bimbingan & Pengajaran)"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Dosen</span>
                </button>
                <button
                  onClick={() => onOpenPortalLogin('admin')}
                  className="px-2.5 py-1.5 text-xs font-bold text-emerald-900 hover:bg-white rounded-lg transition-all flex items-center gap-1 shadow-none hover:shadow-sm"
                  title="Masuk Portal Admin"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Admin</span>
                </button>
              </div>
            )}

            {onOpenGoogleDrive && (
              <button
                onClick={onOpenGoogleDrive}
                className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                title="Buka Google Drive Akademik MKM"
              >
                <svg viewBox="0 0 87.3 78" className="w-3.5 h-3.5 shrink-0">
                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                  <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                  <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                  <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                  <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                  <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                </svg>
                <span>Google Drive</span>
              </button>
            )}

            {onOpenGoogleSheets && (
              <button
                onClick={onOpenGoogleSheets}
                className="px-3 py-2 text-xs font-semibold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                title="Buka Google Sheets Akademik MKM"
              >
                <svg viewBox="0 0 48 48" className="w-3.5 h-3.5 shrink-0">
                  <path fill="#0F9D58" d="M37 45H11c-2.2 0-4-1.8-4-4V7c0-2.2 1.8-4 4-4h18l12 12v26c0 2.2-1.8 4-4 4z"/>
                  <path fill="#87CEAC" d="M29 3v12h12"/>
                  <path fill="#F1F1F1" d="M14 22h20v4H14zm0 6h20v4H14zm0 6h20v4H14z"/>
                  <path fill="#0F9D58" d="M23 22h2v16h-2z"/>
                </svg>
                <span>Google Sheets</span>
              </button>
            )}

            <button
              onClick={onOpenBrochure}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              Unduh Brosur
            </button>

            <button
              onClick={onOpenRegister}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Daftar PMB S2</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => onOpenPortalLogin('admin')}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg whitespace-nowrap flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>Portal</span>
            </button>
            <button
              onClick={onOpenRegister}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-900 rounded-lg whitespace-nowrap"
            >
              Daftar
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          
          {currentUser && (
            <div className="p-3 bg-blue-50 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-blue-950 block">{currentUser.name}</span>
                <span className="text-[10px] text-blue-700 font-medium">Portal {currentUser.role?.toUpperCase()}</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActivePortalView(currentUser.role as any);
                }}
                className="px-2.5 py-1 text-xs font-bold text-white bg-blue-900 rounded-lg"
              >
                Buka Panel
              </button>
            </div>
          )}

          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <a
              href="#profil"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              Profil & Visi
            </a>
            <a
              href="#peminatan"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              Peminatan Studi
            </a>
            <a
              href="#kurikulum"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              Struktur Kurikulum
            </a>
            <a
              href="#pelayanan-akademik"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-amber-50 transition-colors text-amber-900 font-bold flex items-center justify-between"
            >
              <span>Layanan Tesis & Pembelajaran</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-semibold">Dosen & Mhs</span>
            </a>
            <a
              href="#biaya"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              Simulasi Biaya Kuliah
            </a>
            <a
              href="#pendaftaran"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              Jalur & Syarat PMB
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              Tanya Jawab (FAQ)
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {!currentUser && (
              <div className="space-y-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-600 block px-1">Pilihan Masuk Portal:</span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenPortalLogin('mahasiswa');
                    }}
                    className="py-2 px-1 text-xs font-bold text-blue-900 bg-blue-100/80 hover:bg-blue-200 rounded-lg text-center flex flex-col items-center justify-center gap-1"
                  >
                    <GraduationCap className="w-4 h-4 text-blue-700" />
                    <span>Mahasiswa</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenPortalLogin('dosen');
                    }}
                    className="py-2 px-1 text-xs font-bold text-amber-900 bg-amber-100/80 hover:bg-amber-200 rounded-lg text-center flex flex-col items-center justify-center gap-1"
                  >
                    <UserCheck className="w-4 h-4 text-amber-700" />
                    <span>Dosen</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenPortalLogin('admin');
                    }}
                    className="py-2 px-1 text-xs font-bold text-emerald-900 bg-emerald-100/80 hover:bg-emerald-200 rounded-lg text-center flex flex-col items-center justify-center gap-1"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>
            )}
            {onOpenGoogleDrive && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenGoogleDrive();
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg text-center flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 87.3 78" className="w-4 h-4 shrink-0">
                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                  <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                  <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                  <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                  <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                  <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                </svg>
                <span>Google Drive Akademik</span>
              </button>
            )}
            {onOpenGoogleSheets && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenGoogleSheets();
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-center flex items-center justify-center gap-2 border border-emerald-200"
              >
                <svg viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
                  <path fill="#0F9D58" d="M37 45H11c-2.2 0-4-1.8-4-4V7c0-2.2 1.8-4 4-4h18l12 12v26c0 2.2-1.8 4-4 4z"/>
                  <path fill="#87CEAC" d="M29 3v12h12"/>
                  <path fill="#F1F1F1" d="M14 22h20v4H14zm0 6h20v4H14zm0 6h20v4H14z"/>
                  <path fill="#0F9D58" d="M23 22h2v16h-2z"/>
                </svg>
                <span>Google Sheets Akademik</span>
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBrochure();
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg text-center"
            >
              Unduh Brosur Informasi (PDF)
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-900 rounded-lg text-center flex items-center justify-center gap-2"
            >
              <span>Daftar Sekarang / Konsultasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
