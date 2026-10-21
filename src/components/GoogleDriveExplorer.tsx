import React, { useState, useEffect } from 'react';
import {
  signInWithGoogleDrive,
  signOutGoogleDrive,
  initDriveAuth,
  getDriveAccessToken,
} from '../services/googleDriveAuth';
import {
  listDriveFiles,
  createDriveFolder,
  uploadFileToDrive,
  deleteDriveFile,
  DriveFile,
  formatFileSize,
  formatDriveDate,
} from '../services/googleDriveService';
import { User } from 'firebase/auth';
import {
  Folder,
  FileText,
  FileSpreadsheet,
  FileCheck,
  Upload,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle,
  File,
  LogOut,
  FolderPlus,
} from 'lucide-react';

interface GoogleDriveExplorerProps {
  title?: string;
  defaultFolderFilter?: string;
  compact?: boolean;
}

export const GoogleDriveExplorer: React.FC<GoogleDriveExplorerProps> = ({
  title = 'Google Drive Akademik MKM UM Pontianak',
  compact = false,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'folders' | 'documents' | 'sheets'>('all');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Delete Confirmation Modal State
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // New Folder Modal State
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // File Upload State
  const [isUploading, setIsUploading] = useState(false);

  // Initialize Auth Listener
  useEffect(() => {
    const unsubscribe = initDriveAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        fetchFiles(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setFiles([]);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const fetchFiles = async (accessToken: string, query = searchQuery) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const result = await listDriveFiles(accessToken, undefined, query);
      setFiles(result);
    } catch (err: any) {
      console.error('Fetch drive files error:', err);
      setErrorMsg(err.message || 'Gagal mengambil daftar berkas Google Drive');
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
        await fetchFiles(res.accessToken);
        showSuccess(`Berhasil terhubung ke Google Drive (${res.user.email})`);
      }
    } catch (err: any) {
      console.error('Google Drive sign in failed:', err);
      setErrorMsg(
        err.message ||
          'Gagal menghubungkan Google Drive. Pastikan pop-up login tidak diblokir browser.'
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
      setFiles([]);
      showSuccess('Google Drive berhasil diputuskan.');
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile || !token) return;

    setIsUploading(true);
    setErrorMsg('');
    try {
      const newFile = await uploadFileToDrive(token, uploadedFile);
      showSuccess(`Berkas "${newFile.name}" berhasil diunggah ke Google Drive!`);
      await fetchFiles(token);
    } catch (err: any) {
      console.error('Upload error:', err);
      setErrorMsg(err.message || 'Gagal mengunggah berkas ke Google Drive');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim() || !token) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const folder = await createDriveFolder(token, newFolderName.trim());
      showSuccess(`Folder "${folder.name}" berhasil dibuat di Google Drive!`);
      setNewFolderName('');
      setIsCreatingFolder(false);
      await fetchFiles(token);
    } catch (err: any) {
      console.error('Folder creation error:', err);
      setErrorMsg(err.message || 'Gagal membuat folder');
    } finally {
      setLoading(false);
    }
  };

  // Explicit User Confirmation for Destructive Deletion
  const confirmDeleteFile = async () => {
    if (!fileToDelete || !token) return;

    setIsDeleting(true);
    setErrorMsg('');
    try {
      await deleteDriveFile(token, fileToDelete.id);
      showSuccess(`Berkas "${fileToDelete.name}" berhasil dihapus dari Google Drive.`);
      setFileToDelete(null);
      await fetchFiles(token);
    } catch (err: any) {
      console.error('Delete error:', err);
      setErrorMsg(err.message || 'Gagal menghapus berkas');
    } finally {
      setIsDeleting(false);
    }
  };

  const getMimeIcon = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.folder') {
      return <Folder className="w-5 h-5 text-amber-500 fill-amber-100" />;
    }
    if (
      mimeType.includes('pdf') ||
      mimeType.includes('document') ||
      mimeType === 'application/vnd.google-apps.document'
    ) {
      return <FileText className="w-5 h-5 text-blue-600" />;
    }
    if (
      mimeType.includes('sheet') ||
      mimeType.includes('excel') ||
      mimeType === 'application/vnd.google-apps.spreadsheet'
    ) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    }
    return <File className="w-5 h-5 text-slate-500" />;
  };

  // Filtered Files
  const filteredFiles = files.filter((f) => {
    if (filterType === 'folders') {
      return f.mimeType === 'application/vnd.google-apps.folder';
    }
    if (filterType === 'documents') {
      return (
        f.mimeType.includes('pdf') ||
        f.mimeType.includes('document') ||
        f.mimeType === 'application/vnd.google-apps.document'
      );
    }
    if (filterType === 'sheets') {
      return (
        f.mimeType.includes('sheet') ||
        f.mimeType.includes('excel') ||
        f.mimeType === 'application/vnd.google-apps.spreadsheet'
      );
    }
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Header Bar */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center p-2">
            <svg viewBox="0 0 87.3 78" className="w-full h-full">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
              <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
              <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
              <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
              <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-white leading-tight">
              {title}
            </h3>
            <p className="text-xs text-slate-300">
              Integrasi Cloud Storage untuk Tesis, Materi Kuliah & Dokumen Pascasarjana
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
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {user.displayName?.[0] || 'U'}
                </div>
              )}
              <div className="text-left text-xs">
                <span className="font-bold block text-white truncate max-w-[130px]">
                  {user.displayName || 'Pengguna Drive'}
                </span>
                <span className="text-[10px] text-slate-300 truncate max-w-[130px] block">
                  {user.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors ml-1"
                title="Putuskan sambungan Google Drive"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Official Google Sign-in Button */
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="px-4 py-2 bg-white text-slate-800 hover:bg-slate-50 font-semibold text-xs rounded-xl shadow transition-all flex items-center gap-2.5 border border-slate-300 active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
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
        /* Guest / Disconnected View */
        <div className="p-10 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center mx-auto shadow-inner">
            <FolderPlus className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Akses Berkas Tesis & Materi Perkuliahan Langsung dari Google Drive
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Hubungkan akun Google Anda untuk mengunggah naskah proposal tesis, tugas perkuliahan, dan mengunduh berkas akademik resmi pascasarjana FIKPsi UM Pontianak.
            </p>
          </div>
          <button
            onClick={handleSignIn}
            className="px-6 py-2.5 bg-blue-900 text-white font-bold text-xs rounded-xl shadow-md hover:bg-blue-800 transition-all flex items-center gap-2 mx-auto"
          >
            <Folder className="w-4 h-4" />
            <span>Koneksikan Google Drive Saya</span>
          </button>
        </div>
      ) : (
        /* Connected Drive Explorer View */
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari berkas di Google Drive..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (token) fetchFiles(token, e.target.value);
                }}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-900/30"
              />
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Upload Input */}
              <label className="cursor-pointer px-3.5 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Mengunggah...' : 'Unggah Berkas'}</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              {/* Create Folder Button */}
              <button
                onClick={() => setIsCreatingFolder(true)}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Folder Baru</span>
              </button>

              {/* Refresh Button */}
              <button
                onClick={() => token && fetchFiles(token)}
                disabled={loading}
                className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                title="Segarkan daftar berkas"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Berkas ({files.length})
            </button>
            <button
              onClick={() => setFilterType('documents')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                filterType === 'documents'
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Dokumen & PDF
            </button>
            <button
              onClick={() => setFilterType('sheets')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                filterType === 'sheets'
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Spreadsheet & Data
            </button>
            <button
              onClick={() => setFilterType('folders')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                filterType === 'folders'
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Folder
            </button>
          </div>

          {/* Files List Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto text-blue-900" />
                <span>Memuat data dari Google Drive...</span>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <Folder className="w-8 h-8 mx-auto text-slate-300" />
                <p>Tidak ada berkas yang ditemukan.</p>
                <p className="text-[11px] text-slate-400">
                  Klik "Unggah Berkas" untuk menambahkan dokumen tesis atau tugas pertama Anda.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Nama Berkas</th>
                      <th className="py-2.5 px-3">Ukuran</th>
                      <th className="py-2.5 px-3">Terakhir Diubah</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            {getMimeIcon(file.mimeType)}
                            <div className="truncate max-w-[240px] sm:max-w-md">
                              <span className="font-semibold text-slate-900 block truncate">
                                {file.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {file.mimeType.split('/').pop()}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">
                          {formatFileSize(file.size)}
                        </td>
                        <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                          {formatDriveDate(file.modifiedTime)}
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-blue-900 hover:bg-blue-50 rounded"
                                title="Buka di Google Drive"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {file.webContentLink && (
                              <a
                                href={file.webContentLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded"
                                title="Unduh berkas"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => setFileToDelete(file)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                              title="Hapus berkas"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Create Folder Modal */}
      {isCreatingFolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Buat Folder Google Drive</h4>
            <form onSubmit={handleCreateFolder} className="space-y-3">
              <input
                type="text"
                placeholder="Contoh: Berkas Tesis MKM 2026"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-900/30"
                required
                autoFocus
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingFolder(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-900 rounded-lg hover:bg-blue-800"
                >
                  Buat Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mandatory User Confirmation Dialog for Destructive Delete */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-rose-100">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-slate-900">
                Konfirmasi Hapus Berkas dari Google Drive
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus berkas <strong className="text-slate-900">"{fileToDelete.name}"</strong>?
              </p>
              <p className="text-[11px] text-rose-600 font-medium">
                Tindakan ini akan memindahkan atau menghapus berkas secara permanen dari akun Google Drive Anda.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteFile}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus Berkas'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
