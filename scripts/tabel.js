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
function DataTabelRekap(tableId, jsonData, visibleColumns) {
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

    // Ambil filter bulan dari elemen dengan ID "filterBulan"
    const filterBulanElement = document.getElementById('filterBulan');
    if (!filterBulanElement) {
        console.error("Elemen filterBulan tidak ditemukan.");
        return;
    }

    const selectedBulan = filterBulanElement.value; // Ambil value bulan yang dipilih
    if (!selectedBulan) {
        console.error("Bulan tidak dipilih atau value bulan kosong.");
        return;
    }

    // Ambil filter kelas dari elemen dengan ID "kelmdFilter"
    const kelmdFilterElement = document.getElementById('kelmdFilter');
    if (!kelmdFilterElement) {
        console.error("Elemen kelmdFilter tidak ditemukan.");
        return;
    }

    const selectedKelas = kelmdFilterElement.value; // Ambil value kelas yang dipilih

    // Filter data JSON berdasarkan IDS yang diakhiri dengan bulan terpilih dan kelas
    const filteredData = jsonData.filter(row => {
        const idsBulan = row.IDS ? row.IDS.slice(-2) : null;
        const rowKelas = row.Kelas || ''; // Pastikan properti Kelas ada di data JSON

        // Filter berdasarkan bulan dan kelas
        const matchBulan = idsBulan === selectedBulan;
        const matchKelas = !selectedKelas || selectedKelas === rowKelas; // Jika kelas kosong, tampilkan semua

        return matchBulan && matchKelas;
    });

    // Periksa apakah ada data yang sesuai filter
    if (filteredData.length === 0) {
        console.warn("Tidak ada data yang sesuai dengan filter bulan dan kelas.");
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
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Membuat body tabel
    const tbody = document.createElement('tbody');
    filteredData.forEach(row => {
        const tr = document.createElement('tr');

        visibleHeaders.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header] !== undefined ? row[header] : '';
            tr.appendChild(td);
        });

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
        paging: false, // Matikan fitur pagination
        dom: 'frptipB',
        order: [[1, 'asc']],
        scrollx: true,
        scrollY: 800
    });
}




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


        dom: 'frptip',
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
        dom: 'frtip',      
        scrollY: 500,
        order: [[0, 'asc']],
    });

}

