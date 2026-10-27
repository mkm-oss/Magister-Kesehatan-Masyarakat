import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Peminatan,
  SemesterInfo,
  Lecturer,
  AcademicLink,
  ApplicantRecord,
  SiteSettings,
  FaqItem,
  PortalMenuItem,
  AnnouncementItem,
  ReminderItem,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_PEMINATAN_DATA,
  DEFAULT_CURRICULUM_DATA,
  DEFAULT_LECTURERS_DATA,
  DEFAULT_ACADEMIC_LINKS,
  DEFAULT_INITIAL_APPLICANTS,
  DEFAULT_FAQS_DATA,
  DEFAULT_PORTAL_MENUS,
  DEFAULT_ANNOUNCEMENTS,
  DEFAULT_REMINDERS,
  PortalUser,
  DEFAULT_PORTAL_USERS,
} from '../data/mkmData';
import {
  getStoredSupabaseConfig,
  fetchAllFromSupabase,
  insertApplicantToSupabase,
  updateApplicantStatusInSupabase,
} from '../services/supabaseService';

export type UserRole = 'admin' | 'dosen' | 'mahasiswa' | null;

export interface CurrentUser {
  role: UserRole;
  name: string;
  identifier: string; // NIDN for dosen, NIM for mahasiswa, username for admin
  email?: string;
  avatarInitial: string;
}

interface AppContextType {
  currentUser: CurrentUser | null;
  login: (role: 'admin' | 'dosen' | 'mahasiswa', identifier: string, name?: string) => void;
  logout: () => void;

  // Site state
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;

  peminatans: Peminatan[];
  updatePeminatan: (id: string, updated: Partial<Peminatan>) => void;

  curriculum: SemesterInfo[];
  updateCurriculum: (updated: SemesterInfo[]) => void;

  lecturers: Lecturer[];
  updateLecturers: (updated: Lecturer[]) => void;
  addLecturer: (lec: Omit<Lecturer, 'id'>) => void;
  deleteLecturer: (id: string) => void;

  academicLinks: AcademicLink[];
  updateAcademicLinks: (links: AcademicLink[]) => void;
  addAcademicLink: (link: Omit<AcademicLink, 'id'>) => void;
  deleteAcademicLink: (id: string) => void;

  faqs: FaqItem[];
  updateFaqs: (faqs: FaqItem[]) => void;

  applicants: ApplicantRecord[];
  addApplicant: (applicant: Omit<ApplicantRecord, 'id' | 'registrationNumber' | 'registeredAt'>) => string;
  updateApplicantStatus: (id: string, status: ApplicantRecord['status']) => void;

  // Adaptasi Fitur Utama Portal MKM Apps Script
  portalMenus: PortalMenuItem[];
  savePortalMenu: (menu: PortalMenuItem) => void;
  deletePortalMenu: (id: string) => void;

  announcements: AnnouncementItem[];
  addAnnouncement: (announcement: Omit<AnnouncementItem, 'id' | 'createdAt'>) => void;
  deleteAnnouncement: (id: string) => void;

  reminders: ReminderItem[];
  addReminder: (reminder: Omit<ReminderItem, 'id'>) => void;
  deleteReminder: (id: string) => void;

  favoriteMenuIds: string[];
  toggleFavoriteMenu: (id: string) => void;

  // Manajemen Pengguna & Password Portal
  portalUsers: PortalUser[];
  addPortalUser: (user: Omit<PortalUser, 'id' | 'updatedAt'>) => void;
  updatePortalUser: (id: string, updated: Partial<PortalUser>) => void;
  deletePortalUser: (id: string) => void;
  validatePortalLogin: (
    identifier: string,
    pin: string,
    role?: 'admin' | 'dosen' | 'mahasiswa'
  ) => { success: boolean; user?: PortalUser; message?: string };

  // Active view management
  activePortalView: 'landing' | 'admin' | 'dosen' | 'mahasiswa' | 'sim_akreditasi';
  setActivePortalView: (view: 'landing' | 'admin' | 'dosen' | 'mahasiswa' | 'sim_akreditasi') => void;

  // Reset to factory defaults
  resetAllDataToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'mkm_fikpsi_portal_data_v2';
const USER_KEY = 'mkm_fikpsi_portal_user_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [activePortalView, setActivePortalView] = useState<'landing' | 'admin' | 'dosen' | 'mahasiswa' | 'sim_akreditasi'>('landing');

