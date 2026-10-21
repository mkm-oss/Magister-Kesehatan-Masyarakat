import React, { useState } from 'react';
import { Menu, X, ArrowRight, User, ShieldCheck, LogOut, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  onOpenRegister: () => void;
  onOpenBrochure: () => void;
  onOpenPortalLogin: (defaultRole?: 'admin' | 'dosen' | 'mahasiswa') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRegister,
  onOpenBrochure,
  onOpenPortalLogin,
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
              /* Portal Login Button for Guest */
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenPortalLogin('admin')}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  title="Login Portal Dosen, Mahasiswa, atau Admin"
                >
                  <User className="w-3.5 h-3.5 text-blue-900" />
                  <span>Portal Login</span>
                </button>
              </div>
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
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPortalLogin('admin');
                }}
                className="w-full py-2.5 px-4 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg text-center flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Portal Login (Admin / Dosen / Mahasiswa)</span>
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
