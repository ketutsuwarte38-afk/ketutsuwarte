import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  SchoolProfile,
  Teacher,
  Supervisor,
  SupervisionRecord,
  TeacherMonitoring5Weeks,
  RubrikObsItem
} from '../types/supervisi';
import { INSTRUMEN_INDIKATOR_LIST } from '../data/instrumentData';

/**
 * Draws official government Indonesian Kop Surat
 */
function drawOfficialKop(doc: jsPDF, school: SchoolProfile, startY: number = 10): number {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Government Hierarchy Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(20, 20, 20);
  doc.text(`PEMERINTAH PROVINSI ${(school.provinsi || 'LAMPUNG').toUpperCase()}`, pageWidth / 2, startY, { align: 'center' });

  doc.text('DINAS PENDIDIKAN DAN KEBUDAYAAN', pageWidth / 2, startY + 4.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`CABANG DINAS PENDIDIKAN WILAYAH VII • ${(school.kabupaten || 'TULANG BAWANG').toUpperCase()}`, pageWidth / 2, startY + 8.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(school.namaSekolah.toUpperCase(), pageWidth / 2, startY + 14, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`${school.alamat} • NPSN: ${school.npsn}`, pageWidth / 2, startY + 18, { align: 'center' });

  // Double border line
  const lineY = startY + 20.5;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.8);
  doc.line(14, lineY, pageWidth - 14, lineY);

  doc.setLineWidth(0.2);
  doc.line(14, lineY + 1, pageWidth - 14, lineY + 1);

  return lineY + 5;
}

/**
 * Generates and downloads the Official "Kartu Kontrol Monitoring 5 Minggu" PDF directly
 */
