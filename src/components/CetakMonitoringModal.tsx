import React, { useState } from 'react';
import {
  Printer,
  X,
  Check,
  TrendingUp,
  FileCheck2,
  Calendar,
  School,
  Download,
  Loader2
} from 'lucide-react';
import { useSupervision } from '../context/SupervisionContext';
import { TeacherMonitoring5Weeks, Teacher } from '../types/supervisi';
import { generateMonitoringPdf } from '../utils/pdfGenerators';

interface CetakMonitoringModalProps {
  monitoring: TeacherMonitoring5Weeks;
  teacher?: Teacher;
  onClose: () => void;
}

export const CetakMonitoringModal: React.FC<CetakMonitoringModalProps> = ({
  monitoring,
  teacher,
  onClose
}) => {
  const { school, supervisors } = useSupervision();
  const teacherName = teacher ? `${teacher.nama}, ${teacher.gelar}` : 'Guru';
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPdf = () => {
    setIsDownloadingPdf(true);
    try {
      generateMonitoringPdf(monitoring, teacher, school, supervisors);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const completedWeeks = monitoring.weeks.filter(w => w.status === 'selesai').length;
  const progressPercent = Math.round((completedWeeks / 5) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Modal Top Bar (Hidden on Print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 rounded-lg text-white">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                Pratinjau Kartu Kontrol Monitoring 5 Minggu
              </h3>
              <p className="text-xs text-slate-400">
                {teacherName} &bull; {teacher?.mapel || '-'} ({monitoring.fokusPerbaikan})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct PDF Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengunduh PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Unduh File PDF</span>
                </>
              )}
            </button>

            {/* Print Dialog Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Printer</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body (Printable Area) */}
        <div
          id="kartu-monitoring-document"
          className="flex-1 overflow-y-auto p-8 sm:p-12 text-slate-900 bg-white print:p-0 print:overflow-visible text-xs"
        >
          {/* KOP SURAT RESMI */}
          <div className="border-b-4 border-double border-black pb-3 mb-6 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-black">
              PEMERINTAH PROVINSI {school.provinsi.toUpperCase()}
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-black">
              DINAS PENDIDIKAN DAN KEBUDAYAAN
            </p>
            <p className="text-xs font-semibold uppercase tracking-wider text-black">
              CABANG DINAS PENDIDIKAN WILAYAH VII &bull; {school.kabupaten.toUpperCase()}
            </p>
            <h1 className="text-lg font-black uppercase text-black tracking-normal mt-0.5">
              {school.namaSekolah}
            </h1>
            <p className="text-[11px] text-black">
              {school.alamat} &bull; NPSN: {school.npsn}
            </p>
          </div>

          {/* Document Title */}
          <div className="text-center space-y-1 mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider underline">
              KARTU KONTROL TINDAK LANJUT SUPERVISI AKADEMIK
            </h2>
            <h3 className="text-xs font-bold uppercase">
              PROGRAM MONITORING 5 MINGGU PASCA-SUPERVISI
            </h3>
            <p className="text-[11px] text-slate-700">
              Semester {school.semester} &bull; Tahun Pelajaran {school.tahunAjaran}
            </p>
          </div>

          {/* Teacher & Program Identity */}
          <div className="border border-black rounded p-3 bg-slate-50/60 mb-5 space-y-2">
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[11px]">
              <div className="flex">
                <span className="w-36 font-semibold">Nama Guru</span>
                <span>: <strong>{teacherName}</strong></span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold">Tanggal Mulai</span>
                <span>: {monitoring.tanggalMulai}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold">NIP Guru</span>
                <span>: {teacher?.nip || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold">Status Capaian</span>
                <span>: <strong>{completedWeeks} dari 5 Pekan Tuntas ({progressPercent}%)</strong></span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold">Mata Pelajaran</span>
                <span>: {teacher?.mapel || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold">Kelas / Ruang</span>
                <span>: {teacher?.kelas || '-'}</span>
              </div>
              <div className="flex col-span-2">
                <span className="w-36 font-semibold">Fokus Perbaikan</span>
                <span>: <strong>{monitoring.fokusPerbaikan}</strong></span>
              </div>
            </div>
          </div>

          {/* 5-Week Detailed Table */}
          <div className="space-y-2 mb-5">
            <div className="bg-slate-100 border border-black border-b-0 px-3 py-1.5 font-bold text-xs uppercase flex items-center justify-between">
              <span>Matriks Tahapan Pemantauan Mingguan (Minggu 1 s.d. 5)</span>
              <span className="text-[10px] font-normal normal-case">
                Target: Verifikasi Portofolio &amp; Observasi Praktik Lapangan
              </span>
            </div>

            <table className="w-full border-collapse border border-black text-[11px]">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-black p-1.5 text-center w-8">Pekan</th>
                  <th className="border border-black p-1.5 text-left w-52">Tahapan Kegiatan</th>
                  <th className="border border-black p-1.5 text-left">Target Capaian &amp; Uraian Tindakan</th>
                  <th className="border border-black p-1.5 text-center w-20">Jadwal Target</th>
                  <th className="border border-black p-1.5 text-center w-20">Realisasi</th>
                  <th className="border border-black p-1.5 text-center w-20">Status</th>
                  <th className="border border-black p-1.5 text-left w-48">Catatan Supervisor &amp; Bukti</th>
                  <th className="border border-black p-1.5 text-center w-12">Paraf</th>
                </tr>
              </thead>
              <tbody>
                {monitoring.weeks.map(week => {
                  const isDone = week.status === 'selesai';
                  const isRunning = week.status === 'sedang_berjalan';

                  return (
                    <tr key={week.mingguKe} className="hover:bg-slate-50">
                      <td className="border border-black p-1.5 text-center font-bold">
                        M-{week.mingguKe}
                      </td>
                      <td className="border border-black p-1.5 font-semibold text-slate-900">
                        {week.judul.replace(`Minggu ${week.mingguKe}: `, '')}
                      </td>
                      <td className="border border-black p-1.5 leading-relaxed text-slate-800">
                        {week.kegiatanTarget}
                      </td>
                      <td className="border border-black p-1.5 text-center whitespace-nowrap">
                        {week.tanggalTarget}
                      </td>
                      <td className="border border-black p-1.5 text-center whitespace-nowrap font-medium text-emerald-800">
                        {week.tanggalRealisasi || '-'}
                      </td>
                      <td className="border border-black p-1.5 text-center whitespace-nowrap font-bold">
                        {isDone ? (
                          <span className="text-emerald-700">Tuntas ✓</span>
                        ) : isRunning ? (
                          <span className="text-blue-700">Proses</span>
                        ) : (
                          <span className="text-slate-400">Belum</span>
                        )}
                      </td>
                      <td className="border border-black p-1.5 text-slate-800 italic leading-snug">
                        {week.catatanSupervisor ? (
                          <span>&ldquo;{week.catatanSupervisor}&rdquo;</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                        {week.buktiKegiatan && (
                          <div className="mt-1 font-semibold not-italic text-[10px] text-slate-900">
                            Bukti: {week.buktiKegiatan}
                          </div>
                        )}
                      </td>
                      <td className="border border-black p-1.5 text-center">
                        {isDone ? (
                          <span className="font-bold text-emerald-700 text-xs">✓</span>
                        ) : (
                          <span className="text-slate-300">...</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Evaluasi Akhir Box */}
          <div className="border border-black rounded p-3 bg-slate-50/50 mb-6 print-break-inside-avoid">
            <p className="font-bold text-xs uppercase mb-1">
              Catatan Evaluasi Akhir Siklus Pendampingan:
            </p>
            <p className="text-[11px] text-slate-800 leading-relaxed italic">
              &ldquo;{monitoring.evaluasiAkhir || 'Guru menunjukkan komitmen perbaikan yang positif. Terdapat peningkatan keaktifan peserta didik dan pengelolaan pembelajaran di kelas.'}&rdquo;
            </p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-10 mt-8 pt-4 text-xs text-black print-break-inside-avoid">
            <div className="text-center">
              <p>Guru yang Didampingi,</p>
              <div className="h-16 flex items-center justify-center italic text-slate-400">
                (Tanda Tangan)
              </div>
              <p className="font-bold underline">{teacherName}</p>
              <p>NIP. {teacher?.nip || '................................'}</p>
            </div>

            <div className="text-center">
              <p>{school.kabupaten}, {new Date().toLocaleDateString('id-ID')}</p>
              <p>Supervisor / Guru Pendamping,</p>
              <div className="h-16 flex items-center justify-center italic text-slate-400">
                (Tanda Tangan)
              </div>
              <p className="font-bold underline">{school.namaSupervisor || supervisors[0]?.nama || 'Dr. Ketut Suwarte, M.Pd'}</p>
              <p>NIP. {school.nipSupervisor || supervisors[0]?.nip || '19750914 200212 1 003'}</p>
            </div>

            <div className="col-span-2 text-center mt-3">
              <p>Mengetahui,</p>
              <p className="font-semibold">Kepala {school.namaSekolah}</p>
              <div className="h-16 flex items-center justify-center italic text-slate-400">
                (Tanda Tangan &amp; Stempel Resmi)
              </div>
              <p className="font-bold underline">{school.kepalaSekolah}</p>
              <p>NIP. {school.nipKepsek}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