  // CMS state
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
      return saved ? JSON.parse(saved) : DEFAULT_SITE_SETTINGS;
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  });

  const [peminatans, setPeminatans] = useState<Peminatan[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_peminatans`);
      return saved ? JSON.parse(saved) : DEFAULT_PEMINATAN_DATA;
    } catch {
      return DEFAULT_PEMINATAN_DATA;
    }
  });

  const [curriculum, setCurriculum] = useState<SemesterInfo[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_curriculum`);
      return saved ? JSON.parse(saved) : DEFAULT_CURRICULUM_DATA;
    } catch {
      return DEFAULT_CURRICULUM_DATA;
    }
  });

  const [lecturers, setLecturers] = useState<Lecturer[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_lecturers`);
      return saved ? JSON.parse(saved) : DEFAULT_LECTURERS_DATA;
    } catch {
      return DEFAULT_LECTURERS_DATA;
    }
  });

  const [academicLinks, setAcademicLinks] = useState<AcademicLink[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_academic_links`);
      return saved ? JSON.parse(saved) : DEFAULT_ACADEMIC_LINKS;
    } catch {
      return DEFAULT_ACADEMIC_LINKS;
    }
  });

  const [faqs, setFaqs] = useState<FaqItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_faqs`);
      return saved ? JSON.parse(saved) : DEFAULT_FAQS_DATA;
    } catch {
      return DEFAULT_FAQS_DATA;
    }
  });

  const [applicants, setApplicants] = useState<ApplicantRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_applicants`);
      return saved ? JSON.parse(saved) : DEFAULT_INITIAL_APPLICANTS;
    } catch {
      return DEFAULT_INITIAL_APPLICANTS;
    }
  });

  // Adaptasi Menu Layanan Inti dari Apps Script (MENU_AWAL)
  const [portalMenus, setPortalMenus] = useState<PortalMenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_portal_menus`);
      return saved ? JSON.parse(saved) : DEFAULT_PORTAL_MENUS;
    } catch {
      return DEFAULT_PORTAL_MENUS;
    }
  });

  // Pengumuman Prodi
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_announcements`);
      return saved ? JSON.parse(saved) : DEFAULT_ANNOUNCEMENTS;
    } catch {
      return DEFAULT_ANNOUNCEMENTS;
    }
  });

  // Pengingat / Agenda Deadline
  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_reminders`);
      return saved ? JSON.parse(saved) : DEFAULT_REMINDERS;
    } catch {
      return DEFAULT_REMINDERS;
    }
  });

  // Menu Tersemat (Favorit Pin)
  const [favoriteMenuIds, setFavoriteMenuIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_fav_menus`);
      return saved ? JSON.parse(saved) : ['menu-1', 'menu-2', 'menu-3'];
    } catch {
      return ['menu-1', 'menu-2', 'menu-3'];
    }
  });

  // Pengguna & Password Masuk Portal
  const [portalUsers, setPortalUsers] = useState<PortalUser[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_portal_users`);
      return saved ? JSON.parse(saved) : DEFAULT_PORTAL_USERS;
    } catch {
      return DEFAULT_PORTAL_USERS;
    }
  });

  // Automatically fetch from Supabase if configured on startup
  useEffect(() => {
    const config = getStoredSupabaseConfig();
    if (config.isConfigured) {
      fetchAllFromSupabase().then((res) => {
        if (res.success && res.data) {
          if (res.data.settings) setSettings(res.data.settings);
          if (res.data.applicants && res.data.applicants.length > 0) setApplicants(res.data.applicants);
          if (res.data.peminatans && res.data.peminatans.length > 0) setPeminatans(res.data.peminatans);
          if (res.data.lecturers && res.data.lecturers.length > 0) setLecturers(res.data.lecturers);
          if (res.data.academicLinks && res.data.academicLinks.length > 0) setAcademicLinks(res.data.academicLinks);
        }
      }).catch((err) => {
        console.warn('Initial Supabase fetch skipped:', err);
      });
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_peminatans`, JSON.stringify(peminatans));
    } catch (e) {
      console.error(e);
    }
  }, [peminatans]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_curriculum`, JSON.stringify(curriculum));
    } catch (e) {
      console.error(e);
    }
  }, [curriculum]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_lecturers`, JSON.stringify(lecturers));
    } catch (e) {
      console.error(e);
    }
  }, [lecturers]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_academic_links`, JSON.stringify(academicLinks));
    } catch (e) {
      console.error(e);
    }
  }, [academicLinks]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_faqs`, JSON.stringify(faqs));
    } catch (e) {
      console.error(e);
    }
  }, [faqs]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_applicants`, JSON.stringify(applicants));
    } catch (e) {
      console.error(e);
    }
  }, [applicants]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_portal_menus`, JSON.stringify(portalMenus));
    } catch (e) {
      console.error(e);
    }
  }, [portalMenus]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_announcements`, JSON.stringify(announcements));
    } catch (e) {
      console.error(e);
    }
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_reminders`, JSON.stringify(reminders));
    } catch (e) {
      console.error(e);
    }
  }, [reminders]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_fav_menus`, JSON.stringify(favoriteMenuIds));
    } catch (e) {
      console.error(e);
    }
  }, [favoriteMenuIds]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_portal_users`, JSON.stringify(portalUsers));
    } catch (e) {
      console.error(e);
    }
  }, [portalUsers]);

  const login = (role: 'admin' | 'dosen' | 'mahasiswa', identifier: string, name?: string) => {
    let userObj: CurrentUser;
    if (role === 'admin') {
      userObj = {
        role: 'admin',
        name: name || 'Administrator Pascasarjana MKM',
        identifier: identifier || 'admin.mkm',
        email: 'mkm@unmuhpnk.ac.id',
        avatarInitial: 'AD',
      };
      setActivePortalView('admin');
    } else if (role === 'dosen') {
      userObj = {
        role: 'dosen',
        name: name || 'Dr. Rochmawati, S.KM., M.Kes.',
        identifier: identifier || 'NIDN: 1102047801',
        email: 'rochmawati@unmuhpnk.ac.id',
        avatarInitial: 'RC',
      };
      setActivePortalView('dosen');
    } else {
      userObj = {
        role: 'mahasiswa',
        name: name || 'Ahmad Fauzi, S.KM.',
        identifier: identifier || 'NIM: 241021004',
        email: 'ahmad.fauzi@student.unmuhpnk.ac.id',
        avatarInitial: 'AF',
      };
      setActivePortalView('mahasiswa');
    }

    setCurrentUser(userObj);
    localStorage.setItem(USER_KEY, JSON.stringify(userObj));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(USER_KEY);
    setActivePortalView('landing');
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updatePeminatan = (id: string, updated: Partial<Peminatan>) => {
    setPeminatans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const updateCurriculum = (updated: SemesterInfo[]) => {
    setCurriculum(updated);
  };

  const updateLecturers = (updated: Lecturer[]) => {
    setLecturers(updated);
  };

  const addLecturer = (lec: Omit<Lecturer, 'id'>) => {
    const newLec: Lecturer = { ...lec, id: `lec-${Date.now()}` };
    setLecturers((prev) => [...prev, newLec]);
  };

  const deleteLecturer = (id: string) => {
    setLecturers((prev) => prev.filter((l) => l.id !== id));
  };

  const updateAcademicLinks = (links: AcademicLink[]) => {
    setAcademicLinks(links);
  };

  const addAcademicLink = (link: Omit<AcademicLink, 'id'>) => {
    const newLink: AcademicLink = { ...link, id: `link-${Date.now()}` };
    setAcademicLinks((prev) => [...prev, newLink]);
  };

  const deleteAcademicLink = (id: string) => {
    setAcademicLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const updateFaqs = (newFaqs: FaqItem[]) => {
    setFaqs(newFaqs);
  };

  const addApplicant = (applicant: Omit<ApplicantRecord, 'id' | 'registrationNumber' | 'registeredAt'>) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const regNum = `MKM-UMP-2026-${randomSuffix}`;
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 16).replace('T', ' ');

    const newApplicant: ApplicantRecord = {
      ...applicant,
      id: `app-${Date.now()}`,
      registrationNumber: regNum,
      registeredAt: dateStr,
    };

    setApplicants((prev) => [newApplicant, ...prev]);

    // Asynchronously sync to Supabase database if connected
    insertApplicantToSupabase(newApplicant).catch((err) => {
      console.warn('Could not sync applicant to Supabase:', err);
    });

    return regNum;
  };

  const updateApplicantStatus = (id: string, status: ApplicantRecord['status']) => {
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

    // Asynchronously update status in Supabase database
    updateApplicantStatusInSupabase(id, status).catch((err) => {
      console.warn('Could not update applicant status in Supabase:', err);
    });
  };

  const toggleFavoriteMenu = (id: string) => {
    setFavoriteMenuIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const savePortalMenu = (menu: PortalMenuItem) => {
    setPortalMenus((prev) => {
      const idx = prev.findIndex((m) => m.id === menu.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = menu;
        return updated;
      }
      return [...prev, menu];
    });
  };

  const deletePortalMenu = (id: string) => {
    setPortalMenus((prev) => prev.filter((m) => m.id !== id));
  };

  const addAnnouncement = (item: Omit<AnnouncementItem, 'id' | 'createdAt'>) => {
    const newAnn: AnnouncementItem = {
      ...item,
      id: `inf-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const addReminder = (item: Omit<ReminderItem, 'id'>) => {
    const newRem: ReminderItem = {
      ...item,
      id: `ing-${Date.now()}`,
    };
    setReminders((prev) => [newRem, ...prev]);
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  // Manajemen Akun & Password Masuk Portal
  const addPortalUser = (user: Omit<PortalUser, 'id' | 'updatedAt'>) => {
    const newUser: PortalUser = {
      ...user,
      id: `user-${Date.now()}`,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setPortalUsers((prev) => [newUser, ...prev]);
  };

  const updatePortalUser = (id: string, updated: Partial<PortalUser>) => {
    setPortalUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              ...updated,
              updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            }
          : u
      )
    );
  };

  const deletePortalUser = (id: string) => {
    setPortalUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const validatePortalLogin = (
    identifier: string,
    pin: string,
    role?: 'admin' | 'dosen' | 'mahasiswa'
  ): { success: boolean; user?: PortalUser; message?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPin = pin.trim();

    // Find user by email, ID, or NIM/NIDN
    let found = portalUsers.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.id.toLowerCase() === cleanId ||
        (u.number && u.number.trim().toLowerCase() === cleanId) ||
        (cleanId === 'admin' && u.role === 'admin') ||
        (cleanId === 'admin.mkm' && u.role === 'admin')
    );

    // If not found directly and role is specified, try finding first matching user of that role if cleanId is generic
    if (!found && role) {
      if (cleanId === role || cleanId === 'demo' || cleanId === 'user') {
        found = portalUsers.find((u) => u.role === role);
      }
    }

    if (!found) {
      return {
        success: false,
        message: 'Pengguna tidak ditemukan. Periksa Email, NIDN, atau NIM yang dimasukkan.',
      };
    }

    if (found.pin !== cleanPin) {
      return {
        success: false,
        message: 'Password / PIN salah. Silakan masukkan password yang benar.',
      };
    }

    return {
      success: true,
      user: found,
    };
  };

  const resetAllDataToDefault = () => {
    setSettings(DEFAULT_SITE_SETTINGS);
    setPeminatans(DEFAULT_PEMINATAN_DATA);
    setCurriculum(DEFAULT_CURRICULUM_DATA);
    setLecturers(DEFAULT_LECTURERS_DATA);
    setAcademicLinks(DEFAULT_ACADEMIC_LINKS);
    setFaqs(DEFAULT_FAQS_DATA);
    setApplicants(DEFAULT_INITIAL_APPLICANTS);
    setPortalMenus(DEFAULT_PORTAL_MENUS);
    setAnnouncements(DEFAULT_ANNOUNCEMENTS);
    setReminders(DEFAULT_REMINDERS);
    setPortalUsers(DEFAULT_PORTAL_USERS);
    setFavoriteMenuIds(['menu-1', 'menu-2', 'menu-3']);
    localStorage.removeItem(`${STORAGE_KEY}_settings`);
    localStorage.removeItem(`${STORAGE_KEY}_peminatans`);
    localStorage.removeItem(`${STORAGE_KEY}_curriculum`);
    localStorage.removeItem(`${STORAGE_KEY}_lecturers`);
    localStorage.removeItem(`${STORAGE_KEY}_academic_links`);
    localStorage.removeItem(`${STORAGE_KEY}_faqs`);
    localStorage.removeItem(`${STORAGE_KEY}_applicants`);
    localStorage.removeItem(`${STORAGE_KEY}_portal_menus`);
    localStorage.removeItem(`${STORAGE_KEY}_announcements`);
    localStorage.removeItem(`${STORAGE_KEY}_reminders`);
    localStorage.removeItem(`${STORAGE_KEY}_portal_users`);
    localStorage.removeItem(`${STORAGE_KEY}_fav_menus`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        settings,
        updateSettings,
        peminatans,
        updatePeminatan,
        curriculum,
        updateCurriculum,
        lecturers,
        updateLecturers,
        addLecturer,
        deleteLecturer,
        academicLinks,
        updateAcademicLinks,
        addAcademicLink,
        deleteAcademicLink,
        faqs,
        updateFaqs,
        applicants,
        addApplicant,
        updateApplicantStatus,
        activePortalView,
        setActivePortalView,
        resetAllDataToDefault,
        portalMenus,
        savePortalMenu,
        deletePortalMenu,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        reminders,
        addReminder,
        deleteReminder,
        favoriteMenuIds,
        toggleFavoriteMenu,
        portalUsers,
        addPortalUser,
        updatePortalUser,
        deletePortalUser,
        validatePortalLogin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
