/**
 * Google Apps Script Integration Utilities & Script Code
 * E-Supervisi Akademik & Monitoring 5 Pekan
 */

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * =========================================================================
 * GOOGLE APPS SCRIPT: INTEGRASI E-SUPERVISI AKADEMIK & MONITORING 5 PEKAN
 * =========================================================================
 * 
 * PETUNJUK PENERAPAN:
 * 1. Buat Spreadsheet baru di Google Drive (misal: "Database E-Supervisi SMKN 1 Menggala").
 * 2. Klik menu 'Ekstensi' > 'Apps Script'.
 * 3. Hapus seluruh kode bawaan yang ada di editor, lalu TEMPEL seluruh kode ini.
 * 4. Klik 'Simpan' (ikon disket atau Ctrl+S).
 * 5. Klik tombol biru 'Terapkan' (Deploy) di kanan atas > pilih 'Deployment baru' (New deployment).
 * 6. Pada roda gigi (Select type), pilih 'Aplikasi Web' (Web app).
 * 7. Isi:
 *    - Deskripsi: Web API E-Supervisi
 *    - Jalankan sebagai: 'Saya' (Me - akun Google Anda)
 *    - Siapa yang memiliki akses: 'Siapa saja' (Anyone)  <-- PENTING!
 * 8. Klik 'Terapkan' (Deploy), berikan izin akses (Review Permissions -> Pilih Akun -> Advanced -> Go to ... (unsafe) -> Allow).
 * 9. Salin "URL Aplikasi Web" (akhiran /exec) dan tempelkan ke aplikasi E-Supervisi Anda.
 * 10. Sheet akan otomatis dibuatkan tabel rapi (Data_Sekolah, Data_Guru, Hasil_Supervisi, Monitoring_5Pekan).
 */

// Nama-nama sheet yang akan dibuat otomatis
var SHEET_SEKOLAH = 'Data_Sekolah';
var SHEET_GURU = 'Data_Guru';
var SHEET_SUPERVISI = 'Hasil_Supervisi';
var SHEET_MONITORING = 'Monitoring_5Pekan';

/**
 * Menu otomatis saat Spreadsheet dibuka
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('⚡ E-Supervisi')
    .addItem('⚙️ Setup / Buat Seluruh Tabel Otomatis', 'setupSpreadsheet')
    .addItem('📊 Format Ulang Gaya Tabel', 'formatAllSheets')
    .addSeparator()
    .addItem('ℹ️ Petunjuk Integrasi Web App', 'showHelpDialog')
    .addToUi();
}

function showHelpDialog() {
  var html = HtmlService.createHtmlOutput(
    '<div style="font-family:sans-serif;padding:12px;">' +
    '<h3>Integrasi E-Supervisi Berhasil Terpasang!</h3>' +
    '<p>Spreadsheet ini siap menerima data dari aplikasi E-Supervisi.</p>' +
    '<p>Pastikan Anda sudah melakukan <b>Deploy sebagai Web App</b> dengan akses <b>Siapa saja (Anyone)</b>.</p>' +
    '</div>'
  ).setWidth(400).setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(html, 'Informasi E-Supervisi');
}

/**
 * Handle HTTP GET Requests
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'ping';
  
  if (action === 'ping') {
    return createJsonResponse({
      status: 'success',
      message: 'Koneksi Google Sheets E-Supervisi Aktif & Siap Digunakan!',
      timestamp: new Date().toISOString()
    });
  }
  
  if (action === 'getAll') {
    return createJsonResponse({
      status: 'success',
      data: getAllDataFromSheets()
    });
  }

  if (action === 'setup') {
    setupSpreadsheet();
    return createJsonResponse({
      status: 'success',
      message: 'Tabel berhasil disiapkan otomatis.'
    });
  }
  
  return createJsonResponse({
    status: 'error',
    message: 'Action tidak dikenali: ' + action
  });
}

/**
 * Handle HTTP POST Requests
 */