export function generateMonitoringPdf(
  monitoring: TeacherMonitoring5Weeks,
  teacher: Teacher | undefined,
  school: SchoolProfile,
  supervisors: Supervisor[]
): void {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const teacherName = teacher ? `${teacher.nama}, ${teacher.gelar}` : 'Guru';
  const supervisorName = school.namaSupervisor || supervisors[0]?.nama || 'Dr. Ketut Suwarte, M.Pd';
  const supervisorNip = school.nipSupervisor || supervisors[0]?.nip || '19750914 200212 1 003';

  // 1. KOP SURAT
  let currY = drawOfficialKop(doc, school, 10);

  // 2. JUDUL DOKUMEN
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('KARTU KONTROL TINDAK LANJUT SUPERVISI AKADEMIK', pageWidth / 2, currY + 2, { align: 'center' });

  doc.setFontSize(9);
  doc.text('PROGRAM MONITORING 5 MINGGU PASCA-SUPERVISI', pageWidth / 2, currY + 6.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Semester ${school.semester} • Tahun Pelajaran ${school.tahunAjaran}`, pageWidth / 2, currY + 10.5, { align: 'center' });

  currY += 14;

  // 3. IDENTITAS GURU & TARGET MONITORING (Tabel ringkas)
  const completedWeeks = monitoring.weeks.filter(w => w.status === 'selesai').length;
  const progressPercent = Math.round((completedWeeks / 5) * 100);

  autoTable(doc, {
    startY: currY,
    margin: { left: 14, right: 14 },
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 1.5, lineColor: [180, 180, 180], lineWidth: 0.1 },
    body: [
      [
        { content: 'Nama Guru', styles: { fontStyle: 'bold', fillColor: [248, 250, 252], cellWidth: 35 } },
        { content: `: ${teacherName}` },
        { content: 'Tanggal Mulai', styles: { fontStyle: 'bold', fillColor: [248, 250, 252], cellWidth: 35 } },
        { content: `: ${monitoring.tanggalMulai}` }
      ],
      [
        { content: 'NIP Guru', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: `: ${teacher?.nip || '-'}` },
        { content: 'Status Capaian', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: `: ${completedWeeks} dari 5 Pekan Tuntas (${progressPercent}%)` }
      ],
      [
        { content: 'Mata Pelajaran', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: `: ${teacher?.mapel || '-'}` },
        { content: 'Kelas / Ruang', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: `: ${teacher?.kelas || '-'}` }
      ],
      [
        { content: 'Fokus Target', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: `: ${monitoring.fokusPerbaikan}`, colSpan: 3 }
      ]
    ]
  });

  // @ts-expect-error - lastAutoTable injected by jspdf-autotable
  currY = doc.lastAutoTable.finalY + 4;

  // 4. TABEL 5 PEKAN MONITORING
  const tableData = monitoring.weeks.map(week => {
    const isDone = week.status === 'selesai';
    const isRunning = week.status === 'sedang_berjalan';
    const statusText = isDone ? 'Tuntas (V)' : isRunning ? 'Proses' : 'Belum';
    
    let catatanAndBukti = week.catatanSupervisor || '-';
    if (week.buktiKegiatan) {
      catatanAndBukti += `\n[Bukti: ${week.buktiKegiatan}]`;
    }

    return [
      `M-${week.mingguKe}`,
      week.judul.replace(`Minggu ${week.mingguKe}: `, ''),
      week.kegiatanTarget,
      week.tanggalTarget,
      week.tanggalRealisasi || '-',
      statusText,
      catatanAndBukti,
      isDone ? 'V' : ''
    ];
  });

  autoTable(doc, {
    startY: currY,
    margin: { left: 14, right: 14 },
    theme: 'grid',
    head: [[
      'Pekan',
      'Tahapan Kegiatan',
      'Target Capaian & Tindakan',
      'Target',
      'Realisasi',
      'Status',
      'Catatan Supervisor & Bukti',
      'Paraf'
    ]],
    body: tableData,
    headStyles: {
      fillColor: [230, 238, 248],
      textColor: [15, 23, 42],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center',
      lineColor: [0, 0, 0],
      lineWidth: 0.2
    },
    bodyStyles: {
      fontSize: 7.2,
      textColor: [30, 41, 59],
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
      cellPadding: 1.8
    },
    columnStyles: {
      0: { halign: 'center', fontStyle: 'bold', cellWidth: 12 },
      1: { fontStyle: 'bold', cellWidth: 34 },
      2: { cellWidth: 46 },
      3: { halign: 'center', cellWidth: 18 },
      4: { halign: 'center', cellWidth: 18 },
      5: { halign: 'center', fontStyle: 'bold', cellWidth: 16 },
      6: { cellWidth: 26 },
      7: { halign: 'center', fontStyle: 'bold', cellWidth: 12 }
    }
  });

  // @ts-expect-error - lastAutoTable injected by jspdf-autotable
  currY = doc.lastAutoTable.finalY + 4;

  // 5. EVALUASI AKHIR BOX
  autoTable(doc, {
    startY: currY,
    margin: { left: 14, right: 14 },
    theme: 'grid',
    styles: { lineColor: [0, 0, 0], lineWidth: 0.2 },
    body: [
      [
        {
          content: `CATATAN EVALUASI AKHIR SIKLUS PENDAMPINGAN:\n"${monitoring.evaluasiAkhir || 'Guru menunjukkan komitmen perbaikan yang positif. Terdapat peningkatan keaktifan peserta didik dan pengelolaan pembelajaran di kelas.'}"`,
          styles: { fontSize: 7.5, fontStyle: 'italic', cellPadding: 2.5, fillColor: [250, 250, 250] }
        }
      ]
    ]
  });

  // @ts-expect-error - lastAutoTable injected by jspdf-autotable
  currY = doc.lastAutoTable.finalY + 6;

  // 6. TANDA TANGAN (Guru, Supervisor, Mengetahui Kepala Sekolah)
  // Ensure we don't overflow the page
  if (currY + 45 > pageHeight) {
    doc.addPage();
    currY = 20;
  }

  const colWidth = (pageWidth - 28) / 2;

  // Signatures Row 1
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  // Left: Guru
  doc.text('Guru yang Didampingi,', 14 + colWidth / 2, currY, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.text(teacherName, 14 + colWidth / 2, currY + 18, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`NIP. ${teacher?.nip || '................................'}`, 14 + colWidth / 2, currY + 22, { align: 'center' });

  // Right: Supervisor
  const dateStr = `${school.kabupaten}, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  doc.text(dateStr, 14 + colWidth + colWidth / 2, currY - 4, { align: 'center' });
  doc.text('Supervisor / Guru Pendamping,', 14 + colWidth + colWidth / 2, currY, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.text(supervisorName, 14 + colWidth + colWidth / 2, currY + 18, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`NIP. ${supervisorNip}`, 14 + colWidth + colWidth / 2, currY + 22, { align: 'center' });

  // Signatures Row 2: Kepala Sekolah
  const kepsekY = currY + 26;
  doc.text('Mengetahui,', pageWidth / 2, kepsekY, { align: 'center' });
  doc.text(`Kepala ${school.namaSekolah}`, pageWidth / 2, kepsekY + 4, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.text(school.kepalaSekolah, pageWidth / 2, kepsekY + 20, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`NIP. ${school.nipKepsek}`, pageWidth / 2, kepsekY + 24, { align: 'center' });

  // Download PDF directly!
  const safeFileName = `Kartu_Monitoring_5_Minggu_${teacherName.replace(/[\s,.]+/g, '_')}_${monitoring.tanggalMulai}.pdf`;
  doc.save(safeFileName);
}

/**
 * Generates and downloads the Official Rubrik Supervisi / Berita Acara / Instrumen Lengkap PDF directly
 */
export function generateSupervisiRubrikPdf(
  record: SupervisionRecord,
  teacher: Teacher | undefined,
  school: SchoolProfile,
  supervisors: Supervisor[],
  docType: 'rubrik' | 'berita_acara' | 'lengkap' = 'rubrik'
): void {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const teacherName = teacher ? `${teacher.nama}, ${teacher.gelar}` : (record.tandaTanganGuru || 'Guru');
  const supervisorName = school.namaSupervisor || record.supervisorNama || supervisors[0]?.nama || 'Dr. Ketut Suwarte, M.Pd';
  const supervisorNip = school.nipSupervisor || supervisors[0]?.nip || '19750914 200212 1 003';

  // 1. KOP SURAT
  let currY = drawOfficialKop(doc, school, 10);

  // 2. JUDUL DOKUMEN
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  
  if (docType === 'berita_acara') {
    doc.text('BERITA ACARA PELAKSANAAN SUPERVISI AKADEMIK', pageWidth / 2, currY + 2, { align: 'center' });
  } else if (docType === 'lengkap') {
    doc.text('INSTRUMEN LENGKAP & BERITA ACARA SUPERVISI AKADEMIK', pageWidth / 2, currY + 2, { align: 'center' });
  } else {
    doc.text('RUBRIK PENILAIAN OBSERVASI KINERJA GURU (SUPERVISI AKADEMIK)', pageWidth / 2, currY + 2, { align: 'center' });
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Semester ${school.semester} • Tahun Pelajaran ${school.tahunAjaran}`, pageWidth / 2, currY + 6.5, { align: 'center' });

  currY += 10;

  // 3. IDENTITAS OBSERVASI
  autoTable(doc, {
    startY: currY,
    margin: { left: 14, right: 14 },
    theme: 'grid',
    styles: { fontSize: 7.8, cellPadding: 1.5, lineColor: [180, 180, 180], lineWidth: 0.1 },
    body: [
      [
        { content: 'Nama Guru', styles: { fontStyle: 'bold', fillColor: [248, 250, 252], cellWidth: 34 } },
        { content: `: ${teacherName}` },
        { content: 'Hari / Tanggal', styles: { fontStyle: 'bold', fillColor: [248, 250, 252], cellWidth: 34 } },
        { content: `: ${record.tanggal}` }
      ],
      [
        { content: 'NIP Guru', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: `: ${teacher?.nip || '-'}` },
        { content: 'Jam Ke / Waktu', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: `: ${record.jamKe || '08.00 - 09.30 WIB'}` }
      ],
      [
        { content: 'Mata Pelajaran', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: `: ${record.mapel || teacher?.mapel || '-'}` },
        { content: 'Kelas / Fase', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: `: ${record.kelas || teacher?.kelas || '-'} (${record.fase || 'Fase E'})` }
      ],
      [
        { content: 'Materi Pokok', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: `: ${record.materiPokok || 'Pembelajaran Aktif Terdeferensiasi'}` },
        { content: 'Supervisor', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: `: ${supervisorName}` }
      ],
      [
        { content: 'Fokus Indikator', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: `: ${record.indikatorNama || 'Keteraturan Suasana Kelas'}`, colSpan: 3 }
      ]
    ]
  });

  // @ts-expect-error - lastAutoTable injected by jspdf-autotable
  currY = doc.lastAutoTable.finalY + 4;

  // 4. RUBRIK OBSERVASI TABLE (For 'rubrik' and 'lengkap')
  if (docType === 'rubrik' || docType === 'lengkap') {
    // Construct items from INSTRUMEN_INDIKATOR_LIST
    const indicator =
      INSTRUMEN_INDIKATOR_LIST.find(ind => ind.nama === record.indikatorNama) ||
      INSTRUMEN_INDIKATOR_LIST[0];

    const rubrikRows: any[] = [];
    let noCounter = 1;

    indicator.fokusGroups.forEach((fg) => {
      // Group Header Row
      rubrikRows.push([
        {
          content: `${fg.fokusJudul}`,
          colSpan: 6,
          styles: { fontStyle: 'bold', fillColor: [238, 242, 255], textColor: [30, 58, 138] }
        }
      ]);

      fg.items.forEach((it) => {
        const existing = record.rubrikObsItems?.find(r => r.id === it.id);
        const score = existing?.skor ?? (it.nomor === 3 ? 1 : 3);
        const note = existing?.catatan ?? (score === 3 ? 'Terlaksana konsisten & efektif' : score === 2 ? 'Cukup efektif, perlu pembiasaan' : 'Belum tampak');

        rubrikRows.push([
          noCounter++,
          it.aktivitas,
          score === 1 ? 'V' : '',
          score === 2 ? 'V' : '',
          score === 3 ? 'V' : '',
          note
        ]);
      });
    });

    autoTable(doc, {
      startY: currY,
      margin: { left: 14, right: 14 },
      theme: 'grid',
      head: [[
        { content: 'No', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
        { content: 'Fokus Perilaku & Aktivitas yang Diobservasi', rowSpan: 2, styles: { valign: 'middle' } },
        { content: 'Hasil Penilaian Observasi', colSpan: 3, styles: { halign: 'center' } },
        { content: 'Catatan Bukti Konkret & Pembiasaan', rowSpan: 2, styles: { valign: 'middle' } }
      ], [
        { content: 'Belum\n(1)', styles: { halign: 'center' } },
        { content: 'Sebagian\n(2)', styles: { halign: 'center' } },
        { content: 'Efektif\n(3)', styles: { halign: 'center' } }
      ]],
      body: rubrikRows,
      headStyles: {
        fillColor: [230, 238, 248],
        textColor: [15, 23, 42],
        fontStyle: 'bold',
        fontSize: 7.2,
        lineColor: [0, 0, 0],
        lineWidth: 0.2
      },
      bodyStyles: {
        fontSize: 7.2,
        textColor: [30, 41, 59],
        lineColor: [0, 0, 0],
        lineWidth: 0.2,
        cellPadding: 1.8
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 8 },
        1: { cellWidth: 72 },
        2: { halign: 'center', fontStyle: 'bold', cellWidth: 14 },
        3: { halign: 'center', fontStyle: 'bold', cellWidth: 14 },
        4: { halign: 'center', fontStyle: 'bold', cellWidth: 14 },
        5: { cellWidth: 60 }
      }
    });

    // @ts-expect-error - lastAutoTable injected by jspdf-autotable
    currY = doc.lastAutoTable.finalY + 4;
  }

  // 5. SKOR AKHIR & PREDIKAT
  const scorePercent = record.estimasiSkorPercent ?? record.nilaiAkhir;
  autoTable(doc, {
    startY: currY,
    margin: { left: 14, right: 14 },
    theme: 'grid',
    styles: { lineColor: [0, 0, 0], lineWidth: 0.2 },
    body: [
      [
        { content: 'Skor Perencanaan Modul', styles: { fontStyle: 'bold', fillColor: [248, 250, 252], cellWidth: 45 } },
        { content: `${record.skorPerencanaan} / 100` },
        { content: 'Nilai Akhir Supervisi', styles: { fontStyle: 'bold', fillColor: [248, 250, 252], cellWidth: 45 } },
        { content: `${scorePercent}%`, styles: { fontStyle: 'bold', textColor: [22, 101, 52] } }
      ],
      [
        { content: 'Skor Observasi Praktik', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: `${record.skorObservasi} / 100` },
        { content: 'Predikat Kategori', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
        { content: `${record.predikat}`, styles: { fontStyle: 'bold', textColor: [30, 58, 138] } }
      ]
    ]
  });

  // @ts-expect-error - lastAutoTable injected by jspdf-autotable
  currY = doc.lastAutoTable.finalY + 4;

  // 6. CATATAN KUALITATIF & TINDAK LANJUT
  if (docType === 'berita_acara' || docType === 'lengkap') {
    autoTable(doc, {
      startY: currY,
      margin: { left: 14, right: 14 },
      theme: 'grid',
      styles: { fontSize: 7.5, lineColor: [0, 0, 0], lineWidth: 0.2, cellPadding: 2 },
      body: [
        [
          { content: 'Kekuatan & Kelebihan Guru:', styles: { fontStyle: 'bold', fillColor: [240, 253, 244], cellWidth: 50 } },
          { content: record.kekuatanGuru || 'Penyampaian materi runtut, penguasaan kelas kondusif dan interaksi positif dengan murid terjalin sangat baik.' }
        ],
        [
          { content: 'Aspek Perlu Ditingkatkan:', styles: { fontStyle: 'bold', fillColor: [254, 252, 232] } },
          { content: record.aspekPerluDitingkatkan || 'Perbanyak variasi diferensiasi produk dan umpan balik langsung saat diskusi kelompok.' }
        ],
        [
          { content: 'Rekomendasi Tindak Lanjut:', styles: { fontStyle: 'bold', fillColor: [238, 242, 255] } },
          { content: record.rekomendasiTindakLanjut || 'Mengikuti pendampingan klinis 5 minggu dan berbagi praktik baik di Komunitas Belajar (Kombel) sekolah.' }
        ],
        [
          { content: 'Rencana Aksi & Target Waktu:', styles: { fontStyle: 'bold', fillColor: [248, 250, 252] } },
          { content: `${record.rencanaAksiGuru || 'Revisi modul ajar berdiferensiasi dan dokumentasi portofolio murid'} (Target: ${record.targetWaktuTindakLanjut || '4 Pekan'})` }
        ]
      ]
    });

    // @ts-expect-error - lastAutoTable injected by jspdf-autotable
    currY = doc.lastAutoTable.finalY + 5;
  }

  // 7. SIGNATURES
  if (currY + 45 > pageHeight) {
    doc.addPage();
    currY = 20;
  }

  const colWidth = (pageWidth - 28) / 2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  // Left: Guru
  doc.text('Guru yang Disupervisi,', 14 + colWidth / 2, currY, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.text(teacherName, 14 + colWidth / 2, currY + 18, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`NIP. ${teacher?.nip || '................................'}`, 14 + colWidth / 2, currY + 22, { align: 'center' });

  // Right: Supervisor
  const dateStr = `${school.kabupaten}, ${record.tanggal || new Date().toLocaleDateString('id-ID')}`;
  doc.text(dateStr, 14 + colWidth + colWidth / 2, currY - 4, { align: 'center' });
  doc.text('Supervisor / Penilai,', 14 + colWidth + colWidth / 2, currY, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.text(supervisorName, 14 + colWidth + colWidth / 2, currY + 18, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`NIP. ${supervisorNip}`, 14 + colWidth + colWidth / 2, currY + 22, { align: 'center' });

  // Center: Kepala Sekolah
  const kepsekY = currY + 26;
  doc.text('Mengetahui,', pageWidth / 2, kepsekY, { align: 'center' });
  doc.text(`Kepala ${school.namaSekolah}`, pageWidth / 2, kepsekY + 4, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.text(school.kepalaSekolah, pageWidth / 2, kepsekY + 20, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`NIP. ${school.nipKepsek}`, pageWidth / 2, kepsekY + 24, { align: 'center' });

  // Download directly!
  const prefix = docType === 'berita_acara' ? 'Berita_Acara_Supervisi' : docType === 'lengkap' ? 'Instrumen_Lengkap_Supervisi' : 'Rubrik_Supervisi_Observasi';
  const fileName = `${prefix}_${teacherName.replace(/[\s,.]+/g, '_')}_${record.tanggal}.pdf`;
  doc.save(fileName);
}

/**
 * Generates and downloads the Official Rekapitulasi Supervisi PDF
 */
export function generateRekapitulasiPdf(
  teachers: Teacher[],
  supervisions: SupervisionRecord[],
  school: SchoolProfile
): void {
  const doc = new jsPDF({
    orientation: 'l', // Landscape for wide tables
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // KOP SURAT
  let currY = drawOfficialKop(doc, school, 10);

  // JUDUL
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('REKAPITULASI HASIL SUPERVISI AKADEMIK GURU', pageWidth / 2, currY + 2, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Semester ${school.semester} • Tahun Pelajaran ${school.tahunAjaran}`, pageWidth / 2, currY + 6.5, { align: 'center' });

  currY += 10;

  // TABEL REKAP GURU
  const tableData = teachers.map((teacher, index) => {
    const sup = supervisions.find(s => s.teacherId === teacher.id);
    const scoreVal = sup?.estimasiSkorPercent ?? sup?.nilaiAkhir ?? teacher.skorTerakhir ?? '-';
    const predikatVal = sup?.predikat ?? teacher.predikat ?? 'Belum Disupervisi';
    const statusVal = teacher.statusSupervisi === 'selesai' ? 'Tuntas' : teacher.statusSupervisi === 'dalam_monitoring' ? 'Monitoring 5M' : 'Belum';

    return [
      (index + 1).toString(),
      `${teacher.nama}, ${teacher.gelar}`,
      teacher.nip,
      teacher.mapel,
      teacher.kelas,
      sup?.tanggal || teacher.tanggalSupervisi || '-',
      sup ? `${sup.skorPerencanaan}` : '-',
      sup ? `${sup.skorObservasi}` : '-',
      typeof scoreVal === 'number' ? `${scoreVal}%` : scoreVal,
      predikatVal,
      statusVal
    ];
  });

  autoTable(doc, {
    startY: currY,
    margin: { left: 14, right: 14 },
    theme: 'grid',
    head: [[
      'No',
      'Nama Guru',
      'NIP',
      'Mata Pelajaran',
      'Kelas',
      'Tanggal',
      'Perencanaan',
      'Observasi',
      'Nilai Akhir',
      'Predikat',
      'Status'
    ]],
    body: tableData,
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
      lineColor: [0, 0, 0],
      lineWidth: 0.1
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
      cellPadding: 2
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { fontStyle: 'bold', cellWidth: 42 },
      2: { cellWidth: 32 },
      3: { cellWidth: 30 },
      4: { cellWidth: 20 },
      5: { halign: 'center', cellWidth: 22 },
      6: { halign: 'center', cellWidth: 20 },
      7: { halign: 'center', cellWidth: 20 },
      8: { halign: 'center', fontStyle: 'bold', cellWidth: 22 },
      9: { halign: 'center', fontStyle: 'bold', cellWidth: 26 },
      10: { halign: 'center', cellWidth: 24 }
    }
  });

  // @ts-expect-error - lastAutoTable injected by jspdf-autotable
  currY = doc.lastAutoTable.finalY + 8;

  // SIGNATURE
  if (currY + 30 > pageHeight) {
    doc.addPage();
    currY = 20;
  }

  const signX = pageWidth - 70;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`${school.kabupaten}, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, signX, currY);
  doc.text(`Kepala ${school.namaSekolah},`, signX, currY + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.text(school.kepalaSekolah, signX, currY + 20);
  doc.setFont('helvetica', 'normal');
  doc.text(`NIP. ${school.nipKepsek}`, signX, currY + 24);

  doc.save(`Rekapitulasi_Supervisi_Guru_${school.semester}_TP_${school.tahunAjaran.replace(/\//g, '-')}.pdf`);
}
