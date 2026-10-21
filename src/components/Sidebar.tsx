import React from 'react';
import {
  Home,
  Database,
  ClipboardCheck,
  FileText,
  TrendingUp,
  LayoutGrid,
  Printer,
  Sparkles,
  School,
  GraduationCap
} from 'lucide-react';
import { useSupervision } from '../context/SupervisionContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, school, supervisions } = useSupervision();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      section: 'main'
    },
    {
      id: 'master-data',
      label: 'Master Data',
      icon: Database,
      section: 'main'
    },
    // Supervisi Akademik
    {
      id: 'rubrik-supervisi',
      label: 'Rubrik Supervisi',
      icon: ClipboardCheck,
      section: 'supervisi'
    },
    {
      id: 'hasil-analisis',
      label: 'Hasil & Analisis',
      icon: FileText,
      section: 'supervisi'
    },
    // Tindak Lanjut
    {
      id: 'monitoring-5-minggu',
      label: 'Monitoring 5 Minggu',
      icon: TrendingUp,
      section: 'tindak_lanjut'
    },
    {
      id: 'rekapitulasi',
      label: 'Rekapitulasi',
      icon: LayoutGrid,
      section: 'tindak_lanjut'
    }
  ];

  return (
    <aside className="w-64 bg-[#0a192f] text-slate-200 flex flex-col shrink-0 min-h-screen border-r border-slate-800 select-none no-print">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-bold text-xl">
            E
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
              E-Supervisi
            </h1>
            <p className="text-xs text-blue-400 font-medium">
              Sistem Monitoring Guru
            </p>
          </div>
        </div>

        {/* Active School Badge */}
        <div className="mt-4 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center gap-2">
          <School className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-200 truncate">
              {school.namaSekolah}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              TA {school.tahunAjaran} ({school.semester})
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {/* Main Section */}
        <div className="space-y-1">
          {navItems
            .filter(item => item.section === 'main')
            .map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
        </div>

        {/* Supervisi Akademik */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            Supervisi Akademik
          </p>
          {navItems
            .filter(item => item.section === 'supervisi')
            .map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.id === 'hasil-analisis' && supervisions.length > 0 && (
                    <span className="ml-auto text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded-full border border-blue-400/30">
                      {supervisions.length}
                    </span>
                  )}
                </button>
              );
            })}
        </div>

        {/* Tindak Lanjut */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            Tindak Lanjut
          </p>
          {navItems
            .filter(item => item.section === 'tindak_lanjut')
            .map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
        </div>

        {/* Info Box */}
        <div className="pt-2 px-1">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-800/40 text-xs">
            <div className="flex items-center gap-1.5 text-indigo-300 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Standar PMM 2026</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Dilengkapi 8 Indikator Kinerja Guru Kemendikbudristek & Kurikulum Merdeka.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/80 text-center">
        <p className="text-xs font-semibold text-slate-400">Versi 1.0</p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          E-Supervisi {school.namaSekolah}
        </p>
      </div>
    </aside>
  );
};
