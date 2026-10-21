import { ApplicantRecord } from '../data/mkmData';
import { DriveFile } from './googleDriveService';

export interface SpreadsheetInfo {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
  sheets: {
    sheetId: number;
    title: string;
    rowCount?: number;
    columnCount?: number;
  }[];
}

/**
 * Creates a new Google Spreadsheet in the user's Google Drive.
 */
export const createSpreadsheet = async (
  accessToken: string,
  title: string,
  sheetTitle = 'Data Utama'
): Promise<SpreadsheetInfo> => {
  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title,
      },
      sheets: [
        {
          properties: {
            title: sheetTitle,
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gagal membuat spreadsheet baru: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    spreadsheetId: data.spreadsheetId,
    spreadsheetUrl: data.spreadsheetUrl,
    title: data.properties?.title || title,
    sheets: (data.sheets || []).map((s: any) => ({
      sheetId: s.properties?.sheetId,
      title: s.properties?.title,
      rowCount: s.properties?.gridProperties?.rowCount,
      columnCount: s.properties?.gridProperties?.columnCount,
    })),
  };
};

/**
 * Reads metadata of a Google Spreadsheet.
 */
export const getSpreadsheetMetadata = async (
  accessToken: string,
  spreadsheetId: string
): Promise<SpreadsheetInfo> => {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gagal membaca spreadsheet: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    spreadsheetId: data.spreadsheetId,
    spreadsheetUrl: data.spreadsheetUrl,
    title: data.properties?.title || '',
    sheets: (data.sheets || []).map((s: any) => ({
      sheetId: s.properties?.sheetId,
      title: s.properties?.title,
      rowCount: s.properties?.gridProperties?.rowCount,
      columnCount: s.properties?.gridProperties?.columnCount,
    })),
  };
};

/**
 * Gets cell values from a specific sheet range (e.g., 'Sheet1!A1:Z50').
 */
