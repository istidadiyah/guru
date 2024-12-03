
//----------------------------------------- Fungsi Chache ---------------------------------------------
// Fungsi untuk memeriksa cache berdasarkan kunci dan durasi cache
function CekCache(cacheKey) {
    const cachedData = localStorage.getItem(cacheKey);  // Cek apakah ada data di cache
    const currentTime = Date.now();

    if (cachedData) {
        try {
            const parsedCache = JSON.parse(cachedData);
            const cacheTime = parsedCache.timestamp;
            const cacheDuration = 24 * 60 * 60 * 1000;  // Misalnya, durasi cache 24 jam (24 * 60 * 60 * 1000 ms)

            // Jika cache masih berlaku (dalam durasi yang ditentukan), kembalikan data cache
            if ((currentTime - cacheTime) < cacheDuration) {
                console.log(`Cache untuk ${cacheKey} masih berlaku.`);
                return parsedCache.data;  // Kembalikan data dari cache
            } else {
                console.log(`Cache untuk ${cacheKey} sudah kedaluwarsa.`);
                return null;  // Cache sudah kedaluwarsa, kembalikan null
            }
        } catch (e) {
            console.error(`Gagal memparsing cache untuk ${cacheKey}:`, e);
            return null;  // Jika terjadi error dalam parsing, kembalikan null
        }
    } else {
        console.log(`Cache untuk ${cacheKey} tidak ditemukan.`);
        return null;  // Tidak ada cache untuk key yang diberikan, kembalikan null
    }
}


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

const FAILED_DATA_KEY = 'failedData';

/**
 * Simpan data yang gagal ke localStorage.
 * @param {Object} jsonData - Data JSON yang gagal dikirim.
 * @param {string} error - Pesan kesalahan.
 */
function saveFailedDataToCache(jsonData, error) {
    const failedData = JSON.parse(localStorage.getItem(FAILED_DATA_KEY)) || [];
    failedData.push({ jsonData, error });
    localStorage.setItem(FAILED_DATA_KEY, JSON.stringify(failedData));
}

/**
 * Muat data gagal dari localStorage ke tabel tanpa menduplikasi data.
 */
function loadFailedDataFromCache() {
    const failedData = JSON.parse(localStorage.getItem(FAILED_DATA_KEY)) || [];
    const table = document.getElementById('tablePost');
    
    failedData.forEach(({ data, error }) => {
        const jsonHash = hashJson(data); // Buat hash unik untuk data JSON
        
        // Periksa apakah data sudah ada di tabel
        if (!isJsonAlreadyInTable(jsonHash, table)) {
            addToFailedTable(data, error);
        }
    });
}


/**
 * Hapus data yang berhasil dikirim dari cache.
 * @param {Object} jsonData - Data JSON yang berhasil dikirim.
 */
function removeDataFromCache(jsonData) {
    const failedData = JSON.parse(localStorage.getItem(FAILED_DATA_KEY)) || [];
    const updatedData = failedData.filter(
        item => JSON.stringify(item.jsonData) !== JSON.stringify(jsonData)
    );
    localStorage.setItem(FAILED_DATA_KEY, JSON.stringify(updatedData));
}


//--------------------------------- Membuat Json Simpan dan menyimpan Edit data --------------------------------
function generateJSON() {
    // Ambil elemen-elemen dari div dengan id "cardEdit"
    const cardEdit = document.getElementById("cardEdit");
    const inputs = cardEdit.querySelectorAll("input, select");
    
    // Objek yang akan menjadi hasil akhir
    let rowData = {};
    
    // Iterasi melalui semua input dan select
    inputs.forEach(input => {
        const key = input.id; // Menggunakan ID sebagai header
        const value = input.value; // Mengambil nilai dari input atau select
        rowData[key] = value; // Memasukkan ke objek
    });

    // Format JSON sesuai permintaan
    const jsonData = {
        db: [rowData]
    };

    console.log(jsonData); // Untuk debugging
    sendPostWithGet(jsonData);

    return JSON.stringify(jsonData); // Kembalikan JSON dalam bentuk string
}

function generateJSONGuru() {
    // Ambil elemen-elemen dari div dengan id "cardEdit"
    const cardEdit = document.getElementById("cardEdit");
    const inputs = cardEdit.querySelectorAll("input, select");
    
    // Objek yang akan menjadi hasil akhir
    let rowData = {};
    
    // Iterasi melalui semua input dan select
    inputs.forEach(input => {
        const key = input.id; // Menggunakan ID sebagai header
        const value = input.value; // Mengambil nilai dari input atau select
        rowData[key] = value; // Memasukkan ke objek
    });

    // Format JSON sesuai permintaan
    const jsonData = {
        Guru: [rowData]
    };

    console.log(jsonData); // Untuk debugging
    sendPostWithGet(jsonData);

    return JSON.stringify(jsonData); // Kembalikan JSON dalam bentuk string
}


//------------------------------------ Memindah isi form edit ke halaman utama ---------------------------------------

