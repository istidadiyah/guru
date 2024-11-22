// Objek untuk nama bulan
const bulanNames = {
    "01": "Muharram",
    "02": "Shafar",
    "03": "Rabi'ul Awal",
    "04": "Rabi'ul Akhir",
    "05": "Jumadil Awal",
    "06": "Jumadil Akhir",
    "07": "Rajab",
    "08": "Sya'ban",
    "09": "Ramadhan",
    "10": "Syawal",
    "11": "Dzulqa'dah",
    "12": "Dzulhijjah"
};



//------------------------------------------------------------ Fungsi Input data to tabel -------------------------------------------------------------
function DataTabelTanpaTombol(tableId, jsonData, visibleColumns) {
    // Cek elemen tabel
    const table = document.getElementById(tableId);
    if (!table) {
        console.error(`Tabel dengan ID ${tableId} tidak ditemukan.`);
        return;
    }

    // Hapus konten lama (jika ada)
    table.innerHTML = '';

    // Validasi data JSON
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
        console.error("Data JSON kosong atau tidak valid.");
        return;
    }

    // Mendapatkan header dari data JSON berdasarkan kolom yang terlihat
    const visibleHeaders = visibleColumns.split(",").map(col => col.trim());
    if (visibleHeaders.length === 0) {
        console.error("Tidak ada kolom yang valid untuk ditampilkan.");
        return;
    }

    // Membuat header tabel dengan <th>
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    visibleHeaders.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    // *** Bagian Edit Header Dihapus ***
    // Jika di masa depan Anda ingin menambahkan kolom lain, Anda bisa menambahkannya di sini.

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Membuat body tabel
    const tbody = document.createElement('tbody');
    jsonData.forEach(row => {
        const tr = document.createElement('tr');

        visibleHeaders.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header] !== undefined ? row[header] : '';
            tr.appendChild(td);
        });

        // *** Bagian Edit Kolom Dihapus ***
        // Jika di masa depan Anda ingin menambahkan kolom lain, Anda bisa menambahkannya di sini.

        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // Inisialisasi ulang DataTables untuk memastikan fitur sorting berfungsi
    if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
        $(`#${tableId}`).DataTable().destroy();
    }

    // Inisialisasi DataTables
    $(`#${tableId}`).DataTable({
        responsive: true,
        // order: [],
        // lengthChange: true, // Aktifkan opsi tampilan jumlah entri
        paging: false, // Aktifkan fitur pagination


        dom: 'frptipB',
        order: [[0, 'asc']],
        
    });
}

function DataTabel(tableId, jsonData, visibleColumns) {
    // Cek elemen tabel
    const table = document.getElementById(tableId);
    if (!table) {
        console.error(`Tabel dengan ID ${tableId} tidak ditemukan.`);
        return;
    }

    // Hapus konten lama (jika ada)
    table.innerHTML = '';

    // Validasi data JSON
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
        console.error("Data JSON kosong atau tidak valid.");
        return;
    }

    // Mendapatkan header dari data JSON berdasarkan kolom yang terlihat
    const visibleHeaders = visibleColumns.split(",").map(col => col.trim());
    if (visibleHeaders.length === 0) {
        console.error("Tidak ada kolom yang valid untuk ditampilkan.");
        return;
    }

    // Membuat header tabel dengan <th>
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    visibleHeaders.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    // Tambahkan kolom untuk tombol edit
    const editTh = document.createElement('th');
    editTh.textContent = 'Edit';
    editTh.style.width = '1%'; // Lebar kecil untuk menyesuaikan tombol
    headerRow.appendChild(editTh);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Membuat body tabel
    const tbody = document.createElement('tbody');
    jsonData.forEach(row => {
        const tr = document.createElement('tr');

        visibleHeaders.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header] !== undefined ? row[header] : '';
            tr.appendChild(td);
        });

        // Tambahkan kolom untuk tombol edit
        const editTd = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'btn btn-primary btn-sm';
        
        // Menyimpan ID atau IDS ke dalam tombol edit jika tersedia
        const rowId = row['ID'] || row['IDS'];
        if (rowId !== undefined) {
            editButton.id = `edit-${rowId}`;
            editButton.dataset.rowId = rowId;
        }
        
        editButton.onclick = function () {
            // Ketika tombol edit diklik, tampilkan modal dan isi dengan data yang sesuai
            console.log(`Edit button clicked for ID: ${rowId}`);
            const dataToEdit = jsonData.find(r => r['ID'] == rowId || r['IDS'] == rowId);
            if (!dataToEdit) {
                console.error(`Data dengan ID ${rowId} tidak ditemukan.`);
                return;
            }

            // Tampilkan modal edit menggunakan Bootstrap 5 API
            const editModal = new bootstrap.Modal(document.getElementById('cardEdit'), {
                backdrop: 'static',
                keyboard: false
            });
            editModal.show();

            // Mengisi setiap input/select dalam modal sesuai dengan data JSON
            for (const key in dataToEdit) {
                if (dataToEdit.hasOwnProperty(key)) {
                    const inputElement = document.getElementById(key);
                    if (inputElement) {
                        if (inputElement.tagName.toLowerCase() === 'input' || inputElement.tagName.toLowerCase() === 'textarea') {
                            inputElement.value = dataToEdit[key];
                        } else if (inputElement.tagName.toLowerCase() === 'select') {
                            inputElement.value = dataToEdit[key];
                        }
                    }
                }
            }
        };

        editTd.appendChild(editButton);
        tr.appendChild(editTd);
        
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // Inisialisasi ulang DataTables untuk memastikan fitur sorting berfungsi
    if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
        $(`#${tableId}`).DataTable().destroy();
    }

    // Inisialisasi DataTables
    $(`#${tableId}`).DataTable({
        paging: false, // Aktifkan fitur pagination
        dom: 'frtipB',      
        scrollY: 500,
        order: [[0, 'asc']],
    });

}

