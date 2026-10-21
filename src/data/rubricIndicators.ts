import { IndicatorItem, PlanningItem } from '../types/supervisi';

export const DEFAULT_PLANNING_ITEMS: PlanningItem[] = [
  {
    id: 'plan-1',
    nomor: 1,
    komponen: 'Kesesuaian Capaian & Tujuan Pembelajaran (CP & TP)',
    deskripsi: 'Tujuan pembelajaran memuat kompetensi, lingkup materi bermakna, dan selaras dengan karakteristik murid serta kurikulum operasional sekolah.',
    skor: 4,
    catatan: 'Tujuan pembelajaran sangat jelas dan terukur dengan alur yang runut.'
  },
  {
    id: 'plan-2',
    nomor: 2,
    komponen: 'Rancangan Asesmen Awal & Diagnostik',
    deskripsi: 'Memuat rencana asesmen awal kognitif maupun non-kognitif untuk mengetahui kesiapan, minat, atau profil belajar murid sebelum kegiatan inti.',
    skor: 3,
    catatan: 'Terdapat tes diagnostik singkat namun perlu rubrik diferensiasi lanjutan.'
  },
  {
    id: 'plan-3',
    nomor: 3,
    komponen: 'Desain Pengalaman Belajar Berdiferensiasi',
    deskripsi: 'Menyediakan variasi proses, konten, atau produk sesuai kebutuhan dan gaya belajar murid di kelas kejuruan/akademik.',
    skor: 3,
    catatan: 'Variasi kelompok kerja sudah ada, lembar kerja siswa memfasilitasi kecepatan belajar berbeda.'
  },
  {
    id: 'plan-4',
    nomor: 4,
    komponen: 'Media Pembelajaran, LKPD & Sumber Belajar Digital/Nyata',
    deskripsi: 'Penggunaan sarana praktek, media interaktif, tayangan audiovisual atau platform digital yang relevan dengan materi SMK/pembelajaran.',
    skor: 4,
    catatan: 'Media modul dan video tutorial sangat relevan dengan praktik kejuruan.'
  },
  {
    id: 'plan-5',
    nomor: 5,
    komponen: 'Rancangan Asesmen Formatif & Sumatif Berserta Rubrik',
    deskripsi: 'Instrumen penilaian kinerja, rubrik pengamatan sikap dan pemahaman yang jelas serta kriteria ketercapaian tujuan pembelajaran (KKTP).',
    skor: 3,
    catatan: 'Rubrik penilaian kinerja praktik lengkap dengan skala penskoran.'
  }
];

