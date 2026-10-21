import React from 'react';
import { X, Printer, Download, MapPin, Mail, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
}

export const BrochureModal: React.FC<BrochureModalProps> = ({ isOpen, onClose, onOpenRegister }) => {
  const { peminatans, settings } = useApp();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 print:border-none print:shadow-none print:max-w-none print:rounded-none">
        
        {/* Modal Top Actions (Hidden in print) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <Download className="w-4 h-4 text-amber-400" />
            <span>Lembar Informasi Resmi & Brosur Digital MKM</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Brochure Document Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[82vh] overflow-y-auto print:max-h-none print:overflow-visible text-slate-800">
          
          {/* Institutional Header */}
          <div className="flex items-center justify-between border-b-2 border-blue-900 pb-5">
            <div className="flex items-center gap-4">
              <img
                src="/assets/aistudio/UMPontianak_Logo_Warna_2e912afe.png"
                alt="Logo UM Pontianak"
                className="h-16 w-auto object-contain"
              />
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-blue-900 uppercase tracking-tight leading-tight">
                  Universitas Muhammadiyah Pontianak
                </h2>
                <h3 className="text-sm font-bold text-slate-800 uppercase">
                  Fakultas Ilmu Kesehatan & Psikologi (FIKPsi)
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Program Studi Magister Kesehatan Masyarakat (S2) · Akreditasi Baik Sekali (LAM-PTKes)
                </p>
              </div>
            </div>
            <div className="hidden sm:block text-right text-xs text-slate-500 font-mono">
              <span className="font-bold text-slate-900 block text-sm">Gelar: M.K.M.</span>
              <span>Beban: 38 SKS</span>
            </div>
          </div>

          {/* Value Prop Banner */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs sm:text-sm text-slate-700 space-y-1.5">
            <div className="font-bold text-blue-900">
              Pusat Pendidikan Pascasarjana Kesehatan Berbasis Lahan Basah & Pesisir Tropis
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              MKM FIKPsi UM Pontianak menyelenggarakan pendidikan magister berkualitas tinggi dengan kurikulum fleksibel (Hybrid / Kuliah Akhir Pekan), bimbingan penulisan naskah publikasi jurnal bereputasi internasional, serta jejaring kerjasama rumah sakit, dinas kesehatan, dan sektor industri di Kalimantan Barat.
            </p>
          </div>

          {/* 4 Peminatan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
              {peminatans.length} Pilihan Peminatan Studi Utama:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {peminatans.map((c) => (
                <div key={c.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 text-xs">
                  <div className="font-bold text-slate-900 text-sm mb-1">{c.name}</div>
                  <div className="text-slate-600 line-clamp-2 leading-relaxed">{c.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Facts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900">Masa Studi Terarah</div>
              <p className="text-slate-600 mt-0.5">3 hingga 4 Semester (Dapat ditempuh 1,5 tahun)</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900">Metode Perkuliahan</div>
              <p className="text-slate-600 mt-0.5">Blended / Weekend Hybrid (Daring & Tatap Muka)</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-900">Jalur Penerimaan</div>
              <p className="text-slate-600 mt-0.5">S1 Kesehatan & Non-Kesehatan (+ Matrikulasi)</p>
            </div>
          </div>

          {/* Syarat & Jadwal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="border border-slate-200 rounded-lg p-3 space-y-1.5">
              <div className="font-bold text-slate-900">Persyaratan Masuk:</div>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                <li>Ijazah & Transkrip S1 Legalisir (IPK min 2.75)</li>
                <li>Scan KTP & Kartu Keluarga</li>
                <li>Pasfoto formal digital terbaru</li>
                <li>Rekomendasi pimpinan instansi (jika ada)</li>
              </ul>
            </div>
            <div className="border border-slate-200 rounded-lg p-3 space-y-1.5">
              <div className="font-bold text-slate-900">Jadwal Gelombang PMB:</div>
              <div className="space-y-1 text-slate-600">
                <div><strong>Gelombang I:</strong> {settings.pmbBatchDeadline}</div>
                <div><strong>Gelombang II:</strong> 1 Juni - 31 Agustus 2026</div>
                <div><strong>Kuliah Perdana:</strong> September 2026</div>
              </div>
            </div>
          </div>

          {/* Official Contact Box */}
          <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2">
            <div className="font-bold text-amber-400">Sekretariat Pendaftaran Pascasarjana:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{settings.campusAddress}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{settings.officialEmail}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>WA PMB: {settings.hotlineWhatsapp}</span>
              </div>
            </div>
          </div>

          {/* Action button inside brochure modal */}
          <div className="pt-2 flex items-center justify-between print:hidden">
            <button
              onClick={handlePrint}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Halaman Ini</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenRegister();
              }}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow transition-colors"
            >
              Daftar Sekarang Secara Online
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
