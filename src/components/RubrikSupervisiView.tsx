import React, { useState, useEffect } from 'react';
import {
  Save,
  X,
  Bot,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useSupervision } from '../context/SupervisionContext';
import { INSTRUMEN_INDIKATOR_LIST, IndicatorData } from '../data/instrumentData';
import { DEFAULT_PMM_INDICATORS, DEFAULT_PLANNING_ITEMS } from '../data/rubricIndicators';

export const RubrikSupervisiView: React.FC = () => {
  const {
    teachers,
    supervisors,
    addSupervision,
    setActiveTab,
    targetTeacherForSupervisionId,
    setTargetTeacherForSupervisionId,
    setSelectedSupervisionForPrint
  } = useSupervision();

  // Top Form fields
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(
    targetTeacherForSupervisionId || ''
  );
  const [tanggalObservasi, setTanggalObservasi] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [mapel, setMapel] = useState<string>('');
  const [kelas, setKelas] = useState<string>('');
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>(
    'keteraturan_suasana_kelas'
  );

  // Scores and notes for items
  // itemScores: { [itemId: string]: number } (1, 2, or 3)
  const [itemScores, setItemScores] = useState<{ [key: string]: number }>({});
  // itemNotes: { [itemId: string]: string }
  const [itemNotes, setItemNotes] = useState<{ [key: string]: string }>({});

  // Analisis & Kesimpulan fields
  const [kekuatanGuru, setKekuatanGuru] = useState<string>('');
  const [areaPerluDikembangkan, setAreaPerluDikembangkan] = useState<string>('');
  const [rekomendasiTindakLanjut, setRekomendasiTindakLanjut] = useState<string>('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<boolean>(false);

  // Active indicator definition
  const currentIndicator =
    INSTRUMEN_INDIKATOR_LIST.find(ind => ind.id === selectedIndicatorId) ||
    INSTRUMEN_INDIKATOR_LIST[0];

  // Auto-fill teacher info when selected
  useEffect(() => {
    if (selectedTeacherId) {
      const tch = teachers.find(t => t.id === selectedTeacherId);
      if (tch) {
        setMapel(tch.mapel);
        setKelas(tch.kelas);
      }
    } else {
      setMapel('');
      setKelas('');
    }
  }, [selectedTeacherId, teachers]);

  // Handle score change
  const handleScoreChange = (itemId: string, scoreVal: number) => {
    setItemScores(prev => ({
      ...prev,
      [itemId]: scoreVal
    }));
  };

  // Handle note change
  const handleNoteChange = (itemId: string, noteVal: string) => {
    setItemNotes(prev => ({
      ...prev,
      [itemId]: noteVal
    }));
  };

  // Calculate total items and scores for current indicator
  const allCurrentItems = currentIndicator.fokusGroups.flatMap(fg => fg.items);
  const totalItemsCount = allCurrentItems.length; // usually 9
  
  // Count how many items are filled
  let sumScore = 0;
  let filledItemsCount = 0;

  allCurrentItems.forEach(it => {
    const s = itemScores[it.id];
    if (s !== undefined && s > 0) {
      sumScore += s;
      filledItemsCount++;
    }
  });

  // Formula matching the 0.0% default shown in screenshot:
  // With 9 items, min score is 9 * 1 = 9, max score is 9 * 3 = 27.
  // When no items or all 1: (sumScore - totalItemsCount) / (totalItemsCount * 2) * 100
  let rawPercent = 0;
  if (filledItemsCount > 0) {
    const minPossible = filledItemsCount * 1;
    const maxPossible = filledItemsCount * 3;
    if (maxPossible > minPossible) {
      rawPercent = ((sumScore - minPossible) / (maxPossible - minPossible)) * 100;
    }
  }

  const scorePercentage = Math.max(0, Math.min(100, Number(rawPercent.toFixed(1))));

  // Predicate label
  let predikatBadge = 'Perlu Pendampingan';
  let badgeStyle = 'bg-white text-blue-700 border border-blue-200';

  if (scorePercentage >= 85) {
    predikatBadge = 'Sangat Baik';
    badgeStyle = 'bg-emerald-50 text-emerald-800 border border-emerald-200';
  } else if (scorePercentage >= 70) {
    predikatBadge = 'Baik';
    badgeStyle = 'bg-blue-50 text-blue-800 border border-blue-200';
  } else if (scorePercentage >= 50) {
    predikatBadge = 'Cukup';
    badgeStyle = 'bg-amber-50 text-amber-800 border border-amber-200';
  } else {
    predikatBadge = 'Perlu Pendampingan';
    badgeStyle = 'bg-white text-blue-700 border border-blue-200';
  }

  // AI Analysis button
  const handleAiAnalysis = () => {
    setIsAiAnalyzing(true);

    setTimeout(() => {
      const teacher = teachers.find(t => t.id === selectedTeacherId);
      const teacherName = teacher ? `${teacher.nama}, ${teacher.gelar}` : 'Guru';

      // Find items with high score (3) and low score (1 or 2)
      const highItems = allCurrentItems.filter(it => (itemScores[it.id] || 0) === 3);
      const lowItems = allCurrentItems.filter(
        it => (itemScores[it.id] || 0) === 1 || (itemScores[it.id] || 0) === 2
      );

      let strength = '';
      let improvement = '';
      let recommendation = '';

      if (highItems.length > 0) {
        strength = `Guru (${teacherName}) menunjukkan keunggulan yang konsisten dalam ${highItems
          .map(h => h.aktivitas.toLowerCase())
          .slice(0, 2)
          .join(', serta ')}. Iklim belajar terpelihara dengan kondusif dan interaksi berlangsung santun.`;
      } else {
        strength = `Guru memiliki antusiasme dan komitmen yang baik dalam mempersiapkan pembelajaran serta membuka kelas secara terstruktur.`;
      }

      if (lowItems.length > 0) {
        improvement = `Perlu penguatan pada aspek: ${lowItems
          .map(l => l.aktivitas.toLowerCase())
          .slice(0, 2)
          .join(' dan ')}. Siswa yang pasif perlu didorong lebih aktif melalui pengelompokan yang beragam peran.`;
      } else {
        improvement = `Penyempurnaan pada variasi refleksi bersama murid agar kesepakatan kelas semakin membudaya secara mandiri tanpa harus selalu diingatkan.`;
      }

      recommendation = `1. Mempelajari modul pelatihan mandiri PMM topik "${currentIndicator.nama}".\n2. Melaksanakan sesi peer-coaching bersama rekan sejawat dalam program Monitoring 5 Minggu.\n3. Menyusun lembar refleksi berkala dan memperjelas pembagian peran kelompok praktikum.`;

      setKekuatanGuru(strength);
      setAreaPerluDikembangkan(improvement);
      setRekomendasiTindakLanjut(recommendation);
      setIsAiAnalyzing(false);
    }, 700);
  };

  // Submit form
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTeacherId) {
      alert('Silakan pilih Guru terlebih dahulu.');
      return;
    }

    const teacher = teachers.find(t => t.id === selectedTeacherId);
    const supervisor = supervisors[0] || {
      id: 'spv-1',
      nama: 'Ferdayana, S.P.,M.Pd.I',
      nip: '197204192009022001'
    };

    // Calculate final score
    const finalScore = Math.round(scorePercentage);
    let pred: 'Amat Baik' | 'Baik' | 'Cukup' | 'Perlu Pendampingan' = 'Baik';
    if (finalScore >= 90) pred = 'Amat Baik';
    else if (finalScore >= 80) pred = 'Baik';
    else if (finalScore >= 65) pred = 'Cukup';
    else pred = 'Perlu Pendampingan';

    // Prepare rubrikObsItems from the current form
    const rubrikObsItemsToSave = currentIndicator.fokusGroups.flatMap(fg =>
      fg.items.map(it => ({
        id: it.id,
        nomor: it.nomor,
        fokusJudul: fg.fokusJudul,
        aktivitas: it.aktivitas,
        skor: itemScores[it.id] !== undefined ? itemScores[it.id] : 3,
        catatan: itemNotes[it.id] || ''
      }))
    );

    // Map to system record format
    const newRecord = addSupervision({
      teacherId: selectedTeacherId,
      supervisorId: supervisor.id,
      supervisorNama: supervisor.nama,
      tanggal: tanggalObservasi,
      mapel: mapel || (teacher?.mapel || '-'),
      kelas: kelas || (teacher?.kelas || '-'),
      jamKe: '1-3 (07.30 - 09.45)',
      materiPokok: `Supervisi Kinerja: ${currentIndicator.nama}`,
      fase: 'Fase E / F',
      indikatorNama: currentIndicator.nama,
      rubrikObsItems: rubrikObsItemsToSave,
      estimasiSkorPercent: scorePercentage,
      perencanaanItems: DEFAULT_PLANNING_ITEMS,
      indikatorItems: DEFAULT_PMM_INDICATORS.map((ind, idx) => ({
        ...ind,
        skor: idx === 0 ? Math.max(1, Math.min(4, Math.ceil((scorePercentage / 100) * 4))) : 3
      })),
      skorPerencanaan: 85,
      skorObservasi: finalScore,
      nilaiAkhir: Math.max(10, finalScore),
      predikat: pred,
      kekuatanGuru: kekuatanGuru || 'Guru memiliki penguasaan kelas yang baik.',
      aspekPerluDitingkatkan: areaPerluDikembangkan || 'Perlu peningkatan keterlibatan murid.',
      rekomendasiTindakLanjut: rekomendasiTindakLanjut || 'Mengikuti tindak lanjut PMM berkala.',
      rencanaAksiGuru: 'Melakukan perbaikan strategi kelas dan asesmen.',
      targetWaktuTindakLanjut: '4 Minggu',
      tandaTanganGuru: teacher ? `${teacher.nama}, ${teacher.gelar}` : 'Guru',
      tandaTanganSupervisor: supervisor.nama,
      tanggalDisetujui: tanggalObservasi
    });

    setSaveSuccessMessage(true);
    setTimeout(() => {
      setSaveSuccessMessage(false);
      setSelectedSupervisionForPrint(newRecord);
      setActiveTab('hasil-analisis');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        {/* Top Title & Close Button matching screenshot */}
        <div className="flex items-center justify-between pb-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Instrumen Supervisi Akademik
          </h2>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Tutup / Kembali ke Dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container (Light blue background card like in screenshot) */}
        <div className="bg-[#f0f6ff]/70 border border-blue-100 rounded-xl p-5 sm:p-6 space-y-4">
          {/* Row 1: Pilih Guru & Tanggal Observasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pilih Guru
              </label>
              <select
                value={selectedTeacherId}
                onChange={e => setSelectedTeacherId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
              >
                <option value="">-- Pilih Guru --</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.nama}, {t.gelar}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tanggal Observasi
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={tanggalObservasi}
                  onChange={e => setTanggalObservasi(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Mata Pelajaran & Kelas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mata Pelajaran
              </label>
              <input
                type="text"
                value={mapel}
                onChange={e => setMapel(e.target.value)}
                placeholder="Mata Pelajaran yang diajarkan"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kelas
              </label>
              <input
                type="text"
                value={kelas}
                onChange={e => setKelas(e.target.value)}
                placeholder="Kelas / Ruangan"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
              />
            </div>
          </div>

          {/* Row 3: Indikator Supervisi Dropdown (Full Width) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Indikator Supervisi
            </label>
            <select
              value={selectedIndicatorId}
              onChange={e => setSelectedIndicatorId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
            >
              {INSTRUMEN_INDIKATOR_LIST.map(ind => (
                <option key={ind.id} value={ind.id}>
                  {ind.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section: Rubrik Penilaian (Fokus Perilaku) */}
        <div className="space-y-3">
          {/* Section Gray Header Banner matching screenshot */}
          <div className="bg-[#e9edf3] px-4 py-2.5 rounded-lg">
            <h3 className="font-bold text-slate-800 text-sm">
              Rubrik Penilaian (Fokus Perilaku)
            </h3>
          </div>

          <p className="text-xs text-slate-600 px-1 font-medium">
            Skor: 1=Belum, 2=Dilakukan Belum Efektif, 3=Dilakukan &amp; Efektif
          </p>

          {/* Rubrik Table matching screenshot */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-800 text-[11px]">
                    <th className="py-3 px-3 text-center w-12 border-r border-slate-200">
                      No
                    </th>
                    <th className="py-3 px-4 border-r border-slate-200">
                      Aktivitas Diamati
                    </th>
                    <th className="py-3 px-2 text-center w-10 border-r border-slate-200">
                      1
                    </th>
                    <th className="py-3 px-2 text-center w-10 border-r border-slate-200">
                      2
                    </th>
                    <th className="py-3 px-2 text-center w-10 border-r border-slate-200">
                      3
                    </th>
                    <th className="py-3 px-4 w-72">
                      Catatan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentIndicator.fokusGroups.map(fg => (
                    <React.Fragment key={fg.id}>
                      {/* Sub-Header Row: Fokus Perilaku */}
                      <tr className="bg-slate-50/70">
                        <td
                          colSpan={6}
                          className="py-2.5 px-4 font-bold text-slate-800 text-xs border-y border-slate-200"
                        >
                          {fg.fokusJudul}
                        </td>
                      </tr>

                      {/* Items under this focus */}
                      {fg.items.map(item => {
                        const currentScore = itemScores[item.id];
                        const currentNote = itemNotes[item.id] || '';

                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-blue-50/20 transition-colors"
                          >
                            <td className="py-3 px-3 text-center font-medium text-slate-600 border-r border-slate-200">
                              {item.nomor}
                            </td>
                            <td className="py-3 px-4 text-slate-800 border-r border-slate-200 leading-relaxed font-normal">
                              {item.aktivitas}
                            </td>
                            <td className="py-3 px-2 text-center border-r border-slate-200">
                              <input
                                type="radio"
                                name={`score-${item.id}`}
                                checked={currentScore === 1}
                                onChange={() => handleScoreChange(item.id, 1)}
                                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                              />
                            </td>
                            <td className="py-3 px-2 text-center border-r border-slate-200">
                              <input
                                type="radio"
                                name={`score-${item.id}`}
                                checked={currentScore === 2}
                                onChange={() => handleScoreChange(item.id, 2)}
                                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                              />
                            </td>
                            <td className="py-3 px-2 text-center border-r border-slate-200">
                              <input
                                type="radio"
                                name={`score-${item.id}`}
                                checked={currentScore === 3}
                                onChange={() => handleScoreChange(item.id, 3)}
                                className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={currentNote}
                                onChange={e => handleNoteChange(item.id, e.target.value)}
                                placeholder="..."
                                className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-800"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section: Analisis & Kesimpulan matching image_86c7be98.png */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          {/* Header Row: Title on Left, Analisis AI on Right */}
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-base">
              Analisis &amp; Kesimpulan
            </h3>

            {/* Purple Analisis AI button matching screenshot */}
            <button
              type="button"
              onClick={handleAiAnalysis}
              disabled={isAiAnalyzing}
              className="inline-flex items-center gap-1.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Bot className="w-4 h-4" />
              <span>{isAiAnalyzing ? 'Menganalisis...' : 'Analisis AI'}</span>
            </button>
          </div>

          {/* Row 1: Kekuatan Guru & Area Perlu Dikembangkan (Kelemahan) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kekuatan Guru
              </label>
              <textarea
                rows={4}
                value={kekuatanGuru}
                onChange={e => setKekuatanGuru(e.target.value)}
                placeholder="Tuliskan aspek positif dan kekuatan yang ditunjukkan guru saat pembelajaran..."
                className="w-full p-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Area Perlu Dikembangkan (Kelemahan)
              </label>
              <textarea
                rows={4}
                value={areaPerluDikembangkan}
                onChange={e => setAreaPerluDikembangkan(e.target.value)}
                placeholder="Tuliskan catatan fokus perilaku yang masih perlu perbaikan dan pendampingan..."
                className="w-full p-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
              />
            </div>
          </div>

          {/* Row 2: Rekomendasi Tindak Lanjut (Full Width) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Rekomendasi Tindak Lanjut
            </label>
            <textarea
              rows={3}
              value={rekomendasiTindakLanjut}
              onChange={e => setRekomendasiTindakLanjut(e.target.value)}
              placeholder="Rekomendasi tindak lanjut, pelatihan mandiri PMM, atau pendampingan supervisor..."
              className="w-full p-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
            />
          </div>

          {/* Estimasi Skor Banner matching image_86c7be98.png */}
          <div className="bg-[#e0edfd] rounded-xl px-5 py-3.5 flex items-center justify-between">
            <div className="text-sm font-bold text-slate-800">
              Estimasi Skor: <span>{scorePercentage.toFixed(1)}%</span>
            </div>

            <div className={`px-4 py-1.5 rounded-full font-bold text-xs shadow-2xs ${badgeStyle}`}>
              {predikatBadge}
            </div>
          </div>

          {/* Action Button: Simpan Hasil Supervisi */}
          <div className="pt-2 flex items-center justify-end gap-3">
            {saveSuccessMessage && (
              <div className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-semibold bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-lg animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Hasil supervisi berhasil disimpan! Mengalihkan ke berkas...</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-[#1d4ed8] hover:bg-blue-800 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Hasil Supervisi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