function doPost(e) {
  try {
    var contents = e.postData ? e.postData.contents : null;
    if (!contents) {
      return createJsonResponse({ status: 'error', message: 'Payload data kosong.' });
    }
    
    var payload = JSON.parse(contents);
    var action = payload.action || 'syncAll';
    
    // Pastikan tabel-tabel sudah ada
    setupSpreadsheet();
    
    if (action === 'syncAll') {
      var school = payload.school;
      var teachers = payload.teachers || [];
      var supervisions = payload.supervisions || [];
      var monitoringList = payload.monitoringList || [];
      
      if (school) saveSchoolData(school);
      if (teachers.length > 0) saveTeachersData(teachers);
      if (supervisions.length > 0) saveSupervisionsData(supervisions);
      if (monitoringList.length > 0) saveMonitoringData(monitoringList);
      
      return createJsonResponse({
        status: 'success',
        message: 'Seluruh data berhasil disinkronkan ke Google Sheets!',
        timestamp: new Date().toISOString(),
        summary: {
          guruCount: teachers.length,
          supervisiCount: supervisions.length,
          monitoringCount: monitoringList.length
        }
      });
    }
    
    if (action === 'saveSchool') {
      saveSchoolData(payload.school);
      return createJsonResponse({ status: 'success', message: 'Data sekolah berhasil disimpan!' });
    }
    
    if (action === 'saveTeacher') {
      saveTeachersData(payload.teachers || [payload.teacher]);
      return createJsonResponse({ status: 'success', message: 'Data guru berhasil disimpan!' });
    }
    
    if (action === 'saveSupervision') {
      saveSupervisionsData(payload.supervisions || [payload.supervision]);
      return createJsonResponse({ status: 'success', message: 'Data supervisi berhasil disimpan!' });
    }

    if (action === 'saveMonitoring') {
      saveMonitoringData(payload.monitoringList || [payload.monitoring]);
      return createJsonResponse({ status: 'success', message: 'Data monitoring berhasil disimpan!' });
    }
    
    return createJsonResponse({ status: 'error', message: 'Aksi POST tidak didukung: ' + action });
  } catch (err) {
    return createJsonResponse({
      status: 'error',
      message: 'Terjadi kesalahan saat memproses data: ' + err.toString()
    });
  }
}

/**
 * Inisialisasi Sheet dan Header Otomatis
 */
function setupSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Sheet Data Sekolah
  var sheetSekolah = getOrCreateSheet(ss, SHEET_SEKOLAH);
  if (sheetSekolah.getLastRow() === 0) {
    var headersSekolah = [
      'Nama Sekolah', 'NPSN', 'Alamat Sekolah', 'Kabupaten / Kota', 'Provinsi',
      'Kepala Sekolah', 'NIP Kepala Sekolah', 'Nama Supervisor', 'NIP Supervisor',
      'Tahun Ajaran', 'Semester', 'Terakhir Disinkron'
    ];
    sheetSekolah.appendRow(headersSekolah);
    formatHeaderRow(sheetSekolah, headersSekolah.length);
  }
  
  // 2. Sheet Data Guru
  var sheetGuru = getOrCreateSheet(ss, SHEET_GURU);
  if (sheetGuru.getLastRow() === 0) {
    var headersGuru = [
      'ID Guru', 'NIP', 'Nama Lengkap', 'Gelar', 'Mata Pelajaran', 'Kelas Diampu',
      'Email', 'No. HP / WA', 'Status Supervisi', 'Skor Nilai', 'Predikat', 'Tanggal Supervisi'
    ];
    sheetGuru.appendRow(headersGuru);
    formatHeaderRow(sheetGuru, headersGuru.length);
  }
  
  // 3. Sheet Hasil Supervisi
  var sheetSupervisi = getOrCreateSheet(ss, SHEET_SUPERVISI);
  if (sheetSupervisi.getLastRow() === 0) {
    var headersSupervisi = [
      'ID Supervisi', 'ID Guru', 'Nama Guru', 'Mata Pelajaran', 'Kelas', 'Hari & Tanggal',
      'Fokus Observasi PMM', 'Skor Perencanaan (0-100)', 'Skor Pelaksanaan (0-100)',
      'Nilai Akhir (0-100)', 'Predikat Kinerja', 'Nama Supervisor', 'NIP Supervisor',
      'Catatan Kekuatan', 'Catatan Perbaikan', 'Rekomendasi Tindak Lanjut'
    ];
    sheetSupervisi.appendRow(headersSupervisi);
    formatHeaderRow(sheetSupervisi, headersSupervisi.length);
  }
  
  // 4. Sheet Monitoring 5 Pekan
  var sheetMonitoring = getOrCreateSheet(ss, SHEET_MONITORING);
  if (sheetMonitoring.getLastRow() === 0) {
    var headersMonitoring = [
      'ID Monitoring', 'ID Guru', 'Nama Guru', 'Topik / Fokus Pendampingan', 'Tanggal Mulai',
      'Pekan 1 Status', 'Pekan 1 Catatan',
      'Pekan 2 Status', 'Pekan 2 Catatan',
      'Pekan 3 Status', 'Pekan 3 Catatan',
      'Pekan 4 Status', 'Pekan 4 Catatan',
      'Pekan 5 Status', 'Pekan 5 Catatan',
      'Pekan Tuntas', 'Progres (%)', 'Catatan Evaluasi Akhir', 'Terakhir Update'
    ];
    sheetMonitoring.appendRow(headersMonitoring);
    formatHeaderRow(sheetMonitoring, headersMonitoring.length);
  }

  // Hapus Sheet1 default jika kosong
  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && defaultSheet.getLastRow() === 0 && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }
}

