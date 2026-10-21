import React, { useState, useEffect } from 'react';
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  CheckCircle2,
  School,
  X,
  Plus,
  FileSpreadsheet
} from 'lucide-react';
import { useSupervision } from '../context/SupervisionContext';
import { Teacher } from '../types/supervisi';
import { GoogleSheetsIntegration } from './GoogleSheetsIntegration';

export const MasterDataView: React.FC = () => {
  const {
    school,
    updateSchool,
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher
  } = useSupervision();

  const [activeTab, setActiveTab] = useState<'sekolah' | 'guru' | 'google-sheets'>('sekolah');

  // Form State for Data Sekolah - exact matches with screenshot
  const [namaSekolah, setNamaSekolah] = useState(school.namaSekolah || 'SMKN 1 Menggala');
  const [npsn, setNpsn] = useState(school.npsn || '10804168');
  const [alamat, setAlamat] = useState(
    school.alamat || 'Jl. Lintas Timur Kamp. Lebuh Dalem Kec. Menggala Timur - Tulang Bawang'
  );
  const [kepalaSekolah, setKepalaSekolah] = useState(school.kepalaSekolah || 'Ferdayana, S.P.,M.Pd.I');
  const [nipKepsek, setNipKepsek] = useState(school.nipKepsek || '197204192009022001');
  const [namaSupervisor, setNamaSupervisor] = useState(
    school.namaSupervisor || 'Dr. Ketut Suwarte, M.Pd'
  );
  const [nipSupervisor, setNipSupervisor] = useState(
    school.nipSupervisor || '19750914 200212 1 003'
  );
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Sync state if school context changes
  useEffect(() => {
    setNamaSekolah(school.namaSekolah);
    setNpsn(school.npsn);
    setAlamat(school.alamat);
    setKepalaSekolah(school.kepalaSekolah);
    setNipKepsek(school.nipKepsek);
    setNamaSupervisor(school.namaSupervisor || 'Dr. Ketut Suwarte, M.Pd');
    setNipSupervisor(school.nipSupervisor || '19750914 200212 1 003');
  }, [school]);

  // Teacher Management State
  const [searchTeacher, setSearchTeacher] = useState('');
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [tNama, setTNama] = useState('');
  const [tGelar, setTGelar] = useState('S.Pd');
  const [tNip, setTNip] = useState('');
  const [tMapel, setTMapel] = useState('');
  const [tKelas, setTKelas] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tNoHp, setTNoHp] = useState('');

  const handleSaveSchool = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchool({
      namaSekolah,
      npsn,
      alamat,
      kepalaSekolah,
      nipKepsek,
      namaSupervisor,
      nipSupervisor
    });
    setShowSaveSuccess(true);
    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 3500);
  };

  const openAddTeacherModal = () => {
    setEditingTeacherId(null);
    setTNama('');
    setTGelar('S.Pd');
    setTNip('');
    setTMapel('');
    setTKelas('');
    setTEmail('');
    setTNoHp('');
    setShowTeacherModal(true);
  };

  const openEditTeacherModal = (teacher: Teacher) => {
    setEditingTeacherId(teacher.id);
    setTNama(teacher.nama);
    setTGelar(teacher.gelar);
    setTNip(teacher.nip);
    setTMapel(teacher.mapel);
    setTKelas(teacher.kelas);
    setTEmail(teacher.email);
    setTNoHp(teacher.noHp);
    setShowTeacherModal(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tNama.trim() || !tMapel.trim()) return;

    const colors = [
      'bg-emerald-600',
      'bg-blue-600',
      'bg-purple-600',
      'bg-indigo-600',
      'bg-amber-600',
      'bg-pink-600',
      'bg-cyan-600'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    if (editingTeacherId) {
      updateTeacher(editingTeacherId, {
        nama: tNama,
        gelar: tGelar,
        nip: tNip,
        mapel: tMapel,
        kelas: tKelas,
        email: tEmail,
        noHp: tNoHp
      });
    } else {
      addTeacher({
        nama: tNama,
        gelar: tGelar,
        nip: tNip || `198${Math.floor(Math.random() * 90000000)}`,
        mapel: tMapel,
        kelas: tKelas || 'X',
        email: tEmail || `${tNama.toLowerCase().replace(/\s+/g, '')}@guru.smk.belajar.id`,
        noHp: tNoHp || '0812-xxxx-xxxx',
        avatarColor: randomColor,
        statusSupervisi: 'belum'
      });
    }

    setShowTeacherModal(false);
  };

  const filteredTeachers = teachers.filter(t =>
    `${t.nama} ${t.nip} ${t.mapel} ${t.kelas}`.toLowerCase().includes(searchTeacher.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Main Card Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        {/* Title */}
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          Master Data
        </h2>

        {/* Tab Navigation matching screenshot */}
        <div className="flex items-center gap-6 border-b border-slate-200 mt-5">
          <button
            onClick={() => setActiveTab('sekolah')}
            className={`pb-3 text-sm font-semibold transition-all cursor-pointer relative ${
              activeTab === 'sekolah'
                ? 'text-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Data Sekolah</span>
            {activeTab === 'sekolah' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('guru')}
            className={`pb-3 text-sm font-semibold transition-all cursor-pointer relative ${
              activeTab === 'guru'
                ? 'text-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Data Guru</span>
            {activeTab === 'guru' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('google-sheets')}
            className={`pb-3 text-sm font-semibold transition-all cursor-pointer relative flex items-center gap-1.5 ${
              activeTab === 'google-sheets'
                ? 'text-emerald-700 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className={`w-4 h-4 ${activeTab === 'google-sheets' ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>Integrasi Google Sheets</span>
            {activeTab === 'google-sheets' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
            )}
          </button>
        </div>

        {/* TAB 1: DATA SEKOLAH (Exact match with user's screenshot) */}
        {activeTab === 'sekolah' && (
          <form onSubmit={handleSaveSchool} className="mt-6 space-y-5">
            {/* Row 1: Nama Sekolah & NPSN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Sekolah
                </label>
                <input
                  type="text"
                  value={namaSekolah}
                  onChange={e => setNamaSekolah(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-white"
                  placeholder="SMKN 1 Menggala"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  NPSN
                </label>
                <input
                  type="text"
                  value={npsn}
                  onChange={e => setNpsn(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-white"
                  placeholder="10804168"
                  required
                />
              </div>
            </div>

            {/* Row 2: Alamat (Full Width) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alamat
              </label>
              <input
                type="text"
                value={alamat}
                onChange={e => setAlamat(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-white"
                placeholder="Jl. Lintas Timur Kamp. Lebuh Dalem Kec. Menggala Timur - Tulang Bawang"
                required
              />
            </div>

            {/* Row 3: Kepala Sekolah & NIP Kepsek */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kepala Sekolah
                </label>
                <input
                  type="text"
                  value={kepalaSekolah}
                  onChange={e => setKepalaSekolah(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-white"
                  placeholder="Ferdayana, S.P.,M.Pd.I"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  NIP Kepsek
                </label>
                <input
                  type="text"
                  value={nipKepsek}
                  onChange={e => setNipKepsek(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-white"
                  placeholder="197204192009022001"
                  required
                />
              </div>
            </div>

            {/* Row 4: Nama Supervisor & NIP Supervisor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Supervisor
                </label>
                <input
                  type="text"
                  value={namaSupervisor}
                  onChange={e => setNamaSupervisor(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-white"
                  placeholder="Dr. Ketut Suwarte, M.Pd"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  NIP Supervisor
                </label>
                <input
                  type="text"
                  value={nipSupervisor}
                  onChange={e => setNipSupervisor(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 bg-white"
                  placeholder="19750914 200212 1 003"
                  required
                />
              </div>
            </div>

            {/* Save Button matching screenshot */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="bg-[#1d4ed8] hover:bg-blue-800 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2"
              >
                <span>Simpan Data Sekolah</span>
              </button>

              {showSaveSuccess && (
                <div className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-semibold bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Data sekolah berhasil disimpan!</span>
                </div>
              )}
            </div>
          </form>
        )}

        {/* TAB 2: DATA GURU */}
        {activeTab === 'guru' && (
          <div className="mt-6 space-y-5">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTeacher}
                  onChange={e => setSearchTeacher(e.target.value)}
                  placeholder="Cari guru berdasarkan nama, NIP, atau mata pelajaran..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <button
                onClick={openAddTeacherModal}
                className="inline-flex items-center gap-2 bg-[#1d4ed8] hover:bg-blue-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Guru</span>
              </button>
            </div>

            {/* Teacher List Table */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-3 text-center w-12">No</th>
                      <th className="py-3 px-4">Nama Lengkap &amp; Gelar</th>
                      <th className="py-3 px-4">NIP</th>
                      <th className="py-3 px-4">Mata Pelajaran</th>
                      <th className="py-3 px-4">Kelas</th>
                      <th className="py-3 px-3 text-center">Status Supervisi</th>
                      <th className="py-3 px-3 text-center w-28">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredTeachers.map((tch, idx) => (
                      <tr key={tch.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 text-center font-medium text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {tch.nama}, {tch.gelar}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                          {tch.nip}
                        </td>
                        <td className="py-3 px-4 text-slate-800 font-medium">
                          {tch.mapel}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {tch.kelas}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              tch.statusSupervisi === 'selesai'
                                ? 'bg-emerald-100 text-emerald-800'
                                : tch.statusSupervisi === 'dalam_monitoring'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {tch.statusSupervisi === 'selesai'
                              ? 'Sudah Disupervisi'
                              : tch.statusSupervisi === 'dalam_monitoring'
                              ? 'Dalam Monitoring'
                              : 'Belum Disupervisi'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEditTeacherModal(tch)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Edit Data Guru"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Hapus guru ${tch.nama}?`)) {
                                  deleteTeacher(tch.id);
                                }
                              }}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                              title="Hapus Data Guru"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredTeachers.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                          Tidak ada guru yang ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INTEGRASI GOOGLE SHEETS */}
        {activeTab === 'google-sheets' && (
          <div className="mt-6">
            <GoogleSheetsIntegration />
          </div>
        )}
      </div>

      {/* Modal Add / Edit Guru */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">
                {editingTeacherId ? 'Edit Data Guru' : 'Tambah Guru Baru'}
              </h3>
              <button
                onClick={() => setShowTeacherModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap (tanpa gelar):
                  </label>
                  <input
                    type="text"
                    value={tNama}
                    onChange={e => setTNama(e.target.value)}
                    placeholder="Contoh: Ferdayana"
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Gelar:
                  </label>
                  <input
                    type="text"
                    value={tGelar}
                    onChange={e => setTGelar(e.target.value)}
                    placeholder="S.P.,M.Pd.I"
                    className="w-full p-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  NIP:
                </label>
                <input
                  type="text"
                  value={tNip}
                  onChange={e => setTNip(e.target.value)}
                  placeholder="197204192009022001"
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mata Pelajaran:
                </label>
                <input
                  type="text"
                  value={tMapel}
                  onChange={e => setTMapel(e.target.value)}
                  placeholder="Contoh: Agribisnis Ternak Unggas"
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kelas / Rombel:
                </label>
                <input
                  type="text"
                  value={tKelas}
                  onChange={e => setTKelas(e.target.value)}
                  placeholder="Contoh: XI APHP 1"
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email Akun Belajar.id / Kontak:
                </label>
                <input
                  type="email"
                  value={tEmail}
                  onChange={e => setTEmail(e.target.value)}
                  placeholder="guru@smk.belajar.id"
                  className="w-full p-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTeacherModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Simpan Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
