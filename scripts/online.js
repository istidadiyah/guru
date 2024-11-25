// Variabel global untuk menyimpan data JSON dari Google Sheets
const scriptPostURL = 'https://script.google.com/macros/s/AKfycbxjihsdj_d2k0KgvbMHmHj-E95OpYl9pHrq98KB5vnFiBcJZwMn0QBCiT5GLwXLwdz5YA/exec';
let globalJsonData = {};

// Nama kunci untuk menyimpan data di localStorage
const CACHE_KEY = 'googleSheetsData';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 jam dalam milidetik

/**
 * Fungsi untuk mengambil data dari Google Sheets dan menyimpan dalam variabel global.
 * @param {boolean} forceRefresh - Jika true, akan memaksa mengambil data dari server dan memperbarui cache.
 */
async function fetchDataFromAppScript(forceRefresh = false) {
    const url = scriptPostURL;
    const loadingSpinner = document.getElementById("loadingSpinner");
    if (loadingSpinner) {
        loadingSpinner.style.display = "flex"; // Perbaiki nilai display menjadi "block"
    }

    const processData = (data) => {
        if (data) {
            globalJsonData = data;
            const cacheObject = {
                data: data,
                timestamp: new Date().getTime()
            };
            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
                console.log("Data dan timestamp disimpan ke cache.");
            } catch (e) {
                console.error("Gagal menyimpan data ke cache:", e);
            }

            if (data.SemuaData && data.SemuaData.Kelompok) {
                DataTabelTanpaTombol("Kelompok", data.SemuaData.Kelompok, "ID, WaliKelas");
            } else {
                console.error("Data Kelompok tidak ditemukan.");
            }
        } else {
            console.error("Data tidak lengkap atau tidak valid.");
        }
    };

    const fetchFromServer = async () => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            const data = await response.json();
            console.log("Data diterima:", data);
            processData(data);
        } catch (error) {
            console.error("Terjadi kesalahan saat mengambil data:", error);
        } finally {
            if (loadingSpinner) {
                loadingSpinner.style.display = "none"; // Sembunyikan spinner setelah proses selesai
            }
        }
    };

    if (forceRefresh) {
        console.log("Force refresh aktif. Mengambil data dari server dan memperbarui cache.");
        await fetchFromServer();
        return;
    }

    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
        try {
            const parsedCache = JSON.parse(cachedData);
            const currentTime = Date.now();
            const cacheTime = parsedCache.timestamp;

            if ((currentTime - cacheTime) < CACHE_DURATION) {
                console.log("Data diambil dari cache:", parsedCache.data);
                globalJsonData = parsedCache.data;

                if (globalJsonData.SemuaData && globalJsonData.SemuaData.Kelompok) {
                    DataTabelTanpaTombol("Kelompok", globalJsonData.SemuaData.Kelompok, "ID, WaliKelas");
                } else {
                    console.error("Data Kelompok tidak ditemukan dalam cache.");
                }

                if (loadingSpinner) {
                    loadingSpinner.style.display = "none";
                }

                return;
            } else {
                console.log("Cache sudah kedaluwarsa. Mengambil data baru dari server.");
                await fetchFromServer();
            }
        } catch (e) {
            console.error("Gagal memparsing data dari cache:", e);
            await fetchFromServer();
        }
    } else {
        console.log("Tidak ada data di cache. Mengambil data dari server.");
        await fetchFromServer();
    }
}








let antrianPostCount = 0;

/**
 * Mengirim data JSON menggunakan metode GET.
 * @param {Object} jsonData - Data JSON yang akan dikirim.
 */
