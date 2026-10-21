import React, { useState } from 'react';
import { Plus, Download, Check, Eye } from 'lucide-react';
import { useSupervision } from '../context/SupervisionContext';
import { SupervisionRecord } from '../types/supervisi';
import { generateSupervisiRubrikPdf } from '../utils/pdfGenerators';

export const HasilAnalisisView: React.FC = () => {
  const {
    supervisions,
    teachers,
    school,
    supervisors,
    setSelectedSupervisionForPrint,
    openNewSupervisionForTeacher
  } = useSupervision();

  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const handleDownloadRecordPdf = (record: SupervisionRecord) => {
    const teacher = teachers.find(t => t.id === record.teacherId);
    try {
      generateSupervisiRubrikPdf(record, teacher, school, supervisors, 'rubrik');
      setDownloadSuccessToast(teacher?.nama || 'Guru');
      setTimeout(() => setDownloadSuccessToast(null), 3500);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  // Helper to format score display as percentage e.g. 96.3%
  const formatScore = (rec: SupervisionRecord): string => {
    if (rec.estimasiSkorPercent !== undefined) {
      return `${rec.estimasiSkorPercent}%`;
    }
    return `${rec.nilaiAkhir}%`;
  };

  // Helper to format category color matching screenshot
  const getCategoryColor = (kategori: string) => {
    switch (kategori) {
      case 'Sangat Baik':
      case 'Amat Baik':
        return 'text-emerald-600';
      case 'Baik':
        return 'text-emerald-600'; // in screenshot, 'Baik' for Selamat Riyadi is green, and for Nining is blue/green
      case 'Cukup':
        return 'text-amber-600';
      case 'Perlu Pendampingan':
        return 'text-rose-600';
      default:
        return 'text-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-16 relative">
      {/* Toast notification */}
      {downloadSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-xs">File PDF Berhasil Diunduh!</p>
            <p className="text-[11px] text-emerald-100">
              Dokumen Rubrik Supervisi ({downloadSuccessToast}) tersimpan di komputer Anda.
            </p>
          </div>
        </div>
      )}

      {/* Top Action Button: + Buat Supervisi Baru matching screenshot */}
      <div>
        <button
          onClick={() => openNewSupervisionForTeacher()}
          className="bg-[#1d4ed8] hover:bg-blue-800 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Supervisi Baru</span>
        </button>
      </div>

      {/* Main Card Container matching screenshot */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs mt-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6">
          Rekap Hasil Supervisi
        </h2>

        {/* Table matching screenshot */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-800 text-[11px]">
                  <th className="py-3.5 px-4 w-36">Tanggal</th>
                  <th className="py-3.5 px-4">Nama Guru</th>
                  <th className="py-3.5 px-4">Mata Pelajaran</th>
                  <th className="py-3.5 px-4 w-28">Skor</th>
                  <th className="py-3.5 px-4 w-36">Kategori</th>
                  <th className="py-3.5 px-4 w-44 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {supervisions.map((record, index) => {
                  const teacher = teachers.find(t => t.id === record.teacherId);
                  const teacherDisplay = teacher
                    ? `${teacher.nama},${teacher.gelar}`
                    : record.tandaTanganGuru || 'Nama Guru';

                  // Normalizing category text: if 'Amat Baik' in legacy, display 'Sangat Baik'
                  let displayCategory = record.predikat;
                  if (displayCategory === 'Amat Baik') {
                    displayCategory = 'Sangat Baik' as any;
                  }

                  // specific styling for row categories matching screenshot
                  const isBlueBaik = index === 2; // Nining Kurniasari has blue "Baik" in screenshot
                  const categoryColor = isBlueBaik
                    ? 'text-blue-600'
                    : getCategoryColor(displayCategory);

                  return (
                    <tr
                      key={`${record.id}-${index}`}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-4 px-4 text-slate-800 whitespace-nowrap font-normal">
                        {record.tanggal}
                      </td>
                      <td className="py-4 px-4 text-slate-900 font-bold whitespace-nowrap">
                        {teacherDisplay}
                      </td>
                      <td className="py-4 px-4 text-slate-800 whitespace-nowrap font-normal">
                        {record.mapel}
                      </td>
                      <td className="py-4 px-4 text-slate-900 font-bold whitespace-nowrap">
                        {formatScore(record)}
                      </td>
                      <td className={`py-4 px-4 font-bold whitespace-nowrap ${categoryColor}`}>
                        {displayCategory}
                      </td>
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedSupervisionForPrint(record)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Buka pratinjau dokumen resmi"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>Lihat Detail</span>
                          </button>
                          <button
                            onClick={() => handleDownloadRecordPdf(record)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-1.5 rounded-md font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Langsung unduh berkas PDF"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Unduh PDF</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {supervisions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                      Belum ada data hasil supervisi yang tersimpan. Klik tombol &quot;+ Buat Supervisi Baru&quot; di atas untuk memulai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
