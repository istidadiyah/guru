


// Fungsi untuk menghapus semua cache dari situs ini
function clearSiteCache() {
    // Hapus semua data dari localStorage
    localStorage.clear();

    // Hapus semua data dari sessionStorage jika Anda menggunakannya
    sessionStorage.clear();

    // Jika Anda menyimpan data di IndexedDB atau tempat lain, Anda perlu menghapusnya juga

    // Opsi tambahan: Hapus cookie jika diperlukan
    // JavaScript memiliki keterbatasan dalam menghapus cookie dengan domain dan path tertentu
    // Berikut adalah contoh untuk menghapus semua cookie yang dapat dijangkau oleh JavaScript
    document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "")
                           .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });

    // Tampilkan pesan konfirmasi atau reload halaman
    alert("Cache telah dihapus. Halaman akan dimuat ulang.");
    location.reload();
}















//------------------------------------ Hijri date -------------------------------
function getHijriDate() {
    const date = new Date();
    const gDate = date.getDate();
    const gMonth = date.getMonth() + 1; // 1 = Januari, 12 = Desember
    const gYear = date.getFullYear();

    // Mengonversi tanggal Gregorian (Masehi) ke Julian Day
    const jd = gregorianToJD(gYear, gMonth, gDate);
    
    // Mengonversi Julian Day ke Hijriyah
    const hijri = jdToHijri(jd);
    
    // Format tanggal Hijriyah (contoh: 11 Muharram 1446)
    const hijriDate = `${hijri.day} ${bulanNames[hijri.month]} ${hijri.year}`;

    // Menampilkan tanggal Hijriyah di elemen dengan id "Hijriyah"
    document.getElementById('Hijriyah').textContent = hijriDate;
}

// Fungsi untuk mengonversi tanggal Gregorian ke Julian Day
function gregorianToJD(year, month, day) {
    if (month <= 2) {
        month += 12;
        year--;
    }

    const a = Math.floor(year / 100);
    const b = 2 - a + Math.floor(a / 4);
    const jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;

    return jd;
}

// Fungsi untuk mengonversi Julian Day ke Hijriyah
function jdToHijri(jd) {
    const jd1 = 1948440; // Julian Day untuk 1 Muharram 1 H
    const iDate = jd - jd1;
    const iYear = Math.floor(iDate / 354.367);
    const iMonth = Math.floor((iDate - (iYear * 354.367)) / 29.5306) + 1;
    const iDay = Math.floor(iDate - (iYear * 354.367) - ((iMonth - 1) * 29.5306)) + 1;

    // Mengembalikan objek dengan hari, bulan, dan tahun Hijriyah
    return {
        day: iDay,
        month: iMonth < 10 ? '0' + iMonth : iMonth, // Format bulan dua digit
        year: iYear + 1 // Tahun Hijriyah dimulai dari 1
    };
}