function DataTabelSelect(tableId, jsonData) {
    // Cek elemen tabel
    const table = document.getElementById(tableId);
    if (!table) {
        console.error(`Tabel dengan ID ${tableId} tidak ditemukan.`);
        return;
    }

    // Hapus konten lama (jika ada)
    table.innerHTML = '';

    // Validasi data JSON
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
        console.error("Data JSON kosong atau tidak valid.");
        return;
    }

    // Membuat header tabel dengan <th> untuk Nama dan Kel
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const thNama = document.createElement('th');
    thNama.style.width = '100%'
    thNama.textContent = 'Nama';
    headerRow.appendChild(thNama);

    const thKel = document.createElement('th');
    thKel.textContent = 'K';
    headerRow.appendChild(thKel);

    const thAbsen = document.createElement('th');
    // Tidak ada teks di header untuk kolom Absen
    thAbsen.style.width = '1%'; // Lebar kecil untuk menyesuaikan tombol
    headerRow.appendChild(thAbsen);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Membuat body tabel
    const tbody = document.createElement('tbody');
    jsonData.forEach(row => {
        const tr = document.createElement('tr');

        // Kolom Nama
        const tdNama = document.createElement('td');
        tdNama.textContent = row['Nama'] !== undefined ? row['Nama'] : '';
        tr.appendChild(tdNama);

        // Kolom Kel
        const tdKel = document.createElement('td');
        tdKel.textContent = row['KelMD'] !== undefined ? row['KelMD'] : '';
        tr.appendChild(tdKel);

        // Kolom Absen
        const tdAbsen = document.createElement('td');
        const absenButton = document.createElement('button');
        absenButton.className = 'btn btn-light btn-sm'; // Tombol awal tanpa warna

        // Menyimpan ID atau IDS ke dalam tombol absen jika tersedia
        const rowId = row['ID'] || row['IDS'];
        if (rowId !== undefined) {
            absenButton.id = `absen-${rowId}`;
            absenButton.dataset.rowId = rowId;
        }

        absenButton.onclick = function () {
            // Array untuk status tombol
            const statuses = [
                { text: '', class: 'btn-light' }, // Kosong
                { text: 'H', class: 'btn-success' }, // Hijau
                { text: 'A', class: 'btn-danger' }, // Merah
                { text: 'I', class: 'btn-warning' }, // Kuning
                { text: 'S', class: 'btn-primary' } // Biru
            ];

            // Ambil status saat ini
            let currentStatus = statuses.findIndex(s => absenButton.classList.contains(s.class));
            currentStatus = (currentStatus + 1) % statuses.length; // Ubah ke status berikutnya

            // Set teks dan kelas baru
            absenButton.textContent = statuses[currentStatus].text;
            absenButton.className = `btn btn-sm ${statuses[currentStatus].class}`;

            // Panggil fungsi UpdateAbsen dengan parameter yang diperlukan
            const nama = row['Nama'] || '';
            const kelMD = row['KelMD'] || '';
            JsonAbsen(rowId, nama, kelMD, statuses[currentStatus].text);
        };

        tdAbsen.appendChild(absenButton);
        tr.appendChild(tdAbsen);

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    // Inisialisasi ulang DataTables untuk memastikan fitur sorting berfungsi
    if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
        $(`#${tableId}`).DataTable().destroy();
    }

    // Inisialisasi DataTables
    $(`#${tableId}`).DataTable({
        paging: false,
        dom: '<"top"f>rt<"bottom"B>', // Menempatkan tombol di bawah tabel
        scrollY: 500,
        order: [[2, 'asc']],
        buttons: [
            {
                extend: 'excelHtml5',
                text: 'Excel',
                exportOptions: {
                    columns: ':visible',
                    format: {
                        body: function (data, row, column, node) {
                            if ($(node).find('button').length > 0) {
                                return $(node).find('button').text();
                            }
                            return data;
                        }
                    }
                }
            },
            {
                extend: 'pdfHtml5',
                text: 'PDF',
                exportOptions: {
                    columns: ':visible',
                    format: {
                        body: function (data, row, column, node) {
                            if ($(node).find('button').length > 0) {
                                return $(node).find('button').text();
                            }
                            return data;
                        }
                    }
                }
            },
            {
                extend: 'print',
                text: 'Print',
                exportOptions: {
                    columns: ':visible',
                    format: {
                        body: function (data, row, column, node) {
                            if ($(node).find('button').length > 0) {
                                return $(node).find('button').text();
                            }
                            return data;
                        }
                    }
                }
            }
        ]
    });
}


