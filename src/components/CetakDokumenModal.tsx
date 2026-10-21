import React, { useState } from 'react';
import {
  Printer,
  X,
  FileText,
  Award,
  CheckCircle,
  School,
  Download,
  Check,
  ClipboardCheck,
  Loader2
} from 'lucide-react';
import { useSupervision } from '../context/SupervisionContext';
import { SupervisionRecord, RubrikObsItem } from '../types/supervisi';
import { INSTRUMEN_INDIKATOR_LIST } from '../data/instrumentData';
import { generateSupervisiRubrikPdf } from '../utils/pdfGenerators';

interface CetakDokumenModalProps {
  record: SupervisionRecord;
  onClose: () => void;
}

export const CetakDokumenModal: React.FC<CetakDokumenModalProps> = ({ record, onClose }) => {
  const { school, teachers, supervisors } = useSupervision();
  const teacher = teachers.find(t => t.id === record.teacherId);
  const teacherName = teacher ? `${teacher.nama}, ${teacher.gelar}` : (record.tandaTanganGuru || 'Guru');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Default to 'rubrik' as requested by user
  const [docType, setDocType] = useState<'rubrik' | 'berita_acara' | 'lengkap'>('rubrik');

  const handleDownloadPdf = () => {
    setIsDownloadingPdf(true);
    try {
      generateSupervisiRubrikPdf(record, teacher, school, supervisors, docType);
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

  // If record doesn't have rubrikObsItems stored yet (e.g. from initial demo records),
  // construct realistic items based on Keteraturan Suasana Kelas and record score
  const getRubrikItems = (): { fokusJudul: string; items: RubrikObsItem[] }[] => {
    const indicator =
      INSTRUMEN_INDIKATOR_LIST.find(ind => ind.nama === record.indikatorNama) ||
      INSTRUMEN_INDIKATOR_LIST[0];

    return indicator.fokusGroups.map(fg => {
      const items: RubrikObsItem[] = fg.items.map(it => {
        // check if record already has this specific item
        const existing = record.rubrikObsItems?.find(r => r.id === it.id);
        if (existing) {
          return existing;
        }

        // sample score based on record.nilaiAkhir
        let sampleScore = 3;
        if (record.nilaiAkhir < 80) {
          sampleScore = it.nomor === 3 ? 1 : 2;
        } else if (record.nilaiAkhir < 88) {
          sampleScore = it.nomor === 2 ? 2 : 3;
        }

        let sampleCatatan = '';
        if (sampleScore === 3) {
          sampleCatatan = 'Dilakukan dengan sangat baik dan konsisten';
        } else if (sampleScore === 2) {
          sampleCatatan = 'Perlu ditingkatkan efektivitasnya';
        } else {
          sampleCatatan = 'Belum tampak selama pengamatan';
        }

        return {
          id: it.id,
          nomor: it.nomor,
          fokusJudul: fg.fokusJudul,
          aktivitas: it.aktivitas,
          skor: sampleScore,
          catatan: sampleCatatan
        };
      });

      return {
        fokusJudul: fg.fokusJudul,
        items
      };
    });
  };

  const rubrikGroups = getRubrikItems();
  const indikatorJudul = record.indikatorNama || 'Keteraturan suasana kelas';
  const estimasiPersen =
    record.estimasiSkorPercent !== undefined
      ? record.estimasiSkorPercent
      : record.nilaiAkhir;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Modal Top Bar (Hidden on Print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                Pratinjau Dokumen Resmi Supervisi Guru
              </h3>
              <p className="text-xs text-slate-400">
                {teacherName} &bull; {record.mapel} ({record.tanggal})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-800 p-1 rounded-lg flex items-center text-xs">
              <button
                onClick={() => setDocType('rubrik')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  docType === 'rubrik' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Rubrik Supervisi Terisi
              </button>
              <button
                onClick={() => setDocType('berita_acara')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  docType === 'berita_acara' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Berita Acara
              </button>
              <button
                onClick={() => setDocType('lengkap')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  docType === 'lengkap' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Instrumen Lengkap
              </button>
            </div>

            {downloadSuccess && (
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>PDF Terunduh!</span>
              </span>
            )}

            {/* Direct PDF Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengunduh...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Unduh File PDF</span>
                </>
              )}
            </button>

            {/* Printer Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs px-3.5 py-2 rounded-lg transition-colors cursor-pointer border border-slate-700"
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
        <div className="flex-1 overflow-y-auto p-8 sm:p-12 text-slate-900 bg-white print:p-0 print:overflow-visible text-xs">
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

          {/* TAB 1: RUBRIK SUPERVISI TERISI (Sesuai Permintaan User) */}
          {docType === 'rubrik' && (
            <div className="space-y-5 text-black">
              {/* Document Title */}
              <div className="text-center space-y-1 mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider underline">
                  INSTRUMEN SUPERVISI AKADEMIK GURU (OBSERVASI KELAS)
                </h2>
                <p className="text-[11px]">
                  Tahun Ajaran {school.tahunAjaran} ({school.semester}) &bull; Kurikulum Merdeka
                </p>
              </div>

              {/* Identitas Observasi */}
              <div className="border border-black rounded p-3 bg-slate-50/50 space-y-2">
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[11px]">
                  <div className="flex">
                    <span className="w-36 font-semibold">Nama Guru</span>
                    <span>: <strong>{teacherName}</strong></span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold">Tanggal Observasi</span>
                    <span>: {record.tanggal}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold">NIP Guru</span>
                    <span>: {teacher?.nip || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold">Kelas / Ruang</span>
                    <span>: {record.kelas}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold">Mata Pelajaran</span>
                    <span>: {record.mapel}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-semibold">Supervisor / Penilai</span>
                    <span>: {record.supervisorNama}</span>
                  </div>
                  <div className="flex col-span-2">
                    <span className="w-36 font-semibold">Indikator Supervisi</span>
                    <span>: <strong className="uppercase">{indikatorJudul}</strong></span>
                  </div>
                </div>
              </div>

              {/* Rubrik Penilaian Table Terisi Lengkap */}
              <div>
                <div className="bg-slate-200 border border-black border-b-0 px-3 py-1.5 font-bold text-xs uppercase flex items-center justify-between">
                  <span>Rubrik Penilaian (Fokus Perilaku)</span>
                  <span className="text-[10px] font-normal normal-case">
                    Skor: 1=Belum, 2=Dilakukan Belum Efektif, 3=Dilakukan &amp; Efektif
                  </span>
                </div>

                <table className="w-full border-collapse border border-black text-[11px]">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-black p-1.5 text-center w-8">No</th>
                      <th className="border border-black p-1.5 text-left">Aktivitas Diamati</th>
                      <th className="border border-black p-1.5 text-center w-10">1</th>
                      <th className="border border-black p-1.5 text-center w-10">2</th>
                      <th className="border border-black p-1.5 text-center w-10">3</th>
                      <th className="border border-black p-1.5 text-left w-64">Catatan Bukti Pengamatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rubrikGroups.map(fg => (
                      <React.Fragment key={fg.fokusJudul}>
                        {/* Group Header */}
                        <tr className="bg-slate-100/90 font-bold">
                          <td colSpan={6} className="border border-black p-1.5 text-left">
                            {fg.fokusJudul}
                          </td>
                        </tr>

                        {/* Items under focus group */}
                        {fg.items.map(item => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="border border-black p-1.5 text-center font-medium">
                              {item.nomor}
                            </td>
                            <td className="border border-black p-1.5 leading-relaxed">
                              {item.aktivitas}
                            </td>
                            {/* Score 1 */}
                            <td className="border border-black p-1.5 text-center font-bold">
                              {item.skor === 1 ? (
                                <span className="inline-block w-4 h-4 rounded-full bg-black text-white text-[10px] leading-4 text-center">
                                  ✓
                                </span>
                              ) : (
                                <span className="text-slate-300">&bull;</span>
                              )}
                            </td>
                            {/* Score 2 */}
                            <td className="border border-black p-1.5 text-center font-bold">
                              {item.skor === 2 ? (
                                <span className="inline-block w-4 h-4 rounded-full bg-black text-white text-[10px] leading-4 text-center">
                                  ✓
                                </span>
                              ) : (
                                <span className="text-slate-300">&bull;</span>
                              )}
                            </td>
                            {/* Score 3 */}
                            <td className="border border-black p-1.5 text-center font-bold">
                              {item.skor === 3 ? (
                                <span className="inline-block w-4 h-4 rounded-full bg-black text-white text-[10px] leading-4 text-center">
                                  ✓
                                </span>
                              ) : (
                                <span className="text-slate-300">&bull;</span>
                              )}
                            </td>
                            {/* Catatan */}
                            <td className="border border-black p-1.5 italic text-slate-800">
                              {item.catatan || '-'}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Analisis & Kesimpulan */}
              <div className="border border-black rounded p-3.5 space-y-3 bg-slate-50/50 print-break-inside-avoid">
                <h4 className="font-bold text-xs uppercase border-b border-black pb-1">
                  Analisis &amp; Kesimpulan Hasil Observasi
                </h4>

                <div className="grid grid-cols-2 gap-4 text-[11px]">
                  <div>
                    <p className="font-bold mb-1">Kekuatan Guru:</p>
                    <p className="leading-relaxed text-slate-800">
                      {record.kekuatanGuru || 'Guru memiliki penguasaan materi yang baik dan komunikasi hangat dengan peserta didik.'}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold mb-1">Area Perlu Dikembangkan (Kelemahan):</p>
                    <p className="leading-relaxed text-slate-800">
                      {record.aspekPerluDitingkatkan || 'Perlu peningkatan keterlibatan merata bagi seluruh kelompok peserta didik.'}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] pt-1 border-t border-slate-300">
                  <p className="font-bold mb-1">Rekomendasi Tindak Lanjut:</p>
                  <p className="leading-relaxed text-slate-800 whitespace-pre-line">
                    {record.rekomendasiTindakLanjut || 'Mengikuti pendampingan klinis 5 Minggu dan pelatihan mandiri di Platform Merdeka Mengajar (PMM).'}
                  </p>
                </div>
              </div>

              {/* Estimasi Skor Banner */}
              <div className="border-2 border-black p-3 rounded-lg flex items-center justify-between bg-slate-100 print-break-inside-avoid">
                <div>
                  <span className="text-xs font-bold uppercase">Estimasi Skor Observasi: </span>
                  <span className="text-base font-black ml-1">{estimasiPersen}%</span>
                </div>
                <div className="border border-black px-4 py-1 rounded-full font-bold text-xs bg-white uppercase">
                  {record.predikat}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BERITA ACARA SUPERVISI RESMI */}
          {docType === 'berita_acara' && (
            <div className="space-y-6 text-xs text-black leading-relaxed">
              <div className="text-center space-y-1 mb-6">
                <h2 className="text-sm font-bold uppercase underline tracking-wider">
                  BERITA ACARA PELAKSANAAN SUPERVISI AKADEMIK
                </h2>
                <p className="text-[11px]">
                  Nomor: 421.5 / {record.id.replace('sup-', '')} / SMKN.01 / {new Date(record.tanggal).getFullYear()}
                </p>
              </div>

              <p>
                Pada hari ini, tanggal <strong>{new Date(record.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>, bertempat di {school.namaSekolah}, telah dilaksanakan kegiatan Supervisi Akademik dan Observasi Kinerja Guru Kurikulum Merdeka terhadap:
              </p>

              <div className="pl-6 space-y-1.5 border-l-2 border-slate-300">
                <div className="grid grid-cols-12">
                  <span className="col-span-4 font-semibold">Nama Lengkap Guru</span>
                  <span className="col-span-8">: {teacherName}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 font-semibold">NIP / NUPTK</span>
                  <span className="col-span-8">: {teacher?.nip || '-'}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 font-semibold">Mata Pelajaran</span>
                  <span className="col-span-8">: {record.mapel}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 font-semibold">Kelas / Ruang Praktik</span>
                  <span className="col-span-8">: {record.kelas}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 font-semibold">Fokus Indikator</span>
                  <span className="col-span-8">: {indikatorJudul}</span>
                </div>
              </div>

              <p>
                Kegiatan supervisi dilaksanakan oleh Tim Supervisor / Penilai Sekolah:
              </p>

              <div className="pl-6 space-y-1.5 border-l-2 border-slate-300">
                <div className="grid grid-cols-12">
                  <span className="col-span-4 font-semibold">Nama Supervisor</span>
                  <span className="col-span-8">: {record.supervisorNama}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 font-semibold">Jabatan</span>
                  <span className="col-span-8">: Kepala Sekolah / Asesor Supervisi Akademik</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-300 rounded-lg space-y-2 mt-4">
                <p className="font-bold uppercase tracking-wide">Hasil Rekapitulasi Penilaian:</p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="border border-slate-300 p-2 rounded bg-white">
                    <p className="text-[10px] text-slate-600">Skor Observasi Kelas</p>
                    <p className="text-xl font-bold">{estimasiPersen}%</p>
                  </div>
                  <div className="border border-slate-300 p-2 rounded bg-white">
                    <p className="text-[10px] text-slate-600">Predikat Capaian Kinerja</p>
                    <p className="text-xl font-extrabold uppercase">{record.predikat}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-bold">Kesepakatan &amp; Rekomendasi Tindak Lanjut:</p>
                <p className="italic mt-1 text-slate-800">{record.rekomendasiTindakLanjut}</p>
              </div>

              <p>
                Demikian Berita Acara ini dibuat dengan sebenarnya dan ditandatangani untuk dipergunakan sebagaimana mestinya.
              </p>
            </div>
          )}

          {/* TAB 3: INSTRUMEN LENGKAP (8 Indikator & Modul Ajar) */}
          {docType === 'lengkap' && (
            <div className="space-y-6 text-xs text-black">
              <div className="text-center space-y-1 mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider underline">
                  INSTRUMEN SUPERVISI AKADEMIK KOMPREHENSIF
                </h2>
                <p className="text-[11px]">
                  Tahun Ajaran {school.tahunAjaran} ({school.semester}) &bull; Kurikulum Merdeka
                </p>
              </div>

              {/* Data Umum */}
              <table className="w-full border-collapse border border-black text-[11px] mb-4">
                <tbody>
                  <tr>
                    <td className="border border-black p-2 font-bold w-1/4 bg-slate-100">Nama Guru</td>
                    <td className="border border-black p-2 w-1/4">{teacherName}</td>
                    <td className="border border-black p-2 font-bold w-1/4 bg-slate-100">Tanggal Supervisi</td>
                    <td className="border border-black p-2 w-1/4">{record.tanggal}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold bg-slate-100">NIP Guru</td>
                    <td className="border border-black p-2">{teacher?.nip || '-'}</td>
                    <td className="border border-black p-2 font-bold bg-slate-100">Jam Ke / Waktu</td>
                    <td className="border border-black p-2">{record.jamKe}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold bg-slate-100">Mata Pelajaran</td>
                    <td className="border border-black p-2">{record.mapel}</td>
                    <td className="border border-black p-2 font-bold bg-slate-100">Fase / Kelas</td>
                    <td className="border border-black p-2">{record.kelas}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold bg-slate-100">Nama Supervisor</td>
                    <td className="border border-black p-2" colSpan={3}>{record.supervisorNama}</td>
                  </tr>
                </tbody>
              </table>

              {/* Bagian Perencanaan */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold uppercase text-xs">
                    A. Telaah Dokumen Perencanaan (Modul Ajar / RPP)
                  </h3>
                  <span className="font-bold">Skor: {record.skorPerencanaan} / 100</span>
                </div>
                <table className="w-full border-collapse border border-black text-[11px]">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-black p-1.5 text-center w-8">No</th>
                      <th className="border border-black p-1.5 text-left">Komponen Analisis</th>
                      <th className="border border-black p-1.5 text-center w-16">Skor (1-4)</th>
                      <th className="border border-black p-1.5 text-left">Catatan Hasil Telaah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.perencanaanItems?.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                        <td className="border border-black p-1.5">{item.komponen}</td>
                        <td className="border border-black p-1.5 text-center font-bold">{item.skor}</td>
                        <td className="border border-black p-1.5">{item.catatan || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bagian Observasi Kelas 8 Indikator */}
              <div className="print-break-inside-avoid">
                <div className="flex items-center justify-between mb-2 mt-4">
                  <h3 className="font-bold uppercase text-xs">
                    B. Observasi Pelaksanaan Pembelajaran (8 Indikator Kinerja PMM)
                  </h3>
                  <span className="font-bold">Skor: {record.skorObservasi} / 100</span>
                </div>
                <table className="w-full border-collapse border border-black text-[11px]">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-black p-1.5 text-center w-8">No</th>
                      <th className="border border-black p-1.5 text-left">Indikator Kinerja Guru</th>
                      <th className="border border-black p-1.5 text-center w-16">Skor (1-4)</th>
                      <th className="border border-black p-1.5 text-left">Bukti Perilaku Teramati</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.indikatorItems?.map((ind, idx) => (
                      <tr key={ind.id}>
                        <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                        <td className="border border-black p-1.5 font-medium">{ind.nama}</td>
                        <td className="border border-black p-1.5 text-center font-bold">{ind.skor}</td>
                        <td className="border border-black p-1.5">{ind.catatanBukti || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TANDA TANGAN RESMI PADA SEMUA FORMAT */}
          <div className="grid grid-cols-2 gap-10 mt-10 pt-4 text-xs text-black print-break-inside-avoid">
            <div className="text-center">
              <p>Guru yang Disupervisi,</p>
              <div className="h-16 flex items-center justify-center italic text-slate-400">
                (Tanda Tangan)
              </div>
              <p className="font-bold underline">{teacherName}</p>
              <p>NIP. {teacher?.nip || '................................'}</p>
            </div>

            <div className="text-center">
              <p>{school.kabupaten}, {new Date(record.tanggal).toLocaleDateString('id-ID')}</p>
              <p>Supervisor / Penilai,</p>
              <div className="h-16 flex items-center justify-center italic text-slate-400">
                (Tanda Tangan)
              </div>
              <p className="font-bold underline">{record.supervisorNama || school.namaSupervisor || 'Dr. Ketut Suwarte, M.Pd'}</p>
              <p>NIP. {school.nipSupervisor || supervisors.find(s => s.id === record.supervisorId)?.nip || school.nipKepsek}</p>
            </div>

            <div className="col-span-2 text-center mt-3">
              <p>Mengetahui,</p>
              <p className="font-semibold">Kepala {school.namaSekolah}</p>
              <div className="h-16 flex items-center justify-center italic text-slate-400">
                (Tanda Tangan &amp; Stempel)
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
