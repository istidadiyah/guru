
// Fungsi untuk memasukkan data ke tabel dan mengatur filter kelas
function insertDataToTable(sheet1Data) {
    const tableBody = document.querySelector('#dataTable tbody');
    const filterKelas = document.getElementById('filterKelas');

    // Set untuk menyimpan kelas yang unik
    const kelasSet = new Set();

    // Sort the data by 'Nama' first, then by 'Kelas'
    sheet1Data.sort((a, b) => {
        // First, sort by Nama
        const nameCompare = a.Nama.localeCompare(b.Nama);
        if (nameCompare !== 0) return nameCompare;

        // If Nama is the same, sort by Kelas
        return a.KelMD.localeCompare(b.KelMD);
    });

    // Iterasi melalui data dan masukkan ke dalam tabel
    sheet1Data.forEach(data => {
        const row = document.createElement('tr');

        // Kolom Nama
        const namaCell = document.createElement('td');
        namaCell.textContent = data.Nama;
        row.appendChild(namaCell);

        // Kolom Kelas
        const kelasCell = document.createElement('td');
        kelasCell.textContent = data.KelMD;

        kelasCell.setAttribute('translate', 'no');
        
        row.appendChild(kelasCell);

        // Menambahkan kelas ke set untuk filter kelas
        kelasSet.add(data.KelMD);

        // Kolom Absensi
        const absensiCell = document.createElement('td');
        const selectAbsensi = document.createElement('select');
        selectAbsensi.classList.add('form-control'); // Tambahkan kelas Bootstrap "form-control" dan "selectpicker" untuk menggunakan plugin Bootstrap Select

        const options = ['', 'H', 'A', 'I', 'S'];

        selectAbsensi.setAttribute('data-ids', data.IDS);

        options.forEach(optionValue => {
            const option = document.createElement('option');
            option.value = optionValue;
            option.textContent = optionValue;

            // Tambahkan atribut translate="no" pada setiap elemen <option>
            option.setAttribute('translate', 'no');

            selectAbsensi.appendChild(option);
        });

        absensiCell.appendChild(selectAbsensi);
        row.appendChild(absensiCell);

        tableBody.appendChild(row);

        // Event listener untuk perubahan Absensi
        selectAbsensi.addEventListener('change', async function () {
            const nama = namaCell.textContent;
            const kelas = kelasCell.textContent;
            const absensi = selectAbsensi.value;
            const IDS = selectAbsensi.getAttribute('data-ids');
        
            // Mengumpulkan data dan mengirimkan ke server
            const jsonData = collectAbsensiData(IDS, nama, kelas, absensi);
            const encodedData = encodeData(jsonData);
            await postJSON(encodedData);
        
            // Mengupdate tabel dinamis kedua di halaman setelah data dikirim
            updateDynamicTableAfterChange(jsonData);
        });

        addChangeColorListener(selectAbsensi);
    });

    // Menambahkan kelas ke dropdown filterKelas
    // Sort kelas alphabetically
    const sortedKelas = Array.from(kelasSet).sort((a, b) => a.localeCompare(b));
    sortedKelas.forEach(kelas => {
        const option = document.createElement('option');
        option.value = kelas;
        option.textContent = kelas;

        // Tambahkan atribut translate="no" pada setiap elemen <option>
        option.setAttribute('translate', 'no');

        filterKelas.appendChild(option);
    });

    // Tambahkan event listener untuk filter kelas
    filterKelas.addEventListener('change', filterTableByKelas);
}


// Mengumpulkan data untuk dikirimkan dalam JSON
function collectAbsensiData(dataIDS, nama, kelas, absensi) {
    const bulan = document.getElementById('filterBulan').value;
    const tanggal = document.getElementById('filterTanggal').value;
    const jam = document.getElementById('filterJam').value;
    const guru = document.getElementById('filterGuru').value;

    const IDS = `46-${dataIDS}-${bulan}`;
    const headerTanggal = `${jam}T${tanggal}`;

    // Format TanggalUpdate menjadi "YYYY-MM-DD HH:MM:SS"
    const now = new Date();
    const tanggalUpdate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const jsonData = {
        TanggalUpdate: tanggalUpdate,
        IDS: IDS,
        Nama: nama,
        Kelas: kelas,
        Guru: guru,
        Bulan: bulan ? getBulanName(bulan) : '',
        [headerTanggal]: absensi
    };

    return jsonData;
}

// Fungsi untuk mendapatkan nama bulan berdasarkan kode bulan
function getBulanName(bulan) {
    const bulanNames = {
        "01": "Muharram",
        "02": "Shafar",
        "03": "Rabi'ul Awwal",
        "04": "Rabi'ul Akhir",
        "05": "Jumadil Awwal",
        "06": "Jumadil Akhir",
        "07": "Rajab",
        "08": "Sya'ban",
        "09": "Ramadhan",
        "10": "Syawal",
        "11": "Dzulqa'dah",
        "12": "Dzulhijjah"
    };
    return bulanNames[bulan] || '';
}

