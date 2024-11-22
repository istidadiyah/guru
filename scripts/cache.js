document.addEventListener('DOMContentLoaded', function () {
    const selectGuru = document.getElementById('filterGuru');

    // Load the stored selection if available
    const storedGuru = localStorage.getItem('selectedGuru');
    if (storedGuru) {
        selectGuru.value = storedGuru;
    }

    // Save the selection to localStorage on change
    selectGuru.addEventListener('change', function () {
        localStorage.setItem('selectedGuru', selectGuru.value);
    });
});





















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