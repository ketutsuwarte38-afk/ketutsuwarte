import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Check,
  Copy,
  Download,
  ExternalLink,
  RefreshCw,
  Send,
  AlertCircle,
  HelpCircle,
  Code,
  Sparkles,
  Layers,
  ArrowRight,
  Database
} from 'lucide-react';
import { useSupervision } from '../context/SupervisionContext';
import {
  GOOGLE_APPS_SCRIPT_CODE,
  testGoogleSheetsConnection,
  syncAllToGoogleSheets,
  pullDataFromGoogleSheets
} from '../utils/googleSheetsScript';

export const GoogleSheetsIntegration: React.FC = () => {
  const { school, teachers, supervisions, monitoringList, updateSchool, updateTeacher } =
    useSupervision();

  const [webAppUrl, setWebAppUrl] = useState<string>(() => {
    return localStorage.getItem('esupervisi_google_sheets_url') || '';
  });

  const [isCopied, setIsCopied] = useState(false);
  const [testingStatus, setTestingStatus] = useState<
    'idle' | 'testing' | 'success' | 'error'
  >('idle');
  const [testMessage, setTestMessage] = useState<string>('');

  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return localStorage.getItem('esupervisi_last_sync_time') || '';
  });

  const [showCodePreview, setShowCodePreview] = useState(false);

  // Save URL when user types
  const handleUrlChange = (newUrl: string) => {
    setWebAppUrl(newUrl);
    localStorage.setItem('esupervisi_google_sheets_url', newUrl);
    if (testingStatus !== 'idle') {
      setTestingStatus('idle');
      setTestMessage('');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDownloadGsFile = () => {
    const blob = new Blob([GOOGLE_APPS_SCRIPT_CODE], {
      type: 'text/plain;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Code_E_Supervisi.gs';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleTestConnection = async () => {
    if (!webAppUrl.trim()) {
      setTestingStatus('error');
      setTestMessage('Silakan masukkan URL Web App Google Apps Script terlebih dahulu.');
      return;
    }

    setTestingStatus('testing');
    setTestMessage('Menghubungkan ke Google Apps Script...');

    const res = await testGoogleSheetsConnection(webAppUrl);
    if (res.success) {
      setTestingStatus('success');
      setTestMessage(res.message);
    } else {
      setTestingStatus('error');
      setTestMessage(res.message);
    }
  };

  const handleSyncToSheets = async () => {
    if (!webAppUrl.trim()) {
      setSyncStatus('error');
      setSyncMessage('Masukkan URL Web App terlebih dahulu sebelum sinkronisasi.');
      return;
    }

    setSyncStatus('syncing');
    setSyncMessage('Mengirim data sekolah, guru, supervisi, dan monitoring 5 pekan...');

    const res = await syncAllToGoogleSheets(webAppUrl, {
      school,
      teachers,
      supervisions,
      monitoringList
    });

    if (res.success) {
      const nowStr = new Date().toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      setSyncStatus('success');
      setSyncMessage(res.message);
      setLastSyncTime(nowStr);
      localStorage.setItem('esupervisi_last_sync_time', nowStr);
    } else {
      setSyncStatus('error');
      setSyncMessage(res.message);
    }
  };

  const handlePullFromSheets = async () => {
    if (!webAppUrl.trim()) {
      setSyncStatus('error');
      setSyncMessage('Masukkan URL Web App terlebih dahulu.');
      return;
    }

    setSyncStatus('syncing');
    setSyncMessage('Menarik data dari Google Sheets...');

    const res = await pullDataFromGoogleSheets(webAppUrl);
    if (res.success && res.data) {
      if (res.data.school) {
        updateSchool(res.data.school);
      }
      if (res.data.teachers && Array.isArray(res.data.teachers)) {
        res.data.teachers.forEach((t: any) => {
          if (t.id) updateTeacher(t.id, t);
        });
      }
      setSyncStatus('success');
      setSyncMessage('Berhasil menyinkronkan data dari Google Sheets ke aplikasi!');
    } else {
      setSyncStatus('error');
      setSyncMessage(res.message || 'Gagal menarik data.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900/90 via-teal-900/90 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-400/30">
                <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
              </span>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Integrasi Google Spreadsheet
                  <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full">
                    Apps Script Ready
                  </span>
                </h3>
                <p className="text-xs text-emerald-100/80">
                  Sinkronisasi 2 arah otomatis antara aplikasi E-Supervisi dan Google Sheets
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'Kode Tersalin!' : 'Salin Kode Apps Script'}</span>
            </button>

            <button
              onClick={handleDownloadGsFile}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
              title="Unduh File Code_E_Supervisi.gs"
            >
              <Download className="w-4 h-4 text-slate-300" />
              <span>Unduh .gs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Settings & Sync */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: URL & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card: URL Web App Configuration */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span>Pengaturan URL Google Apps Script</span>
              </h4>
              {lastSyncTime && (
                <span className="text-[11px] text-slate-500">
                  Sinkron Terakhir: <strong className="text-slate-700">{lastSyncTime}</strong>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Masukkan URL Deployment Aplikasi Web yang didapatkan dari Google Apps Script (berakhiran{' '}
              <code className="bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded font-mono text-[11px]">
                /exec
              </code>
              ).
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                URL Aplikasi Web (Web App Deployment URL):
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={webAppUrl}
                  onChange={e => handleUrlChange(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                  className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono text-slate-800 bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testingStatus === 'testing'}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl border border-slate-300 transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 text-slate-600 ${testingStatus === 'testing' ? 'animate-spin' : ''}`}
                  />
                  <span>Tes Koneksi</span>
                </button>
              </div>

              {/* Status Message */}
              {testMessage && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 mt-2 ${
                    testingStatus === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : testingStatus === 'error'
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : 'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}
                >
                  {testingStatus === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : testingStatus === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <RefreshCw className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                  )}
                  <span>{testMessage}</span>
                </div>
              )}
            </div>

            {/* Sync Controls */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Aksi Sinkronisasi Data:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleSyncToSheets}
                  disabled={syncStatus === 'syncing'}
                  className="w-full bg-[#1e3a8a] hover:bg-blue-900 text-white font-semibold text-xs py-3 px-4 rounded-xl shadow-xs transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-pulse' : ''}`} />
                  <span>Kirim Data ke Google Sheets</span>
                </button>

                <button
                  type="button"
                  onClick={handlePullFromSheets}
                  disabled={syncStatus === 'syncing'}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3 px-4 rounded-xl border border-slate-300 shadow-xs transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 text-slate-500 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`}
                  />
                  <span>Tarik Data dari Spreadsheet</span>
                </button>
              </div>

              {/* Sync Status Banner */}
              {syncMessage && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 mt-2 ${
                    syncStatus === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : syncStatus === 'error'
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : 'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}
                >
                  {syncStatus === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : syncStatus === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <RefreshCw className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                  )}
                  <span>{syncMessage}</span>
                </div>
              )}
            </div>

            {/* Sheets Preview Badges */}
            <div className="pt-3 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500 mb-2">
                4 Lembar Sheet yang Dikelola Otomatis oleh Apps Script:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-800">Data_Sekolah</p>
                  <p className="text-[10px] text-slate-400">Profil &amp; Supervisor</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-800">Data_Guru</p>
                  <p className="text-[10px] text-slate-400">{teachers.length} Guru</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-800">Hasil_Supervisi</p>
                  <p className="text-[10px] text-slate-400">{supervisions.length} Rekor Nilai</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-800">Monitoring_5Pekan</p>
                  <p className="text-[10px] text-slate-400">{monitoringList.length} Kartu Siklus</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Step-by-Step Tutorial (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Panduan Pasang Apps Script (5 Langkah)</span>
            </h4>

            <div className="space-y-3.5 text-xs">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Buat Google Spreadsheet Baru</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Buka <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium inline-flex items-center gap-0.5">sheets.new <ExternalLink className="w-2.5 h-2.5 inline" /></a> di browser Anda.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Buka Menu Ekstensi &gt; Apps Script</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Pada spreadsheet Anda, klik menu <strong>Ekstensi</strong> lalu pilih <strong>Apps Script</strong>.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Tempelkan Kode Apps Script</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Hapus kode default pada file <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">Code.gs</code>, lalu klik tombol <strong>Salin Kode</strong> di atas dan tempelkan. Simpan (Ctrl+S).
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  4
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Deploy sebagai Web App</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Klik tombol biru <strong>Terapkan (Deploy)</strong> &gt; <strong>Deployment baru</strong>. Pilih jenis <strong>Aplikasi Web</strong>.
                  </p>
                  <p className="text-emerald-700 font-semibold text-[11px] mt-1 bg-emerald-50 p-1.5 rounded-md border border-emerald-200">
                    Penting: Ubah 'Siapa yang memiliki akses' menjadi 'Siapa saja' (Anyone).
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  5
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Salin URL &amp; Tempel di Aplikasi</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Salin URL Web App yang dihasilkan (akhiran <code className="text-blue-600 font-mono">/exec</code>), tempelkan ke kolom URL di sebelah kiri, dan klik <strong>Kirim Data</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Viewer Collapsible Box */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden text-slate-200">
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-xs font-bold text-slate-200">
              Google Apps Script Source Code (Code.gs)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCodePreview(!showCodePreview)}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              {showCodePreview ? 'Sembunyikan Kode' : 'Tampilkan Kode Lengkap'}
            </button>

            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Tersalin!' : 'Salin'}</span>
            </button>
          </div>
        </div>

        {showCodePreview && (
          <div className="p-4 overflow-x-auto max-h-96 text-[11px] font-mono leading-relaxed bg-slate-950 text-slate-300">
            <pre>{GOOGLE_APPS_SCRIPT_CODE}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
