import React, { useState, useEffect } from 'react';
import { X, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PortalLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'superadmin' | 'admin' | 'dosen' | 'mahasiswa';
}

export const PortalLoginModal: React.FC<PortalLoginModalProps> = ({
  isOpen,
  onClose,
  defaultRole,
}) => {
  const { login, validatePortalLogin } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setErrorMsg('');
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim()) {
      setErrorMsg('Silakan masukkan Email, NIDN, atau NIM.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Silakan masukkan Password / Kata Sandi.');
      return;
    }

    setIsLoading(true);

    const validation = validatePortalLogin(username, password, defaultRole);
    if (!validation.success) {
      setErrorMsg(validation.message || 'Identitas atau password tidak sesuai.');
      setIsLoading(false);
      return;
    }

    const matched = validation.user!;
    login(matched.role, matched.email || matched.id, matched.name);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Tombol Tutup (X) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors z-20 cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* KOP RESMI INSTITUSI */}
        <div className="pt-6 px-6 pb-3 bg-white">
          <div className="flex items-center gap-3.5 pr-8">
            <img
              src="/assets/aistudio/UMPontianak_Logo_Warna_2e912afe.png"
              alt="Logo Universitas Muhammadiyah Pontianak"
              className="h-16 w-auto object-contain shrink-0"
            />
            <div className="flex flex-col text-left">
              <span className="text-[13px] sm:text-[14px] font-black text-[#032B5B] tracking-tight leading-tight uppercase">
                UNIVERSITAS MUHAMMADIYAH PONTIANAK
              </span>
              <span className="text-[11px] sm:text-[12px] font-extrabold text-slate-800 tracking-normal leading-tight uppercase mt-0.5">
                FAKULTAS ILMU KESEHATAN DAN PSIKOLOGI
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-600 leading-tight uppercase mt-0.5">
                PROGRAM STUDI MAGISTER KESEHATAN MASYARAKAT
              </span>
              <span className="text-[9px] text-slate-500 font-medium leading-none mt-1">
                Jl. Jenderal Ahmad Yani No. 111, Pontianak 78124
              </span>
            </div>
          </div>

          {/* Garis Batas Kop Standar Institusi (Ganda: Tebal + Tipis) */}
          <div className="mt-3.5">
            <div className="h-[2.5px] bg-slate-900 w-full" />
            <div className="h-[1px] bg-slate-400 w-full mt-[2px]" />
          </div>
        </div>

        {/* KOLOM LOGIN SAJA */}
        <div className="p-6 pt-4 space-y-4">
          <div className="text-center pb-1">
            <h3 className="text-base font-extrabold text-[#032B5B]">
              LOGIN PORTAL AKADEMIK
            </h3>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Kolom 1: Email / Username / NIDN / NIM */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-slate-700">
                Email / ID Pengguna
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Email, NIDN, atau NIM"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#054DA0]/20 focus:border-[#054DA0] transition-colors"
                />
              </div>
            </div>

            {/* Kolom 2: Password / Kata Sandi */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-slate-700">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#054DA0]/20 focus:border-[#054DA0] transition-colors font-mono"
                />
              </div>
            </div>

            {/* Tombol Submit Masuk */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#032B5B] hover:bg-[#054DA0] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-70"
              >
                <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
