import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SchoolProfile,
  Teacher,
  Supervisor,
  SupervisionRecord,
  TeacherMonitoring5Weeks,
  WeekProgress
} from '../types/supervisi';
import {
  INITIAL_SCHOOL,
  INITIAL_SUPERVISORS,
  INITIAL_TEACHERS,
  INITIAL_SUPERVISIONS,
  INITIAL_MONITORING_5_WEEKS
} from '../data/initialData';

interface SupervisionContextType {
  school: SchoolProfile;
  updateSchool: (data: Partial<SchoolProfile>) => void;
  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  supervisors: Supervisor[];
  addSupervisor: (supervisor: Omit<Supervisor, 'id'>) => void;
  supervisions: SupervisionRecord[];
  addSupervision: (record: Omit<SupervisionRecord, 'id'>) => SupervisionRecord;
  updateSupervision: (id: string, record: Partial<SupervisionRecord>) => void;
  deleteSupervision: (id: string) => void;
  monitoringList: TeacherMonitoring5Weeks[];
  updateMonitoringWeek: (monitoringId: string, weekIndex: number, data: Partial<WeekProgress>) => void;
  createOrGetMonitoring: (teacherId: string, supervisionId: string, focusTopic?: string) => TeacherMonitoring5Weeks;
  resetToDefault: () => void;
  activeRole: 'Admin/Kepsek' | 'Supervisor' | 'Guru';
  setActiveRole: (role: 'Admin/Kepsek' | 'Supervisor' | 'Guru') => void;
  activeTab: 'dashboard' | 'master-data' | 'rubrik-supervisi' | 'hasil-analisis' | 'monitoring-5-minggu' | 'rekapitulasi';
  setActiveTab: (tab: 'dashboard' | 'master-data' | 'rubrik-supervisi' | 'hasil-analisis' | 'monitoring-5-minggu' | 'rekapitulasi') => void;
  selectedSupervisionForPrint: SupervisionRecord | null;
  setSelectedSupervisionForPrint: (s: SupervisionRecord | null) => void;
  openNewSupervisionForTeacher: (teacherId?: string) => void;
  targetTeacherForSupervisionId: string | null;
  setTargetTeacherForSupervisionId: (id: string | null) => void;
}

const SupervisionContext = createContext<SupervisionContextType | undefined>(undefined);