//-------------------------------------- Updadate Isi tabel absen ------------------------------

// Fungsi untuk memperbarui tombol berdasarkan data dari JSON
function updateStatusTombol() {
    // Ambil nilai filter
    const filterJamValue = document.getElementById('filterJam').value; // Jam yang dipilih (M, 1, 2)
    const filterTanggalValue = document.getElementById('filterTanggal').value; // Tanggal yang dipilih (1 - 31)
    const filterBulanValue = document.getElementById('filterBulan').value; // Bulan yang dipilih (01, 02, dst)

    // Validasi jika filter tidak lengkap
    if (!filterJamValue || !filterTanggalValue || !filterBulanValue) {
        console.error("Semua filter harus diisi.");
        return;
    }

    // Buat kombinasi header berdasarkan filter yang dipilih (misalnya "MT1", "1T1", "MT5")
    const header = `${filterJamValue}T${filterTanggalValue}`;

    // Filter data berdasarkan bulan (IDS yang diakhiri dengan bulan yang dipilih)
    const filteredData = globalJsonData.SemuaData.Absen.filter(row => {
        return row['IDS']?.endsWith(filterBulanValue);
    });

    // Update tombol berdasarkan data yang difilter
    filteredData.forEach(row => {
        // Ambil status dari header (misalnya "MT1", "MT2", dsb.)
        const status = row[header];

        // Ambil ID tombol berdasarkan IDS yang ada di row (IDS lengkapnya adalah "46-1450025-01")
        const rowId = row['IDS'].split('-')[1]; // Ambil ID tengah dari IDS (contoh: "1450025")

        // Cari tombol berdasarkan ID dari row
        const editButton = document.querySelector(`#edit-${rowId}`);

        if (editButton) {
            // Tentukan status dan kelas tombol berdasarkan status yang didapatkan
            let statusText = '';
            let statusClass = 'btn-light'; // Default button class

            if (status === 'H') {
                statusText = 'H';
                statusClass = 'btn-success';
            } else if (status === 'A') {
                statusText = 'A';
                statusClass = 'btn-danger';
            } else if (status === 'I') {
                statusText = 'I';
                statusClass = 'btn-warning';
            } else if (status === 'S') {
                statusText = 'S';
                statusClass = 'btn-primary';
            }

            // Update tombol dengan status dan kelas yang sesuai
            editButton.textContent = statusText;
            editButton.className = `btn btn-sm ${statusClass}`;
        }
    });
}

// Panggil fungsi updateStatusTombol setiap kali filter berubah
document.getElementById('filterJam').addEventListener('change', updateStatusTombol);
document.getElementById('filterTanggal').addEventListener('change', updateStatusTombol);
document.getElementById('filterBulan').addEventListener('change', updateStatusTombol);



//----------------------------------------------------------- Fungsi Absen -----------------------------------
// Fungsi UpdateAbsen yang akan dipanggil
// Antrian JSON global
let JsonAntrian = {
    Absen: [],
    AbsenGuru: []
};

