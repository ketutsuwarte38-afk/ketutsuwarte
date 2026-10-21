import React, { useState } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  FileCheck,
  User,
  Plus,
  Printer,
  ChevronRight,
  ExternalLink,
  Save,
  Check,
  Sparkles,
  Download,
  Loader2
} from 'lucide-react';
import { useSupervision } from '../context/SupervisionContext';
import { WeekProgress } from '../types/supervisi';
import { CetakMonitoringModal } from './CetakMonitoringModal';
import { generateMonitoringPdf } from '../utils/pdfGenerators';

export const Monitoring5MingguView: React.FC = () => {
  const {
    monitoringList,
    updateMonitoringWeek,
    teachers,
    supervisions,
    supervisors,
    createOrGetMonitoring,
    school
  } = useSupervision();

  const [selectedMonitoringId, setSelectedMonitoringId] = useState<string>(
    monitoringList[0]?.id || ''
  );

  const [showAddTeacherModal, setShowAddTeacherModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [selectedTeacherToAdd, setSelectedTeacherToAdd] = useState<string>('');
  const [customFokus, setCustomFokus] = useState<string>('');

  const currentMonitoring = monitoringList.find(m => m.id === selectedMonitoringId) || monitoringList[0];
  const currentTeacher = teachers.find(t => t.id === currentMonitoring?.teacherId);

  // Editing state for specific week
  const [editingWeekIndex, setEditingWeekIndex] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<WeekProgress['status']>('belum');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editBukti, setEditBukti] = useState<string>('');
  const [editTanggal, setEditTanggal] = useState<string>('');

  const startEditWeek = (index: number, week: WeekProgress) => {
    setEditingWeekIndex(index);
    setEditStatus(week.status);
    setEditNotes(week.catatanSupervisor || '');
    setEditBukti(week.buktiKegiatan || '');
    setEditTanggal(week.tanggalRealisasi || new Date().toISOString().split('T')[0]);
  };

  const saveEditWeek = () => {
    if (editingWeekIndex === null || !currentMonitoring) return;

    updateMonitoringWeek(currentMonitoring.id, editingWeekIndex, {
      status: editStatus,
      catatanSupervisor: editNotes,
      buktiKegiatan: editBukti,
      tanggalRealisasi: editStatus === 'selesai' ? editTanggal : undefined
    });

    setEditingWeekIndex(null);
  };

  const handleAddNewMonitoring = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherToAdd) return;

    const teacher = teachers.find(t => t.id === selectedTeacherToAdd);
    const relatedSup = supervisions.find(s => s.teacherId === selectedTeacherToAdd);

    const newMon = createOrGetMonitoring(
      selectedTeacherToAdd,
      relatedSup?.id || `dummy-${Date.now()}`,
      customFokus || `Pendampingan Peningkatan Kompetensi Pembelajaran Guru (${teacher?.nama})`
    );

    setSelectedMonitoringId(newMon.id);
    setShowAddTeacherModal(false);
    setSelectedTeacherToAdd('');
    setCustomFokus('');
  };

  // Progress metrics
  const completedWeeks = currentMonitoring?.weeks.filter(w => w.status === 'selesai').length || 0;
  const progressPercent = Math.round((completedWeeks / 5) * 100);

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [downloadToast, setDownloadToast] = useState(false);

  const handleDirectDownloadPdf = () => {
    if (!currentMonitoring) return;
    setIsDownloadingPdf(true);
    try {
      generateMonitoringPdf(currentMonitoring, currentTeacher, school, supervisors);
      setDownloadToast(true);
      setTimeout(() => setDownloadToast(false), 4000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const printMonitoringSheet = () => {
    setShowPrintModal(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 relative">
      {/* Download Success Floating Toast */}
      {downloadToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-xs">File PDF Berhasil Diunduh!</p>
            <p className="text-[11px] text-emerald-100">
              Kartu Kontrol Monitoring 5 Minggu ({currentTeacher?.nama}) tersimpan di komputer Anda.
            </p>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">
              Monitoring 5 Minggu Pasca-Supervisi
            </h2>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
              Tindak Lanjut Klinis
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Siklus pendampingan terstruktur 5 pekan untuk memastikan perbaikan kualitas belajar di kelas berjalan nyata
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddTeacherModal(true)}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Guru ke Program</span>
          </button>

          {/* Primary Action: Direct Download PDF */}
          <button
            onClick={handleDirectDownloadPdf}
            disabled={isDownloadingPdf}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            title="Langsung mengunduh berkas PDF Kartu Monitoring"
          >
            {isDownloadingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyiapkan PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Unduh PDF Kartu Monitoring</span>
              </>
            )}
          </button>

          <button
            onClick={printMonitoringSheet}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Pratinjau Dokumen</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Header (Only visible on Print) */}
      <div className="hidden print:block mb-6 text-center border-b-2 border-black pb-4">
        <h2 className="text-lg font-bold uppercase">
          KARTU KONTROL TINDAK LANJUT SUPERVISI AKADEMIK (MONITORING 5 MINGGU)
        </h2>
        <h3 className="text-base font-semibold">{school.namaSekolah}</h3>
        <p className="text-xs">
          {school.alamat} &bull; NPSN: {school.npsn} &bull; Semester {school.semester} TP {school.tahunAjaran}
        </p>
      </div>

      {/* Teacher Tabs Selection */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto no-print">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 shrink-0">
          Pilih Guru:
        </span>
        {monitoringList.map(item => {
          const tch = teachers.find(t => t.id === item.teacherId);
          const isSelected = item.id === (currentMonitoring?.id);
          const doneCount = item.weeks.filter(w => w.status === 'selesai').length;

          return (
            <button
              key={item.id}
              onClick={() => setSelectedMonitoringId(item.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{tch ? `${tch.nama}, ${tch.gelar}` : 'Guru'}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {doneCount}/5
              </span>
            </button>
          );
        })}
      </div>

      {currentMonitoring ? (
        <div className="space-y-6">
          {/* Active Teacher Profile Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg ${
                    currentTeacher?.avatarColor || 'bg-blue-600'
                  }`}
                >
                  {currentTeacher?.nama?.charAt(0) || 'G'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-extrabold text-white">
                      {currentTeacher ? `${currentTeacher.nama}, ${currentTeacher.gelar}` : 'Nama Guru'}
                    </h3>
                    <span className="text-xs bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 px-2.5 py-0.5 rounded-full font-semibold">
                      NIP: {currentTeacher?.nip || '-'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Mapel: {currentTeacher?.mapel} &bull; Kelas: {currentTeacher?.kelas}
                  </p>
                  <p className="text-xs text-amber-300 font-medium mt-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fokus: {currentMonitoring.fokusPerbaikan}</span>
                  </p>
                </div>
              </div>

              {/* Progress percentage box */}
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 min-w-56">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-300">Kemajuan 5 Minggu</span>
                  <span className="text-emerald-400 text-sm font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2 flex justify-between">
                  <span>Target: 5 Pekan</span>
                  <span>{completedWeeks} Pekan Tuntas</span>
                </p>
                <button
                  onClick={handleDirectDownloadPdf}
                  disabled={isDownloadingPdf}
                  className="mt-3 w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                  title="Unduh langsung PDF kartu kontrol guru ini"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* 5 Weeks Timeline / Stepper */}
          <div className="space-y-4">
            {currentMonitoring.weeks.map((week, idx) => {
              const isDone = week.status === 'selesai';
              const isRunning = week.status === 'sedang_berjalan';
              const isEditing = editingWeekIndex === idx;

              return (
                <div
                  key={week.mingguKe}
                  className={`bg-white rounded-xl border transition-all p-5 shadow-xs ${
                    isDone
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : isRunning
                      ? 'border-amber-300 ring-2 ring-amber-100 bg-amber-50/10'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      {/* Week number badge */}
                      <div
                        className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center shrink-0 ${
                          isDone
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : isRunning
                            ? 'bg-amber-500 text-white shadow-sm ring-4 ring-amber-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {isDone ? <Check className="w-5 h-5" /> : `M-${week.mingguKe}`}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                            {week.judul}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-800'
                                : isRunning
                                ? 'bg-amber-100 text-amber-800'
                                : week.status === 'terkendala'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isDone
                              ? 'Selesai'
                              : isRunning
                              ? 'Sedang Berjalan'
                              : week.status === 'terkendala'
                              ? 'Terkendala'
                              : 'Belum Terlaksana'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {week.deskripsi}
                        </p>

                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700 mt-2">
                          <span className="font-semibold text-slate-900">Target Kegiatan:</span> {week.kegiatanTarget}
                        </div>

                        {week.catatanSupervisor && (
                          <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-xs text-blue-950 mt-1">
                            <span className="font-semibold text-blue-900">Catatan Supervisor:</span> &ldquo;{week.catatanSupervisor}&rdquo;
                          </div>
                        )}

                        {week.buktiKegiatan && (
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Bukti dukung: <strong className="text-slate-700">{week.buktiKegiatan}</strong></span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions and Dates */}
                    <div className="shrink-0 flex flex-col items-end gap-2 text-right">
                      <div className="text-[11px] text-slate-500">
                        <span>Target: </span>
                        <strong className="text-slate-700">{week.tanggalTarget}</strong>
                        {week.tanggalRealisasi && (
                          <div className="text-emerald-600 font-semibold">
                            Tuntas: {week.tanggalRealisasi}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => startEditWeek(idx, week)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer no-print"
                      >
                        {isDone ? 'Ubah Catatan' : 'Verifikasi / Update Status'}
                      </button>
                    </div>
                  </div>

                  {/* Inline Edit Form when clicking Update */}
                  {isEditing && (
                    <div className="mt-4 pt-4 border-t border-slate-200 bg-slate-50 p-4 rounded-xl space-y-3 text-xs no-print animate-in fade-in">
                      <div className="font-bold text-slate-800 text-sm">
                        Update Status &amp; Verifikasi Minggu ke-{week.mingguKe}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Status Progres:
                          </label>
                          <select
                            value={editStatus}
                            onChange={e => setEditStatus(e.target.value as any)}
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white font-medium"
                          >
                            <option value="belum">Belum Terlaksana</option>
                            <option value="sedang_berjalan">Sedang Berjalan</option>
                            <option value="selesai">Selesai / Terverifikasi</option>
                            <option value="terkendala">Terkendala</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Tanggal Realisasi:
                          </label>
                          <input
                            type="date"
                            value={editTanggal}
                            onChange={e => setEditTanggal(e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Nama Bukti / Tautan Karya:
                          </label>
                          <input
                            type="text"
                            value={editBukti}
                            onChange={e => setEditBukti(e.target.value)}
                            placeholder="Contoh: Modul Ajar Revisi v2"
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Catatan Bimbingan Supervisor:
                        </label>
                        <textarea
                          rows={2}
                          value={editNotes}
                          onChange={e => setEditNotes(e.target.value)}
                          placeholder="Masukkan arahan atau hasil observasi pada pekan ini..."
                          className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingWeekIndex(null)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-white cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={saveEditWeek}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                        >
                          Simpan Verifikasi
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Print Signatures */}
          <div className="hidden print:grid grid-cols-2 gap-12 mt-12 pt-6 border-t border-slate-300 text-xs">
            <div className="text-center">
              <p>Mengetahui,</p>
              <p className="font-semibold">Kepala {school.namaSekolah}</p>
              <div className="h-20"></div>
              <p className="font-bold underline">{school.kepalaSekolah}</p>
              <p>NIP. {school.nipKepsek}</p>
            </div>
            <div className="text-center">
              <p>{school.kabupaten}, {new Date().toLocaleDateString('id-ID')}</p>
              <p className="font-semibold">Guru yang Disupervisi</p>
              <div className="h-20"></div>
              <p className="font-bold underline">
                {currentTeacher ? `${currentTeacher.nama}, ${currentTeacher.gelar}` : '.........................'}
              </p>
              <p>NIP. {currentTeacher?.nip || '.........................'}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          <Clock className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-semibold">Belum ada data guru dalam program Monitoring 5 Minggu.</p>
          <p className="text-xs text-slate-400 mt-1">Klik tombol &quot;Tambah Guru ke Program 5 Minggu&quot; di atas untuk mendaftarkan.</p>
        </div>
      )}

      {/* Modal: Tambah Guru ke Monitoring 5 Minggu */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              Daftarkan Guru ke Monitoring 5 Minggu
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pilih guru yang membutuhkan pendampingan perbaikan pasca-supervisi
            </p>

            <form onSubmit={handleAddNewMonitoring} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih Guru:
                </label>
                <select
                  value={selectedTeacherToAdd}
                  onChange={e => setSelectedTeacherToAdd(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  required
                >
                  <option value="">-- Pilih Guru --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.nama}, {t.gelar} ({t.mapel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Fokus Target Perbaikan Pembelajaran:
                </label>
                <input
                  type="text"
                  value={customFokus}
                  onChange={e => setCustomFokus(e.target.value)}
                  placeholder="Contoh: Peningkatan Aktivitas Interaktif dan Disiplin Positif"
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  required
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-slate-600 text-[11px] leading-relaxed">
                Sistem akan secara otomatis menyusun 5 pekan rencana kegiatan terstandar: Refleksi PMM, Coaching Modul Ajar, Praktik Kelas, Peer Teaching, dan Evaluasi Capaian.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs"
                >
                  Daftarkan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pratinjau Cetak Kartu Monitoring Modal */}
      {showPrintModal && currentMonitoring && (
        <CetakMonitoringModal
          monitoring={currentMonitoring}
          teacher={currentTeacher}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};
