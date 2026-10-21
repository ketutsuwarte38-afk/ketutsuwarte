import React, { useState } from 'react';
import {
  School,
  UserCheck,
  Calendar,
  Settings,
  PlusCircle,
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useSupervision } from '../context/SupervisionContext';

interface HeaderProps {
  onOpenSchoolModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSchoolModal }) => {
  const {
    school,
    activeRole,
    setActiveRole,
    openNewSupervisionForTeacher,
    resetToDefault
  } = useSupervision();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roles: Array<'Admin/Kepsek' | 'Supervisor' | 'Guru'> = [
    'Admin/Kepsek',
    'Supervisor',
    'Guru'
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs no-print">
      {/* Left: School Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-slate-800 font-semibold text-base sm:text-lg">
          <div className="p-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 flex items-center justify-center">
            <School className="w-5 h-5 text-blue-600" />
          </div>
          <span className="tracking-tight">{school.namaSekolah}</span>
        </div>

        <button
          onClick={onOpenSchoolModal}
          className="text-xs text-slate-500 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 border border-slate-200"
          title="Ubah identitas sekolah & tahun ajaran"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ubah Profil</span>
        </button>
      </div>

      {/* Right: Actions & Role */}
      <div className="flex items-center gap-3">
        {/* Quick Supervisi Button */}
        <button
          onClick={() => openNewSupervisionForTeacher()}
          className="hidden md:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs shadow-blue-500/20 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Supervisi Baru</span>
        </button>

        {/* Academic Period */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{school.semester} {school.tahunAjaran}</span>
        </div>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-full border border-blue-200 transition-colors cursor-pointer text-xs font-semibold"
          >
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>{activeRole}</span>
            <ChevronDown className="w-3 h-3 text-blue-500" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Pilih Peran Tampilan
              </div>
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setActiveRole(r);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between hover:bg-slate-50 ${
                    activeRole === r ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{r}</span>
                  {activeRole === r && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reset Demo Data button */}
        <button
          onClick={resetToDefault}
          title="Reset ke Data Awal SMKN 1 Menggala"
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
