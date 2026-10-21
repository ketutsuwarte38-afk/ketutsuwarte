/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SupervisionProvider, useSupervision } from './context/SupervisionContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { MasterDataView } from './components/MasterDataView';
import { RubrikSupervisiView } from './components/RubrikSupervisiView';
import { HasilAnalisisView } from './components/HasilAnalisisView';
import { Monitoring5MingguView } from './components/Monitoring5MingguView';
import { RekapitulasiView } from './components/RekapitulasiView';
import { CetakDokumenModal } from './components/CetakDokumenModal';
import { X, Save, School as SchoolIcon } from 'lucide-react';

function MainApp() {
  const {
    activeTab,
    selectedSupervisionForPrint,
    setSelectedSupervisionForPrint,
    school,
    updateSchool
  } = useSupervision();

  const [schoolModalOpen, setSchoolModalOpen] = useState(false);
  const [tempSchool, setTempSchool] = useState(school);

  const handleOpenSchoolModal = () => {
    setTempSchool(school);
    setSchoolModalOpen(true);
  };

  const handleSaveSchool = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchool(tempSchool);
    setSchoolModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Sidebar matching the image */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenSchoolModal={handleOpenSchoolModal} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'master-data' && <MasterDataView />}
          {activeTab === 'rubrik-supervisi' && <RubrikSupervisiView />}
          {activeTab === 'hasil-analisis' && <HasilAnalisisView />}
          {activeTab === 'monitoring-5-minggu' && <Monitoring5MingguView />}
          {activeTab === 'rekapitulasi' && <RekapitulasiView />}
        </main>
      </div>

      {/* Print / Pratinjau Modal */}
      {selectedSupervisionForPrint && (
        <CetakDokumenModal
          record={selectedSupervisionForPrint}
          onClose={() => setSelectedSupervisionForPrint(null)}
        />
      )}

      {/* Quick School Profile Editor Modal */}
      {schoolModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-base">
                <SchoolIcon className="w-5 h-5 text-blue-600" />
                <span>Ubah Profil Sekolah &amp; Periode</span>
              </div>
              <button
                onClick={() => setSchoolModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSchool} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Sekolah:
                </label>
                <input
                  type="text"
                  value={tempSchool.namaSekolah}
                  onChange={e => setTempSchool({ ...tempSchool, namaSekolah: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-bold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NPSN:
                  </label>
                  <input
                    type="text"
                    value={tempSchool.npsn}
                    onChange={e => setTempSchool({ ...tempSchool, npsn: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kabupaten / Kota:
                  </label>
                  <input
                    type="text"
                    value={tempSchool.kabupaten}
                    onChange={e => setTempSchool({ ...tempSchool, kabupaten: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Alamat Sekolah:
                </label>
                <input
                  type="text"
                  value={tempSchool.alamat}
                  onChange={e => setTempSchool({ ...tempSchool, alamat: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Kepala Sekolah:
                  </label>
                  <input
                    type="text"
                    value={tempSchool.kepalaSekolah}
                    onChange={e => setTempSchool({ ...tempSchool, kepalaSekolah: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NIP Kepala Sekolah:
                  </label>
                  <input
                    type="text"
                    value={tempSchool.nipKepsek}
                    onChange={e => setTempSchool({ ...tempSchool, nipKepsek: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Supervisor:
                  </label>
                  <input
                    type="text"
                    value={tempSchool.namaSupervisor || ''}
                    onChange={e => setTempSchool({ ...tempSchool, namaSupervisor: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                    placeholder="Dr. Ketut Suwarte, M.Pd"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NIP Supervisor:
                  </label>
                  <input
                    type="text"
                    value={tempSchool.nipSupervisor || ''}
                    onChange={e => setTempSchool({ ...tempSchool, nipSupervisor: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                    placeholder="19750914 200212 1 003"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Semester:
                  </label>
                  <select
                    value={tempSchool.semester}
                    onChange={e => setTempSchool({ ...tempSchool, semester: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Ganjil">Semester Ganjil</option>
                    <option value="Genap">Semester Genap</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tahun Ajaran:
                  </label>
                  <input
                    type="text"
                    value={tempSchool.tahunAjaran}
                    onChange={e => setTempSchool({ ...tempSchool, tahunAjaran: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSchoolModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <SupervisionProvider>
      <MainApp />
    </SupervisionProvider>
  );
}
