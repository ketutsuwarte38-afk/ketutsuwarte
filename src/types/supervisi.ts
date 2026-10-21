export interface SchoolProfile {
  namaSekolah: string;
  npsn: string;
  alamat: string;
  kabupaten: string;
  provinsi: string;
  kepalaSekolah: string;
  nipKepsek: string;
  namaSupervisor?: string;
  nipSupervisor?: string;
  semester: 'Ganjil' | 'Genap';
  tahunAjaran: string;
  logoUrl?: string;
}

export type SupervisiStatus = 'belum' | 'dalam_monitoring' | 'selesai';

export interface Teacher {
  id: string;
  nip: string;
  nama: string;
  gelar: string;
  mapel: string;
  kelas: string;
  email: string;
  noHp: string;
  avatarColor: string;
  statusSupervisi: SupervisiStatus;
  skorTerakhir?: number;
  predikat?: 'Amat Baik' | 'Baik' | 'Cukup' | 'Perlu Pendampingan';
  tanggalSupervisi?: string;
}

export interface Supervisor {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
}

export interface IndicatorItem {
  id: string;
  nomor: number;
  nama: string;
  definisi: string;
  fokusPerilaku: string[];
  perilakuDianjurkan: string[];
  perilakuDihindari: string[];
  skor: number; // 1: Belum Dilakukan, 2: Dilakukan Belum Efektif, 3: Dilakukan Efektif, 4: Membudaya
  catatanBukti: string;
}

export interface PlanningItem {
  id: string;
  nomor: number;
  komponen: string;
  deskripsi: string;
  skor: number; // 1-4
  catatan: string;
}

export interface RubrikObsItem {
  id: string;
  nomor: number;
  fokusJudul: string;
  aktivitas: string;
  skor: number; // 1, 2, or 3
  catatan: string;
}

export interface SupervisionRecord {
  id: string;
  teacherId: string;
  supervisorId: string;
  supervisorNama: string;
  tanggal: string;
  mapel: string;
  kelas: string;
  jamKe: string;
  materiPokok: string;
  fase: string; // Fase E (Kelas X), Fase F (Kelas XI/XII)
  indikatorNama?: string;
  rubrikObsItems?: RubrikObsItem[];
  estimasiSkorPercent?: number;
  
  // Nilai
  perencanaanItems: PlanningItem[];
  indikatorItems: IndicatorItem[];
  skorPerencanaan: number; // 0-100
  skorObservasi: number; // 0-100
  nilaiAkhir: number; // 0-100
  predikat: 'Amat Baik' | 'Baik' | 'Cukup' | 'Perlu Pendampingan';
  
  // Catatan kualitatif
  kekuatanGuru: string;
  aspekPerluDitingkatkan: string;
  rekomendasiTindakLanjut: string;
  rencanaAksiGuru: string;
  targetWaktuTindakLanjut: string;
  
  // Tanda tangan
  tandaTanganGuru?: string;
  tandaTanganSupervisor?: string;
  tanggalDisetujui?: string;
}

export interface WeekProgress {
  mingguKe: number;
  judul: string;
  deskripsi: string;
  kegiatanTarget: string;
  status: 'belum' | 'sedang_berjalan' | 'selesai' | 'terkendala';
  tanggalTarget: string;
  tanggalRealisasi?: string;
  catatanSupervisor: string;
  buktiKegiatan?: string;
}

export interface TeacherMonitoring5Weeks {
  id: string;
  teacherId: string;
  supervisionId: string;
  fokusPerbaikan: string;
  tanggalMulai: string;
  weeks: WeekProgress[];
  statusKeseluruhan: 'belum' | 'sedang_berjalan' | 'selesai';
  evaluasiAkhir?: string;
}
