import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, UserCheck, GraduationCap, ArrowRight, KeyRound, LogIn } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PortalLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'admin' | 'dosen' | 'mahasiswa';
}

export const PortalLoginModal: React.FC<PortalLoginModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'admin',
}) => {
  const { login } = useApp();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'dosen' | 'mahasiswa'>(defaultRole);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [customName, setCustomName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedRole(defaultRole);
      setErrorMsg('');
      setUsername('');
      setPassword('');
    }
  }, [isOpen, defaultRole]);

  if (!isOpen) return null;

  const handleRoleChange = (role: 'admin' | 'dosen' | 'mahasiswa') => {
    setSelectedRole(role);
    setErrorMsg('');
    setUsername('');
    setPassword('');
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Mohon masukkan Username / NIDN / NIM.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Mohon masukkan Password.');
      return;
    }

    login(selectedRole, username, customName || undefined);
    onClose();
  };

  const handleQuickDemoLogin = (role: 'admin' | 'dosen' | 'mahasiswa') => {
    if (role === 'admin') {
      login('admin', 'admin.mkm', 'Administrator Pascasarjana MKM');
    } else if (role === 'dosen') {
      login('dosen', 'NIDN: 1102047801', 'Dr. Rochmawati, S.KM., M.Kes.');
    } else {
      login('mahasiswa', 'NIM: 241021004', 'Ahmad Fauzi, S.KM.');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/UMPontianak_Logo_Warna_2e912afe.png"
              alt="Logo UM Pontianak"
              className="h-9 w-auto bg-white/10 p-1 rounded"
            />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Portal Sivitas Akademika MKM
              </h3>
              <p className="text-[11px] text-slate-300">
                FIKPsi Universitas Muhammadiyah Pontianak
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 p-2 bg-slate-100 border-b border-slate-200 gap-1.5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`py-2.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              selectedRole === 'admin'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('dosen')}
            className={`py-2.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              selectedRole === 'dosen'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Dosen</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('mahasiswa')}
            className={`py-2.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              selectedRole === 'mahasiswa'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Mahasiswa</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          
          {/* Role Description Banner */}
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 flex items-start gap-2.5">
            <KeyRound className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
            <div>
              {selectedRole === 'admin' && (
                <span>
                  <strong>Portal Administrator:</strong> Kelola penuh seluruh konten website, ubah peminatan, kurikulum, data dosen, biaya, serta pantau pendaftar PMB.
                </span>
              )}
              {selectedRole === 'dosen' && (
                <span>
                  <strong>Portal Dosen:</strong> Akses cepat ke Kelas Online (LMS), Sistem Bimbingan Tesis, SIAKAD nilai, dan presensi perkuliahan pascasarjana.
                </span>
              )}
              {selectedRole === 'mahasiswa' && (
                <span>
                  <strong>Portal Mahasiswa:</strong> Tautan langsung perkuliahan daring (LMS), monitoring pengajuan & logbook tesis, jadwal kuliah, dan SIAKAD.
                </span>
              )}
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
              {errorMsg}
            </div>
          )}

          {/* Quick 1-Click Login Button */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin(selectedRole)}
              className="w-full py-2.5 px-4 text-xs font-semibold text-blue-950 bg-amber-300 hover:bg-amber-400 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>
                Masuk Cepat Sebagai {selectedRole === 'admin' ? 'Admin' : selectedRole === 'dosen' ? 'Dosen' : 'Mahasiswa'} (1-Klik)
              </span>
            </button>
            <span className="text-[10px] text-slate-400 block text-center">
              Akses instan tanpa perlu ketik username/password
            </span>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-xs uppercase">atau masuk dengan akun</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Custom Form */}
          <form onSubmit={handleCustomLogin} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                {selectedRole === 'admin'
                  ? 'Username Admin'
                  : selectedRole === 'dosen'
                  ? 'NIDN / Akun Dosen'
                  : 'NIM / Akun Mahasiswa'}
              </label>
              <input
                type="text"
                placeholder={
                  selectedRole === 'admin'
                    ? 'admin'
                    : selectedRole === 'dosen'
                    ? '1102047801'
                    : '241021004'
                }
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Nama Tampilan (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: dr. Budi Santoso"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow transition-colors flex items-center justify-center gap-2 pt-2"
            >
              <span>Masuk ke Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