async function sendPostWithGet(jsonData) {
    antrianPostCount++;
    updateAntrianCounterPost();

    try {
        // Periksa koneksi internet
        if (!navigator.onLine) {
            throw new Error("Tidak ada koneksi internet.");
        }

        // Encode data menjadi parameter URL
        const encodedData = encodeData({
            action: "Post",
            json: JSON.stringify(jsonData)
        });

        // Kirim permintaan GET ke server
        const response = await fetch(`${scriptPostURL}?${encodedData}`, {
            method: "GET"
        });

        // Jika respons tidak OK, lemparkan kesalahan
        if (!response.ok) {
            throw new Error(`Respons jaringan tidak OK: ${response.statusText}`);
        }

        // Parsing data dari respons server
        const data = await response.json();
        console.log("Respons server:", data);

        // Proses hasil respons
        processPostResponse(data, jsonData);
    } catch (error) {
        console.error("Kesalahan saat mengirim data:", error);

        // Masukkan data ke tabel gagal jika terjadi kesalahan
        addToFailedTable(jsonData, error.message || "Kesalahan tidak diketahui.");
    } finally {
        // Kurangi jumlah antrian aktif
        antrianPostCount--;
        updateAntrianCounterPost();
    }
}


/**
 * Memperbarui tampilan jumlah antrian Post.
 */
function updateAntrianCounterPost() {
    const antrianElement = document.getElementById('antrianCounter');
    if (antrianElement) {
        antrianElement.textContent = antrianPostCount;
        antrianElement.style.display = antrianPostCount > 0 ? 'block' : 'none';
    }
}

/**
 * Fungsi untuk encode data ke URL-encoded format.
 * @param {Object} data - Data yang akan di-encode.
 * @returns {string} - Data dalam format URL-encoded.
 */
function encodeData(data) {
    return Object.keys(data)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join("&");
}

function addToFailedTable(jsonData, error) {
    const table = document.getElementById('tablePost');
    const jsonHash = hashJson(jsonData); // Buat hash unik untuk JSON

    // Cek apakah data sudah ada di tabel
    if (isJsonAlreadyInTable(jsonHash, table)) {
        console.warn("Data JSON sudah ada di tabel, tidak ditambahkan lagi.");
        return;
    }

    if (!table.tHead) {
        const header = table.createTHead();
        const row = header.insertRow();
        ['No', 'JSON', 'Error', 'Action'].forEach(text => {
            const cell = row.insertCell();
            cell.textContent = text;
        });
    }

    const body = table.tBodies[0] || table.createTBody();
    const row = body.insertRow();
    const rowCount = body.rows.length;

    row.insertCell(0).textContent = rowCount;
    row.insertCell(1).textContent = JSON.stringify(jsonData, null, 2); // Pretty-print untuk debugging
    row.insertCell(2).textContent = error;

    const actionCell = row.insertCell(3);
    const retryButton = document.createElement('button');
    retryButton.textContent = 'Ulangi';
    retryButton.className = 'btn btn-primary';
    retryButton.onclick = async () => {
        const success = await retrySendPost(jsonData, row);
        if (success) removeTableRow(row); // Hapus dari tabel jika berhasil
    };
    actionCell.appendChild(retryButton);

    // Tambahkan atribut hash ke row untuk identifikasi
    row.dataset.jsonHash = jsonHash;
}


/**
 * Memeriksa apakah JSON sudah ada di tabel kesalahan.
 * @param {string} jsonHash - Hash unik dari JSON.
 * @param {HTMLTableElement} table - Elemen tabel untuk memeriksa data.
 * @returns {boolean} - True jika JSON sudah ada di tabel, false jika belum.
 */
function isJsonAlreadyInTable(jsonHash, table) {
    const body = table.tBodies[0];
    if (!body) return false;

    for (let row of body.rows) {
        const existingJsonHash = row.dataset.jsonHash; // Ambil hash dari atribut data
        if (existingJsonHash === jsonHash) {
            return true;
        }
    }
    return false;
}

/**
 * Memeriksa apakah JSON sudah ada di cache.
 * @param {string} jsonHash - Hash unik dari JSON.
 * @returns {boolean} - True jika JSON sudah ada di cache, false jika belum.
 */
function isJsonAlreadyInCache(jsonHash) {
    const failedData = JSON.parse(localStorage.getItem('failedData') || '[]');
    return failedData.some(item => hashJson(item.data) === jsonHash);
}

