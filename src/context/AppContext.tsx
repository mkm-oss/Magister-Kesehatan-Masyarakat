import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Peminatan,
  SemesterInfo,
  Lecturer,
  AcademicLink,
  ApplicantRecord,
  SiteSettings,
  FaqItem,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_PEMINATAN_DATA,
  DEFAULT_CURRICULUM_DATA,
  DEFAULT_LECTURERS_DATA,
  DEFAULT_ACADEMIC_LINKS,
  DEFAULT_INITIAL_APPLICANTS,
  DEFAULT_FAQS_DATA,
} from '../data/mkmData';

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

  // Active view management
  activePortalView: 'landing' | 'admin' | 'dosen' | 'mahasiswa';
  setActivePortalView: (view: 'landing' | 'admin' | 'dosen' | 'mahasiswa') => void;

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

  const [activePortalView, setActivePortalView] = useState<'landing' | 'admin' | 'dosen' | 'mahasiswa'>('landing');

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
    return regNum;
  };

  const updateApplicantStatus = (id: string, status: ApplicantRecord['status']) => {
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const resetAllDataToDefault = () => {
    setSettings(DEFAULT_SITE_SETTINGS);
    setPeminatans(DEFAULT_PEMINATAN_DATA);
    setCurriculum(DEFAULT_CURRICULUM_DATA);
    setLecturers(DEFAULT_LECTURERS_DATA);
    setAcademicLinks(DEFAULT_ACADEMIC_LINKS);
    setFaqs(DEFAULT_FAQS_DATA);
    setApplicants(DEFAULT_INITIAL_APPLICANTS);
    localStorage.removeItem(`${STORAGE_KEY}_settings`);
    localStorage.removeItem(`${STORAGE_KEY}_peminatans`);
    localStorage.removeItem(`${STORAGE_KEY}_curriculum`);
    localStorage.removeItem(`${STORAGE_KEY}_lecturers`);
    localStorage.removeItem(`${STORAGE_KEY}_academic_links`);
    localStorage.removeItem(`${STORAGE_KEY}_faqs`);
    localStorage.removeItem(`${STORAGE_KEY}_applicants`);
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