// Fungsi untuk mengirim data ke server setelah 3 detik tidak ada perubahan
let sendTimeout;
// Update jumlah antrian dan visibilitas elemen
function updateAntrianDisplay() {
    const antrianElement = document.getElementById("antrianJson");
    const absenCount = JsonAntrian.Absen.length; // Hitung jumlah data di Absen

    if (absenCount > 0) {
        antrianElement.style.display = "block"; // Tampilkan antrian
        antrianElement.innerText = absenCount; // Perbarui jumlah data
    } else {
        antrianElement.style.display = "none"; // Sembunyikan antrian jika kosong
        antrianElement.innerText = "0"; // Reset teks ke 0
    }
}

// Fungsi untuk memperbarui atau menambah data ke dalam Antrian JSON
function updateAntrianJson(data, isGuru = false) {
    const targetArray = isGuru ? JsonAntrian.AbsenGuru : JsonAntrian.Absen;

    // Cek apakah IDS sudah ada di dalam antrian
    const existingIndex = targetArray.findIndex(item => item.IDS === data.IDS);

    if (existingIndex !== -1) {
        // Jika IDS sudah ada, perbarui data
        targetArray[existingIndex] = { ...targetArray[existingIndex], ...data };
    } else {
        // Jika IDS belum ada, tambahkan data baru
        targetArray.push(data);
    }

    // Perbarui tampilan antrian hanya untuk Absen (bukan AbsenGuru)
    if (!isGuru) {
        updateAntrianDisplay();
    }

    // Kirim data dengan penundaan
    sendDelayedData();
}

// Fungsi untuk mengirim data ke server setelah 3 detik tidak ada perubahan

function sendDelayedData() {
    if (sendTimeout) clearTimeout(sendTimeout);
    sendTimeout = setTimeout(() => {
        sendPostWithGet(JsonAntrian); // Fungsi pengiriman data

        // Reset antrian setelah pengiriman berhasil
        JsonAntrian.Absen = []; // Kosongkan Absen
        JsonAntrian.AbsenGuru = []; // Kosongkan AbsenGuru

        // Perbarui tampilan antrian
        updateAntrianDisplay();
    }, 5000); // Tunggu 3 detik sebelum mengirim
}

// Fungsi untuk mendapatkan tanggal dan waktu dalam format "DD/MM/YYYY HH:mm:ss"
function getFormattedDate() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0'); // Jam dalam format 24 jam
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

// Fungsi Absen yang akan dipanggil ketika tombol ditekan
function JsonAbsen(id, nama, kelMD, status) {
    // Ambil nilai dari filterBulan, filterJam, dan filterTanggal
    const filterBulan = document.getElementById('filterBulan').value; // Contoh: "1450023-02"
    const filterJam = document.getElementById('filterJam').value;     // Contoh: "M"
    const filterTanggal = document.getElementById('filterTanggal').value; // Contoh: "1"

    // Pastikan nilai-nilai tersedia
    if (!filterBulan || !filterJam || !filterTanggal) {
        console.error("Pastikan semua filter (Bulan, Jam, Tanggal) telah diisi.");
        return;
    }

    // Buat IDS
    const IDS = `46-${id}-${filterBulan}`;

    // Buat header kolom (contoh: "MT1")
    const header = `${filterJam}T${filterTanggal}`;

    // Ambil nama bulan dari objek bulanNames
    const bulanKey = filterBulan.slice(-2); // Ambil dua digit terakhir dari filterBulan
    const bulan = bulanNames[bulanKey] || "Bulan Tidak Valid";

    // Ambil TanggalUpdate
    const TanggalUpdate = getFormattedDate(); // Format: "DD/MM/YYYY HH:mm:ss"

    // Buat objek JSON untuk Absen
    const Absen = {
        TanggalUpdate: TanggalUpdate,
        IDS: IDS,
        Nama: nama,
        Kelas: kelMD,
        Bulan: bulan
    };

    // Tambahkan header kolom dan status
    Absen[header] = status;

    // Update data ke dalam antrian JSON (untuk Absen)
    UpdateCacheJson(globalJsonData, "SemuaData.Absen", "IDS", IDS, header, status)
    updateAntrianJson(Absen);

    // Ambil data Guru
    const IDGuru = document.getElementById('IDGuru').innerText; // Ambil IDGuru
    const NamaGuru = document.getElementById('NamaGuru').innerText; // Ambil NamaGuru

    // Buat objek JSON untuk AbsenGuru
    const AbsenGuru = {
        TanggalUpdate: TanggalUpdate,
        IDS: `46-${IDGuru}-${filterBulan}`,
        Nama: NamaGuru,
        Kelas: kelMD,
        Bulan: bulan
    };

    // Tambahkan header kolom dan status
    AbsenGuru[header] = 'H';

    // Update data ke dalam antrian JSON (untuk AbsenGuru)
    updateAntrianJson(AbsenGuru, true);
}



