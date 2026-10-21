import React from 'react';
import {
  Users,
  CheckCircle2,
  Search,
  AlertTriangle,
  FileText,
  TrendingUp,
  ArrowRight,
  ClipboardList,
  Sparkles,
  Award,
  Calendar,
  Check,
  ChevronRight,
  Eye
} from 'lucide-react';
import { useSupervision } from '../context/SupervisionContext';
import { DEFAULT_PMM_INDICATORS } from '../data/rubricIndicators';

export const DashboardView: React.FC = () => {
  const {
    teachers,
    supervisions,
    monitoringList,
    setActiveTab,
    openNewSupervisionForTeacher,
    setSelectedSupervisionForPrint
  } = useSupervision();

  // Metrics calculation
  const totalGuru = teachers.length;
  const sudahDisupervisiCount = teachers.filter(t => t.statusSupervisi === 'selesai').length;
  const dalamMonitoringCount = teachers.filter(t => t.statusSupervisi === 'dalam_monitoring').length;
  const belumDisupervisiCount = teachers.filter(t => t.statusSupervisi === 'belum').length;
  const perluPendampinganCount = teachers.filter(
    t => (t.skorTerakhir !== undefined && t.skorTerakhir < 75) || t.predikat === 'Perlu Pendampingan'
  ).length;

  // Average score
  const scores = supervisions.map(s => s.nilaiAkhir);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  // Donut chart calculations
  const totalCountForDonut = Math.max(totalGuru, 1);
  const sudahPercent = Math.round((sudahDisupervisiCount / totalCountForDonut) * 100);
  const belumPercent = 100 - sudahPercent;

  // Calculate indicator averages across all supervisions
  const indicatorStats = DEFAULT_PMM_INDICATORS.map(ind => {
    let sum = 0;
    let count = 0;
    supervisions.forEach(s => {
      const match = s.indikatorItems?.find(item => item.nomor === ind.nomor);
      if (match) {
        sum += match.skor;
        count++;
      }
    });
    const avg = count > 0 ? Number((sum / count).toFixed(1)) : 3.5;
    return {
      nomor: ind.nomor,
      nama: ind.nama,
      avg,
      percent: Math.round((avg / 4) * 100)
    };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Dashboard Kepala Sekolah / Supervisor
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Ringkasan pemantauan supervisi akademik &amp; evaluasi kinerja guru Kurikulum Merdeka
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openNewSupervisionForTeacher()}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-sm transition-all hover:shadow-md cursor-pointer"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Mulai Supervisi Baru</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards Matching Image Exactly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Guru */}
        <div className="bg-white rounded-xl p-5 border-l-4 border-l-blue-500 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Guru
              </p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">
                {totalGuru}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">{totalGuru} Guru Terdaftar</span>
            <span>di sistem</span>
          </div>
        </div>

        {/* Card 2: Sudah Disupervisi */}
        <div className="bg-white rounded-xl p-5 border-l-4 border-l-emerald-500 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Sudah Disupervisi
              </p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">
                {supervisions.length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-emerald-600 font-medium flex items-center gap-1">
            <span>{sudahDisupervisiCount} dari {totalGuru} Guru tuntas dinilai</span>
          </div>
        </div>

        {/* Card 3: Dalam Monitoring */}
        <div className="bg-white rounded-xl p-5 border-l-4 border-l-amber-500 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Dalam Monitoring
              </p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">
                {monitoringList.length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-amber-600 font-medium flex items-center gap-1">
            <span>Program pendampingan 5 minggu berjalan</span>
          </div>
        </div>

        {/* Card 4: Perlu Pendampingan */}
        <div className="bg-white rounded-xl p-5 border-l-4 border-l-rose-500 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Perlu Pendampingan
              </p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">
                {perluPendampinganCount}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            {perluPendampinganCount === 0 ? (
              <span className="text-emerald-600 font-medium">Semua nilai memenuhi ambang batas</span>
            ) : (
              <span className="text-rose-600 font-medium">Memerlukan bimbingan intensif supervisor</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Status Chart & Aktivitas Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Donut Chart Widget (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-lg">
                Status Supervisi Guru
              </h3>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                Semester Berjalan
              </span>
            </div>

            {/* Legend matching screenshot */}
            <div className="flex items-center justify-center gap-6 my-3 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-6 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
                <span>Sudah Disupervisi ({sudahDisupervisiCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-2.5 rounded-sm bg-rose-500 inline-block"></span>
                <span>Belum Disupervisi ({belumDisupervisiCount})</span>
              </div>
            </div>

            {/* Custom SVG Donut matching screenshot */}
            <div className="relative flex items-center justify-center my-6">
              <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="text-slate-100"
                  strokeWidth="18"
                  stroke="currentColor"
                  fill="transparent"
                />
                {/* Belum Disupervisi segment (red) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="text-rose-500"
                  strokeWidth="18"
                  strokeDasharray={`${2 * Math.PI * 38}`}
                  strokeDashoffset="0"
                  stroke="currentColor"
                  fill="transparent"
                />
                {/* Sudah Disupervisi segment (green) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="text-emerald-500 transition-all duration-700 ease-out"
                  strokeWidth="18"
                  strokeDasharray={`${2 * Math.PI * 38}`}
                  strokeDashoffset={`${2 * Math.PI * 38 * (1 - sudahPercent / 100)}`}
                  stroke="currentColor"
                  fill="transparent"
                  strokeLinecap="butt"
                />
              </svg>

              {/* Center text in donut */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-slate-800">
                  {sudahPercent}%
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Ketercapaian
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bottom */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
            <div className="bg-slate-50 p-3 rounded-lg text-center">
              <p className="text-xs text-slate-500">Rata-Rata Skor</p>
              <p className="text-xl font-bold text-blue-600 mt-0.5">{avgScore}</p>
              <p className="text-[10px] text-slate-400">Predikat: {avgScore >= 91 ? 'Amat Baik' : avgScore >= 81 ? 'Baik' : 'Cukup'}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg text-center">
              <p className="text-xs text-slate-500">Belum Dinilai</p>
              <p className="text-xl font-bold text-rose-500 mt-0.5">{belumDisupervisiCount}</p>
              <p className="text-[10px] text-slate-400">Target selesai semester</p>
            </div>
          </div>
        </div>

        {/* Right: Aktivitas Terbaru Widget (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-lg">
                Aktivitas Terbaru
              </h3>
              <button
                onClick={() => setActiveTab('hasil-analisis')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List matching screenshot format exactly */}
            <div className="space-y-3">
              {supervisions.slice(0, 5).map(sup => {
                const teacher = teachers.find(t => t.id === sup.teacherId);
                const teacherFullName = teacher ? `${teacher.nama}, ${teacher.gelar}` : 'Guru';

                return (
                  <div
                    key={sup.id}
                    className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-100 hover:border-blue-200 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-800">
                            Supervisi selesai: <span className="text-slate-900 font-bold">{teacherFullName}</span>
                          </p>
                          <span className="text-xs text-slate-500">
                            ({sup.tanggal})
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 truncate max-w-md">
                          Mapel: {sup.mapel} &bull; Kelas: {sup.kelas}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-600">Skor: </span>
                        <span className={`text-sm font-bold ${
                          sup.nilaiAkhir >= 90
                            ? 'text-emerald-600'
                            : sup.nilaiAkhir >= 80
                            ? 'text-blue-600'
                            : 'text-amber-600'
                        }`}>
                          {sup.nilaiAkhir}
                        </span>
                        <span className="text-[10px] block text-slate-400">
                          {sup.predikat}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedSupervisionForPrint(sup)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors"
                        title="Lihat Berkas & Cetak Berita Acara"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {supervisions.length === 0 && (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <ClipboardList className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-medium">Belum ada aktivitas supervisi</p>
                  <p className="text-xs text-slate-400 mt-1">Klik tombol &quot;Mulai Supervisi Baru&quot; di atas untuk memulai penilaian guru.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick link to 5-week monitoring */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span>Program <strong>Monitoring 5 Minggu</strong> untuk guru dalam pendampingan</span>
            </span>
            <button
              onClick={() => setActiveTab('monitoring-5-minggu')}
              className="text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Buka Pantauan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Section: 8 Indikator PMM Overview */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>Capaian 8 Indikator Kinerja Guru (Platform Merdeka Mengajar)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rata-rata skor skala 1 s.d. 4 pada aspek pengelolaan pembelajaran observasi kelas
            </p>
          </div>
          <button
            onClick={() => setActiveTab('rubrik-supervisi')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer self-start sm:self-auto"
          >
            Lihat Detail Rubrik &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {indicatorStats.map(item => (
            <div
              key={item.nomor}
              className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-all hover:bg-slate-50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                  {item.nomor}
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {item.avg} / 4.0
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-800 line-clamp-1 mb-2" title={item.nama}>
                {item.nama}
              </h4>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.percent >= 85
                      ? 'bg-emerald-500'
                      : item.percent >= 70
                      ? 'bg-blue-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 flex justify-between">
                <span>Efektivitas</span>
                <span className="font-semibold">{item.percent}%</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