/**
 * Simpan Data Profil Sekolah
 */
function saveSchoolData(school) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, SHEET_SEKOLAH);
  
  // Bersihkan data lama setelah header
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }
  
  var row = [
    school.namaSekolah || '',
    school.npsn || '',
    school.alamat || '',
    school.kabupaten || '',
    school.provinsi || 'Lampung',
    school.kepalaSekolah || '',
    school.nipKepsek || '',
    school.namaSupervisor || '',
    school.nipSupervisor || '',
    school.tahunAjaran || '',
    school.semester || 'Ganjil',
    new Date()
  ];
  sheet.appendRow(row);
  sheet.autoResizeColumns(1, row.length);
}

/**
 * Simpan Data Guru
 */
function saveTeachersData(teachers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, SHEET_GURU);
  
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }
  
  var rows = [];
  for (var i = 0; i < teachers.length; i++) {
    var t = teachers[i];
    rows.push([
      t.id || ('tch-' + (i + 1)),
      t.nip ? "'" + t.nip : '',
      t.nama || '',
      t.gelar || '',
      t.mapel || '',
      t.kelas || '',
      t.email || '',
      t.noHp ? "'" + t.noHp : '',
      t.statusSupervisi || 'belum',
      t.skorTerakhir || '-',
      t.predikat || '-',
      t.tanggalSupervisi || '-'
    ]);
  }
  
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
    sheet.autoResizeColumns(1, rows[0].length);
  }
}

/**
 * Simpan Data Hasil Supervisi
 */
function saveSupervisionsData(supervisions) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, SHEET_SUPERVISI);
  
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }
  
  var rows = [];
  for (var i = 0; i < supervisions.length; i++) {
    var s = supervisions[i];
    rows.push([
      s.id || '',
      s.teacherId || '',
      s.teacherName || '',
      s.mapel || '',
      s.kelas || '',
      s.tanggal || '',
      s.fokusObservasiNama || '',
      s.skorPerencanaan || 0,
      s.skorPelaksanaan || 0,
      s.nilaiAkhir || 0,
      s.predikat || '',
      s.supervisorName || '',
      s.supervisorNip ? "'" + s.supervisorNip : '',
      s.catatanKekuatan || '',
      s.catatanPerbaikan || '',
      s.rekomendasiTindakLanjut || ''
    ]);
  }
  
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
    sheet.autoResizeColumns(1, rows[0].length);
  }
}

