import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  UploadCloud,
  DownloadCloud,
  ExternalLink,
  ShieldCheck,
  Key,
  Globe,
  Terminal,
  Table,
  Eye,
  Trash2,
} from 'lucide-react';
import {
  getStoredSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection,
  generateSupabaseSqlScript,
  syncLocalDataToSupabase,
  fetchAllFromSupabase,
  getSupabaseClient,
} from '../services/supabaseService';
import { useApp } from '../context/AppContext';

export const SupabaseManager: React.FC = () => {
  const {
    settings,
    updateSettings,
    applicants,
    peminatans,
    lecturers,
    academicLinks,
    updateApplicantStatus,
  } = useApp();

  const [urlInput, setUrlInput] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'config' | 'sql' | 'tables'>('config');
  const [tableData, setTableData] = useState<any[]>([]);
  const [activeTable, setActiveTable] = useState<'applicants' | 'site_settings' | 'peminatan' | 'academic_links' | 'lecturers'>('applicants');
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  useEffect(() => {
    const config = getStoredSupabaseConfig();
    setUrlInput(config.url);
    setKeyInput(config.anonKey);
    setIsConfigured(config.isConfigured);

    if (config.isConfigured) {
      handleTestConnection(config.url, config.anonKey);
    }
  }, []);

  const handleTestConnection = async (testUrl?: string, testKey?: string) => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await testSupabaseConnection(testUrl || urlInput, testKey || keyInput);
      setTestResult(result);
    } catch (err: unknown) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : 'Koneksi gagal',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || !keyInput.trim()) {
      alert('Harap masukkan Supabase URL dan Anon Key.');
      return;
    }

    saveSupabaseConfig(urlInput, keyInput);
    setIsConfigured(true);
    await handleTestConnection(urlInput, keyInput);
  };

  const handleDisconnect = () => {
    if (confirm('Apakah Anda yakin ingin memutuskan koneksi Supabase di sesi ini?')) {
      clearSupabaseConfig();
      setUrlInput('');
      setKeyInput('');
      setIsConfigured(false);
      setTestResult(null);
      setTableData([]);
    }
  };

  const handleCopySql = () => {
    const sql = generateSupabaseSqlScript();
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handlePushData = async () => {
    if (!isConfigured) {
      alert('Silakan simpan konfigurasi kredensial Supabase terlebih dahulu.');
      return;
    }

    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await syncLocalDataToSupabase({
        settings,
        applicants,
        peminatans,
        lecturers,
        academicLinks,
      });
      setSyncFeedback(res.message);
      if (res.success) {
        handleLoadTable(activeTable);
      }
    } catch (err: unknown) {
      setSyncFeedback(err instanceof Error ? err.message : 'Gagal sinkronisasi data');
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePullData = async () => {
    if (!isConfigured) {
      alert('Silakan simpan konfigurasi kredensial Supabase terlebih dahulu.');
      return;
    }

    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await fetchAllFromSupabase();
      if (res.success && res.data) {
        if (res.data.settings) updateSettings(res.data.settings);
        setSyncFeedback('Data berhasil diperbarui dari Supabase!');
        handleLoadTable(activeTable);
      } else {
        setSyncFeedback(res.message || 'Gagal mengambil data dari Supabase.');
      }
    } catch (err: unknown) {
      setSyncFeedback(err instanceof Error ? err.message : 'Gagal mengambil data');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLoadTable = async (tableName: typeof activeTable) => {
    setActiveTable(tableName);
    const client = getSupabaseClient();
    if (!client) return;

    setIsLoadingTable(true);
    try {
      const { data, error } = await client.from(tableName).select('*').limit(20);
      if (error) {
        setTableData([]);
        console.error('Error fetching table data:', error);
      } else {
        setTableData(data || []);
      }
    } catch (err) {
      console.error(err);
      setTableData([]);
    } finally {
      setIsLoadingTable(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 shadow-inner">
              <Database className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Koneksi Database Supabase</h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 rounded-full uppercase tracking-wider">
                  PostgreSQL Cloud
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                Sinkronisasi data PMB, Peminatan, Dosen, Tautan Akademik, dan CMS ke database Supabase
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {testResult?.success ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Terhubung ({testResult.latencyMs}ms)
              </span>
            ) : isConfigured ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <AlertCircle className="w-3.5 h-3.5" />
                Terkonfigurasi
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-500/20 text-slate-300 border border-slate-500/30">
                Belum Terhubung
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('config')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeSubTab === 'config'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Key className="w-4 h-4" />
          Kredensial & Pengaturan
        </button>

        <button
          onClick={() => setActiveSubTab('sql')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeSubTab === 'sql'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Skrip SQL Migrasi (DDL)
        </button>

        <button
          onClick={() => {
            setActiveSubTab('tables');
            handleLoadTable(activeTable);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeSubTab === 'tables'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Table className="w-4 h-4" />
          Penjelajah Tabel Supabase
        </button>
      </div>

      {/* Feedback Banner */}
      {syncFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
          <span>{syncFeedback}</span>
          <button
            onClick={() => setSyncFeedback(null)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Tab 1: Kredensial & Koneksi */}
      {activeSubTab === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                Konfigurasi Kredensial Supabase
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Dapatkan Project URL dan Anon Public Key dari dashboard Supabase Anda di menu{' '}
                <span className="font-semibold text-slate-700">Project Settings → API</span>.
              </p>

              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Atau tentukan lewat environment variable <code>VITE_SUPABASE_URL</code>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Supabase Anon Public API Key
                  </label>
                  <input
                    type="password"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Atau tentukan lewat environment variable <code>VITE_SUPABASE_ANON_KEY</code>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Simpan & Hubungkan
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTestConnection()}
                    disabled={isTesting || (!urlInput && !keyInput)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    {isTesting ? 'Memeriksa...' : 'Tes Koneksi'}
                  </button>

                  {isConfigured && (
                    <button
                      type="button"
                      onClick={handleDisconnect}
                      className="px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Putuskan
                    </button>
                  )}
                </div>
              </form>

              {/* Status Test Box */}
              {testResult && (
                <div
                  className={`mt-4 p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                    testResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-semibold block">
                      {testResult.success ? 'Koneksi Berhasil' : 'Koneksi Bermasalah'}
                    </span>
                    <p className="mt-0.5">{testResult.message}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sync Tools */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-emerald-600" />
                Operasi Sinkronisasi Data
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Sinkronkan seluruh data aplikasi (Pendaftar PMB, Pengaturan Website, Peminatan, Dosen, dan Tautan Akademik) dengan cloud Supabase.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors">
                  <span className="text-xs font-bold text-slate-900 block mb-1">
                    1. Kirim Data Lokal ke Supabase
                  </span>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Mengunggah seluruh data saat ini ke tabel Supabase (Upsert). Pastikan tabel sudah dibuat terlebih dahulu.
                  </p>
                  <button
                    onClick={handlePushData}
                    disabled={isSyncing || !isConfigured}
                    className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    {isSyncing ? 'Menyinkronkan...' : 'Kirim Data ke Supabase'}
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors">
                  <span className="text-xs font-bold text-slate-900 block mb-1">
                    2. Tarik Data Terbaru dari Supabase
                  </span>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Mengambil data terbaru yang tersimpan di cloud Supabase dan menerapkannya ke tampilan website saat ini.
                  </p>
                  <button
                    onClick={handlePullData}
                    disabled={isSyncing || !isConfigured}
                    className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <DownloadCloud className="w-3.5 h-3.5" />
                    {isSyncing ? 'Mengambil...' : 'Tarik Data dari Supabase'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Petunjuk Lengkap Menemukan VITE_SUPABASE_* */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm border border-slate-800">
              <h4 className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                <Key className="w-4 h-4 text-emerald-400" />
                Cara Menemukan URL & Anon Key di Supabase
              </h4>
              <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">
                Ikuti langkah berikut di dashboard <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-emerald-400 font-bold underline inline-flex items-center gap-0.5">Supabase.com <ExternalLink className="w-2.5 h-2.5" /></a>:
              </p>

              <div className="space-y-3 text-[11px]">
                <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/80">
                  <span className="font-bold text-emerald-300 block mb-0.5">1. Buka Menu Project Settings</span>
                  <span className="text-slate-300 text-[10px]">
                    Klik ikon roda gigi <b className="text-white">⚙️ Project Settings</b> di pojok kiri bawah dashboard project Supabase Anda.
                  </span>
                </div>

                <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/80">
                  <span className="font-bold text-emerald-300 block mb-0.5">2. Pilih Submenu "Data API" / "API"</span>
                  <span className="text-slate-300 text-[10px]">
                    Di panel navigasi Settings, klik menu <b className="text-white">Data API</b> (atau <b className="text-white">API</b>).
                  </span>
                </div>

                <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/80">
                  <span className="font-bold text-emerald-300 block mb-0.5">3. Salin "Project URL"</span>
                  <code className="text-[10px] text-emerald-300 bg-slate-950 px-1.5 py-0.5 rounded block my-1 font-mono break-all">
                    https://[project-id].supabase.co
                  </code>
                  <span className="text-slate-400 text-[10px]">
                    → Ini adalah nilai untuk <b>VITE_SUPABASE_URL</b>.
                  </span>
                </div>

                <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/80">
                  <span className="font-bold text-emerald-300 block mb-0.5">4. Salin "anon public" API Key</span>
                  <code className="text-[10px] text-emerald-300 bg-slate-950 px-1.5 py-0.5 rounded block my-1 font-mono break-all truncate">
                    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                  </code>
                  <span className="text-slate-400 text-[10px]">
                    → Cari kunci berlabel <b className="text-amber-300">anon public</b> (bukan <i>service_role</i>!). Ini adalah <b>VITE_SUPABASE_ANON_KEY</b>.
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/70 rounded-xl border border-emerald-200/80 p-4">
              <span className="text-xs font-bold text-emerald-950 block mb-1">
                Di Mana Variabel Ini Digunakan?
              </span>
              <ul className="text-[11px] text-emerald-900/90 space-y-1.5 list-disc list-inside">
                <li>
                  <b>Form di sebelah kiri</b>: Langsung tempel dan klik <i>Simpan & Hubungkan</i> untuk sesi browser saat ini.
                </li>
                <li>
                  <b>Vercel Environment Variables</b>: Jika deploy ke Vercel, tambahkan <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code> di menu <i>Settings → Environment Variables</i>.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Skrip SQL Migrasi */}
      {activeSubTab === 'sql' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-600" />
                Skrip SQL DDL & Schema Supabase
              </h3>
              <p className="text-xs text-slate-500">
                Jalankan skrip ini sekali saja di <b>Supabase SQL Editor</b> untuk membuat seluruh tabel dan kebijakan keamanan (RLS).
              </p>
            </div>

            <button
              onClick={handleCopySql}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors shrink-0"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Tersalin ke Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Salin Skrip SQL Lengkap
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <pre className="p-4 bg-slate-950 text-slate-100 rounded-xl text-[11px] font-mono leading-relaxed overflow-x-auto max-h-[500px] border border-slate-800">
              {generateSupabaseSqlScript()}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Penjelajah Tabel */}
      {activeSubTab === 'tables' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Table className="w-4 h-4 text-emerald-600" />
                Penjelajah Data Langsung Supabase
              </h3>
              <p className="text-xs text-slate-500">
                Melihat baris data yang tersimpan secara real-time di tabel database Supabase.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={activeTable}
                onChange={(e) => handleLoadTable(e.target.value as any)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-700"
              >
                <option value="applicants">Tabel applicants (Pendaftar PMB)</option>
                <option value="site_settings">Tabel site_settings (Pengaturan Web)</option>
                <option value="peminatan">Tabel peminatan (Peminatan S2)</option>
                <option value="academic_links">Tabel academic_links (Tautan Kuliah)</option>
                <option value="lecturers">Tabel lecturers (Dosen Pengajar)</option>
              </select>

              <button
                onClick={() => handleLoadTable(activeTable)}
                disabled={isLoadingTable}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
                title="Muat Ulang Tabel"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingTable ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {isLoadingTable ? (
            <div className="py-12 text-center text-xs text-slate-500">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
              Mengambil baris dari Supabase...
            </div>
          ) : tableData.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              Belum ada baris data di tabel <code>{activeTable}</code>, atau tabel belum dibuat di Supabase.
              <div className="mt-3">
                <button
                  onClick={handlePushData}
                  disabled={!isConfigured}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Kirim Data Sekarang
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    {Object.keys(tableData[0]).slice(0, 7).map((col) => (
                      <th key={col} className="px-3 py-2.5 font-bold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tableData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      {Object.keys(row).slice(0, 7).map((col) => (
                        <td key={col} className="px-3 py-2 font-mono text-[11px] truncate max-w-[200px]">
                          {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
