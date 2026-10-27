import React from 'react';
import { MapPin, Mail, Phone, ExternalLink, Award, Globe, UserCheck, GraduationCap, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FooterProps {
  onOpenRegister: () => void;
  onOpenBrochure: () => void;
  onOpenPortalLogin: (defaultRole?: 'admin' | 'dosen' | 'mahasiswa') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenRegister,
  onOpenBrochure,
  onOpenPortalLogin,
}) => {
  const { settings, peminatans } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid: Brand & Institutional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src="/assets/aistudio/UMPontianak_Logo_Warna_2e912afe.png"
                alt="Logo Universitas Muhammadiyah Pontianak"
                className="h-14 w-auto object-contain bg-white/10 p-1 rounded-lg"
              />
              <div>
                <span className="text-lg font-bold text-white block leading-tight">
                  Magister Kesehatan Masyarakat
                </span>
                <span className="text-xs font-semibold text-blue-300">
                  FIKPsi · Universitas Muhammadiyah Pontianak
                </span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              Pusat keunggulan pendidikan pascasarjana kesehatan masyarakat di Kalimantan Barat, menghasilkan magister yang berdaya saing global, berintegritas islami, dan berfokus pada ketahanan kesehatan wilayah lahan basah tropis.
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-slate-200">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Akreditasi Baik Sekali LAM-PTKes</span>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-slate-200">
                <span>Gelar M.K.M.</span>
              </span>
            </div>
          </div>

          {/* Portal Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Akses Portal Terpadu
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPortalLogin('mahasiswa')}
                  className="hover:text-blue-300 font-semibold text-slate-300 transition-colors text-left flex items-center gap-1.5"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                  <span>Portal Mahasiswa</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPortalLogin('dosen')}
                  className="hover:text-amber-300 font-semibold text-slate-300 transition-colors text-left flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Portal Dosen</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenPortalLogin('admin')}
                  className="hover:text-emerald-300 font-semibold text-slate-300 transition-colors text-left flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Portal Administrator</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Academic Services (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Layanan Pascasarjana
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="https://tesis.unmuhpnk.ac.id/mkm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Bimbingan Tesis (SIMPATI) ↗
                </a>
              </li>
              <li>
                <a
                  href="https://elearning.unmuhpnk.ac.id/course/index.php?categoryid=mkm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LMS Moodle Pembelajaran ↗
                </a>
              </li>
              <li>
                <a
                  href="https://siakad.unmuhpnk.ac.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  SIAKAD FIKPsi ↗
                </a>
              </li>
              <li>
                <a
                  href="https://digilib.unmuhpnk.ac.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Perpustakaan & Repositori ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Secretariat (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Sekretariat Pascasarjana
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.campusAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${settings.officialEmail}`} className="hover:text-white transition-colors font-mono">
                  {settings.officialEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.hotlineWhatsapp} (Hotline PMB)</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                <span>www.unmuhpnk.ac.id</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Hairline & Legal Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Program Studi Magister Kesehatan Masyarakat (S2). Fakultas Ilmu Kesehatan dan Psikologi Universitas Muhammadiyah Pontianak.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 transition-colors">Tridharma Perguruan Tinggi</span>
            <span>·</span>
            <span className="hover:text-slate-400 transition-colors">AIPTKMI</span>
            <span>·</span>
            <span className="hover:text-slate-400 transition-colors">LAM-PTKes</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
