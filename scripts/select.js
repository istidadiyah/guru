//---------------------- Fungsi select Filter ----------------------------
// custom-script.js

/**
 * Mendapatkan indeks kolom berdasarkan nama kolom (header).
 * @param {string} columnName - Nama kolom yang ingin dicari.
 * @returns {number} Indeks kolom atau -1 jika tidak ditemukan.
 */
function getColumnIndexByName(columnName) {
    var columnIndex = -1;
    $('#Santri thead th').each(function(index) {
        // Membandingkan nama kolom dengan teks header
        if ($(this).text().trim().toLowerCase() === columnName.toLowerCase()) {
            columnIndex = index;
            return false; // Keluar dari loop setelah menemukan kolom yang cocok
        }
    });
    return columnIndex;
}

/**
 * Mengisi elemen <select> dengan nilai unik dari kolom tertentu dalam tabel.
 * @param {string} columnName - Nama kolom yang ingin diambil nilainya.
 */
function populateColumnFilter(columnName) {
    var uniqueValuesSet = new Set();
    
    // Mendapatkan indeks kolom berdasarkan nama kolom yang diberikan
    var columnIndex = getColumnIndexByName(columnName);

    // Jika kolom tidak ditemukan
    if (columnIndex === -1) {
        console.error(`Kolom "${columnName}" tidak ditemukan.`);
        return;
    }

    // Kumpulkan nilai unik dari kolom yang ditentukan
    $('#Santri tbody tr').each(function() {
        var cellText = $(this).find('td').eq(columnIndex).text().trim();
        if (cellText) {
            uniqueValuesSet.add(cellText);
        }
    });

    // Ubah set menjadi array dan urutkan A-Z
    var uniqueValuesArray = Array.from(uniqueValuesSet).sort();

    // Seleksi elemen select untuk filter
    var $filter = $('#kelmdFilter');

    // Hapus semua opsi kecuali opsi default (All)
    $filter.find('option').not('[value=""]').remove();

    // Isi opsi select dengan nilai unik dari kolom
    uniqueValuesArray.forEach(function(value) {
        var option = $('<option>').val(value).text(value);
        $filter.append(option);
    });
}

/**
 * Memfilter tabel berdasarkan nilai yang dipilih dari dropdown filter.
 * @param {string} selectedValue Nilai yang dipilih dari dropdown filter.
 * @param {string} columnName Nama kolom yang ingin difilter.
 */
function filterTableByColumn(selectedValue, columnName) {
    var columnIndex = getColumnIndexByName(columnName);

    if (columnIndex === -1) {
        console.error(`Kolom "${columnName}" tidak ditemukan.`);
        return;
    }

    // Tampilkan atau sembunyikan baris berdasarkan filter
    $('#Santri tbody tr').each(function() {
        var cellText = $(this).find('td').eq(columnIndex).text().trim();
        if (selectedValue === "" || cellText === selectedValue) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

/**
 * Menginisialisasi filter dan mengatur event listener untuk perubahan pada dropdown filter.
 * @param {string} columnName Nama kolom yang akan difilter.
 */
function initializeFilter(columnName) {
    populateColumnFilter(columnName);

    // Event listener untuk perubahan pada select
    $('#kelmdFilter').on('change', function() {
        var selectedValue = $(this).val();
        filterTableByColumn(selectedValue, columnName);
    });
}










// -------------------------------- Fungsi select di dalam form awal --------------------------------------

// Fungsi untuk memfilter tabel berdasarkan kelas
function filterTableByKelas() {
    const selectedKelas = document.getElementById('filterKelas').value; // Mengambil kelas yang dipilih
    const rows = document.querySelectorAll('#dataTable tbody tr'); // Mengambil semua baris dalam tabel

    // Menyembunyikan atau menampilkan baris berdasarkan kelas yang dipilih
    rows.forEach(row => {
        const kelasCell = row.cells[1]; // Kelas ada di kolom kedua
        if (selectedKelas === "" || kelasCell.textContent === selectedKelas) {
            row.style.display = ''; // Tampilkan baris jika kelas cocok
        } else {
            row.style.display = 'none'; // Sembunyikan baris jika kelas tidak cocok
        }
    });
}







// Menambahkan Event Listener untuk setiap selectAbsensi
function addChangeColorListener(selectAbsensi) {
    selectAbsensi.addEventListener('change', function () {
        updateSelectColor(selectAbsensi); // Update warna saat value berubah
    });

    // Set warna pada saat pertama kali elemen dibuat, agar sesuai dengan nilai default
    updateSelectColor(selectAbsensi);
}

// Fungsi untuk mengisi elemen select dengan opsi bulan
function IsiBulan(selectId) {
    // Mendapatkan elemen select berdasarkan id
    const selectElement = document.getElementById(selectId);

    // Mengosongkan select terlebih dahulu
    selectElement.innerHTML = "";

    // Menambahkan opsi-opsi bulan ke dalam elemen select
    for (const bulan in bulanNames) {
        if (bulanNames.hasOwnProperty(bulan)) {
            const option = document.createElement("option");
            option.value = bulan; // "01", "02", ...
            option.text = bulanNames[bulan]; // "Muharram", "Shafar", ...
            selectElement.appendChild(option);
        }
    }
}

function isiSelect(idSelect, json, header, event) {
    if (event) {
        event.preventDefault(); // Mencegah form untuk dikirim dan halaman direfresh
    }

    // Parsing JSON string menjadi objek JavaScript
    let data;
    try {
        data = JSON.parse(json);
    } catch (e) {
        console.error("JSON tidak valid:", e);
        return;
    }

    // Cek apakah elemen select ada di halaman
    const selectElement = document.getElementById(idSelect);
    if (!selectElement) {
        console.error(`Elemen <select> dengan ID "${idSelect}" tidak ditemukan.`);
        return;
    }

    // Cek apakah data dalam JSON adalah array
    if (!Array.isArray(data)) {
        console.error("Data JSON harus berupa array.");
        return;
    }

    // Hapus semua opsi sebelumnya dari <select>
    selectElement.innerHTML = "";

    // Tambahkan opsi default (opsional)
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Pilih " + header;
    selectElement.appendChild(defaultOption);

    // Iterasi melalui array data JSON dan tambahkan opsi sesuai header
    data.forEach(item => {
        if (item[header]) {
            const option = document.createElement("option");
            option.value = item[header];
            option.textContent = item[header];
            selectElement.appendChild(option);
        }
    });
}