function TabelSelect(tableId, jsonData) {
    const table = document.getElementById(tableId);
    if (!table) {
        console.error(`Tabel dengan ID ${tableId} tidak ditemukan.`);
        return;
    }

    // Hapus konten lama
    table.innerHTML = '';

    if (!Array.isArray(jsonData) || jsonData.length === 0) {
        console.error("Data JSON kosong atau tidak valid.");
        return;
    }

    // Header tabel
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Kolom Nama
    const thNama = document.createElement('th');
    thNama.style.width = '100%';
    thNama.textContent = 'Nama';
    headerRow.appendChild(thNama);

    // Kolom Kelompok
    const thKel = document.createElement('th');
    thKel.textContent = 'K';
    headerRow.appendChild(thKel);

    // Kolom Absen
    const thAbsen = document.createElement('th');
    thAbsen.textContent = 'A';
    thAbsen.style.width = '1%'; 
    headerRow.appendChild(thAbsen);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Body tabel
    const tbody = document.createElement('tbody');
    jsonData.forEach(row => {
        const tr = document.createElement('tr');

        // Nama
        const tdNama = document.createElement('td');
        tdNama.textContent = row['Nama'] || '';
        tr.appendChild(tdNama);

        // Kelompok
        const tdKel = document.createElement('td');
        tdKel.textContent = row['KelMD'] || '';
        tr.appendChild(tdKel);

        // Tombol Absen
        const tdAbsen = document.createElement('td');
        const absenButton = document.createElement('button');
        absenButton.className = 'btn btn-light btn-sm';

        // ID untuk tombol
        const rowId = row['ID'] || row['IDS'];
        if (rowId) {
            absenButton.id = `absen-${rowId}`;
            absenButton.dataset.rowId = rowId;
        }

        // Klik untuk mengubah status
        absenButton.onclick = function () {
            const statuses = [
                { text: '', class: 'btn-light' },
                { text: 'H', class: 'btn-success' },
                { text: 'A', class: 'btn-danger' },
                { text: 'I', class: 'btn-warning' },
                { text: 'S', class: 'btn-primary' }
            ];

            let currentStatus = statuses.findIndex(s => absenButton.classList.contains(s.class));
            currentStatus = (currentStatus + 1) % statuses.length;

            absenButton.textContent = statuses[currentStatus].text;
            absenButton.className = `btn btn-sm ${statuses[currentStatus].class}`;
            
            // Panggil fungsi untuk memperbarui data
            JsonAbsen(rowId, row['Nama'] || '', row['KelMD'] || '', statuses[currentStatus].text);
        };

        tdAbsen.appendChild(absenButton);
        tr.appendChild(tdAbsen);

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    // Inisialisasi ulang DataTables
    if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
        $(`#${tableId}`).DataTable().destroy();
    }

    $(`#${tableId}`).DataTable({
        paging: false,
        dom: '<"top"f>rt<"bottom">',
        scrollY: 500,
        order: [[1, 'asc']],
        //buttons: ['excelHtml5', 'pdfHtml5', 'print']
    });
}

function Tabel3Select(tableId, jsonData) {
    const table = document.getElementById(tableId);
    if (!table) {
        console.error(`Tabel dengan ID ${tableId} tidak ditemukan.`);
        return;
    }

    // Hapus konten lama
    table.innerHTML = '';

    if (!Array.isArray(jsonData) || jsonData.length === 0) {
        console.error("Data JSON kosong atau tidak valid.");
        return;
    }

    // Header tabel
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const createHeader = (text, width = 'auto') => {
        const th = document.createElement('th');
        th.textContent = text;
        th.style.width = width;
        return th;
    };

    headerRow.appendChild(createHeader('Nama', '40%'));
    headerRow.appendChild(createHeader('Kelompok', '20%'));
    headerRow.appendChild(createHeader('M', '10%'));
    headerRow.appendChild(createHeader('1', '10%'));
    headerRow.appendChild(createHeader('2', '10%'));

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Body tabel
    const tbody = document.createElement('tbody');
    jsonData.forEach(row => {
        const tr = document.createElement('tr');

        // Kolom Nama dan Kelompok
        const tdNama = document.createElement('td');
        tdNama.textContent = row['Nama'] || '';
        tr.appendChild(tdNama);

        const tdKel = document.createElement('td');
        tdKel.textContent = row['KelMD'] || '';
        tr.appendChild(tdKel);

        // Tambahkan tombol M, 1, dan 2 dengan event onclick
        ['m', '1', '2'].forEach(col => {
            const tdButton = document.createElement('td');
            const button = document.createElement('button');
            button.id = `absen-${col}-${row['IDS']}`;
            button.className = 'btn btn-light btn-sm';
            button.textContent = ''; // Default kosong
            button.onclick = function () {
                // Menentukan status tombol berdasarkan klik
                const statuses = [
                    { text: '', class: 'btn-light' },    // Default
                    { text: 'H', class: 'btn-success' }, // Hadir
                    { text: 'A', class: 'btn-danger' },  // Absen
                    { text: 'I', class: 'btn-warning' }, // Izin
                    { text: 'S', class: 'btn-primary' }  // Sakit
                ];

                let currentStatus = statuses.findIndex(s => button.classList.contains(s.class));
                currentStatus = (currentStatus + 1) % statuses.length;  // Bergerak ke status berikutnya

                // Update teks dan kelas tombol
                button.textContent = statuses[currentStatus].text;
                button.className = `btn btn-sm ${statuses[currentStatus].class}`;

                // Update data berdasarkan klik tombol
                Json3Absen(row['IDS'], row['Nama'], row['KelMD'], col, statuses[currentStatus].text);
            };
            tdButton.appendChild(button);
            tr.appendChild(tdButton);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    // Reinitialize DataTables
    if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
        $(`#${tableId}`).DataTable().destroy();
    }

    $(`#${tableId}`).DataTable({
        paging: false,
        dom: '<"top"f>rt<"bottom">',
        scrollY: 500,
        order: [[0, 'asc']],
    });
}






//-------------------------------------- Updadate Isi tabel absen ------------------------------

// Fungsi untuk memperbarui tombol berdasarkan data dari JSON
function updateStatusTombol() {
    const filterJamValue = document.getElementById('filterJam')?.value;
    const filterTanggalValue = document.getElementById('filterTanggal')?.value;
    const filterBulanValue = document.getElementById('filterBulan')?.value;

    if (!filterJamValue || !filterTanggalValue || !filterBulanValue) {
        console.error("Semua filter harus diisi.");
        return;
    }

    const header = `${filterJamValue}T${filterTanggalValue}`;
    const filteredData = JSON.parse(localStorage.getItem('Absen')).data.filter(row => row['IDS']?.endsWith(filterBulanValue));

    filteredData.forEach(row => {
        const status = row[header];
        const rowId = row['IDS']?.split('-')[1];

        if (rowId) {
            const editButton = document.querySelector(`#absen-${rowId}`);

            if (editButton) {
                let statusText = '';
                let statusClass = 'btn-light';

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

                editButton.textContent = statusText;
                editButton.className = `btn btn-sm ${statusClass}`;
            }
        }
    });
}


// Panggil fungsi updateStatusTombol setiap kali filter berubah
document.getElementById('filterJam')?.addEventListener('change', updateStatusTombol);
document.getElementById('filterTanggal')?.addEventListener('change', updateStatusTombol);
document.getElementById('filterBulan')?.addEventListener('change', updateStatusTombol);

function updateStatus3Tombol() {
    const filterJamValue = document.getElementById('filterJam')?.value;
    const filterTanggalValue = document.getElementById('filterTanggal')?.value;
    const filterBulanValue = document.getElementById('filterBulan')?.value;

    if (!filterJamValue || !filterTanggalValue || !filterBulanValue) {
        console.error("Semua filter harus diisi.");
        return;
    }

    const filteredData = JSON.parse(localStorage.getItem('Absen'))?.data.filter(row => 
        row['IDS']?.endsWith(filterBulanValue)
    ) || [];

    if (!filteredData.length) {
        console.warn("Data tidak ditemukan berdasarkan filter yang diberikan.");
        return;
    }

    // Refresh tabel
    DataTabelSelect("absenTable", filteredData);

    // Perbarui status tombol dalam tabel sesuai data JSON
    filteredData.forEach(row => {
        const rowId = row['IDS']?.split('-')[1];

        if (rowId) {
            const headerJam = `${filterJamValue}T${filterTanggalValue}`; // Kolom untuk status di tabel
            const statusJam = row[headerJam];

            const updateButtonStatus = (columnName, columnValue) => {
                const button = document.querySelector(`#${columnName}-${rowId}`);
                if (button) {
                    let statusText = '';
                    let statusClass = 'btn-light';

                    if (columnValue === 'H') {
                        statusText = 'H';
                        statusClass = 'btn-success';
                    } else if (columnValue === 'A') {
                        statusText = 'A';
                        statusClass = 'btn-danger';
                    } else if (columnValue === 'I') {
                        statusText = 'I';
                        statusClass = 'btn-warning';
                    } else if (columnValue === 'S') {
                        statusText = 'S';
                        statusClass = 'btn-primary';
                    }

                    button.textContent = statusText;
                    button.className = `btn btn-sm ${statusClass}`;
                }
            };

            // Update tombol untuk Jam, Malam, dan Jam 2
            updateButtonStatus('absen-m', row['MT1'] || ''); // Contoh key untuk Malam
            updateButtonStatus('absen-1', row['1T1'] || ''); // Contoh key untuk Jam 1
            updateButtonStatus('absen-2', row['2T1'] || ''); // Contoh key untuk Jam 2
        }
    });
}

/* Panggil fungsi updateStatusTombol setiap kali filter berubah
['filterJam', 'filterTanggal', 'filterBulan'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', updateStatus3Tombol);
});
*/


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
    }, 8000); // Tunggu 5 detik sebelum mengirim
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

    UpdateLocalStorage("Absen", "IDS", IDS, header, status);
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

function Json3Absen(id, nama, kelMD, jam, status) {
    const filterBulan = document.getElementById('filterBulan').value;
    const filterTanggal = document.getElementById('filterTanggal').value;

    if (!filterBulan || !filterTanggal) {
        console.error("Pastikan filter (Bulan dan Tanggal) telah diisi.");
        return;
    }

    const IDS = `46-${id}-${filterBulan}`;
    const header = `${jam}T${filterTanggal}`;
    const TanggalUpdate = getFormattedDate();

    const Absen = {
        TanggalUpdate,
        IDS,
        Nama: nama,
        Kelas: kelMD,
        Bulan: filterBulan,
        [header]: status,
    };

    UpdateLocalStorage("Absen", "IDS", IDS, header, status);
    updateAntrianJson(Absen);


    const IDGuru = document.getElementById('IDGuru').innerText; 
    const NamaGuru = document.getElementById('NamaGuru').innerText;

    const AbsenGuru = {
        TanggalUpdate: TanggalUpdate,
        IDS: `46-${IDGuru}-${filterBulan}`,
        Nama: NamaGuru,
        Kelas: kelMD,
        Bulan: bulan
    };

    AbsenGuru[header] = 'H';

    updateAntrianJson(AbsenGuru, true);
}

function getNextStatus(current) {
    const statuses = ['', 'H', 'A', 'I', 'S']; // Urutan status
    const currentIndex = statuses.indexOf(current);
    return statuses[(currentIndex + 1) % statuses.length];
}

function updateButtonAppearance(button, status) {
    let statusClass = 'btn-light'; // Default button class

    if (status === 'H') {
        statusClass = 'btn-success';
    } else if (status === 'A') {
        statusClass = 'btn-danger';
    } else if (status === 'I') {
        statusClass = 'btn-warning';
    } else if (status === 'S') {
        statusClass = 'btn-primary';
    }

    button.textContent = status; // Update teks tombol
    button.className = `btn btn-sm ${statusClass}`; // Update class tombol
}


//---------------------------------------------------- Edit Json Utama di cache -------------------------------------------
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
function UpdateCacheJson(jsonData, idKey, idValue, header, newValue) {
    try {
        // Pastikan jsonData adalah array
        if (!jsonData || !Array.isArray(jsonData)) {
            console.error("Data JSON tidak ditemukan atau bukan array.");
            return false;
        }

        // Cari item berdasarkan idKey dan idValue
        const itemIndex = jsonData.findIndex(item => item[idKey] === idValue);
        console.log("Index item yang ditemukan:", itemIndex);

        if (itemIndex === -1) {
            // Jika item tidak ditemukan, tambahkan item baru
            const newItem = { [idKey]: idValue, [header]: newValue };
            jsonData.push(newItem);
            console.log(`Data baru ditambahkan: ${JSON.stringify(newItem)}`);
        } else {
            // Jika item ditemukan, update nilai header
            jsonData[itemIndex][header] = newValue;
            console.log(`Data berhasil diperbarui: ${idKey}: ${idValue}, ${header}: ${newValue}`);
        }

        // Simpan data yang sudah diperbarui ke localStorage
        localStorage.setItem('Absen', JSON.stringify({ data: jsonData, timestamp: Date.now() }));
        console.log("Cache diperbarui di localStorage.");

        return true;
    } catch (error) {
        console.error("Terjadi kesalahan saat memperbarui cache:", error);
        return false;
    }
}

function UpdateLocalStorage(storageKey, idKey, idValue, header, newValue) {
    try {
        // Ambil data dari localStorage
        const rawData = localStorage.getItem(storageKey);
        if (!rawData) {
            console.error(`Data dengan key "${storageKey}" tidak ditemukan di localStorage.`);
            return false;
        }

        // Parse data menjadi JSON
        const parsedData = JSON.parse(rawData);
        const jsonData = parsedData.data || []; // Gunakan array kosong jika data tidak ditemukan

        // Pastikan jsonData adalah array
        if (!Array.isArray(jsonData)) {
            console.error("Data JSON dalam localStorage bukan array.");
            return false;
        }

        // Cari item berdasarkan idKey dan idValue
        const itemIndex = jsonData.findIndex(item => item[idKey] === idValue);
        console.log("Index item yang ditemukan:", itemIndex);

        if (itemIndex === -1) {
            // Jika item tidak ditemukan, tambahkan item baru
            const newItem = { [idKey]: idValue, [header]: newValue };
            jsonData.push(newItem);
            console.log(`Data baru ditambahkan: ${JSON.stringify(newItem)}`);
        } else {
            // Jika item ditemukan, update nilai header
            jsonData[itemIndex][header] = newValue;
            console.log(`Data berhasil diperbarui: ${idKey}: ${idValue}, ${header}: ${newValue}`);
        }

        // Simpan data yang sudah diperbarui kembali ke localStorage
        localStorage.setItem(storageKey, JSON.stringify({ data: jsonData, timestamp: parsedData.timestamp }));
        console.log("Cache diperbarui di localStorage.");

        return true;
    } catch (error) {
        console.error("Terjadi kesalahan saat memperbarui data di localStorage:", error);
        return false;
    }
}







//------------------------------------------------- Tombol Edit Semua Tabel ------------------------------------
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
                backdrop: true, // Mengizinkan klik di luar modal untuk menutup
                keyboard: true   // Memungkinkan tombol keyboard untuk menutup modal
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

