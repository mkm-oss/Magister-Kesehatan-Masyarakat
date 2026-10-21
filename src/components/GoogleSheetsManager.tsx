import React, { useState, useEffect } from 'react';
import {
  signInWithGoogleDrive,
  signOutGoogleDrive,
  initDriveAuth,
  getDriveAccessToken,
} from '../services/googleDriveAuth';
import {
  createSpreadsheet,
  getSpreadsheetMetadata,
  getSpreadsheetValues,
  updateSpreadsheetValues,
  exportApplicantsToGoogleSheet,
  exportGradebookToGoogleSheet,
  listSpreadsheets,
  SpreadsheetInfo,
} from '../services/googleSheetsService';
import { DriveFile, formatDriveDate } from '../services/googleDriveService';
import { useApp } from '../context/AppContext';
import { User } from 'firebase/auth';
import {
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Download,
  Table,
  Eye,
  LogOut,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface GoogleSheetsManagerProps {
  title?: string;
  defaultAction?: 'none' | 'export_applicants';
  compact?: boolean;
}

export const GoogleSheetsManager: React.FC<GoogleSheetsManagerProps> = ({
  title = 'Google Sheets Akademik MKM UM Pontianak',
  defaultAction = 'none',
  compact = false,
}) => {
  const { applicants } = useApp();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sheetsList, setSheetsList] = useState<DriveFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Selected Spreadsheet for In-App Data Preview
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null);
  const [previewMetadata, setPreviewMetadata] = useState<SpreadsheetInfo | null>(null);
  const [previewValues, setPreviewValues] = useState<string[][]>([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // New Sheet Modal
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [newSheetTitle, setNewSheetTitle] = useState('');

  // Gradebook Modal for Dosen
  const [isCreatingGradebook, setIsCreatingGradebook] = useState(false);
  const [gradebookCourse, setGradebookCourse] = useState('Epidemiologi Lahan Basah & Pesisir');
  const [gradebookSemester, setGradebookSemester] = useState('Semester II (2026/2027)');

  // Destructive Action Confirmation State
  const [confirmModalData, setConfirmModalData] = useState<{
    actionTitle: string;
    description: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  // Initialize Auth Listener
  useEffect(() => {
    const unsubscribe = initDriveAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        fetchSheets(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setSheetsList([]);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  const fetchSheets = async (accessToken: string, query = searchQuery) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const result = await listSpreadsheets(accessToken, query);
      setSheetsList(result);
    } catch (err: any) {
      console.error('Fetch sheets error:', err);
      setErrorMsg(err.message || 'Gagal mengambil daftar spreadsheet dari Google Drive');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await signInWithGoogleDrive();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        await fetchSheets(res.accessToken);
        showSuccess(`Berhasil menghubungkan Google Sheets (${res.user.email})`);
      }
    } catch (err: any) {
      console.error('Sign in failed:', err);
      setErrorMsg(
        err.message || 'Gagal menghubungkan Google Account. Pastikan pop-up tidak diblokir.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutGoogleDrive();
      setUser(null);
      setToken(null);
      setSheetsList([]);
      setSelectedSheetId(null);
      setPreviewValues([]);
      showSuccess('Google Account berhasil diputuskan.');
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  // Preview Spreadsheet Content
  const handlePreviewSheet = async (file: DriveFile) => {
    if (!token) return;
    setSelectedSheetId(file.id);
    setLoadingPreview(true);
    setErrorMsg('');
    try {
      const meta = await getSpreadsheetMetadata(token, file.id);
      setPreviewMetadata(meta);

      const firstTab = meta.sheets[0]?.title || 'Sheet1';
      const values = await getSpreadsheetValues(token, file.id, `'${firstTab}'!A1:Z30`);
      setPreviewValues(values);
    } catch (err: any) {
      console.error('Preview error:', err);
      setErrorMsg(`Gagal membaca isi spreadsheet: ${err.message}`);
    } finally {
      setLoadingPreview(false);
    }
  };

  // Create Custom Spreadsheet
  const handleCreateCustomSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newSheetTitle.trim()) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const created = await createSpreadsheet(token, newSheetTitle.trim());
      showSuccess(`Spreadsheet "${created.title}" berhasil dibuat di Google Drive!`);
      setNewSheetTitle('');
      setIsCreatingSheet(false);
      await fetchSheets(token);
      // Auto open preview
      await handlePreviewSheet({
        id: created.spreadsheetId,
        name: created.title,
        mimeType: 'application/vnd.google-apps.spreadsheet',
        webViewLink: created.spreadsheetUrl,
      });
    } catch (err: any) {
      console.error('Create sheet error:', err);
      setErrorMsg(err.message || 'Gagal membuat spreadsheet');
    } finally {
      setLoading(false);
    }
  };

  // Export Applicants to Google Sheets
  const handleExportApplicants = async () => {
    if (!token) {
      handleSignIn();
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const result = await exportApplicantsToGoogleSheet(
        token,
        applicants,
        `Data Calon Mahasiswa S2 MKM UM Pontianak (${new Date().toLocaleDateString('id-ID')})`
      );
      showSuccess(
        `Berhasil mengekspor ${result.totalApplicants} data calon mahasiswa ke Google Sheets!`
      );
      await fetchSheets(token);
      await handlePreviewSheet({
        id: result.spreadsheetId,
        name: `Data Calon Mahasiswa S2 MKM`,
        mimeType: 'application/vnd.google-apps.spreadsheet',
        webViewLink: result.spreadsheetUrl,
      });
    } catch (err: any) {
      console.error('Export error:', err);
      setErrorMsg(err.message || 'Gagal mengekspor pendaftar ke Google Sheets');
    } finally {
      setLoading(false);
    }
  };

  // Export Gradebook Template
  const handleExportGradebook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const dosenName = user?.displayName || 'Dosen Pengampu MKM';
      const result = await exportGradebookToGoogleSheet(
        token,
        gradebookCourse,
        dosenName,
        gradebookSemester
      );
      showSuccess(`Template Rekap Nilai & Presensi untuk "${gradebookCourse}" berhasil dibuat!`);
      setIsCreatingGradebook(false);
      await fetchSheets(token);
      await handlePreviewSheet({
        id: result.spreadsheetId,
        name: `Rekap Nilai - ${gradebookCourse}`,
        mimeType: 'application/vnd.google-apps.spreadsheet',
        webViewLink: result.spreadsheetUrl,
      });
    } catch (err: any) {
      console.error('Gradebook export error:', err);
      setErrorMsg(err.message || 'Gagal membuat template rekap nilai');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Header */}
      <div className="p-5 sm:p-6 bg-emerald-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center p-2 border border-emerald-500/30">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-white leading-tight flex items-center gap-2">
              <span>{title}</span>
              <span className="text-[10px] font-semibold bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                Google Sheets API
              </span>
            </h3>
            <p className="text-xs text-emerald-200/80">
              Sinkronisasi Rekap PMB, Nilai Akademik, Presensi & Data Penelitian Pascasarjana
            </p>
          </div>
        </div>

        {/* User Status / Connect Button */}
        <div>
          {user ? (
            <div className="flex items-center gap-3 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                  {user.displayName?.[0] || 'U'}
                </div>
              )}
              <div className="text-left text-xs">
                <span className="font-bold block text-white truncate max-w-[130px]">
                  {user.displayName || 'Pengguna Sheets'}
                </span>
                <span className="text-[10px] text-emerald-200 truncate max-w-[130px] block">
                  {user.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1 text-emerald-300 hover:text-white rounded hover:bg-white/10 transition-colors ml-1"
                title="Putuskan sambungan Google Sheets"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="px-4 py-2 bg-white text-slate-800 hover:bg-emerald-50 font-semibold text-xs rounded-xl shadow transition-all flex items-center gap-2.5 border border-emerald-300 active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>{loading ? 'Menghubungkan...' : 'Hubungkan Akun Google'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Alert Notifications */}
      {errorMsg && (
        <div className="p-3 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs flex items-center gap-2 px-6">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 px-6">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Content Area */}
      {!user ? (
        <div className="p-10 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Integrasi Google Sheets untuk Data PMB & Akademik MKM
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Koneksikan akun Google Anda untuk mengekspor pendaftar PMB secara instan ke spreadsheet,
              membuat format rekap nilai dan presensi mahasiswa, serta meninjau data langsung dari portal.
            </p>
          </div>
          <button
            onClick={handleSignIn}
            className="px-6 py-2.5 bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-700 transition-all flex items-center gap-2 mx-auto"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Koneksikan Google Sheets Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari file Google Spreadsheet..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (token) fetchSheets(token, e.target.value);
                }}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/30"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Export Applicants Button */}
              <button
                onClick={handleExportApplicants}
                disabled={loading}
                className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95"
                title="Ekspor seluruh data calon mahasiswa ke Google Sheets baru"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor PMB ({applicants.length} Data)</span>
              </button>

              {/* Create Gradebook Button */}
              <button
                onClick={() => setIsCreatingGradebook(true)}
                className="px-3.5 py-2 text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap"
                title="Buat template rekap nilai mata kuliah untuk Dosen"
              >
                <Table className="w-3.5 h-3.5" />
                <span>Format Nilai Dosen</span>
              </button>

              {/* Create Custom Sheet */}
              <button
                onClick={() => setIsCreatingSheet(true)}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Spreadsheet Baru</span>
              </button>

              {/* Refresh */}
              <button
                onClick={() => token && fetchSheets(token)}
                disabled={loading}
                className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                title="Segarkan daftar spreadsheet"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Grid Layout: Spreadsheet List & Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Spreadsheet List (5 cols on lg) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                <span>Daftar Spreadsheet Google Drive ({sheetsList.length})</span>
                <span>Klik untuk pratinjau</span>
              </div>

              {loading && sheetsList.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 space-y-2 border border-slate-200 rounded-xl">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-emerald-800" />
                  <span>Memuat daftar spreadsheet...</span>
                </div>
              ) : sheetsList.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 space-y-2 border border-slate-200 rounded-xl bg-slate-50">
                  <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="font-semibold text-slate-700">Belum ada spreadsheet.</p>
                  <p className="text-[11px] text-slate-500">
                    Klik "Ekspor PMB" atau "Spreadsheet Baru" untuk membuat lembar kerja pertama Anda.
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                  {sheetsList.map((file) => {
                    const isSelected = selectedSheetId === file.id;
                    return (
                      <div
                        key={file.id}
                        onClick={() => handlePreviewSheet(file)}
                        className={`p-3.5 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'bg-emerald-50/80 border-l-4 border-emerald-600'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 truncate">
                          <FileSpreadsheet
                            className={`w-4 h-4 mt-0.5 shrink-0 ${
                              isSelected ? 'text-emerald-700' : 'text-emerald-600'
                            }`}
                          />
                          <div className="truncate">
                            <span
                              className={`text-xs font-semibold block truncate ${
                                isSelected ? 'text-emerald-950 font-bold' : 'text-slate-900'
                              }`}
                            >
                              {file.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              Dimodifikasi: {formatDriveDate(file.modifiedTime)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 text-slate-400 hover:text-emerald-700 rounded hover:bg-slate-100"
                              title="Buka langsung di Google Sheets"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: In-App Spreadsheet Preview (7 cols on lg) */}
            <div className="lg:col-span-7">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 min-h-[400px] flex flex-col justify-between">
                
                {/* Preview Header */}
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <Table className="w-4 h-4 text-emerald-800" />
                      <h4 className="text-xs font-bold text-slate-900 truncate max-w-xs">
                        {previewMetadata?.title || 'Pratinjau Lembar Kerja (Preview)'}
                      </h4>
                    </div>

                    {previewMetadata?.spreadsheetUrl && (
                      <a
                        href={previewMetadata.spreadsheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <span>Buka di Google Sheets</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Tabs indicator if multi-tab */}
                  {previewMetadata?.sheets && previewMetadata.sheets.length > 1 && (
                    <div className="flex items-center gap-1.5 pt-2 pb-1 overflow-x-auto text-[11px]">
                      <span className="text-slate-400 font-medium">Tab:</span>
                      {previewMetadata.sheets.map((sh) => (
                        <span
                          key={sh.sheetId}
                          className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-semibold"
                        >
                          {sh.title}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Preview Table Body */}
                  <div className="mt-3 overflow-x-auto max-h-[380px] overflow-y-auto border border-slate-200 rounded-lg bg-white">
                    {loadingPreview ? (
                      <div className="p-12 text-center text-xs text-slate-500 space-y-2">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto text-emerald-800" />
                        <span>Membaca data sel Google Sheets...</span>
                      </div>
                    ) : previewValues.length === 0 ? (
                      <div className="p-12 text-center text-xs text-slate-400 space-y-2">
                        <Eye className="w-8 h-8 mx-auto text-slate-300" />
                        <p>Pilih salah satu spreadsheet di sebelah kiri untuk melihat isinya.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left text-[11px] font-sans border-collapse">
                        <thead>
                          {previewValues[0] && (
                            <tr className="bg-emerald-50/70 border-b border-slate-200 text-slate-800 font-bold sticky top-0">
                              <th className="py-2 px-2.5 border-r border-slate-200 bg-slate-100/80 text-[10px] text-slate-500 text-center w-8">
                                #
                              </th>
                              {previewValues[0].map((headerCell, i) => (
                                <th
                                  key={i}
                                  className="py-2 px-2.5 border-r border-slate-200 whitespace-nowrap"
                                >
                                  {headerCell || `Kolom ${String.fromCharCode(65 + i)}`}
                                </th>
                              ))}
                            </tr>
                          )}
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {previewValues.slice(1).map((row, rIndex) => (
                            <tr key={rIndex} className="hover:bg-slate-50">
                              <td className="py-1.5 px-2.5 border-r border-slate-200 text-[10px] text-slate-400 font-mono text-center bg-slate-50/50">
                                {rIndex + 2}
                              </td>
                              {previewValues[0].map((_, cIndex) => (
                                <td
                                  key={cIndex}
                                  className="py-1.5 px-2.5 border-r border-slate-100 text-slate-700 whitespace-nowrap"
                                >
                                  {row[cIndex] !== undefined && row[cIndex] !== ''
                                    ? String(row[cIndex])
                                    : '-'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                <div className="mt-3 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Pratinjau menampilkan hingga 30 baris pertama.</span>
                  <span>Semua perubahan tersimpan otomatis di Google Drive Anda.</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* Modal: Buat Spreadsheet Baru */}
      {isCreatingSheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
              <h4 className="text-sm font-bold text-slate-900">Buat Google Spreadsheet Baru</h4>
            </div>
            <form onSubmit={handleCreateCustomSheet} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Judul Spreadsheet
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Rekapitulasi Data Riset Tesis MKM 2026"
                  value={newSheetTitle}
                  onChange={(e) => setNewSheetTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/30"
                  required
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingSheet(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-800 rounded-lg hover:bg-emerald-700"
                >
                  {loading ? 'Membuat...' : 'Buat Spreadsheet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Buat Format Rekap Nilai Dosen */}
      {isCreatingGradebook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Table className="w-5 h-5 text-emerald-700" />
              <h4 className="text-sm font-bold text-slate-900">
                Buat Format Rekap Nilai & Presensi MKM
              </h4>
            </div>
            <p className="text-xs text-slate-600">
              Sistem akan membuat file Google Spreadsheet siap pakai dengan formula kelulusan,
              bobot nilai kehadiran (10%), tugas (20%), UTS (30%), dan UAS (40%).
            </p>
            <form onSubmit={handleExportGradebook} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Mata Kuliah MKM
                </label>
                <select
                  value={gradebookCourse}
                  onChange={(e) => setGradebookCourse(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/30 bg-white"
                >
                  <option value="Epidemiologi Lahan Basah & Pesisir">Epidemiologi Lahan Basah & Pesisir</option>
                  <option value="Metodologi Penelitian Kesehatan Lanjut">Metodologi Penelitian Kesehatan Lanjut</option>
                  <option value="Biostatistik & Manajemen Data Kesehatan">Biostatistik & Manajemen Data Kesehatan</option>
                  <option value="Kebijakan & Manajemen Pelayanan Kesehatan">Kebijakan & Manajemen Pelayanan Kesehatan</option>
                  <option value="Manajemen Risiko Lingkungan Tropis">Manajemen Risiko Lingkungan Tropis</option>
                  <option value="Promosi Kesehatan & Pemberdayaan Masyarakat">Promosi Kesehatan & Pemberdayaan Masyarakat</option>
                  <option value="Seminar Proposal Tesis">Seminar Proposal Tesis</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Semester & Tahun Akademik
                </label>
                <input
                  type="text"
                  value={gradebookSemester}
                  onChange={(e) => setGradebookSemester(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/30"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingGradebook(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-800 rounded-lg hover:bg-emerald-700"
                >
                  {loading ? 'Membuat...' : 'Buat di Google Sheets'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mandatory User Confirmation Modal for Destructive Operations */}
      {confirmModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-rose-100">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-slate-900">{confirmModalData.actionTitle}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {confirmModalData.description}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalData(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={async () => {
                  await confirmModalData.onConfirm();
                  setConfirmModalData(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