/**
 * Simpan Data Monitoring 5 Pekan
 */
function saveMonitoringData(monitoringList) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateSheet(ss, SHEET_MONITORING);
  
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }
  
  var rows = [];
  for (var i = 0; i < monitoringList.length; i++) {
    var m = monitoringList[i];
    var weeks = m.weeks || [];
    var w1 = weeks[0] || {};
    var w2 = weeks[1] || {};
    var w3 = weeks[2] || {};
    var w4 = weeks[3] || {};
    var w5 = weeks[4] || {};
    
    var completed = 0;
    for (var w = 0; w < weeks.length; w++) {
      if (weeks[w].status === 'selesai') completed++;
    }
    var percent = Math.round((completed / 5) * 100);
    
    rows.push([
      m.id || '',
      m.teacherId || '',
      m.teacherName || '',
      m.focusTopic || '',
      m.startDate || '',
      w1.status || 'belum',
      w1.notes || '',
      w2.status || 'belum',
      w2.notes || '',
      w3.status || 'belum',
      w3.notes || '',
      w4.status || 'belum',
      w4.notes || '',
      w5.status || 'belum',
      w5.notes || '',
      completed + ' dari 5 Pekan',
      percent + '%',
      m.evaluasiAkhir || '',
      new Date()
    ]);
  }
  
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
    sheet.autoResizeColumns(1, rows[0].length);
  }
}

/**
 * Helper: Ambil seluruh data dari Google Sheets (untuk fitur Tarik Data)
 */
function getAllDataFromSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var result = {
    school: null,
    teachers: [],
    supervisions: [],
    monitoringList: []
  };
  
  // 1. Data Sekolah
  var sheetSekolah = ss.getSheetByName(SHEET_SEKOLAH);
  if (sheetSekolah && sheetSekolah.getLastRow() > 1) {
    var dataS = sheetSekolah.getRange(2, 1, 1, 11).getValues()[0];
    result.school = {
      namaSekolah: String(dataS[0] || ''),
      npsn: String(dataS[1] || ''),
      alamat: String(dataS[2] || ''),
      kabupaten: String(dataS[3] || ''),
      provinsi: String(dataS[4] || ''),
      kepalaSekolah: String(dataS[5] || ''),
      nipKepsek: String(dataS[6] || ''),
      namaSupervisor: String(dataS[7] || ''),
      nipSupervisor: String(dataS[8] || ''),
      tahunAjaran: String(dataS[9] || ''),
      semester: String(dataS[10] || 'Ganjil')
    };
  }
  
  // 2. Data Guru
  var sheetGuru = ss.getSheetByName(SHEET_GURU);
  if (sheetGuru && sheetGuru.getLastRow() > 1) {
    var dataG = sheetGuru.getRange(2, 1, sheetGuru.getLastRow() - 1, 12).getValues();
    for (var i = 0; i < dataG.length; i++) {
      var row = dataG[i];
      if (row[0]) {
        result.teachers.push({
          id: String(row[0]),
          nip: String(row[1]).replace(/^'/, ''),
          nama: String(row[2]),
          gelar: String(row[3] || 'S.Pd'),
          mapel: String(row[4] || ''),
          kelas: String(row[5] || 'X'),
          email: String(row[6] || ''),
          noHp: String(row[7] || '').replace(/^'/, ''),
          statusSupervisi: String(row[8] || 'belum'),
          skorTerakhir: row[9] === '-' ? undefined : Number(row[9]),
          predikat: row[10] === '-' ? undefined : String(row[10]),
          tanggalSupervisi: row[11] === '-' ? undefined : String(row[11]),
          avatarColor: 'bg-blue-600'
        });
      }
    }
  }
  
  return result;
}

/**
 * Format Header Row dengan tema Biru Navy & teks putih
 */
function formatHeaderRow(sheet, numColumns) {
  var headerRange = sheet.getRange(1, 1, 1, numColumns);
  headerRange.setBackground('#1e3a8a'); // Navy Blue
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(10);
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 32);
  sheet.setFrozenRows(1);
}

