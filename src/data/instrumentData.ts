export interface SubActivityItem {
  id: string;
  nomor: number;
  aktivitas: string;
}

export interface FocusGroup {
  id: string;
  fokusJudul: string;
  items: SubActivityItem[];
}

export interface IndicatorData {
  id: string;
  nama: string;
  fokusGroups: FocusGroup[];
}

export const INSTRUMEN_INDIKATOR_LIST: IndicatorData[] = [
  {
    id: 'keteraturan_suasana_kelas',
    nama: 'Keteraturan suasana kelas',
    fokusGroups: [
      {
        id: 'fokus-1',
        fokusJudul: 'Fokus: Guru melakukan komunikasi positif untuk membangun suasana kelas yang kondusif',
        items: [
          {
            id: 'item-1-1',
            nomor: 1,
            aktivitas: 'Guru memanggil murid dengan menyebut namanya'
          },
          {
            id: 'item-1-2',
            nomor: 2,
            aktivitas: 'Guru menyampaikan harapan positif terhadap kelas'
          },
          {
            id: 'item-1-3',
            nomor: 3,
            aktivitas: 'Guru melakukan aktivitas yang mencairkan suasana kelas'
          }
        ]
      },
      {
        id: 'fokus-2',
        fokusJudul: 'Fokus: Guru melakukan strategi pengelompokkan untuk mengaktifkan keterlibatan murid',
        items: [
          {
            id: 'item-2-1',
            nomor: 1,
            aktivitas: 'Guru mengelompokkan murid dengan menyampaikan tujuannya pada murid'
          },
          {
            id: 'item-2-2',
            nomor: 2,
            aktivitas: 'Guru menyediakan beragam peran dalam kelompok agar semua anggota terlibat aktif'
          },
          {
            id: 'item-2-3',
            nomor: 3,
            aktivitas: 'Guru mengajak murid untuk berinteraksi dan berperan aktif dalam kelompok'
          }
        ]
      },
      {
        id: 'fokus-3',
        fokusJudul: 'Fokus: Guru membuat dan mengingatkan aturan/kesepakatan kelas',
        items: [
          {
            id: 'item-3-1',
            nomor: 1,
            aktivitas: 'Guru membuat aturan/kesepakatan kelas yang disetujui semua murid dan ditempel di kelas'
          },
          {
            id: 'item-3-2',
            nomor: 2,
            aktivitas: 'Guru mengajak murid untuk mengingat aturan/kesepakatan kelas yang telah disepakati'
          },
          {
            id: 'item-3-3',
            nomor: 3,
            aktivitas: 'Guru mengajak murid menilai seberapa efektif pelaksanaan aturan/kesepakatan kelas'
          }
        ]
      }
    ]
  },
  {
    id: 'penerapan_disiplin_positif',
    nama: 'Penerapan disiplin positif',
    fokusGroups: [
      {
        id: 'fokus-dp-1',
        fokusJudul: 'Fokus: Guru melakukan refleksi dinamika kelas mengacu kesepakatan kelas',
        items: [
          {
            id: 'dp-1-1',
            nomor: 1,
            aktivitas: 'Guru mengajak murid melakukan refleksi dinamika kelas mengacu kesepakatan kelas'
          },
          {
            id: 'dp-1-2',
            nomor: 2,
            aktivitas: 'Guru menunjukkan kesediaan mendengarkan pandangan murid tentang dinamika kelas'
          },
          {
            id: 'dp-1-3',
            nomor: 3,
            aktivitas: 'Guru bersikap adaptif sehingga bersedia mengubah kesepakatan kelas bila diperlukan'
          }
        ]
      },
      {
        id: 'fokus-dp-2',
        fokusJudul: 'Fokus: Guru memfasilitasi murid menyadari konsekuensi dan memperbaiki perilaku (restitusi)',
        items: [
          {
            id: 'dp-2-1',
            nomor: 1,
            aktivitas: 'Guru membantu murid menyadari konsekuensi dari perilaku melanggarnya'
          },
          {
            id: 'dp-2-2',
            nomor: 2,
            aktivitas: 'Guru mendengarkan sudut pandang murid terhadap perilaku melanggarnya'
          },
          {
            id: 'dp-2-3',
            nomor: 3,
            aktivitas: 'Guru memberikan dukungan pada murid dalam melakukan perbaikan perilakunya'
          }
        ]
      },
      {
        id: 'fokus-dp-3',
        fokusJudul: 'Fokus: Guru memfasilitasi murid merefleksikan nilai dan keyakinan kelas',
        items: [
          {
            id: 'dp-3-1',
            nomor: 1,
            aktivitas: 'Guru mengajak murid merefleksikan keyakinan kelas yang mendasari perilakunya'
          },
          {
            id: 'dp-3-2',
            nomor: 2,
            aktivitas: 'Guru memandu murid menemukan alasan internal untuk berperilaku positif'
          },
          {
            id: 'dp-3-3',
            nomor: 3,
            aktivitas: 'Guru mengonfirmasi komitmen murid dalam menerapkan keyakinan kelas'
          }
        ]
      }
    ]
  },
  {
    id: 'ekspektasi_pada_peserta_didik',
    nama: 'Ekspektasi pada peserta didik',
    fokusGroups: [
      {
        id: 'fokus-epd-1',
        fokusJudul: 'Fokus: Guru mengomunikasikan ekspektasi tinggi terhadap kemampuan semua murid',
        items: [
          {
            id: 'epd-1-1',
            nomor: 1,
            aktivitas: 'Guru menyampaikan keyakinan bahwa semua murid dapat mencapai tujuan belajar'
          },
          {
            id: 'epd-1-2',
            nomor: 2,
            aktivitas: 'Guru memberi dorongan verbal yang memotivasi murid untuk gigih berusaha'
          },
          {
            id: 'epd-1-3',
            nomor: 3,
            aktivitas: 'Guru tidak menunjukkan keraguan terhadap kemampuan murid tertentu'
          }
        ]
      },
      {
        id: 'fokus-epd-2',
        fokusJudul: 'Fokus: Guru mengomunikasikan harapan positif terhadap kemajuan belajar murid',
        items: [
          {
            id: 'epd-2-1',
            nomor: 1,
            aktivitas: 'Guru mengidentifikasi dan mengapresiasi kemajuan belajar yang dicapai murid'
          },
          {
            id: 'epd-2-2',
            nomor: 2,
            aktivitas: 'Guru memberikan tantangan yang bermakna dan memandu murid menuntaskannya'
          },
          {
            id: 'epd-2-3',
            nomor: 3,
            aktivitas: 'Guru menegaskan pentingnya proses belajar dibandingkan sekadar hasil akhir'
          }
        ]
      },
      {
        id: 'fokus-epd-3',
        fokusJudul: 'Fokus: Guru memfasilitasi murid mengembangkan pola pikir berkembang (growth mindset)',
        items: [
          {
            id: 'epd-3-1',
            nomor: 1,
            aktivitas: 'Guru menjelaskan bahwa kesalahan adalah bagian wajar dalam proses belajar'
          },
          {
            id: 'epd-3-2',
            nomor: 2,
            aktivitas: 'Guru mengajak murid menganalisis kesalahan dan mencari cara memperbaikinya'
          },
          {
            id: 'epd-3-3',
            nomor: 3,
            aktivitas: 'Guru memuji ketekunan dan strategi murid dalam memecahkan masalah'
          }
        ]
      }
    ]
  },
  {
    id: 'perhatian_dan_kepedulian',
    nama: 'Perhatian dan kepedulian',
    fokusGroups: [
      {
        id: 'fokus-pk-1',
        fokusJudul: 'Fokus: Guru menunjukkan empati terhadap kondisi dan perasaan murid',
        items: [
          {
            id: 'pk-1-1',
            nomor: 1,
            aktivitas: 'Guru menyapa dan menunjukkan ketertarikan pada kabar peserta didik'
          },
          {
            id: 'pk-1-2',
            nomor: 2,
            aktivitas: 'Guru peka terhadap perubahan emosi atau sikap peserta didik di kelas'
          },
          {
            id: 'pk-1-3',
            nomor: 3,
            aktivitas: 'Guru memberikan waktu dan ruang bagi murid yang mengalami kendala emosional'
          }
        ]
      },
      {
        id: 'fokus-pk-2',
        fokusJudul: 'Fokus: Guru peka terhadap kebutuhan belajar peserta didik',
        items: [
          {
            id: 'pk-2-1',
            nomor: 1,
            aktivitas: 'Guru memeriksa pemahaman murid yang tampak ragu atau kesulitan'
          },
          {
            id: 'pk-2-2',
            nomor: 2,
            aktivitas: 'Guru menyesuaikan bantuan belajar sesuai tingkat kebutuhan masing-masing murid'
          },
          {
            id: 'pk-2-3',
            nomor: 3,
            aktivitas: 'Guru memberikan apresiasi personal yang relevan dengan perkembangan murid'
          }
        ]
      },
      {
        id: 'fokus-pk-3',
        fokusJudul: 'Fokus: Guru membangun hubungan positif dan suportif dengan peserta didik',
        items: [
          {
            id: 'pk-3-1',
            nomor: 1,
            aktivitas: 'Guru mendengarkan pendapat murid dengan penuh perhatian tanpa memotong'
          },
          {
            id: 'pk-3-2',
            nomor: 2,
            aktivitas: 'Guru menggunakan bahasa tubuh yang ramah dan terbuka (tatap mata, senyum)'
          },
          {
            id: 'pk-3-3',
            nomor: 3,
            aktivitas: 'Guru menghindari sikap diskriminatif atau membandingkan antar peserta didik'
          }
        ]
      }
    ]
  },
  {
    id: 'umpan_balik_konstruktif',
    nama: 'Umpan balik konstruktif',
    fokusGroups: [
      {
        id: 'fokus-ubk-1',
        fokusJudul: 'Fokus: Guru memberikan umpan balik spesifik yang berorientasi pada tujuan',
        items: [
          {
            id: 'ubk-1-1',
            nomor: 1,
            aktivitas: 'Guru menjelaskan secara konkret bagian mana dari tugas murid yang sudah tepat'
          },
          {
            id: 'ubk-1-2',
            nomor: 2,
            aktivitas: 'Guru menunjukkan bagian yang masih perlu disempurnakan dengan jelas'
          },
          {
            id: 'ubk-1-3',
            nomor: 3,
            aktivitas: 'Guru mengaitkan umpan balik dengan kriteria ketercapaian tujuan pembelajaran'
          }
        ]
      },
      {
        id: 'fokus-ubk-2',
        fokusJudul: 'Fokus: Guru memandu murid menemukan cara memperbaiki kinerjanya',
        items: [
          {
            id: 'ubk-2-1',
            nomor: 1,
            aktivitas: 'Guru mengajukan pertanyaan pemantik agar murid menyadari letak kekeliruannya'
          },
          {
            id: 'ubk-2-2',
            nomor: 2,
            aktivitas: 'Guru memberikan alternatif strategi pemecahan masalah yang dapat dicoba murid'
          },
          {
            id: 'ubk-2-3',
            nomor: 3,
            aktivitas: 'Guru memberi waktu kepada murid untuk mempraktikkan perbaikan tersebut'
          }
        ]
      },
      {
        id: 'fokus-ubk-3',
        fokusJudul: 'Fokus: Guru mendorong murid melakukan refleksi mandiri atas umpan balik',
        items: [
          {
            id: 'ubk-3-1',
            nomor: 1,
            aktivitas: 'Guru mengajak murid mencatat poin evaluasi dan rencana perbaikannya'
          },
          {
            id: 'ubk-3-2',
            nomor: 2,
            aktivitas: 'Guru memfasilitasi saling bertukar umpan balik positif antar peserta didik'
          },
          {
            id: 'ubk-3-3',
            nomor: 3,
            aktivitas: 'Guru menindaklanjuti apakah perbaikan yang disarankan sudah dilakukan'
          }
        ]
      }
    ]
  },
  {
    id: 'instruksi_yang_adaptif',
    nama: 'Instruksi yang adaptif',
    fokusGroups: [
      {
        id: 'fokus-iya-1',
        fokusJudul: 'Fokus: Guru melakukan asesmen formatif berkala selama proses belajar',
        items: [
          {
            id: 'iya-1-1',
            nomor: 1,
            aktivitas: 'Guru mengajukan pertanyaan cek pemahaman di sela-sela penjelasan materi'
          },
          {
            id: 'iya-1-2',
            nomor: 2,
            aktivitas: 'Guru meminta murid menunjukkan respon cepat (jempol, kartu kode, kuis singkat)'
          },
          {
            id: 'iya-1-3',
            nomor: 3,
            aktivitas: 'Guru mengamati aktivitas kerja mandiri murid untuk mendeteksi miskonsepsi'
          }
        ]
      },
      {
        id: 'fokus-iya-2',
        fokusJudul: 'Fokus: Guru menyesuaikan kecepatan dan cara mengajar berdasarkan respons murid',
        items: [
          {
            id: 'iya-2-1',
            nomor: 1,
            aktivitas: 'Guru memperlambat tempo atau mengulang penjelasan saat murid tampak bingung'
          },
          {
            id: 'iya-2-2',
            nomor: 2,
            aktivitas: 'Guru memberikan contoh nyata atau analogi sederhana yang relevan dengan siswa'
          },
          {
            id: 'iya-2-3',
            nomor: 3,
            aktivitas: 'Guru beralih ke strategi lain bila metode awal dinilai kurang efektif'
          }
        ]
      },
      {
        id: 'fokus-iya-3',
        fokusJudul: 'Fokus: Guru memberikan scaffolding/bimbingan bertahap sesuai kebutuhan',
        items: [
          {
            id: 'iya-3-1',
            nomor: 1,
            aktivitas: 'Guru memberikan bantuan bertahap bagi kelompok siswa yang belum memahami materi'
          },
          {
            id: 'iya-3-2',
            nomor: 2,
            aktivitas: 'Guru memberikan tantangan pengayaan bagi siswa yang sudah tuntas lebih cepat'
          },
          {
            id: 'iya-3-3',
            nomor: 3,
            aktivitas: 'Guru secara bertahap mengurangi bantuan saat murid mulai mandiri'
          }
        ]
      }
    ]
  },
  {
    id: 'aktivitas_interaktif',
    nama: 'Aktivitas interaktif',
    fokusGroups: [
      {
        id: 'fokus-ai-1',
        fokusJudul: 'Fokus: Guru memantik diskusi dan interaksi antar murid',
        items: [
          {
            id: 'ai-1-1',
            nomor: 1,
            aktivitas: 'Guru memberikan pertanyaan pemantik terbuka yang memancing beragam tanggapan'
          },
          {
            id: 'ai-1-2',
            nomor: 2,
            aktivitas: 'Guru memberi waktu tunggu berpikir sebelum meminta murid menjawab'
          },
          {
            id: 'ai-1-3',
            nomor: 3,
            aktivitas: 'Guru memfasilitasi murid untuk saling menanggapi pendapat rekannya'
          }
        ]
      },
      {
        id: 'fokus-ai-2',
        fokusJudul: 'Fokus: Guru memfasilitasi kolaborasi kelompok yang efektif',
        items: [
          {
            id: 'ai-2-1',
            nomor: 1,
            aktivitas: 'Guru memastikan setiap anggota kelompok memiliki peran tugas yang jelas'
          },
          {
            id: 'ai-2-2',
            nomor: 2,
            aktivitas: 'Guru berkeliling mendampingi dinamika diskusi setiap kelompok'
          },
          {
            id: 'ai-2-3',
            nomor: 3,
            aktivitas: 'Guru mendorong semua murid untuk berpartisipasi aktif tanpa ada yang pasif'
          }
        ]
      },
      {
        id: 'fokus-ai-3',
        fokusJudul: 'Fokus: Guru memfasilitasi presentasi dan apresiasi karya bersama',
        items: [
          {
            id: 'ai-3-1',
            nomor: 1,
            aktivitas: 'Guru memberikan kesempatan kelompok menampilkan hasil karyanya'
          },
          {
            id: 'ai-3-2',
            nomor: 2,
            aktivitas: 'Guru memandu audiens memberikan pertanyaan dan apresiasi konstruktif'
          },
          {
            id: 'ai-3-3',
            nomor: 3,
            aktivitas: 'Guru bersama murid menyimpulkan intisari hasil diskusi kelas'
          }
        ]
      }
    ]
  },
  {
    id: 'instruksi_pembelajaran',
    nama: 'Instruksi pembelajaran',
    fokusGroups: [
      {
        id: 'fokus-ip-1',
        fokusJudul: 'Fokus: Guru menyampaikan tujuan dan alur pembelajaran secara terstruktur',
        items: [
          {
            id: 'ip-1-1',
            nomor: 1,
            aktivitas: 'Guru menjelaskan tujuan pembelajaran dan manfaat praktisnya dengan jelas'
          },
          {
            id: 'ip-1-2',
            nomor: 2,
            aktivitas: 'Guru memaparkan agenda kegiatan dan alokasi waktu secara runtut'
          },
          {
            id: 'ip-1-3',
            nomor: 3,
            aktivitas: 'Guru mengaitkan materi hari ini dengan pengetahuan yang telah dipelajari'
          }
        ]
      },
      {
        id: 'fokus-ip-2',
        fokusJudul: 'Fokus: Guru menjelaskan materi dengan bahasa yang jelas dan konsep yang tepat',
        items: [
          {
            id: 'ip-2-1',
            nomor: 1,
            aktivitas: 'Guru menggunakan istilah yang komunikatif dan mudah dipahami peserta didik'
          },
          {
            id: 'ip-2-2',
            nomor: 2,
            aktivitas: 'Guru memanfaatkan media visual, tayangan, atau alat peraga praktik optimal'
          },
          {
            id: 'ip-2-3',
            nomor: 3,
            aktivitas: 'Guru menekankan poin-poin kunci dan konsep inti pembelajaran'
          }
        ]
      },
      {
        id: 'fokus-ip-3',
        fokusJudul: 'Fokus: Guru merangkum dan menutup pembelajaran secara bermakna',
        items: [
          {
            id: 'ip-3-1',
            nomor: 1,
            aktivitas: 'Guru bersama murid merangkum kesimpulan pokok materi yang telah dipelajari'
          },
          {
            id: 'ip-3-2',
            nomor: 2,
            aktivitas: 'Guru melakukan refleksi singkat mengenai pengalaman belajar hari ini'
          },
          {
            id: 'ip-3-3',
            nomor: 3,
            aktivitas: 'Guru menyampaikan arahan penugasan mandiri atau topik pertemuan berikutnya'
          }
        ]
      }
    ]
  }
];
