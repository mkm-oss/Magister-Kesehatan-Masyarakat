/** Portal Sistem Informasi – Prodi Magister Kesehatan Masyarakat FIKPsi UM Pontianak */
const SS_ID = '1Y7kFfU24q8N1Jrxs3AzSY4ylGDPRQN8-VztnkftoM-I';
const KOLOM = {
  Pengguna: ['Email', 'Nama', 'Peran', 'Nomor', 'PIN'],
  Menu: ['ID', 'Judul', 'Deskripsi', 'URL', 'Kategori', 'Ikon', 'Urutan', 'Aktif', 'Untuk'],
  Pengumuman: ['ID', 'Judul', 'Isi', 'Penting', 'Target', 'PembuatEmail', 'PembuatNama', 'Peran', 'Dibuat'],
  Pengingat: ['ID', 'Judul', 'Isi', 'Waktu', 'Target', 'PembuatEmail', 'PembuatNama', 'Peran', 'Dibuat', 'EmailTerkirim'],
  Dibaca: ['ID', 'Email', 'ItemID', 'Waktu']
};
// Menu awal. Isi kolom URL langsung di Sheet "Menu" atau lewat tab Kelola Menu (admin).
const MENU_AWAL = [
  ['Bimbingan Tesis', 'Catat bimbingan, jadwal, dan tahapan tesis', '', 'Akademik', '🎓', 1, 'Semua'],
  ['Pengajuan Outline Tesis', 'Ajukan dan pantau outline tesis', '', 'Akademik', '📝', 2, 'Semua'],
  ['Materi dan Video Matrikulasi', 'Unduh materi dan tonton video dosen', '', 'Pembelajaran', '🎬', 3, 'Semua'],
  ['EDOM Dosen Magister', 'Hasil evaluasi dosen oleh mahasiswa', '', 'Mutu', '📊', 4, 'Semua'],
  ['Surat Pengambilan Data', 'Pengelolaan surat pengambilan data penelitian', '', 'Administrasi', '✉️', 5, 'Semua'],
  ['Portal Akademik FIKPsi', 'Layanan akademik fakultas', '', 'Administrasi', '🏛️', 6, 'Semua']
];

const GUEST = { Email: '', Nama: 'Pengunjung', Peran: 'Tamu' };