export const DEFAULT_PMM_INDICATORS: IndicatorItem[] = [
  {
    id: 'ind-1',
    nomor: 1,
    nama: 'Keteraturan Suasana Kelas',
    definisi: 'Upaya membangun suasana kelas yang kondusif untuk proses belajar, dengan minimal gangguan yang mengalihkan perhatian peserta didik dari aktivitas belajar.',
    fokusPerilaku: [
      'Guru melakukan komunikasi positif untuk membangun suasana kelas kondusif',
      'Guru melakukan pengelompokan peserta didik secara adil dan interaktif',
      'Guru membuat dan menyepakati aturan/kesepakatan kelas bersama'
    ],
    perilakuDianjurkan: [
      'Menyapa peserta didik dengan hangat dan membangkitkan motivasi',
      'Mengingatkan kesepakatan kelas secara tenang dan solutif',
      'Mengajak murid aktif terlibat menjaga ketenangan suasana belajar'
    ],
    perilakuDihindari: [
      'Membiarkan peserta didik membuat kegaduhan tanpa tindakan edukatif',
      'Menggunakan intonasi tinggi atau nada menghakimi murid',
      'Memberikan hukuman fisik atau mempermalukan peserta didik di depan kelas'
    ],
    skor: 4,
    catatanBukti: 'Guru menyapa hangat, mengulang kesepakatan kelas, dan membagi kelompok praktikum dengan tertib.'
  },
  {
    id: 'ind-2',
    nomor: 2,
    nama: 'Penerapan Disiplin Positif',
    definisi: 'Upaya menerapkan prinsip-prinsip disiplin positif untuk mengelola perilaku peserta didik tanpa hukuman yang merugikan atau hadiah yang manipulatif.',
    fokusPerilaku: [
      'Guru melakukan refleksi dinamika kelas mengacu pada kesepakatan kelas',
      'Guru memfasilitasi peserta didik menyadari konsekuensi perilakunya (segitiga restitusi)',
      'Guru membantu murid menemukan solusi atas permasalahan perilakunya'
    ],
    perilakuDianjurkan: [
      'Mengajak murid berdiskusi mengapa aturan itu penting bagi diri dan bersama',
      'Memberikan kesempatan murid memperbaiki kesalahan tanpa merasa dihakimi',
      'Mendengarkan sudut pandang murid sebelum merespon tindakan indispliner'
    ],
    perilakuDihindari: [
      'Mengancam dengan pengurangan nilai atau sanksi memberatkan di luar konteks',
      'Mengabaikan pelanggaran kesepakatan kelas tanpa tindak lanjut reflektif',
      'Memberikan label negatif (misal: "pemalas", "pembangkang") kepada peserta didik'
    ],
    skor: 3,
    catatanBukti: 'Pendekatan restitusi diterapkan ketika ada siswa terlambat kembali dari istirahat laboratorium.'
  },
  {
    id: 'ind-3',
    nomor: 3,
    nama: 'Ekspektasi pada Peserta Didik',
    definisi: 'Upaya mengomunikasikan ekspektasi yang tinggi namun realistis terhadap kemampuan belajar dan potensi setiap peserta didik.',
    fokusPerilaku: [
      'Guru mengomunikasikan keyakinan bahwa semua murid mampu mencapai tujuan pembelajaran',
      'Guru memberikan tantangan yang bermakna sesuai kapasitas murid',
      'Guru menegaskan pentingnya proses kerja keras dan kegigihan (growth mindset)'
    ],
    perilakuDianjurkan: [
      'Menyampaikan "Kalian pasti bisa menyelesaikan proyek ini langkah demi langkah"',
      'Memberikan afirmasi kemajuan belajar sekecil apapun',
      'Mendorong murid tidak mudah menyerah saat mengalami kendala teknis'
    ],
    perilakuDihindari: [
      'Menunjukkan keraguan pada kemampuan murid kelompok tertentu',
      'Hanya memuji murid yang cepat memahami materi',
      'Menurunkan standar tantangan terlalu drastis tanpa bimbingan bertahap'
    ],
    skor: 4,
    catatanBukti: 'Guru memberikan motivasi standar industri kejuruan dan meyakinkan murid mampu menguasai SOP.'
  },
  {
    id: 'ind-4',
    nomor: 4,
    nama: 'Perhatian dan Kepedulian',
    definisi: 'Upaya memberikan perhatian tulus kepada kondisi emosional, kebutuhan belajar, dan kendala yang dihadapi peserta didik.',
    fokusPerilaku: [
      'Guru menunjukkan empati terhadap kondisi dan perasaan murid',
      'Guru peka terhadap kebutuhan khusus atau murid yang tampak kesulitan',
      'Guru menghargai keunikan latar belakang dan minat tiap peserta didik'
    ],
    perilakuDianjurkan: [
      'Menghampiri murid yang tampak pasif dan menanyakan kesulitannya dengan ramah',
      'Memvalidasi perasaan lelah atau bingung sebelum mengarahkan fokus kembali',
      'Memberikan ruang konsultasi santai seputar materi'
    ],
    perilakuDihindari: [
      'Mengabaikan murid yang tertinggal di barisan belakang',
      'Menganggap remeh keluhan murid terkait beban belajar',
      'Menunjukkan sikap pilih kasih kepada murid berprestasi saja'
    ],
    skor: 3,
    catatanBukti: 'Guru berkeliling ke meja praktek memeriksa pemahaman murid satu per satu.'
  },
  {
    id: 'ind-5',
    nomor: 5,
    nama: 'Umpan Balik Konstruktif',
    definisi: 'Upaya memberikan umpan balik yang spesifik, tepat waktu, dan berorientasi pada perbaikan kinerja serta proses berpikir murid.',
    fokusPerilaku: [
      'Guru memberi umpan balik spesifik pada hasil kerja murid (bukan sekadar "bagus")',
      'Guru menjelaskan letak kelebihan dan bagian yang perlu diperbaiki',
      'Guru membimbing murid merencanakan langkah perbaikan berikutnya'
    ],
    perilakuDianjurkan: [
      'Menyebutkan indikator capaian konkret: "Langkah kedua sudah tepat, perhatikan toleransi ukurannya"',
      'Memberikan pertanyaan pemantik agar murid menyadari kekeliruannya sendiri',
      'Memberikan kesempatan revisi setelah umpan balik disampaikan'
    ],
    perilakuDihindari: [
      'Hanya memberi tanda silang atau kata "salah" tanpa penjelasan konstruktif',
      'Memberikan kritik yang menjatuhkan rasa percaya diri murid',
      'Menunda pemberian umpan balik hingga waktu yang sangat lama'
    ],
    skor: 4,
    catatanBukti: 'Umpan balik langsung diberikan saat praktek berlangsung dengan rubrik ceklist yang transparan.'
  },
  {
    id: 'ind-6',
    nomor: 6,
    nama: 'Instruksi yang Adaptif',
    definisi: 'Upaya menyesuaikan strategi pembelajaran, kecepatan, dan materi berdasarkan respons serta tingkat pemahaman aktual murid di kelas.',
    fokusPerilaku: [
      'Guru melakukan pengecekan pemahaman secara berkala di tengah pembelajaran',
      'Guru merespon keraguan murid dengan penjelasan alternatif yang lebih sederhana',
      'Guru menyesuaikan ritme pembelajaran agar tidak meninggalkan murid yang lambat'
    ],
    perilakuDianjurkan: [
      'Menggunakan analogi kehidupan nyata saat murid tampak bingung dengan konsep teori',
      'Mengubah aktivitas dari ceramah ke simulasi saat murid mulai jenuh',
      'Memberi waktu tambahan bagi kelompok yang membutuhkan bimbingan intensif'
    ],
    perilakuDihindari: [
      'Tetap mengebut materi meskipun sebagian besar murid belum paham',
      'Mengabaikan pertanyaan murid dengan dalih waktu terbatas',
      'Menggunakan satu metode monolog secara kaku tanpa variasi'
    ],
    skor: 3,
    catatanBukti: 'Guru memodifikasi kecepatan demonstrasi alat ketika beberapa murid meminta pengulangan langkah.'
  },
  {
    id: 'ind-7',
    nomor: 7,
    nama: 'Aktivitas Interaktif',
    definisi: 'Upaya memfasilitasi interaksi kolaboratif antar-peserta didik dan antara guru dengan peserta didik yang mendorong pemikiran kritis dan kreatif.',
    fokusPerilaku: [
      'Guru memantik diskusi kelompok dengan pertanyaan terbuka bermutu',
      'Guru memberi peran aktif kepada setiap anggota kelompok',
      'Guru memfasilitasi saling bertukar masukan antar-kelompok (peer assessment)'
    ],
    perilakuDianjurkan: [
      'Mengajak murid mempresentasikan ide inovatif di depan teman-temannya',
      'Menggunakan teknik gallery walk, debat terstruktur, atau studi kasus nyata',
      'Memastikan setiap murid berkontribusi dalam produk tim'
    ],
    perilakuDihindari: [
      'Guru mendominasi lebih dari 80% waktu pembelajaran dengan ceramah satu arah',
      'Membiarkan kelompok kerja dikerjakan hanya oleh satu murid yang pintar',
      'Tidak memberikan ruang bagi murid untuk mengajukan tanggapan kritis'
    ],
    skor: 4,
    catatanBukti: 'Diskusi kelompok studi kasus industri berjalan sangat hidup dengan presentasi per tim.'
  },
  {
    id: 'ind-8',
    nomor: 8,
    nama: 'Instruksi Pembelajaran',
    definisi: 'Upaya menyampaikan penjelasan konsep, materi, dan arahan tugas secara terstruktur, runtut, jelas, dan mudah dipahami oleh seluruh peserta didik.',
    fokusPerilaku: [
      'Guru menyampaikan tujuan, alur kegiatan, dan kriteria keberhasilan dengan runtut',
      'Guru menjelaskan konsep dasar dengan bahasa komunikatif dan visual jelas',
      'Guru merangkum inti materi dan mengaitkannya dengan pertemuan berikutnya'
    ],
    perilakuDianjurkan: [
      'Membuat peta konsep di papan tulis / proyektor sebelum masuk ke materi teknis',
      'Memberi instruksi tugas langkah demi langkah disertai lembar kerja panduan',
      'Menyimpulkan bersama peserta didik poin-poin utama pembelajaran hari itu'
    ],
    perilakuDihindari: [
      'Memberikan tugas tanpa kriteria penilaian yang jelas',
      'Menyampaikan instruksi yang berbelit-belit dan membingungkan peserta didik',
      'Mengakhiri kelas secara terburu-buru tanpa refleksi atau rangkuman'
    ],
    skor: 3,
    catatanBukti: 'Penyampaian SOP praktikum sangat terstruktur dan dipahami dengan baik oleh peserta didik.'
  }
];