function moveHtmlContent(sourceUrl, sourceDivId, targetDivId) {
    // Ambil elemen target di mana konten akan dipindahkan
    const targetDiv = document.getElementById(targetDivId);
    if (!targetDiv) {
        console.error(`Target div dengan ID ${targetDivId} tidak ditemukan.`);
        return;
    }
  
    // Fetch HTML dari URL yang diberikan
    fetch(sourceUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Gagal memuat halaman: ${response.statusText}`);
            }
            return response.text();
        })
        .then(htmlText => {
            // Buat elemen dummy untuk memparsing HTML yang diambil
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(htmlText, 'text/html');
            const sourceDiv = htmlDocument.getElementById(sourceDivId);
  
            // Pastikan sourceDiv ditemukan
            if (!sourceDiv) {
                console.error(`Div dengan ID ${sourceDivId} tidak ditemukan di halaman sumber.`);
                return;
            }
  
            // Pindahkan isi dari sourceDiv (.modal-content) ke target modal di index.html
            const targetContent = targetDiv.querySelector('.modal-content');
            if (targetContent) {
                targetContent.innerHTML = sourceDiv.innerHTML;
            } else {
                console.error('Target modal tidak memiliki elemen .modal-content.');
            }
        })
        .catch(error => {
            console.error('Error saat memindahkan konten:', error);
        });
  }
  
  
  // Fungsi untuk memindahkan konten berdasarkan ID
  function moveHtmlContentFromJS(sourceId, targetDivId) {
    // Ambil elemen target di mana konten akan dipindahkan
    const targetDiv = document.getElementById(targetDivId);
    if (!targetDiv) {
        console.error(`Target div dengan ID ${targetDivId} tidak ditemukan.`);
        return;
    }
  
    // Ambil HTML dari objek `htmlTemplates` dengan ID tertentu
    const contentHTML = htmlTemplates[sourceId];
    if (!contentHTML) {
        console.error(`Sumber HTML dengan ID ${sourceId} tidak ditemukan.`);
        return;
    }
  
    // Pindahkan konten ke elemen target
    targetDiv.innerHTML = contentHTML;
  }
  
  



//------------------------------------ Hijri date -------------------------------
function getHijriDate() {
    const date = new Date();
    let gDate = date.getDate();
    let gMonth = date.getMonth() + 1; // 1 = Januari, 12 = Desember
    let gYear = date.getFullYear();

    // Menambahkan 1 hari jika setelah pukul 6 sore
    const currentHour = date.getHours();
    if (currentHour >= 18) { 
        gDate += 1;

        // Menangani overflow tanggal di akhir bulan
        const daysInMonth = new Date(gYear, gMonth, 0).getDate(); // Jumlah hari di bulan ini
        if (gDate > daysInMonth) {
            gDate = 1; // Reset ke hari pertama bulan berikutnya
            gMonth += 1;

            // Jika bulan Desember, lanjut ke Januari tahun berikutnya
            if (gMonth > 12) {
                gMonth = 1;
                gYear += 1;
            }
        }
    }

    // Mengonversi tanggal Gregorian (Masehi) ke Julian Day
    const jd = gregorianToJD(gYear, gMonth, gDate);
    
    // Mengonversi Julian Day ke Hijriyah
    const hijri = jdToHijri(jd);

    // Format tanggal Hijriyah (contoh: 11 Muharram 1446)
    const hijriDate = `${hijri.day} ${bulanNames[hijri.month]} ${hijri.year}`;

    // Menampilkan tanggal Hijriyah di elemen dengan id "Hijriyah"
    document.getElementById('Hijriyah').textContent = hijriDate;

    // Memasukkan bulan ke dalam select filterBulan
    const filterBulan = document.getElementById("filterBulan");
    if (filterBulan) {
        filterBulan.innerHTML = ''; // Hapus semua opsi yang ada
        Object.keys(bulanNames).forEach((key) => {
            const option = document.createElement("option");
            option.value = key; // Value tetap 01 hingga 12
            option.textContent = bulanNames[key]; // Nama bulan dari objek bulanNames
            if (key === hijri.month) {
                option.selected = true; // Set bulan sesuai hasil konversi
            }
            filterBulan.appendChild(option);
        });
    }

    // Memasukkan tanggal ke dalam input filterTanggal
    const filterTanggal = document.getElementById("filterTanggal");
    if (filterTanggal) {
        filterTanggal.value = hijri.day; // Tetap menggunakan nilai asli tanpa format tambahan
    }
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





//--------------------------------------------- Hash ID ---------------------------------
// Fungsi untuk membuat ID unik dari gabungan tiga parameter: Pelajaran, Kelas, Kitab
async function buatID(Pelajaran, Kelas, kitab) {
    // Gabungkan parameter menjadi satu string
    const data = Pelajaran + '-' + Kelas + '-' + kitab;

    // Menggunakan SubtleCrypto untuk hash SHA-256
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Hash menggunakan SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    
    // Mengonversi hashBuffer menjadi string hexadecimal
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    // Potong hasil hash untuk mendapatkan ID unik sepanjang 8 karakter
    const idUnik = hashHex.substring(0, 8);

    return idUnik;
}