export const getSpreadsheetValues = async (
  accessToken: string,
  spreadsheetId: string,
  range: string
): Promise<string[][]> => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
    spreadsheetId
  )}/values/${encodeURIComponent(range)}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gagal mengambil nilai sel: ${response.statusText}`);
  }

  const data = await response.json();
  return data.values || [];
};

/**
 * Appends rows to an existing spreadsheet range.
 */
export const appendSpreadsheetValues = async (
  accessToken: string,
  spreadsheetId: string,
  range: string,
  values: (string | number)[][]
): Promise<{ updatedRows: number }> => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
    spreadsheetId
  )}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gagal menambahkan baris: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    updatedRows: data.updates?.updatedRows || 0,
  };
};

/**
 * Updates/overwrites cell values in a specified range.
 */
export const updateSpreadsheetValues = async (
  accessToken: string,
  spreadsheetId: string,
  range: string,
  values: (string | number)[][]
): Promise<{ updatedCells: number }> => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
    spreadsheetId
  )}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gagal memperbarui sel: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    updatedCells: data.updatedCells || 0,
  };
};

/**
 * Exports all PMB Applicants into a freshly created, beautifully formatted Google Spreadsheet.
 */
export const exportApplicantsToGoogleSheet = async (
  accessToken: string,
  applicants: ApplicantRecord[],
  title = `Data Pendaftar PMB S2 MKM UM Pontianak - ${new Date().toLocaleDateString('id-ID')}`
): Promise<{ spreadsheetId: string; spreadsheetUrl: string; totalApplicants: number }> => {
  // 1. Create spreadsheet with default tab "Pendaftar PMB"
  const created = await createSpreadsheet(accessToken, title, 'Data Pendaftar S2');

  // 2. Prepare header and rows
  const header = [
    'No',
    'No. Pendaftaran',
    'Nama Lengkap',
    'No. WhatsApp',
    'Email',
    'Peminatan',
    'Kategori Pendaftaran',
    'Asal S1 / Jurusan',
    'Instansi / Pekerjaan',
    'Status Seleksi',
    'Tanggal Daftar',
    'Catatan Khusus',
  ];

  const rows = applicants.map((app, index) => [
    index + 1,
    app.registrationNumber,
    app.fullName,
    app.whatsapp,
    app.email,
    app.peminatan,
    app.category,
    `${app.s1Campus} - ${app.s1Major}`,
    app.currentJob,
    app.status,
    app.registeredAt,
    app.notes || '-',
  ]);

  const allValues = [header, ...rows];

  // 3. Write data to sheet
  await updateSpreadsheetValues(
    accessToken,
    created.spreadsheetId,
    `'Data Pendaftar S2'!A1:L${allValues.length}`,
    allValues
  );

  return {
    spreadsheetId: created.spreadsheetId,
    spreadsheetUrl: created.spreadsheetUrl,
    totalApplicants: applicants.length,
  };
};

/**
 * Creates an academic gradebook template for Dosen for MKM courses.
 */
export const exportGradebookToGoogleSheet = async (
  accessToken: string,
  mataKuliah: string,
  dosenName: string,
  semester: string
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  const title = `Rekap Nilai & Presensi - ${mataKuliah} (${semester})`;
  const created = await createSpreadsheet(accessToken, title, 'Rekapitulasi Nilai');

  const metaRows = [
    ['UNIVERSITAS MUHAMMADIYAH PONTIANAK'],
    ['FAKULTAS ILMU KESEHATAN DAN PSIKOLOGI - PROGRAM STUDI MAGISTER KESEHATAN MASYARAKAT'],
    [`Mata Kuliah: ${mataKuliah}`, '', `Semester: ${semester}`],
    [`Dosen Pengampu: ${dosenName}`, '', `Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`],
    [], // empty row
    [
      'No',
      'NIM',
      'Nama Mahasiswa',
      'Peminatan',
      'Kehadiran (10%)',
      'Tugas & Makalah (20%)',
      'UTS (30%)',
      'UAS / Draf Riset (40%)',
      'Nilai Akhir',
      'Nilai Huruf',
      'Status Kelulusan',
    ],
    // Sample student rows
    [
      1,
      '241021001',
      'dr. Maya Safitri',
      'Administrasi & Kebijakan Kesehatan',
      95,
      88,
      85,
      90,
      '=E7*0.1+F7*0.2+G7*0.3+H7*0.4',
      '=IF(I7>=85,"A",IF(I7>=80,"A-",IF(I7>=75,"B+",IF(I7>=70,"B","C"))))',
      '=IF(I7>=70,"LULUS","REMEDIAL")',
    ],
    [
      2,
      '241021002',
      'Budi Santoso, S.KM.',
      'Epidemiologi & Pengendalian Penyakit Tropis',
      90,
      85,
      82,
      88,
      '=E8*0.1+F8*0.2+G8*0.3+H8*0.4',
      '=IF(I8>=85,"A",IF(I8>=80,"A-",IF(I8>=75,"B+",IF(I8>=70,"B","C"))))',
      '=IF(I8>=70,"LULUS","REMEDIAL")',
    ],
    [
      3,
      '241021003',
      'Ns. Rahmad Hidayat, S.Kep.',
      'K3 & Kesehatan Lingkungan Lahan Basah',
      100,
      90,
      88,
      92,
      '=E9*0.1+F9*0.2+G9*0.3+H9*0.4',
      '=IF(I9>=85,"A",IF(I9>=80,"A-",IF(I9>=75,"B+",IF(I9>=70,"B","C"))))',
      '=IF(I9>=70,"LULUS","REMEDIAL")',
    ],
  ];

  await updateSpreadsheetValues(
    accessToken,
    created.spreadsheetId,
    `'Rekapitulasi Nilai'!A1:K${metaRows.length}`,
    metaRows
  );

  return {
    spreadsheetId: created.spreadsheetId,
    spreadsheetUrl: created.spreadsheetUrl,
  };
};

/**
 * Lists Google Sheets spreadsheets from Google Drive.
 */
export const listSpreadsheets = async (
  accessToken: string,
  searchQuery?: string
): Promise<DriveFile[]> => {
  let q = "mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false";
  if (searchQuery && searchQuery.trim()) {
    const escaped = searchQuery.replace(/'/g, "\\'");
    q += ` and name contains '${escaped}'`;
  }

  const fields =
    'files(id, name, mimeType, webViewLink, webContentLink, iconLink, thumbnailLink, modifiedTime, size)';
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    q
  )}&fields=${encodeURIComponent(fields)}&orderBy=modifiedTime desc&pageSize=30`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal mengambil daftar spreadsheet');
  }

  const data = await response.json();
  return data.files || [];
};