/**
 * Helper: Dapatkan atau buat Sheet jika belum ada
 */
function getOrCreateSheet(spreadsheet, sheetName) {
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  return sheet;
}

/**
 * Helper: Buat HTTP JSON Output yang support CORS
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export interface SyncPayload {
  action?: string;
  school?: any;
  teachers?: any[];
  supervisions?: any[];
  monitoringList?: any[];
}

export interface SyncResult {
  success: boolean;
  message: string;
  data?: any;
  timestamp?: string;
}

/**
 * Test connectivity with Google Apps Script Web App URL
 */
export async function testGoogleSheetsConnection(webAppUrl: string): Promise<SyncResult> {
  const cleanUrl = webAppUrl.trim();
  if (!cleanUrl) {
    return { success: false, message: 'URL Web App Google Apps Script belum diisi.' };
  }

  try {
    const separator = cleanUrl.includes('?') ? '&' : '?';
    const pingUrl = `${cleanUrl}${separator}action=ping&_t=${Date.now()}`;
    const response = await fetch(pingUrl, {
      method: 'GET',
      mode: 'cors'
    });

    if (!response.ok) {
      return {
        success: false,
        message: `HTTP Error: ${response.status} ${response.statusText}. Pastikan Web App disetel 'Anyone' (Siapa saja).`
      };
    }

    const data = await response.json();
    if (data.status === 'success') {
      return {
        success: true,
        message: data.message || 'Koneksi ke Google Sheets berhasil!',
        timestamp: data.timestamp
      };
    } else {
      return {
        success: false,
        message: data.message || 'Respon Google Apps Script gagal.'
      };
    }
  } catch (error: any) {
    // If CORS preflight fails in some strict browser modes, test via simple GET or provide clear diagnosis
    return {
      success: false,
      message: `Gagal menghubungi Google Apps Script: ${error.message || 'Network error'}. Pastikan URL Web App di-deploy dengan akses 'Anyone'.`
    };
  }
}

/**
 * Sync entire database to Google Sheets
 */
export async function syncAllToGoogleSheets(
  webAppUrl: string,
  payload: SyncPayload
): Promise<SyncResult> {
  const cleanUrl = webAppUrl.trim();
  if (!cleanUrl) {
    return { success: false, message: 'URL Web App Google Apps Script belum diatur.' };
  }

  try {
    const bodyData = {
      action: 'syncAll',
      ...payload
    };

    // Google Apps Script accepts text/plain to avoid CORS preflight issues
    const response = await fetch(cleanUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(bodyData)
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Gagal mengirim data. Kode status: ${response.status}`
      };
    }

    const result = await response.json();
    return {
      success: result.status === 'success',
      message: result.message || 'Sinkronisasi selesai!',
      data: result.summary,
      timestamp: result.timestamp
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Terjadi kendala saat mengirim data: ${error.message || 'Koneksi gagal'}`
    };
  }
}

/**
 * Pull teachers & school data from Google Sheets
 */
export async function pullDataFromGoogleSheets(webAppUrl: string): Promise<SyncResult> {
  const cleanUrl = webAppUrl.trim();
  if (!cleanUrl) {
    return { success: false, message: 'URL Web App belum diisi.' };
  }

  try {
    const separator = cleanUrl.includes('?') ? '&' : '?';
    const url = `${cleanUrl}${separator}action=getAll&_t=${Date.now()}`;
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors'
    });

    if (!response.ok) {
      return { success: false, message: `HTTP Error: ${response.status}` };
    }

    const result = await response.json();
    if (result.status === 'success') {
      return {
        success: true,
        message: 'Data berhasil ditarik dari Google Sheets!',
        data: result.data
      };
    } else {
      return {
        success: false,
        message: result.message || 'Gagal mengambil data dari Google Sheets.'
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Gagal menarik data: ${error.message}`
    };
  }
}
