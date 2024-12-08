
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
function generateJSON(keyName) {
    // Validasi keyName harus diberikan
    if (!keyName || typeof keyName !== "string") {
        console.error("Key JSON harus berupa string yang valid!");
        return null;
    }

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

    // Format JSON sesuai dengan keyName
    const jsonData = {
        [keyName]: [rowData]
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


//------------------------------------------------- Update PWA --------------------------------
function updatePWA() {
    const statusElement = document.getElementById('notifUpdate'); // Notifikasi di elemen ini
    const button = document.getElementById('updateBtn'); // Tombol Update
    //statusElement.style.display = 'none'; // Sembunyikan notifikasi awalnya
    button.disabled = true; // Nonaktifkan tombol sementara pembaruan berlangsung
    button.textContent = 'Memperbarui...'; // Ubah teks tombol untuk memberikan feedback

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration()
            .then((registration) => {
                if (registration) {
                    registration.update()
                        .then(() => {
                            button.textContent = 'Update'; // Kembalikan teks tombol
                            button.disabled = false; // Aktifkan tombol kembali
                            //statusElement.style.display = 'block'; // Tampilkan notifikasi
                            showNotification('Service Worker berhasil diperbarui!'); // Tampilkan notifikasi
                            console.log('Service Worker berhasil diperbarui.');
                        })
                        .catch((error) => {
                            button.textContent = 'Update'; // Kembalikan teks tombol
                            button.disabled = false; // Aktifkan tombol kembali
                            console.error('Error saat memperbarui Service Worker:', error);
                            alert('Gagal memperbarui cache. Silakan coba lagi.');
                        });
                } else {
                    button.textContent = 'Update'; // Kembalikan teks tombol
                    button.disabled = false; // Aktifkan tombol kembali
                    alert('Tidak ada Service Worker terdaftar.');
                }
            })
            .catch((error) => {
                button.textContent = 'Update'; // Kembalikan teks tombol
                button.disabled = false; // Aktifkan tombol kembali
                console.error('Error saat memeriksa Service Worker:', error);
                alert('Gagal memeriksa pendaftaran Service Worker.');
            });
    } else {
        button.textContent = 'Update'; // Kembalikan teks tombol
        button.disabled = false; // Aktifkan tombol kembali
        alert('Browser tidak mendukung Service Worker.');
    }
}


//------------------------------------------------- Notif seperti windows --------------------------------
function showNotification(message) {
    const container = document.getElementById('notifContainer');

    // Buat elemen notifikasi
    const notif = document.createElement('div');
    notif.className = 'notif';
    notif.textContent = message;

    // Tambahkan elemen ke container
    container.appendChild(notif);

    // Animasi masuk
    setTimeout(() => {
        notif.classList.add('show');
    }, 10);

    // Animasi keluar dan hapus notifikasi setelah 3 detik
    setTimeout(() => {
        notif.classList.remove('show');
        notif.classList.add('hide');
        setTimeout(() => {
            notif.remove();
        }, 500);
    }, 3000);
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


//--------------------------------------- Fungsi Tampilkan / Sembunyikan dan tampilan teks header ----------------------------------------------
function Tampilkan(id) {
    const elem = document.getElementById(id);
    if (elem) {
        elem.classList.remove('fade-out');
        elem.classList.add('fade-in');
        elem.style.display = "block"; // Tampilkan elemen
    } else {
        console.error(`Elemen dengan id "${id}" tidak ditemukan.`);
    }
}

function Sembunyikan(id, callback) {
    const elem = document.getElementById(id);
    if (elem) {
        elem.classList.remove('fade-in');
        elem.classList.add('fade-out');
        setTimeout(() => {
            elem.style.display = "none"; // Sembunyikan elemen sepenuhnya setelah animasi selesai
            if (callback) {
                callback(); // Panggil callback setelah selesai disembunyikan
            }
        }, 800); // Sesuaikan waktu sesuai durasi animasi (800ms)
    } else {
        console.error(`Elemen dengan id "${id}" tidak ditemukan.`);
    }
}


function UbahText(newHeaderText, newTanggalInfoText) {
    const headerElement = document.getElementById('headerInfo');
    const tanggalInfoElement = document.getElementById('tanggalInfo');

    function animateText(element, newText) {
        // Tambahkan kelas 'fade-out' untuk memulai animasi keluar
        element.classList.add('fade-out');

        // Ketika animasi keluar selesai
        element.addEventListener('animationend', function handler() {
            // Hapus kelas 'fade-out'
            element.classList.remove('fade-out');
            // Ubah teks elemen
            element.textContent = newText;
            // Tambahkan kelas 'fade-in' untuk animasi masuk
            element.classList.add('fade-in');
            // Hapus event listener agar tidak terjadi pemanggilan berulang
            element.removeEventListener('animationend', handler);

            // Hapus kelas 'fade-in' setelah animasi masuk selesai
            element.addEventListener('animationend', function handler2() {
                element.classList.remove('fade-in');
                element.removeEventListener('animationend', handler2);
            });
        });
    }

    // Panggil fungsi animasi untuk masing-masing elemen
    animateText(headerElement, newHeaderText);
    animateText(tanggalInfoElement, newTanggalInfoText);
}





//-------------------------------------------------------- Fungsi Tabel -------------------------------------------------
function resetTable(tableId) {
    const oldTable = document.getElementById(tableId);

    if (!oldTable) {
        console.error(`Tabel dengan ID "${tableId}" tidak ditemukan.`);
        return;
    }

    // Hapus DataTables jika ada
    if ($.fn.DataTable && $.fn.DataTable.isDataTable(oldTable)) {
        $(oldTable).DataTable().destroy(); // Hapus inisialisasi DataTables
    }

    // Hapus tabel lama dari DOM
    oldTable.parentNode.removeChild(oldTable);

    // Buat tabel baru dengan ID dan class yang sama
    const newTable = document.createElement('table');
    newTable.id = tableId;
    newTable.className = 'table table-hover table-bordered'; // Tambahkan class yang sesuai

    // Cari elemen container #TabelUmum
    const container = document.getElementById('TabelUmum');
    if (container) {
        container.appendChild(newTable); // Tambahkan tabel baru ke dalam #TabelUmum
    } else {
        console.error('Container dengan ID "TabelUmum" tidak ditemukan.');
    }

    console.log(`Tabel "${tableId}" telah dihapus dan dibuat ulang.`);
}




//--------------------------------------------------------- Fungsi Tombol kembali ke hom -------------------------------------------------------
// Fungsi untuk menambahkan state ke riwayat browser
function pushState() {
    window.history.pushState({page: "newState"}, "", window.location.href);
}

// Tambahkan state awal ke riwayat saat halaman pertama kali dimuat
window.onload = () => {
    pushState();
};

// Event listener untuk mendeteksi tombol "kembali"
window.onpopstate = () => {
    const cardIconElem = document.getElementById('cardIcon');

    // Cek apakah elemen 'cardIcon' sedang disembunyikan
    if (cardIconElem && cardIconElem.style.display === 'none') {
        // Panggil fungsi home() untuk menampilkan kembali cardIcon
        home();
        // Kembalikan state ke riwayat agar fungsi tetap bisa mendeteksi "back"
        pushState();
    }
};