function doGet() {
  setup_();
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Portal Sistem Informasi MKM – UM Pontianak')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

const ss_ = () => SpreadsheetApp.openById(SS_ID);
const em_ = s => String(s || '').trim().toLowerCase();
const id_ = () => Utilities.getUuid().slice(0, 8);
const h_ = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function setup_() {
  const ss = ss_();
  Object.keys(KOLOM).forEach(n => {
    if (ss.getSheetByName(n)) return;
    const s = ss.insertSheet(n), k = KOLOM[n];
    s.getRange(1, 1, 1, k.length).setValues([k]).setFontWeight('bold').setBackground('#054DA0').setFontColor('#fff');
    s.setFrozenRows(1);
    s.getRange(2, 1, s.getMaxRows() - 1, k.length).setNumberFormat('@');
    if (n === 'Pengguna') s.getRange(2, 1, 3, 5).setValues([
      ['admin@contoh.ac.id', 'Admin Prodi MKM', 'Admin', '', '1234'],
      ['dosen@contoh.ac.id', 'Dr. Dosen Contoh, M.Kes', 'Dosen', '0000000001', '1234'],
      ['mahasiswa@contoh.ac.id', 'Mahasiswa Contoh', 'Mahasiswa', '2400000001', '1234']]);
    if (n === 'Menu') s.getRange(2, 1, MENU_AWAL.length, 9)
      .setValues(MENU_AWAL.map(m => [id_(), m[0], m[1], m[2], m[3], m[4], m[5], 'Ya', m[6]]));
  });
  const d = ss.getSheetByName('Sheet1');
  if (d && d.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(d);
}

function rows_(n) {
  const sh = ss_().getSheetByName(n);
  if (!sh) throw new Error('Sheet "' + n + '" tidak ditemukan. Buka ulang halaman aplikasi.');
  const v = sh.getDataRange().getValues(), h = v[0].map(k => String(k).trim());
  return v.slice(1).filter(r => r[0] !== '').map(r => { const o = {}; h.forEach((k, i) => o[k] = String(r[i])); return o; });
}
function add_(n, o) { ss_().getSheetByName(n).appendRow(KOLOM[n].map(k => o[k] == null ? '' : o[k])); }
function upd_(n, id, o) {
  const s = ss_().getSheetByName(n), v = s.getDataRange().getValues(), h = v[0];
  for (let i = 1; i < v.length; i++) if (v[i][0] == id) {
    Object.keys(o).forEach(k => s.getRange(i + 1, h.indexOf(k) + 1).setValue(o[k]));
    return;
  }
}

function auth_(a) {
  if (!a) throw new Error('Data akses tidak valid.');
  
  // Akses langsung menggunakan pilihan peran (Mahasiswa / Dosen / Admin) tanpa perlu PIN/password
  if (a.role) {
    const r = a.role === 'Dosen' ? 'Dosen' : a.role === 'Admin' ? 'Admin' : 'Mahasiswa';
    try {
      const all = rows_('Pengguna');
      const u = all.find(x => String(x.Peran).trim().toLowerCase() === r.toLowerCase());
      if (u) {
        return {
          Email: em_(u.Email),
          Nama: u.Nama || (r === 'Dosen' ? 'Dosen MKM' : (r === 'Admin' ? 'Admin Prodi MKM' : 'Mahasiswa MKM')),
          Peran: r
        };
      }
    } catch (e) {
      // Fallback jika sheet sedang tidak dapat dibaca
    }
    return {
      Email: (r === 'Dosen' ? 'dosen' : r === 'Admin' ? 'admin' : 'mahasiswa') + '@mkm.umpontianak.ac.id',
      Nama: r === 'Dosen' ? 'Dosen MKM' : (r === 'Admin' ? 'Admin Prodi MKM' : 'Mahasiswa MKM'),
      Peran: r
    };
  }

  // Alternatif dengan email & PIN jika masih ada parameter lama
  if (a.email && a.pin) {
    const e = em_(a.email), all = rows_('Pengguna');
    const u = all.find(x => em_(x.Email) === e && String(x.PIN).trim() === String(a.pin).trim());
    if (u) {
      const r = u.Peran.trim().toLowerCase();
      return { Email: e, Nama: u.Nama, Peran: r === 'admin' ? 'Admin' : r === 'dosen' ? 'Dosen' : 'Mahasiswa' };
    }
  }

  // Default fallback role Mahasiswa
  return {
    Email: 'mahasiswa@mkm.umpontianak.ac.id',
    Nama: 'Mahasiswa MKM',
    Peran: 'Mahasiswa'
  };
}

/** Satu pintu untuk semua aksi dari antarmuka */
function api(action, a, p) {
  try {
    const u = (action === 'home' && (!a || (!a.email && !a.role))) ? GUEST : auth_(a); p = p || {};
    const act = {
      home: () => home_(u), read: () => read_(u, p), saveMenu: () => saveMenu_(u, p),
      hapus: () => hapus_(u, p), addInfo: () => addInfo_(u, p), addIng: () => addIng_(u, p)
    }[action];
    if (!act) throw new Error('Aksi tidak dikenal.');
    const w = action !== 'home', lock = LockService.getScriptLock();
    if (w) lock.waitLock(20000);
    try { return { ok: true, data: act() }; } finally { if (w) lock.releaseLock(); }
  } catch (e) { return { ok: false, error: e.message }; }
}

function home_(u) {
  const adm = u.Peran === 'Admin';
  const vis = x => { const t = String(x.Target).trim(); return adm || t === 'Semua' || t === u.Peran || (u.Email && (em_(t) === u.Email || em_(x.PembuatEmail) === u.Email)); };
  return {
    user: u,
    menu: rows_('Menu').filter(x => adm || (x.Aktif !== 'Tidak' && (x.Untuk === 'Semua' || x.Untuk === u.Peran)))
      .sort((a, b) => (+a.Urutan || 99) - (+b.Urutan || 99)),
    info: rows_('Pengumuman').filter(vis).reverse().slice(0, 60),
    ing: rows_('Pengingat').filter(vis).sort((a, b) => new Date(a.Waktu) - new Date(b.Waktu)).slice(-80),
    dibaca: rows_('Dibaca').filter(x => em_(x.Email) === u.Email).map(x => x.ItemID)
  };
}

function read_(u, p) {
  const have = new Set(rows_('Dibaca').filter(x => em_(x.Email) === u.Email).map(x => x.ItemID)), now = new Date().toISOString();
  const v = (p.ids || []).slice(0, 100).filter(i => !have.has(i)).map(i => [id_(), u.Email, i, now]);
  if (v.length) { const s = ss_().getSheetByName('Dibaca'); s.getRange(s.getLastRow() + 1, 1, v.length, 4).setValues(v); }
}

function saveMenu_(u, p) {
  if (u.Peran !== 'Admin') throw new Error('Khusus admin.');
  const j = (p.judul || '').trim(), l = (p.url || '').trim();
  if (!j) throw new Error('Judul menu wajib diisi.');
  if (l && !/^https?:\/\//i.test(l)) throw new Error('Tautan harus diawali http:// atau https://');
  const o = {
    Judul: j, Deskripsi: (p.deskripsi || '').trim(), URL: l, Kategori: (p.kategori || 'Lainnya').trim(),
    Ikon: (p.ikon || '📌').trim(), Urutan: p.urutan || '99', Aktif: p.aktif === 'Tidak' ? 'Tidak' : 'Ya',
    Untuk: ['Dosen', 'Mahasiswa'].includes(p.untuk) ? p.untuk : 'Semua'
  };
  if (p.id && rows_('Menu').some(x => x.ID === p.id)) upd_('Menu', p.id, o);
  else add_('Menu', Object.assign({ ID: id_() }, o));
}

function hapus_(u, p) {
  const n = p.tipe;
  if (!['Menu', 'Pengumuman', 'Pengingat'].includes(n)) throw new Error('Jenis data tidak valid.');
  const x = rows_(n).find(r => r.ID === p.id);
  if (!x) throw new Error('Data tidak ditemukan.');
  if (u.Peran !== 'Admin' && (n === 'Menu' || em_(x.PembuatEmail) !== u.Email)) throw new Error('Anda tidak berhak menghapus data ini.');
  const s = ss_().getSheetByName(n), v = s.getRange(1, 1, s.getLastRow(), 1).getValues();
  for (let i = 1; i < v.length; i++) if (v[i][0] == p.id) { s.deleteRow(i + 1); return; }
}

function addInfo_(u, p) {
  if (u.Peran === 'Mahasiswa') throw new Error('Pengumuman hanya dapat dibuat admin dan dosen.');
  const j = (p.judul || '').trim(), i = (p.isi || '').trim();
  if (!j || !i) throw new Error('Judul dan isi pengumuman wajib diisi.');
  const t = ['Dosen', 'Mahasiswa'].includes(p.target) ? p.target : 'Semua';
  add_('Pengumuman', { ID: id_(), Judul: j, Isi: i, Penting: p.penting ? 'Ya' : '', Target: t, PembuatEmail: u.Email, PembuatNama: u.Nama, Peran: u.Peran, Dibuat: new Date().toISOString() });
  if (p.email) try { mail_(t, 'Pengumuman MKM: ' + j, i); } catch (e) { /* kuota email */ }
}

function addIng_(u, p) {
  const j = (p.judul || '').trim();
  if (!j) throw new Error('Judul pengingat wajib diisi.');
  if (!p.waktu || isNaN(new Date(p.waktu))) throw new Error('Tanggal dan jam pengingat wajib diisi.');
  const t = u.Peran !== 'Mahasiswa' && ['Semua', 'Dosen', 'Mahasiswa'].includes(p.target) ? p.target : u.Email;
  add_('Pengingat', { ID: id_(), Judul: j, Isi: (p.isi || '').trim(), Waktu: p.waktu, Target: t, PembuatEmail: u.Email, PembuatNama: u.Nama, Peran: u.Peran, Dibuat: new Date().toISOString() });
}

/** Email ke kelompok penerima (BCC agar alamat tidak saling terlihat) */
function mail_(t, subjek, isi) {
  const to = rows_('Pengguna')
    .filter(x => t.indexOf('@') > 0 ? em_(x.Email) === em_(t) : t === 'Semua' || x.Peran.trim().toLowerCase() === t.toLowerCase())
    .map(x => em_(x.Email)).filter(e => /^\S+@\S+\.\S+$/.test(e));
  const html = '<div style="font-family:sans-serif"><p style="white-space:pre-wrap">' + h_(isi) + '</p><p><a href="' + ScriptApp.getService().getUrl() + '">Buka Portal Sistem Informasi MKM</a></p></div>';
  for (let i = 0; i < to.length; i += 50)
    MailApp.sendEmail({ to: Session.getEffectiveUser().getEmail(), bcc: to.slice(i, i + 50).join(','), subject: subjek, htmlBody: html });
}

/** Dijalankan otomatis tiap 15 menit: kirim email untuk pengingat yang waktunya tiba */
function kirimPengingat() {
  const now = new Date();
  rows_('Pengingat').forEach(r => {
    const w = new Date(r.Waktu);
    if (r.EmailTerkirim || isNaN(w) || w > now) return;
    try {
      mail_(r.Target, 'Pengingat: ' + r.Judul, r.Judul + '\n' + r.Waktu.replace('T', ' ') + '\n\n' + r.Isi + '\n\nDibuat oleh ' + r.PembuatNama);
      upd_('Pengingat', r.ID, { EmailTerkirim: now.toISOString() });
    } catch (e) { /* coba lagi pada putaran berikutnya */ }
  });
}

/** Jalankan SEKALI dari editor Apps Script untuk memasang pemicu email pengingat */
function pasang() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'kirimPengingat').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('kirimPengingat').timeBased().everyMinutes(15).create();
}