//---------------------------------------------------- Edit Json Utama di scache -------------------------------------------
/**
 * Fungsi untuk memperbarui data dalam cache JSON, atau menambahkan data baru jika tidak ditemukan.
 * @param {object} jsonData - Objek JSON utama yang akan diperbarui (contoh: globalJsonData.Santri).
 * @param {string} path - Jalur di dalam JSON untuk menemukan data yang akan diperbarui (contoh: "Santri" atau "SemuaData.Absen").
 * @param {string} idKey - Kunci unik yang digunakan untuk mencari data (contoh: "ID" atau "IDS").
 * @param {string} idValue - Nilai ID unik untuk menemukan atau menambahkan entri.
 * @param {string} header - Nama kolom atau properti yang akan diperbarui.
 * @param {any} newValue - Nilai baru yang akan dimasukkan ke dalam JSON.
 * @returns {boolean} - True jika pembaruan atau penambahan berhasil, false jika gagal.
 */
function UpdateCacheJson(jsonData, path, idKey, idValue, header, newValue) {
    try {
        // Pastikan jalur valid dan data target ada
        const targetData = path.split('.').reduce((obj, key) => obj && obj[key], jsonData);
        if (!targetData || !Array.isArray(targetData)) {
            console.error("Data target tidak ditemukan atau bukan array:", path);
            return false;
        }

        // Cari item yang sesuai dengan idKey dan idValue
        const itemIndex = targetData.findIndex(item => item[idKey] === idValue);

        if (itemIndex === -1) {
            // Jika tidak ditemukan, tambahkan sebagai data baru
            const newItem = { [idKey]: idValue, [header]: newValue };
            targetData.push(newItem);
            console.log(`Data baru ditambahkan: ${JSON.stringify(newItem)}`);
        } else {
            // Jika ditemukan, perbarui header dengan nilai baru
            targetData[itemIndex][header] = newValue;
            console.log(`Data berhasil diperbarui pada ${idKey}: ${idValue}, ${header}: ${newValue}`);
        }

        // Simpan perubahan ke cache lokal
        const cacheObject = JSON.parse(localStorage.getItem(CACHE_KEY));
        if (cacheObject && cacheObject.data) {
            path.split('.').reduce((obj, key, idx, arr) => {
                if (idx === arr.length - 1) {
                    obj[key] = targetData; // Perbarui array target
                }
                return obj[key];
            }, cacheObject.data);

            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
            console.log("Cache diperbarui di localStorage.");
        }

        return true;
    } catch (error) {
        console.error("Terjadi kesalahan saat memperbarui JSON:", error);
        return false;
    }
}






//--------------------------------------------------- Vlook Up dari Json ---------------------------------------------




//------------------------------------------------- Tombol Edit Semua Tabel ------------------------------------
// Fungsi untuk tombol Edit
function EditData(jsonData) {
    // Tambahkan event listener untuk semua tombol edit
    document.querySelectorAll('[id^="edit-"]').forEach(button => {
        button.addEventListener('click', function () {
            const rowId = this.dataset.rowId;
            if (!rowId) {
                console.error('ID tidak ditemukan pada tombol edit.');
                return;
            }

            // Cari data dalam JSON berdasarkan ID
            const dataToEdit = jsonData.find(row => row['ID'] == rowId || row['IDS'] == rowId);
            if (!dataToEdit) {
                console.error(`Data dengan ID ${rowId} tidak ditemukan.`);
                return;
            }

            // Tampilkan modal edit
            const editModal = new bootstrap.Modal(document.getElementById('cardEdit'), {
                backdrop: 'static',
                keyboard: false
            });
            editModal.show();

            // Mengisi setiap input/select dalam modal sesuai dengan data JSON
            for (const key in dataToEdit) {
                if (dataToEdit.hasOwnProperty(key)) {
                    const inputElement = document.getElementById(key);
                    if (inputElement) {
                        if (inputElement.tagName.toLowerCase() === 'input' || inputElement.tagName.toLowerCase() === 'textarea') {
                            inputElement.value = dataToEdit[key];
                        } else if (inputElement.tagName.toLowerCase() === 'select') {
                            inputElement.value = dataToEdit[key];
                        }
                    }
                }
            }
        });
    });
}

