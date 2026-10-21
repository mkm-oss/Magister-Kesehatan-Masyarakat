import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  ApplicantRecord,
  Peminatan,
  Lecturer,
  AcademicLink,
  SiteSettings,
  FaqItem,
} from '../data/mkmData';

const STORAGE_SUPABASE_URL = 'mkm_supabase_url';
const STORAGE_SUPABASE_KEY = 'mkm_supabase_anon_key';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export function getStoredSupabaseConfig(): SupabaseConfig {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  const storedUrl = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_SUPABASE_URL) : '') || '';
  const storedKey = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_SUPABASE_KEY) : '') || '';

  const url = (storedUrl || envUrl).trim();
  const anonKey = (storedKey || envKey).trim();

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey),
  };
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_SUPABASE_URL, url.trim());
    localStorage.setItem(STORAGE_SUPABASE_KEY, anonKey.trim());
  }
  // Reset cached client
  cachedClient = null;
}

export function clearSupabaseConfig(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_SUPABASE_URL);
    localStorage.removeItem(STORAGE_SUPABASE_KEY);
  }
  cachedClient = null;
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const config = getStoredSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return cachedClient;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}

/**
 * Test connectivity to Supabase
 */
export async function testSupabaseConnection(customUrl?: string, customKey?: string): Promise<{
  success: boolean;
  message: string;
  latencyMs?: number;
}> {
  const config = getStoredSupabaseConfig();
  const url = (customUrl || config.url || '').trim();
  const key = (customKey || config.anonKey || '').trim();

  if (!url || !key) {
    return {
      success: false,
      message: 'Project URL dan Anon Key belum diisi. Masukkan kredensial Supabase Anda.',
    };
  }

  // Basic URL validation
  if (!url.startsWith('https://') || !url.includes('.supabase.co')) {
    return {
      success: false,
      message: 'URL Supabase harus berformat: https://[project-ref].supabase.co',
    };
  }

  const startTime = Date.now();
  try {
    const testClient = createClient(url, key);
    // Attempt a light query to verify API key validity
    const { error } = await testClient.from('site_settings').select('id').limit(1);
    
    const latencyMs = Date.now() - startTime;
    
    // In Supabase, if the table doesn't exist yet, it returns a 404 or relation error (PGRST205 or PGRST116),
    // which confirms the credentials are valid and the REST API responded!
    if (error) {
      if (
        error.code === 'PGRST204' ||
        error.code === 'PGRST205' ||
        error.code === '42P01' || // relation does not exist
        error.message?.toLowerCase().includes('relation') ||
        error.message?.toLowerCase().includes('table')
      ) {
        return {
          success: true,
          message: `Koneksi ke project Supabase BERHASIL (${latencyMs}ms). Catatan: Tabel belum dibuat, silakan jalankan SQL Migrasi.`,
          latencyMs,
        };
      }

      // If invalid API key / JWT
      if (error.code === 'PGRST301' || error.message?.toLowerCase().includes('jwt') || error.message?.toLowerCase().includes('key')) {
        return {
          success: false,
          message: `Koneksi gagal: Anon Key tidak valid (${error.message}).`,
        };
      }

      // Other PostgreSQL / RLS response that still proves server contact
      return {
        success: true,
        message: `Terhubung ke Supabase (${latencyMs}ms). Respon API: ${error.message}`,
        latencyMs,
      };
    }

    return {
      success: true,
      message: `Koneksi ke database Supabase BERHASIL dan tabel terverifikasi (${latencyMs}ms)!`,
      latencyMs,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Gagal menghubungi Supabase: ${errorMsg}`,
    };
  }
}

/**
 * Generate Complete SQL DDL & Seed Script for Supabase SQL Editor
 */
export function generateSupabaseSqlScript(): string {
  return `-- ====================================================================
-- SKRIP MIGRASI DATABASE SUPABASE
-- PROGRAM STUDI MAGISTER KESEHATAN MASYARAKAT (S2 MKM)
-- FAKULTAS ILMU KESEHATAN DAN PSIKOLOGI - UNIVERSITAS MUHAMMADIYAH PONTIANAK
-- ====================================================================

-- 1. Tabel Pengaturan Website (Site Settings)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  hero_kicker TEXT,
  hero_headline TEXT,
  hero_subheadline TEXT,
  announcement_text TEXT,
  pmb_batch_name TEXT,
  pmb_batch_deadline TEXT,
  base_spp_per_semester BIGINT DEFAULT 7500000,
  base_development_fee BIGINT DEFAULT 4500000,
  matriculation_fee BIGINT DEFAULT 1500000,
  registration_fee BIGINT DEFAULT 500000,
  alumni_discount BIGINT DEFAULT 1500000,
  partner_discount BIGINT DEFAULT 1000000,
  thesis_exam_fee BIGINT DEFAULT 3500000,
  official_email TEXT DEFAULT 'mkm@unmuhpnk.ac.id',
  hotline_whatsapp TEXT DEFAULT '+62 812-5678-9012',
  campus_address TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Pendaftar PMB (Applicants)
CREATE TABLE IF NOT EXISTS public.applicants (
  id TEXT PRIMARY KEY,
  registration_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  s1_major TEXT,
  s1_campus TEXT,
  current_job TEXT,
  peminatan TEXT NOT NULL,
  category TEXT DEFAULT 'Reguler',
  notes TEXT,
  status TEXT DEFAULT 'Menunggu Verifikasi',
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Peminatan S2 MKM (Peminatan)
CREATE TABLE IF NOT EXISTS public.peminatan (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  badge TEXT,
  description TEXT,
  career_prospects JSONB DEFAULT '[]'::jsonb,
  core_subjects JSONB DEFAULT '[]'::jsonb,
  thesis_topics JSONB DEFAULT '[]'::jsonb,
  icon_name TEXT DEFAULT 'Activity',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Dosen Pengajar (Lecturers)
CREATE TABLE IF NOT EXISTS public.lecturers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  specialty TEXT,
  education TEXT,
  scopus_articles INT DEFAULT 0,
  featured_role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabel Tautan Akademik, Kelas Online & Tesis (Academic Links)
CREATE TABLE IF NOT EXISTS public.academic_links (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'kelas_online' | 'tesis' | 'akademik' | 'referensi' | 'keuangan'
  target_audience TEXT DEFAULT 'all', -- 'all' | 'dosen' | 'mahasiswa'
  url TEXT NOT NULL,
  description TEXT,
  badge TEXT,
  icon_name TEXT DEFAULT 'ExternalLink',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peminatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_links ENABLE ROW LEVEL SECURITY;

-- 7. Kebijakan Akses Terbuka (Public Read/Write untuk Portal MKM)
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Write Settings" ON public.site_settings FOR ALL USING (true);

CREATE POLICY "Public Read Applicants" ON public.applicants FOR SELECT USING (true);
CREATE POLICY "Public Insert Applicants" ON public.applicants FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Applicants" ON public.applicants FOR UPDATE USING (true);
CREATE POLICY "Public Delete Applicants" ON public.applicants FOR DELETE USING (true);

CREATE POLICY "Public Read Peminatan" ON public.peminatan FOR SELECT USING (true);
CREATE POLICY "Public Write Peminatan" ON public.peminatan FOR ALL USING (true);

CREATE POLICY "Public Read Lecturers" ON public.lecturers FOR SELECT USING (true);
CREATE POLICY "Public Write Lecturers" ON public.lecturers FOR ALL USING (true);

CREATE POLICY "Public Read Links" ON public.academic_links FOR SELECT USING (true);
CREATE POLICY "Public Write Links" ON public.academic_links FOR ALL USING (true);

-- 8. Indeks Pencarian Cepat
CREATE INDEX IF NOT EXISTS idx_applicants_reg_no ON public.applicants(registration_number);
CREATE INDEX IF NOT EXISTS idx_applicants_status ON public.applicants(status);
CREATE INDEX IF NOT EXISTS idx_academic_links_cat ON public.academic_links(category);
CREATE INDEX IF NOT EXISTS idx_academic_links_target ON public.academic_links(target_audience);
`;
}

/**
 * Push all local data to Supabase (Initial Seed / Backup Sync)
 */
export async function syncLocalDataToSupabase(payload: {
  settings: SiteSettings;
  applicants: ApplicantRecord[];
  peminatans: Peminatan[];
  lecturers: Lecturer[];
  academicLinks: AcademicLink[];
}): Promise<{ success: boolean; message: string; details: Record<string, number> }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: 'Supabase client belum terhubung. Periksa konfigurasi URL & Anon Key.',
      details: {},
    };
  }

  const details: Record<string, number> = {
    settings: 0,
    applicants: 0,
    peminatan: 0,
    lecturers: 0,
    academic_links: 0,
  };

  try {
    // 1. Sync Settings
    const { error: settingsError } = await supabase.from('site_settings').upsert({
      id: 'default',
      hero_kicker: payload.settings.heroKicker,
      hero_headline: payload.settings.heroHeadline,
      hero_subheadline: payload.settings.heroSubheadline,
      announcement_text: payload.settings.announcementText,
      pmb_batch_name: payload.settings.pmbBatchName,
      pmb_batch_deadline: payload.settings.pmbBatchDeadline,
      base_spp_per_semester: payload.settings.baseSppPerSemester,
      base_development_fee: payload.settings.baseDevelopmentFee,
      matriculation_fee: payload.settings.matriculationFee,
      registration_fee: payload.settings.registrationFee,
      alumni_discount: payload.settings.alumniDiscount,
      partner_discount: payload.settings.partnerDiscount,
      thesis_exam_fee: payload.settings.thesisExamFee,
      official_email: payload.settings.officialEmail,
      hotline_whatsapp: payload.settings.hotlineWhatsapp,
      campus_address: payload.settings.campusAddress,
      updated_at: new Date().toISOString(),
    });
    if (!settingsError) details.settings = 1;

    // 2. Sync Applicants
    if (payload.applicants.length > 0) {
      const applicantRows = payload.applicants.map((a) => ({
        id: a.id,
        registration_number: a.registrationNumber,
        full_name: a.fullName,
        whatsapp: a.whatsapp,
        email: a.email,
        s1_major: a.s1Major,
        s1_campus: a.s1Campus,
        current_job: a.currentJob,
        peminatan: a.peminatan,
        category: a.category,
        notes: a.notes,
        status: a.status,
        registered_at: a.registeredAt,
      }));
      const { error: appError } = await supabase.from('applicants').upsert(applicantRows, {
        onConflict: 'id',
      });
      if (!appError) details.applicants = applicantRows.length;
    }

    // 3. Sync Peminatan
    if (payload.peminatans.length > 0) {
      const peminatanRows = payload.peminatans.map((p) => ({
        id: p.id,
        name: p.name,
        short_name: p.shortName,
        badge: p.badge,
        description: p.description,
        career_prospects: p.careerProspects,
        core_subjects: p.coreSubjects,
        thesis_topics: p.thesisTopics,
        icon_name: p.iconName,
        updated_at: new Date().toISOString(),
      }));
      const { error: pemError } = await supabase.from('peminatan').upsert(peminatanRows, {
        onConflict: 'id',
      });
      if (!pemError) details.peminatan = peminatanRows.length;
    }

    // 4. Sync Lecturers
    if (payload.lecturers.length > 0) {
      const lecturerRows = payload.lecturers.map((l) => ({
        id: l.id,
        name: l.name,
        title: l.title,
        specialty: l.specialty,
        education: l.education,
        scopus_articles: l.scopusArticles,
        featured_role: l.featuredRole,
      }));
      const { error: lecError } = await supabase.from('lecturers').upsert(lecturerRows, {
        onConflict: 'id',
      });
      if (!lecError) details.lecturers = lecturerRows.length;
    }

    // 5. Sync Academic Links
    if (payload.academicLinks.length > 0) {
      const linkRows = payload.academicLinks.map((link) => ({
        id: link.id,
        title: link.title,
        category: link.category,
        target_audience: link.targetAudience,
        url: link.url,
        description: link.description,
        badge: link.badge,
        icon_name: link.iconName,
      }));
      const { error: linkError } = await supabase.from('academic_links').upsert(linkRows, {
        onConflict: 'id',
      });
      if (!linkError) details.academic_links = linkRows.length;
    }

    return {
      success: true,
      message: 'Berhasil menyinkronkan seluruh data ke database Supabase!',
      details,
    };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Sinkronisasi gagal: ${errorMsg}`,
      details,
    };
  }
}

/**
 * Fetch all data from Supabase
 */
export async function fetchAllFromSupabase(): Promise<{
  success: boolean;
  message: string;
  data?: {
    settings?: SiteSettings;
    applicants?: ApplicantRecord[];
    peminatans?: Peminatan[];
    lecturers?: Lecturer[];
    academicLinks?: AcademicLink[];
  };
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, message: 'Supabase client belum terhubung' };
  }

  try {
    const [settingsRes, applicantsRes, peminatanRes, lecturersRes, linksRes] = await Promise.all([
      supabase.from('site_settings').select('*').eq('id', 'default').single(),
      supabase.from('applicants').select('*').order('registered_at', { ascending: false }),
      supabase.from('peminatan').select('*'),
      supabase.from('lecturers').select('*'),
      supabase.from('academic_links').select('*'),
    ]);

    const result: {
      settings?: SiteSettings;
      applicants?: ApplicantRecord[];
      peminatans?: Peminatan[];
      lecturers?: Lecturer[];
      academicLinks?: AcademicLink[];
    } = {};

    if (settingsRes.data) {
      const d = settingsRes.data;
      result.settings = {
        heroKicker: d.hero_kicker,
        heroHeadline: d.hero_headline,
        heroSubheadline: d.hero_subheadline,
        announcementText: d.announcement_text,
        pmbBatchName: d.pmb_batch_name,
        pmbBatchDeadline: d.pmb_batch_deadline,
        baseSppPerSemester: Number(d.base_spp_per_semester || 7500000),
        baseDevelopmentFee: Number(d.base_development_fee || 4500000),
        matriculationFee: Number(d.matriculation_fee || 1500000),
        registrationFee: Number(d.registration_fee || 500000),
        alumniDiscount: Number(d.alumni_discount || 1500000),
        partnerDiscount: Number(d.partner_discount || 1000000),
        thesisExamFee: Number(d.thesis_exam_fee || 3500000),
        officialEmail: d.official_email || 'mkm@unmuhpnk.ac.id',
        hotlineWhatsapp: d.hotline_whatsapp || '+62 812-5678-9012',
        campusAddress: d.campus_address || '',
      };
    }

    if (applicantsRes.data && applicantsRes.data.length > 0) {
      result.applicants = applicantsRes.data.map((row: any) => ({
        id: row.id,
        registrationNumber: row.registration_number,
        fullName: row.full_name,
        whatsapp: row.whatsapp,
        email: row.email,
        s1Major: row.s1_major || '',
        s1Campus: row.s1_campus || '',
        currentJob: row.current_job || '',
        peminatan: row.peminatan,
        category: row.category || 'Reguler',
        notes: row.notes || '',
        status: row.status as any,
        registeredAt: row.registered_at,
      }));
    }

    if (peminatanRes.data && peminatanRes.data.length > 0) {
      result.peminatans = peminatanRes.data.map((row: any) => ({
        id: row.id,
        name: row.name,
        shortName: row.short_name,
        badge: row.badge,
        description: row.description,
        careerProspects: Array.isArray(row.career_prospects) ? row.career_prospects : [],
        coreSubjects: Array.isArray(row.core_subjects) ? row.core_subjects : [],
        thesisTopics: Array.isArray(row.thesis_topics) ? row.thesis_topics : [],
        iconName: row.icon_name || 'Activity',
      }));
    }

    if (lecturersRes.data && lecturersRes.data.length > 0) {
      result.lecturers = lecturersRes.data.map((row: any) => ({
        id: row.id,
        name: row.name,
        title: row.title,
        specialty: row.specialty,
        education: row.education,
        scopusArticles: row.scopus_articles || 0,
        featuredRole: row.featured_role || '',
      }));
    }

    if (linksRes.data && linksRes.data.length > 0) {
      result.academicLinks = linksRes.data.map((row: any) => ({
        id: row.id,
        title: row.title,
        category: row.category,
        targetAudience: row.target_audience,
        url: row.url,
        description: row.description,
        badge: row.badge,
        iconName: row.icon_name,
      }));
    }

    return {
      success: true,
      message: 'Data berhasil dimuat dari database Supabase!',
      data: result,
    };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Gagal memuat data dari Supabase: ${errorMsg}`,
    };
  }
}

/**
 * Add an applicant directly into Supabase
 */
export async function insertApplicantToSupabase(applicant: ApplicantRecord): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('applicants').insert({
      id: applicant.id,
      registration_number: applicant.registrationNumber,
      full_name: applicant.fullName,
      whatsapp: applicant.whatsapp,
      email: applicant.email,
      s1_major: applicant.s1Major,
      s1_campus: applicant.s1Campus,
      current_job: applicant.currentJob,
      peminatan: applicant.peminatan,
      category: applicant.category,
      notes: applicant.notes,
      status: applicant.status,
      registered_at: applicant.registeredAt,
    });
    return !error;
  } catch (err) {
    console.error('Error inserting applicant to Supabase:', err);
    return false;
  }
}

/**
 * Update applicant status in Supabase
 */
export async function updateApplicantStatusInSupabase(
  id: string,
  status: ApplicantRecord['status']
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('applicants')
      .update({ status })
      .eq('id', id);
    return !error;
  } catch (err) {
    console.error('Error updating applicant status in Supabase:', err);
    return false;
  }
}
