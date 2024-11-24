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

    // Fungsi untuk memproses respons server
    const processPostResponse = (data, jsonData) => {
        let allSuccess = true; // Untuk melacak apakah semua berhasil
        let failedSheets = []; // Menyimpan sheet yang gagal

        if (data && Array.isArray(data.success)) {
            data.success.forEach(sheetData => {
                // Cek apakah sheet berhasil diperbarui
                if (
                    sheetData.IDS.newRowIndexes.length === 0 &&
                    sheetData.IDS.updated
                ) {
                    console.log(
                        `${sheetData.sheet} berhasil diperbarui tanpa baris baru.`
                    );
                } else if (sheetData.IDS.newRowIndexes.length === 0) {
                    // Jika tidak ada baris baru atau update, tandai sebagai gagal
                    allSuccess = false;
                    failedSheets.push(sheetData.sheet);
                }
            });

            if (allSuccess) {
                console.log("Data berhasil diproses untuk semua sheet:", data);
            } else {
                console.error("Beberapa sheet gagal diproses:", failedSheets);
                addToFailedTable(jsonData, `Sheet gagal: ${failedSheets.join(", ")}`);
            }
        } else {
            console.error(
                "Respons server tidak valid atau tidak ada data sukses:",
                data
            );
            addToFailedTable(jsonData, "Format respons server tidak sesuai.");
        }

        // Log kesalahan tambahan jika ada
        if (data && Array.isArray(data.errors) && data.errors.length > 0) {
            console.error("Server errors:", data.errors);
        }
    };

    try {
        // Cek koneksi internet
        if (!navigator.onLine) {
            throw new Error("Tidak ada koneksi internet.");
        }

        const encodedData = encodeData({
            action: "Post",
            json: JSON.stringify(jsonData)
        });

        const response = await fetch(`${scriptPostURL}?${encodedData}`, {
            method: "GET"
        });

        if (!response.ok)
            throw new Error(`Respons jaringan tidak OK: ${response.statusText}`);

        const data = await response.json();
        console.log("Respons server:", data);
        processPostResponse(data, jsonData);
    } catch (error) {
        console.error("Kesalahan saat mengirim data:", error);

        // Masukkan semua JSON ke tabel gagal
        addToFailedTable(jsonData, error.message || "Kesalahan tidak diketahui.");
    } finally {
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

/**
 * Menambahkan data ke tabel kesalahan jika gagal dikirim.
 * @param {Object} jsonData - Data JSON yang gagal dikirim.
 * @param {string} error - Pesan kesalahan.
 */
function addToFailedTable(jsonData, error) {
    const table = document.getElementById('tablePost');
    const jsonString = JSON.stringify(jsonData);

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
    row.insertCell(1).textContent = jsonString;
    row.insertCell(2).textContent = error;

    const actionCell = row.insertCell(3);
    const retryButton = document.createElement('button');
    retryButton.textContent = 'Ulangi';
    retryButton.className = 'btn btn-primary';
    retryButton.onclick = async () => {
        const success = await retrySendPost(jsonData, row);
        if (success) removeTableRow(row);
    };
    actionCell.appendChild(retryButton);

    // Simpan data ke localStorage
    saveFailedDataToCache(jsonData, error);
}


/**
 * Mengirim ulang data JSON dari tabel kesalahan.
 * @param {Object} jsonData - Data JSON yang gagal dikirim.
 * @param {HTMLTableRowElement} row - Baris tabel yang terkait.
 * @returns {boolean} - True jika berhasil dikirim ulang, false jika gagal.
 */
async function retrySendPost(jsonData, row) {
    antrianPostCount++;
    updateAntrianCounterPost();

    try {
        const encodedData = encodeData({ action: 'Post', json: JSON.stringify(jsonData) });
        const response = await fetch(`${scriptPostURL}?${encodedData}`, { method: 'GET' });

        if (!response.ok) throw new Error(`Network response not ok: ${response.statusText}`);

        const data = await response.json();

        if (data && Array.isArray(data.success)) {
            console.log("Data berhasil dikirim ulang:", data);
            return true;
        } else {
            throw new Error(data.error || "Respons server tidak valid.");
        }
    } catch (error) {
        row.cells[2].textContent = error.message;
        return false;
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
