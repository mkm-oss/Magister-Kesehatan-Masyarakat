import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Send, Phone, Copy, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPeminatan?: string;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  preselectedPeminatan = '',
}) => {
  const { peminatans, addApplicant, settings } = useApp();
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [s1Major, setS1Major] = useState('');
  const [s1Campus, setS1Campus] = useState('');
  const [currentJob, setCurrentJob] = useState('');
  const [selectedPeminatan, setSelectedPeminatan] = useState(
    preselectedPeminatan || peminatans[0]?.name || ''
  );
  const [applicantCategory, setApplicantCategory] = useState<'Umum' | 'Alumni UMP' | 'Mitra Dinkes/RS'>('Umum');
  const [notes, setNotes] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (preselectedPeminatan) {
      setSelectedPeminatan(preselectedPeminatan);
    } else if (peminatans.length > 0 && !selectedPeminatan) {
      setSelectedPeminatan(peminatans[0].name);
    }
  }, [preselectedPeminatan, peminatans]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !whatsapp.trim() || !email.trim()) {
      setErrorMsg('Mohon lengkapi Nama, Nomor WhatsApp, dan Email Anda.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMsg('Mohon masukkan format email yang valid.');
      return;
    }

    // Save applicant record to live state & localStorage via AppContext
    const newRegId = addApplicant({
      fullName,
      whatsapp,
      email,
      s1Major,
      s1Campus,
      currentJob,
      peminatan: selectedPeminatan,
      category: applicantCategory,
      notes,
      status: 'Menunggu Verifikasi',
    });

    setRegistrationId(newRegId);
    setErrorMsg('');
    setSubmitted(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(registrationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWhatsAppShareUrl = () => {
    const text = `Halo Panitia PMB S2 Kesehatan Masyarakat FIKPsi UM Pontianak, saya telah mengisi formulir minat PMB:
- No. Registrasi: ${registrationId}
- Nama: ${fullName}
- Pilihan Peminatan: ${selectedPeminatan}
- Asal S1: ${s1Major} (${s1Campus || 'Perguruan Tinggi'})
- Instansi/Pekerjaan: ${currentJob || '-'}
- Kategori: ${applicantCategory}

Mohon informasi langkah selanjutnya dan jadwal seleksi wawancara pascasarjana. Terima kasih!`;
    const cleanNumber = settings.hotlineWhatsapp.replace(/\D/g, '') || '6281256789012';
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-blue-900 text-white">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/UMPontianak_Logo_Warna_2e912afe.png"
              alt="Logo UM Pontianak"
              className="h-9 w-auto bg-white/10 p-1 rounded"
            />
            <div>
              <h3 className="text-base font-bold text-white">
                Formulir Pendaftaran & Konsultasi PMB S2
              </h3>
              <p className="text-xs text-blue-200">
                Magister Kesehatan Masyarakat FIKPsi UM Pontianak
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {submitted ? (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl font-bold text-slate-900">
                  Data Registrasi Berhasil Dikirim!
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Terima kasih, <strong>{fullName}</strong>. Data calon mahasiswa pascasarjana telah tercatat di basis data PMB MKM FIKPsi UM Pontianak.
                </p>
              </div>

              {/* Registration Ticket Card */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Nomor Registrasi Sementara:</span>
                  <span className="font-semibold text-emerald-700">Tersimpan di Sistem</span>
                </div>
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                  <span className="font-mono font-bold text-lg text-blue-900">
                    {registrationId}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="p-1.5 text-slate-500 hover:text-blue-900 rounded hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>Pilihan Peminatan:</strong> {selectedPeminatan}</div>
                  <div><strong>Email Konfirmasi:</strong> {email}</div>
                  <div><strong>Email Resmi Prodi:</strong> {settings.officialEmail}</div>
                </div>
              </div>

              {/* Next Step Action */}
              <div className="space-y-3 max-w-md mx-auto pt-2">
                <a
                  href={getWhatsAppShareUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Kirim Data ke WhatsApp Panitia PMB Sekarang</span>
                </a>
                <p className="text-xs text-slate-500">
                  Menghubungkan langsung dengan staf sekretariat pascasarjana FIKPsi untuk panduan pembayaran pendaftaran dan verifikasi berkas.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Selesai & Tutup
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
                  {errorMsg}
                </div>
              )}

              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Nama Lengkap & Gelar (Sesuai Ijazah S1) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: dr. Ahmad Fauzi / Ns. Siti Nurhaliza, S.Kep."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900"
                />
              </div>

              {/* WhatsApp & Email (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Alamat Email Aktif <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900"
                  />
                </div>
              </div>

              {/* S1 Major & S1 Campus */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Program Studi S1 Sebelumnya
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Kesehatan Masyarakat / Kedokteran / Keperawatan"
                    value={s1Major}
                    onChange={(e) => setS1Major(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Asal Perguruan Tinggi S1
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Universitas Muhammadiyah Pontianak"
                    value={s1Campus}
                    onChange={(e) => setS1Campus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900"
                  />
                </div>
              </div>

              {/* Current Job & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Instansi / Unit Kerja Saat Ini
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: RSUD dr. Soedarso / Puskesmas / PT Sawit"
                    value={currentJob}
                    onChange={(e) => setCurrentJob(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Kategori Pendaftar
                  </label>
                  <select
                    value={applicantCategory}
                    onChange={(e) => setApplicantCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 bg-white"
                  >
                    <option value="Umum">Umum / Mandiri</option>
                    <option value="Alumni UMP">Alumni S1 UM Pontianak (Subsidi Khusus)</option>
                    <option value="Mitra Dinkes/RS">Mitra Instansi / Rumah Sakit / Dinkes</option>
                  </select>
                </div>
              </div>

              {/* Pilihan Peminatan Studi */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Rencana Peminatan Studi <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedPeminatan}
                  onChange={(e) => setSelectedPeminatan(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 bg-white font-medium text-slate-900"
                >
                  {peminatans.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.shortName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Catatan / Rencana Riset */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Rencana Topik Riset Tesis / Catatan Konsultasi (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Tuliskan topik kesehatan yang ingin Anda kaji atau pertanyaan khusus mengenai jadwal perkuliahan..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Formulir Pendaftaran PMB</span>
                </button>
                <p className="text-[11px] text-slate-500 text-center mt-2">
                  Dengan mengirim formulir ini, data pendaftaran Anda akan tersimpan di sistem PMB FIKPsi UM Pontianak.
                </p>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