export const SupervisionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [school, setSchool] = useState<SchoolProfile>(() => {
    const saved = localStorage.getItem('esupervisi_school');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.npsn === '10804052' || !parsed.npsn) {
          return INITIAL_SCHOOL;
        }
        return {
          ...INITIAL_SCHOOL,
          ...parsed,
          namaSupervisor: parsed.namaSupervisor || INITIAL_SCHOOL.namaSupervisor,
          nipSupervisor: parsed.nipSupervisor || INITIAL_SCHOOL.nipSupervisor
        };
      } catch {
        return INITIAL_SCHOOL;
      }
    }
    return INITIAL_SCHOOL;
  });

  const [supervisors, setSupervisors] = useState<Supervisor[]>(() => {
    const saved = localStorage.getItem('esupervisi_supervisors');
    return saved ? JSON.parse(saved) : INITIAL_SUPERVISORS;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('esupervisi_teachers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && !parsed.some((t: any) => t.id === 'tch-8')) {
          return INITIAL_TEACHERS;
        }
        return parsed;
      } catch {
        return INITIAL_TEACHERS;
      }
    }
    return INITIAL_TEACHERS;
  });

  const [supervisions, setSupervisions] = useState<SupervisionRecord[]>(() => {
    const saved = localStorage.getItem('esupervisi_supervisions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed[0]?.mapel === 'Agribisnis Pengolahan Hasil Pertanian') {
          return INITIAL_SUPERVISIONS;
        }
        return parsed;
      } catch {
        return INITIAL_SUPERVISIONS;
      }
    }
    return INITIAL_SUPERVISIONS;
  });

  const [monitoringList, setMonitoringList] = useState<TeacherMonitoring5Weeks[]>(() => {
    const saved = localStorage.getItem('esupervisi_monitoring');
    return saved ? JSON.parse(saved) : INITIAL_MONITORING_5_WEEKS;
  });

  const [activeRole, setActiveRole] = useState<'Admin/Kepsek' | 'Supervisor' | 'Guru'>('Admin/Kepsek');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'master-data' | 'rubrik-supervisi' | 'hasil-analisis' | 'monitoring-5-minggu' | 'rekapitulasi'>('dashboard');
  const [selectedSupervisionForPrint, setSelectedSupervisionForPrint] = useState<SupervisionRecord | null>(null);
  const [targetTeacherForSupervisionId, setTargetTeacherForSupervisionId] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('esupervisi_school', JSON.stringify(school));
  }, [school]);

  useEffect(() => {
    localStorage.setItem('esupervisi_supervisors', JSON.stringify(supervisors));
  }, [supervisors]);

  useEffect(() => {
    localStorage.setItem('esupervisi_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('esupervisi_supervisions', JSON.stringify(supervisions));
  }, [supervisions]);

  useEffect(() => {
    localStorage.setItem('esupervisi_monitoring', JSON.stringify(monitoringList));
  }, [monitoringList]);

  const updateSchool = (data: Partial<SchoolProfile>) => {
    setSchool(prev => {
      const next = { ...prev, ...data };
      if (data.namaSupervisor) {
        setSupervisors(curr => {
          const updated = [...curr];
          if (updated.length > 0) {
            updated[0] = {
              ...updated[0],
              nama: data.namaSupervisor || updated[0].nama,
              nip: data.nipSupervisor !== undefined ? data.nipSupervisor : updated[0].nip
            };
          } else {
            updated.push({
              id: 'spv-main',
              nama: data.namaSupervisor || '',
              nip: data.nipSupervisor || '',
              jabatan: 'Supervisor Utama'
            });
          }
          return updated;
        });
      }
      return next;
    });
  };

  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newId = `tch-${Date.now()}`;
    const newTeacher: Teacher = {
      ...teacher,
      id: newId,
      statusSupervisi: teacher.statusSupervisi || 'belum'
    };
    setTeachers(prev => [newTeacher, ...prev]);
  };

  const updateTeacher = (id: string, updated: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => (t.id === id ? { ...t, ...updated } : t)));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
  };

  const addSupervisor = (spv: Omit<Supervisor, 'id'>) => {
    const newId = `spv-${Date.now()}`;
    setSupervisors(prev => [...prev, { ...spv, id: newId }]);
  };

  const addSupervision = (record: Omit<SupervisionRecord, 'id'>): SupervisionRecord => {
    const newId = `sup-${Date.now()}`;
    const newRecord: SupervisionRecord = {
      ...record,
      id: newId
    };

    setSupervisions(prev => [newRecord, ...prev]);

    // Update teacher status and scores
    const targetStatus = newRecord.nilaiAkhir < 80 ? 'dalam_monitoring' : 'selesai';
    updateTeacher(newRecord.teacherId, {
      statusSupervisi: targetStatus,
      skorTerakhir: newRecord.nilaiAkhir,
      predikat: newRecord.predikat,
      tanggalSupervisi: newRecord.tanggal
    });

    // If teacher gets under 80 or needs monitoring, auto initialize or ensure 5-week monitoring
    if (newRecord.nilaiAkhir < 85) {
      createOrGetMonitoring(
        newRecord.teacherId,
        newId,
        `Tindak Lanjut Supervisi: ${newRecord.aspekPerluDitingkatkan || 'Peningkatan Kualitas Pembelajaran'}`
      );
    }

    return newRecord;
  };

  const updateSupervision = (id: string, updated: Partial<SupervisionRecord>) => {
    setSupervisions(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteSupervision = (id: string) => {
    setSupervisions(prev => prev.filter(s => s.id !== id));
  };

  const updateMonitoringWeek = (monitoringId: string, weekIndex: number, data: Partial<WeekProgress>) => {
    setMonitoringList(prev =>
      prev.map(item => {
        if (item.id !== monitoringId) return item;
        const updatedWeeks = [...item.weeks];
        updatedWeeks[weekIndex] = { ...updatedWeeks[weekIndex], ...data };
        
        // determine overall status
        const allDone = updatedWeeks.every(w => w.status === 'selesai');
        const anyRunning = updatedWeeks.some(w => w.status === 'sedang_berjalan' || w.status === 'selesai');
        const overallStatus = allDone ? 'selesai' : anyRunning ? 'sedang_berjalan' : 'belum';

        return {
          ...item,
          weeks: updatedWeeks,
          statusKeseluruhan: overallStatus
        };
      })
    );
  };

  const createOrGetMonitoring = (
    teacherId: string,
    supervisionId: string,
    focusTopic?: string
  ): TeacherMonitoring5Weeks => {
    const existing = monitoringList.find(m => m.teacherId === teacherId);
    if (existing) return existing;

    const teacher = teachers.find(t => t.id === teacherId);
    const teacherName = teacher ? `${teacher.nama}, ${teacher.gelar}` : 'Guru';

    const newMonitoring: TeacherMonitoring5Weeks = {
      id: `mon-${Date.now()}`,
      teacherId,
      supervisionId,
      fokusPerbaikan: focusTopic || `Peningkatan Kinerja Mengajar & Interaktivitas Kelas (${teacherName})`,
      tanggalMulai: new Date().toISOString().split('T')[0],
      statusKeseluruhan: 'sedang_berjalan',
      evaluasiAkhir: 'Tahap awal implementasi rencana tindak lanjut pasca-supervisi akademik.',
      weeks: [
        {
          mingguKe: 1,
          judul: 'Minggu 1: Refleksi & Pemetaan Rencana Belajar Mandiri PMM',
          deskripsi: 'Diskusi hasil supervisi bersama supervisor dan penentuan target modul PMM yang akan dipelajari.',
          kegiatanTarget: 'Mempelajari modul Platform Merdeka Mengajar terkait indikator yang perlu ditingkatkan.',
          status: 'sedang_berjalan',
          tanggalTarget: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          catatanSupervisor: 'Guru telah menerima umpan balik dan mulai menyusun jadwal belajar mandiri.'
        },
        {
          mingguKe: 2,
          judul: 'Minggu 2: Coaching & Pendampingan Perbaikan Modul Ajar',
          deskripsi: 'Bimbingan 1-on-1 dengan Supervisor atau Guru Penggerak dalam merevisi modul dan asesmen.',
          kegiatanTarget: 'Menyerahkan draf revisi Modul Ajar / LKPD yang telah mengakomodasi diferensiasi dan interaktivitas.',
          status: 'belum',
          tanggalTarget: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          catatanSupervisor: ''
        },
        {
          mingguKe: 3,
          judul: 'Minggu 3: Penerapan Praktik Baik di Ruang Kelas / Laboratorium',
          deskripsi: 'Implementasi rencana tindakan baru di depan peserta didik dengan fokus pada interaksi murid.',
          kegiatanTarget: 'Melaksanakan sesi pembelajaran terobservasi dengan variasi strategi interaktif baru.',
          status: 'belum',
          tanggalTarget: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
          catatanSupervisor: ''
        },
        {
          mingguKe: 4,
          judul: 'Minggu 4: Peer Observation & Berbagi Praktik di Komunitas Belajar',
          deskripsi: 'Pengamatan oleh rekan sejawat satu rumpun mata pelajaran dan diskusi kaji pembelajaran.',
          kegiatanTarget: 'Diskusi refleksi bersama rekan MGMP sekolah mengenai dampak terhadap respon murid.',
          status: 'belum',
          tanggalTarget: new Date(Date.now() + 28 * 86400000).toISOString().split('T')[0],
          catatanSupervisor: ''
        },
        {
          mingguKe: 5,
          judul: 'Minggu 5: Evaluasi Akhir Perubahan & Validasi Capaian',
          deskripsi: 'Review komprehensif portofolio 5 minggu oleh Kepala Sekolah / Pengawas.',
          kegiatanTarget: 'Penyusunan laporan akhir tuntas pendampingan dan kesiapan asesmen berkala berikutnya.',
          status: 'belum',
          tanggalTarget: new Date(Date.now() + 35 * 86400000).toISOString().split('T')[0],
          catatanSupervisor: ''
        }
      ]
    };

    setMonitoringList(prev => [newMonitoring, ...prev]);
    return newMonitoring;
  };

  const openNewSupervisionForTeacher = (teacherId?: string) => {
    if (teacherId) {
      setTargetTeacherForSupervisionId(teacherId);
    } else {
      setTargetTeacherForSupervisionId(null);
    }
    setActiveTab('rubrik-supervisi');
  };

  const resetToDefault = () => {
    if (confirm('Kembalikan seluruh data supervisi ke data percontohan awal (SMKN 1 Menggala)? Data yang diinput manual akan diatur ulang.')) {
      setSchool(INITIAL_SCHOOL);
      setSupervisors(INITIAL_SUPERVISORS);
      setTeachers(INITIAL_TEACHERS);
      setSupervisions(INITIAL_SUPERVISIONS);
      setMonitoringList(INITIAL_MONITORING_5_WEEKS);
      localStorage.clear();
    }
  };

  return (
    <SupervisionContext.Provider
      value={{
        school,
        updateSchool,
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        supervisors,
        addSupervisor,
        supervisions,
        addSupervision,
        updateSupervision,
        deleteSupervision,
        monitoringList,
        updateMonitoringWeek,
        createOrGetMonitoring,
        resetToDefault,
        activeRole,
        setActiveRole,
        activeTab,
        setActiveTab,
        selectedSupervisionForPrint,
        setSelectedSupervisionForPrint,
        openNewSupervisionForTeacher,
        targetTeacherForSupervisionId,
        setTargetTeacherForSupervisionId
      }}
    >
      {children}
    </SupervisionContext.Provider>
  );
};

export const useSupervision = () => {
  const context = useContext(SupervisionContext);
  if (!context) {
    throw new Error('useSupervision must be used within a SupervisionProvider');
  }
  return context;
};
