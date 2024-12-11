const scriptPostURL = 'https://script.google.com/macros/s/AKfycbxjihsdj_d2k0KgvbMHmHj-E95OpYl9pHrq98KB5vnFiBcJZwMn0QBCiT5GLwXLwdz5YA/exec';

async function fetchDataFromAppScript(dataSettings = {}, forceRefresh = false) {
    const urlBase = scriptPostURL;
    const loadingSpinner = document.getElementById("loadingSpinner");

    /*
    if (loadingSpinner) {
        loadingSpinner.style.display = 'flex';
    }
    */

    // Fungsi untuk menghapus durasi dan menyiapkan data sebelum dikirim ke server
    const removeDurasiAndPrepareData = (data) => {
        const filteredData = {};
        Object.keys(data).forEach(key => {
            if (data[key].durasi) {
                const { durasi, ...rest } = data[key];
                filteredData[key] = rest;
            } else {
                filteredData[key] = data[key];
            }
        });
        return filteredData;
    };

    // Fungsi untuk menyimpan dan memproses data setelah diambil
    const processData = (data, dataKey) => {
        if (data) {
            try {
                // Menyimpan data ke cache (localStorage)
                localStorage.setItem(dataKey, JSON.stringify({ data, timestamp: Date.now() }));
                console.log(`Data ${dataKey} dan timestamp disimpan ke cache.`);
            } catch (e) {
                console.error(`Gagal menyimpan data ${dataKey} ke cache:`, e);
            }
        } else {
            console.error(`Data ${dataKey} tidak lengkap atau tidak valid.`);
        }
    };

    // Fungsi untuk mengambil data dari server
    const fetchFromServer = async () => {
        const filteredData = removeDurasiAndPrepareData(dataSettings);
        const filters = encodeURIComponent(JSON.stringify(filteredData));
        const url = `${urlBase}?action=Data&filters=${filters}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            const data = await response.json();
            console.log("Data diterima:", data);

            // Proses setiap data yang dipilih untuk disimpan
            Object.keys(dataSettings).forEach((dataKey) => {
                const dataToCache = data[dataKey];
                if (dataToCache) {
                    processData(dataToCache, dataKey);
                } else {
                    console.error(`Data untuk kunci "${dataKey}" tidak ditemukan.`);
                }
            });
        } catch (error) {
            console.error("Terjadi kesalahan saat mengambil data:", error);
        } finally {
            if (loadingSpinner) {
                loadingSpinner.style.display = "none"; // Menyembunyikan spinner setelah selesai
            }
        }
    };

    // Jika forceRefresh aktif, ambil data langsung dari server dan perbarui cache
    if (forceRefresh) {
        console.log("Force refresh aktif. Mengambil data dari server dan memperbarui cache.");
        await fetchFromServer();
        return;
    }

    // Memeriksa cache untuk setiap data yang dipilih
    Object.keys(dataSettings).forEach(async (dataKey) => {
        const cachedData = localStorage.getItem(dataKey);
        if (cachedData) {
            try {
                const parsedCache = JSON.parse(cachedData);
                const currentTime = Date.now();
                const cacheTime = parsedCache.timestamp;
                const cacheDuration = dataSettings[dataKey].durasi || Infinity;  // Durasi default selamanya (Infinity)

                // Memeriksa apakah cache masih berlaku
                if (cacheDuration === Infinity || (currentTime - cacheTime) < cacheDuration) {
                    console.log(`Data ${dataKey} diambil dari cache:`, parsedCache.data);
                    processData(parsedCache.data, dataKey);
                    if (loadingSpinner) {
                        loadingSpinner.style.display = "none"; // Menyembunyikan spinner setelah selesai
                    }
                } else {
                    console.log(`Cache ${dataKey} sudah kedaluwarsa. Mengambil data baru dari server.`);
                    await fetchFromServer();
                }
            } catch (e) {
                console.error(`Gagal memparsing cache ${dataKey}:`, e);
                await fetchFromServer();
            }
        } else {
            console.log(`Tidak ada data cache untuk ${dataKey}. Mengambil data dari server.`);
            await fetchFromServer();
        }
    });
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
                // Sheet dianggap berhasil jika ada update atau tidak perlu update/buat baris baru
                const isSuccessful = 
                    sheetData.IDS.updated || sheetData.IDS.newRowIndexes.length > 0;
    
                if (!isSuccessful) {
                    allSuccess = false;
                    failedSheets.push(sheetData.sheet); // Tambahkan sheet yang gagal
                }
            });
    
            if (allSuccess) {
                console.log("Semua sheet berhasil diproses:", data);
                // Hapus data dari cache jika semua sheet berhasil
                removeDataFromCache(jsonData);
            } else {
                console.error("Beberapa sheet gagal diproses:", failedSheets);
                addToFailedTable(jsonData, `Sheet gagal: ${failedSheets.join(", ")}`);
            }
        } else {
            console.error("Respons server tidak valid atau tidak ada data sukses:", data);
            addToFailedTable(jsonData, "Format respons server tidak sesuai.");
        }
    
        // Log kesalahan tambahan jika ada
        if (data && Array.isArray(data.errors) && data.errors.length > 0) {
            console.error("Kesalahan server tambahan:", data.errors);
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
