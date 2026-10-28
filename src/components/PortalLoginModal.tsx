import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, UserCheck, GraduationCap, ArrowRight, KeyRound, LogIn } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PortalLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'superadmin' | 'admin' | 'dosen' | 'mahasiswa';
}

export const PortalLoginModal: React.FC<PortalLoginModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'superadmin',
}) => {
  const { login, portalUsers, validatePortalLogin } = useApp();
  const [selectedRole, setSelectedRole] = useState<'superadmin' | 'admin' | 'dosen' | 'mahasiswa'>(defaultRole);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [customName, setCustomName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedRole(defaultRole);
      setErrorMsg('');
      const defaultUser = portalUsers.find((u) => u.role === defaultRole);
      if (defaultUser) {
        setUsername(defaultUser.email);
        setPassword('');
        setCustomName(defaultUser.name);
      } else {
        setUsername('');
        setPassword('');
      }
    }
  }, [isOpen, defaultRole, portalUsers]);

  if (!isOpen) return null;

  const handleRoleChange = (role: 'superadmin' | 'admin' | 'dosen' | 'mahasiswa') => {
    setSelectedRole(role);
    setErrorMsg('');
    const user = portalUsers.find((u) => u.role === role);
    if (user) {
      setUsername(user.email);
      setPassword('');
      setCustomName(user.name);
    } else {
      setUsername('');
      setPassword('');
    }
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Mohon masukkan Email / NIDN / NIM.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Mohon masukkan PIN / Password untuk masuk ke portal.');
      return;
    }

    const validation = validatePortalLogin(username, password, selectedRole);
    if (!validation.success) {
      setErrorMsg(validation.message || 'Password atau identitas tidak sesuai.');
      return;
    }

    const matched = validation.user!;
    login(matched.role, matched.email || matched.id, customName.trim() || matched.name);
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

        {/* Role Selector Tabs (4 Roles including Superadmin) */}
        <div className="grid grid-cols-4 p-2 bg-slate-100 border-b border-slate-200 gap-1 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => handleRoleChange('superadmin')}
            className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all text-center ${
              selectedRole === 'superadmin'
                ? 'bg-amber-600 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Superadmin</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all text-center ${
              selectedRole === 'admin'
                ? 'bg-blue-900 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('dosen')}
            className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all text-center ${
              selectedRole === 'dosen'
                ? 'bg-blue-900 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Dosen</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('mahasiswa')}
            className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all text-center ${
              selectedRole === 'mahasiswa'
                ? 'bg-blue-900 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Mahasiswa</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          
          {/* Role Description Banner */}
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 flex items-start gap-2.5">
            <KeyRound className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
            <div>
              {selectedRole === 'superadmin' && (
                <span>
                  <strong className="text-amber-800">Akses Super Administrator:</strong> Hak akses tak terbatas untuk mengedit seluruh bagian aplikasi, membuat pengguna baru, menyusun menu & sub-menu, serta membuat halaman publik baru.
                </span>
              )}
              {selectedRole === 'admin' && (
                <span>
                  <strong>Portal Administrator:</strong> Kelola konten website, ubah peminatan, kurikulum, data dosen, biaya, serta pantau pendaftar PMB.
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

          {/* Akun Pengguna Terdaftar (Hanya Email / Username, Password Tetap Rahasia) */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Pilih Akun ({portalUsers.length} Pengguna Terdaftar):
              </span>
              <span className="text-[10px] text-slate-400">
                Klik untuk isi Email/ID
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {portalUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    setSelectedRole(u.role);
                    setUsername(u.email);
                    setPassword(''); // Wajib diisi manual oleh pengguna!
                    setCustomName(u.name);
                    setErrorMsg('');
                  }}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedRole === u.role && username === u.email
                      ? 'bg-blue-900 text-white shadow-xs'
                      : u.role === 'admin'
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300/40'
                      : u.role === 'dosen'
                      ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300/40'
                      : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-300/40'
                  }`}
                  title={u.name}
                >
                  <span>{u.role === 'admin' ? '⚙️' : u.role === 'dosen' ? '👨‍🏫' : '🎓'}</span>
                  <span className="font-semibold">{u.email}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-xs font-semibold uppercase">
              Masukkan Kredensial Masuk
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Custom Form */}
          <form onSubmit={handleCustomLogin} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                {selectedRole === 'admin'
                  ? 'Email / Username Admin'
                  : selectedRole === 'dosen'
                  ? 'Email / NIDN Dosen'
                  : 'Email / NIM Mahasiswa'}
              </label>
              <input
                type="text"
                placeholder={
                  selectedRole === 'admin'
                    ? 'admin@contoh.ac.id'
                    : selectedRole === 'dosen'
                    ? 'dosen@contoh.ac.id'
                    : 'mahasiswa@contoh.ac.id'
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