function saveFailedDataToCache(jsonData, error) {
    const failedData = JSON.parse(localStorage.getItem('failedData') || '[]');
    const jsonHash = hashJson(jsonData);

    if (!failedData.some(item => hashJson(item.data) === jsonHash)) {
        failedData.push({ data: jsonData, error });
        localStorage.setItem('failedData', JSON.stringify(failedData));
        console.log("Data gagal disimpan ke cache:", jsonData);
    } else {
        console.warn("Data sudah ada di cache, tidak disimpan ulang.");
    }
}

function removeDataFromCache(jsonData) {
    const failedData = JSON.parse(localStorage.getItem('failedData') || '[]');
    const jsonHash = hashJson(jsonData);

    const updatedData = failedData.filter(item => hashJson(item.data) !== jsonHash);
    localStorage.setItem('failedData', JSON.stringify(updatedData));
    console.log("Data berhasil dihapus dari cache:", jsonData);
}

/**
 * Membuat hash unik untuk JSON dengan urutan konsisten.
 * @param {Object} json - Data JSON.
 * @returns {string} - Hash unik dari JSON.
 */
function hashJson(json) {
    const orderedJson = JSON.stringify(json, Object.keys(json).sort()); // Urutkan kunci
    return btoa(orderedJson); // Encode JSON sebagai string base64
}


/**
 * Menghapus baris dari tabel kesalahan.
 * @param {HTMLTableRowElement} row - Baris tabel yang akan dihapus.
 */
function removeTableRow(row) {
    if (row && row.parentNode) {
        row.parentNode.removeChild(row);
    }
}

/**
 * Mengirim ulang data JSON dari tabel kesalahan.
 * @param {Object} jsonData - Data JSON yang gagal dikirim.
 * @param {HTMLTableRowElement} row - Baris tabel yang terkait.
 * @returns {Promise<boolean>} - True jika berhasil dikirim ulang, false jika gagal.
 */
async function retrySendPost(jsonData, row) {
    antrianPostCount++;
    updateAntrianCounterPost();

    try {
        // Encode data untuk request
        const encodedData = encodeData({
            action: 'Post',
            json: JSON.stringify(jsonData)
        });

        // Kirim ulang data ke server
        const response = await fetch(`${scriptPostURL}?${encodedData}`, { method: 'GET' });

        // Cek respons server
        if (!response.ok) {
            throw new Error(`Respons jaringan tidak OK: ${response.statusText}`);
        }

        const data = await response.json();

        // Verifikasi apakah server berhasil memproses data
        if (data && Array.isArray(data.success) && data.success.length > 0) {
            console.log("Data berhasil dikirim ulang:", data);

            // Hapus data dari cache jika berhasil
            removeDataFromCache(jsonData);

            return true; // Berhasil
        } else {
            throw new Error(data.error || "Respons server tidak valid.");
        }
    } catch (error) {
        console.error("Gagal mengirim ulang data:", error);
        row.cells[2].textContent = error.message; // Update pesan error pada tabel
        return false; // Gagal
    } finally {
        antrianPostCount--;
        updateAntrianCounterPost();
    }
}



/**
 * Menghapus baris dari tabel kesalahan.
 * @param {HTMLTableRowElement} row - Baris tabel yang akan dihapus.
 */
function removeTableRow(row) {
    row.parentNode.removeChild(row);
}

// Contoh pengiriman data
const samplePostJson = {
    "Absen": [
        {
            "TanggalUpdate": "21/07/2024 6:11:15",
            "IDS": "03-1450024-02",
            "Nama": "Ini Ini paling update update",
            "Bulan": "Muharram",
            "MT1": "H"
        },
        {
            "TanggalUpdate": "22/07/2024 7:12:10",
            "IDS": "04-1450024-03",
            "Nama": "Data kedua update",
            "Bulan": "Muharram",
            "MT1": "A"
        },
        {
            "TanggalUpdate": "23/07/2024 8:13:05",
            "IDS": "05-1450024-04",
            "Nama": "Data ketiga update",
            "Bulan": "Muharram",
            "MT1": "S"
        }
    ],
    "AbsenGuru": [
        {
            "TanggalUpdate": "21/07/2024 6:15:20",
            "IDS": "06-1450024-05",
            "Nama": "Guru pertama",
            "Bulan": "Muharram",
            "MT1": "I"
        }
    ]
};
