import React, { useState } from 'react';
import {
  LayoutGrid,
  Search,
  Download,
  Printer,
  Eye,
  Filter,
  CheckCircle,
  AlertTriangle,
  Award,
  ChevronDown,
  FileText
} from 'lucide-react';
import { useSupervision } from '../context/SupervisionContext';
import { generateRekapitulasiPdf } from '../utils/pdfGenerators';

export const RekapitulasiView: React.FC = () => {
  const {
    teachers,
    supervisions,
    monitoringList,
    school,
    setSelectedSupervisionForPrint,
    openNewSupervisionForTeacher
  } = useSupervision();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPredikat, setFilterPredikat] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Build unified table rows
  const tableRows = teachers.map((teacher, index) => {
    const sup = supervisions.find(s => s.teacherId === teacher.id);
    const mon = monitoringList.find(m => m.teacherId === teacher.id);

    return {
      no: index + 1,
      teacher,
      sup,
      mon,
      nip: teacher.nip,
      nama: `${teacher.nama}, ${teacher.gelar}`,
      mapel: teacher.mapel,
      kelas: teacher.kelas,
      tanggal: sup?.tanggal || '-',
      skorPerencanaan: sup ? `${sup.skorPerencanaan}` : '-',
      skorObservasi: sup ? `${sup.skorObservasi}` : '-',
      nilaiAkhir: sup?.nilaiAkhir ?? (teacher.skorTerakhir ?? null),
      predikat: sup?.predikat ?? (teacher.predikat ?? 'Belum Disupervisi'),
      statusSupervisi: teacher.statusSupervisi,
      statusMonitoring: mon ? `${mon.weeks.filter(w => w.status === 'selesai').length}/5 Pekan Selesai` : 'Tidak Aktif'
    };
  });

  const filteredRows = tableRows.filter(row => {
    const matchesSearch = `${row.nama} ${row.nip} ${row.mapel} ${row.kelas}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPredikat = filterPredikat === 'all' || row.predikat === filterPredikat;
    const matchesStatus = filterStatus === 'all' || row.statusSupervisi === filterStatus;
    return matchesSearch && matchesPredikat && matchesStatus;
  });

  // Calculate stats
  const completedSupervisions = tableRows.filter(r => r.sup !== undefined);
  const avgScore = completedSupervisions.length > 0
    ? Math.round(completedSupervisions.reduce((acc, r) => acc + (r.nilaiAkhir || 0), 0) / completedSupervisions.length)
    : 0;

  // CSV Export
  const exportToCSV = () => {
    const headers = [
      'No',
      'NIP',
      'Nama Guru',
      'Mata Pelajaran',
      'Kelas',
      'Tanggal Supervisi',
      'Skor Perencanaan',
      'Skor Observasi',
      'Nilai Akhir',
      'Predikat',
      'Status Supervisi',
      'Status Monitoring 5 Minggu'
    ];

    const rows = filteredRows.map(r => [
      r.no,
      `="${r.nip}"`,
      `"${r.nama}"`,
      `"${r.mapel}"`,
      `"${r.kelas}"`,
      r.tanggal,
      r.skorPerencanaan,
      r.skorObservasi,
      r.nilaiAkhir !== null ? r.nilaiAkhir : '',
      `"${r.predikat}"`,
      r.statusSupervisi,
      `"${r.statusMonitoring}"`
    ]);

    const csvContent = [
      `"REKAPITULASI HASIL SUPERVISI AKADEMIK GURU - ${school.namaSekolah}"`,
      `"Tahun Ajaran: ${school.tahunAjaran} (${school.semester})"`,
      '',
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Rekap_Supervisi_${school.namaSekolah.replace(/\s+/g, '_')}_${school.tahunAjaran.replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadRekapPdf = () => {
    generateRekapitulasiPdf(teachers, supervisions, school);
  };

  const printRekap = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 no-print">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Rekapitulasi Hasil Supervisi Akademik
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Daftar kumulatif penilaian kinerja guru, skor perencanaan, observasi kelas, dan status pembinaan
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadRekapPdf}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Langsung unduh dokumen PDF Rekapitulasi"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Rekap PDF</span>
          </button>

          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Ekspor CSV / Excel</span>
          </button>

          <button
            onClick={printRekap}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Printer</span>
          </button>
        </div>
      </div>

      {/* Formal Header for Print */}
      <div className="hidden print:block text-center mb-6">
        <h2 className="text-xl font-bold uppercase tracking-tight">
          REKAPITULASI HASIL SUPERVISI AKADEMIK GURU
        </h2>
        <h3 className="text-lg font-semibold">{school.namaSekolah}</h3>
        <p className="text-xs text-slate-600">
          {school.alamat} &bull; NPSN: {school.npsn} &bull; Semester {school.semester} Tahun Pelajaran {school.tahunAjaran}
        </p>
        <div className="border-b-2 border-slate-800 mt-3 mb-4"></div>
      </div>

      {/* KPI Cards (No Print) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Guru</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{teachers.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">SMKN 1 Menggala</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">Sudah Disupervisi</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{completedSupervisions.length}</p>
          <p className="text-[11px] text-emerald-600 mt-1">
            {Math.round((completedSupervisions.length / Math.max(teachers.length, 1)) * 100)}% Ketercapaian
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">Rata-Rata Nilai</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{avgScore}</p>
          <p className="text-[11px] text-blue-600 mt-1">
            Predikat: {avgScore >= 91 ? 'Amat Baik' : avgScore >= 81 ? 'Baik' : 'Cukup'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">Program Monitoring</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{monitoringList.length}</p>
          <p className="text-[11px] text-amber-600 mt-1">Siklus 5 Minggu aktif</p>
        </div>
      </div>

      {/* Filters (No Print) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 no-print">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Cari guru, NIP, atau mata pelajaran..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <select
              value={filterPredikat}
              onChange={e => setFilterPredikat(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">Semua Predikat</option>
              <option value="Amat Baik">Amat Baik (&ge; 91)</option>
              <option value="Baik">Baik (81 - 90)</option>
              <option value="Cukup">Cukup (71 - 80)</option>
              <option value="Perlu Pendampingan">Perlu Pendampingan (&lt; 71)</option>
              <option value="Belum Disupervisi">Belum Disupervisi</option>
            </select>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">Semua Status Supervisi</option>
              <option value="selesai">Sudah Disupervisi</option>
              <option value="dalam_monitoring">Dalam Monitoring</option>
              <option value="belum">Belum Disupervisi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3 text-center w-10">No</th>
                <th className="py-3 px-3">Nama Guru &amp; Gelar</th>
                <th className="py-3 px-3">Mata Pelajaran &amp; Kelas</th>
                <th className="py-3 px-3 text-center">Tanggal</th>
                <th className="py-3 px-3 text-center">Perencanaan (30%)</th>
                <th className="py-3 px-3 text-center">Observasi (70%)</th>
                <th className="py-3 px-3 text-center">Nilai Akhir</th>
                <th className="py-3 px-3 text-center">Predikat</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRows.map((row, idx) => (
                <tr key={row.teacher.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 text-center font-medium text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-900">{row.nama}</p>
                    <p className="text-[10px] text-slate-400">NIP: {row.nip}</p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-slate-800 font-medium">{row.mapel}</p>
                    <p className="text-[10px] text-slate-400">Kelas: {row.kelas}</p>
                  </td>
                  <td className="py-3 px-3 text-center text-slate-600 whitespace-nowrap">
                    {row.tanggal}
                  </td>
                  <td className="py-3 px-3 text-center font-semibold text-indigo-700">
                    {row.skorPerencanaan !== '-' ? `${row.skorPerencanaan}` : '-'}
                  </td>
                  <td className="py-3 px-3 text-center font-semibold text-emerald-700">
                    {row.skorObservasi !== '-' ? `${row.skorObservasi}` : '-'}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.nilaiAkhir !== null ? (
                      <span className="font-extrabold text-sm text-slate-900">
                        {row.nilaiAkhir}
                      </span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        row.predikat === 'Amat Baik'
                          ? 'bg-emerald-100 text-emerald-800'
                          : row.predikat === 'Baik'
                          ? 'bg-blue-100 text-blue-800'
                          : row.predikat === 'Cukup'
                          ? 'bg-amber-100 text-amber-800'
                          : row.predikat === 'Perlu Pendampingan'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {row.predikat}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    {row.statusSupervisi === 'selesai' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Selesai</span>
                      </span>
                    ) : row.statusSupervisi === 'dalam_monitoring' ? (
                      <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Monitoring 5M</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium text-[11px]">
                        Belum
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center no-print whitespace-nowrap">
                    {row.sup ? (
                      <button
                        onClick={() => setSelectedSupervisionForPrint(row.sup || null)}
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                        title="Lihat Lembar & Cetak Berita Acara"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Berkas</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => openNewSupervisionForTeacher(row.teacher.id)}
                        className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800 font-semibold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                      >
                        <span>+ Nilai Sekarang</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Signature Section for Print */}
      <div className="hidden print:grid grid-cols-2 gap-12 mt-12 pt-6 text-xs">
        <div className="text-center">
          <p>Mengetahui,</p>
          <p className="font-semibold">Kepala {school.namaSekolah}</p>
          <div className="h-24"></div>
          <p className="font-bold underline">{school.kepalaSekolah}</p>
          <p>NIP. {school.nipKepsek}</p>
        </div>
        <div className="text-center">
          <p>{school.kabupaten}, {new Date().toLocaleDateString('id-ID')}</p>
          <p className="font-semibold">Koordinator Tim Penjamin Mutu / Supervisi</p>
          <div className="h-24"></div>
          <p className="font-bold underline">Dr. Ketut Suwarte, M.Pd</p>
          <p>NIP. 19750914 200212 1 003</p>
        </div>
      </div>
    </div>
  );
};