// Fungsi untuk mengubah objek menjadi format URL-encoded
function encodeData(data) {
    const formBody = [];
    for (const key in data) {
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(data[key]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    return formBody.join("&");
}






// -------------------- Fungsi untuk tabel 2 -------------------------------------


let globalSheet2Data = [];  // Variabel global untuk menyimpan data sheet2

// Memasukkan data 2 ke tabel 2
function insertDataToDynamicTable(sheet2Data) {
    globalSheet2Data = sheet2Data;  // Simpan sheet2Data ke variabel global
    
    const dynamicHeader = document.getElementById('dynamicHeader');
    const dynamicBody = document.getElementById('dynamicBody');

    // Menghitung kolom-kolom untuk header, menggunakan key dari data pertama
    if (sheet2Data.length === 0) return;  // Pastikan data tidak kosong

    const columns = Object.keys(sheet2Data[0]); // Ambil keys dari data pertama sebagai header

    // Membuat header dinamis berdasarkan kolom-kolom yang ada
    const headerRow = document.createElement('tr');

    // Menambahkan setiap kolom sebagai header
    columns.forEach(column => {
        const columnHeader = document.createElement('th');
        columnHeader.textContent = column; // Menambahkan nama kolom sebagai header
        headerRow.appendChild(columnHeader);
    });

    // Menambahkan header ke dalam tabel
    dynamicHeader.innerHTML = ''; // Kosongkan header yang ada sebelumnya
    dynamicHeader.appendChild(headerRow);

    // Memasukkan data ke dalam body tabel
    dynamicBody.innerHTML = '';  // Kosongkan body tabel yang ada sebelumnya
    sheet2Data.forEach(data => {
        const row = document.createElement('tr');

        // Mengisi data sesuai dengan kolom yang ada
        columns.forEach(column => {
            const cell = document.createElement('td');
            cell.textContent = data[column] || '';  // Menggunakan default kosong jika data tidak ada
            row.appendChild(cell);
        });

        // Menambahkan row ke dalam body tabel
        dynamicBody.appendChild(row);
    });

    // Menampilkan tabel setelah data dimasukkan
    document.getElementById('dynamicTable').style.display = 'table';
}




// Fungsi terbaru memasukkan data ke dalam tabel
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

    // Mendapatkan header dari data JSON
    const headers = Object.keys(jsonData[0]);

    // Membuat header tabel dengan <th>
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Membuat body tabel
    const tbody = document.createElement('tbody');
    jsonData.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
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
    const dataTableInstance = $(`#${tableId}`).DataTable({
        responsive: true,
        order: [],
        lengthChange: false, // Menghilangkan opsi tampilan jumlah entri
        paging: false, // Menghilangkan fitur pagination
        searching: true, // Menghilangkan fitur pencarian, jika tidak diperlukan
        info: false, // Menghilangkan informasi "Showing x to y of z entries"
        initComplete: function () {
            // Setelah DataTables selesai diinisialisasi, panggil ShowColumns
            ShowColumns(tableId, visibleColumns);
        }
    });
}

// --------- Menampilkan kolom tertentu
function ShowColumns(tableId, visibleColumns) {
    const table = $(`#${tableId}`).DataTable();

    // Ambil teks header kolom secara eksplisit
    const allHeaders = table.columns().header().toArray().map(header => $(header).text().trim());
    console.log("Kolom yang ditemukan di tabel:", allHeaders);

    // Tentukan indeks kolom yang akan ditampilkan
    const visibleIndices = visibleColumns
        .split(",")
        .map(col => col.trim())
        .map(col => allHeaders.indexOf(col))
        .filter(index => index !== -1);

    console.log("Indeks kolom yang akan ditampilkan:", visibleIndices);

    if (visibleIndices.length === 0) {
        console.error("Tidak ada kolom yang valid untuk ditampilkan.");
        return;
    }

    // Tampilkan atau sembunyikan kolom berdasarkan indeks
    table.columns().every(function (index) {
        const visible = visibleIndices.includes(index);
        table.column(index).visible(visible);
    });
}




//------------------- Menambah colom buton
// Fungsi untuk menambahkan kolom dengan tombol "Edit"
function AddColumnWithButton(tableId, columnName, buttonFunction) {
    // Cek elemen tabel
    const table = document.getElementById(tableId);
    if (!table) {
        console.error(`Tabel dengan ID ${tableId} tidak ditemukan.`);
        return;
    }

    // Cek apakah kolom sudah ada
    if (table.querySelector(`th[data-column="${columnName}"]`)) {
        console.log(`Kolom dengan nama "${columnName}" sudah ada.`);
        return;
    }

    // Menambahkan kolom di header
    const thead = table.querySelector('thead tr');
    if (thead) {
        const th = document.createElement('th');
        th.textContent = columnName;
        th.setAttribute('data-column', columnName);
        thead.appendChild(th);
    }

    // Menambahkan tombol di setiap baris di body
    const tbody = table.querySelector('tbody');
    if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            const td = document.createElement('td');
            const button = document.createElement('button');
            button.textContent = "Edit";
            button.className = "btn btn-primary btn-sm"; // Tambahkan kelas Bootstrap
            button.onclick = () => buttonFunction(row); // Menambahkan fungsi tombol
            td.appendChild(button);
            row.appendChild(td);
        });
    }
}

// Fungsi untuk mengedit baris, membuka modal, dan mengisi input
function editRow(row) {
    // Dapatkan modal dan elemen-elemen input di dalam modal
    const modal = new bootstrap.Modal(document.getElementById('cardEdit'), {});
    const inputs = document.querySelectorAll('#cardEdit input, #cardEdit select, #cardEdit textarea');

    // Dapatkan data dari sel dalam baris yang dipilih
    const cells = row.querySelectorAll('td');

    // Iterasi melalui elemen input dan sel-sel baris
    inputs.forEach((input, index) => {
        if (cells[index]) {
            input.value = cells[index].textContent.trim(); // Mengisi input dengan isi sel baris
        }
    });

    // Buka modal
    modal.show();
}


