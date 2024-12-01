
function home() {
    UbahText("Isti'dadiyah", "Aplikasi Khusus Guru");
    
    Sembunyikan("tombolHome");
    Sembunyikan("cardSantri");
    Sembunyikan("cardGuru");
    Sembunyikan("cardPost");
    Sembunyikan("cardRekap")

    Sembunyikan("cardSetting", () => {
        Tampilkan("cardIcon");
        DataTabelTanpaTombol("Kelompok", JSON.parse(localStorage.getItem('Kelompok')).data, "ID, WaliKelas");
        Tampilkan("cardKelompok");
        resetTable("Santri")
    });
}

function KelasButton() {
    UbahText("Data Kelas", "Daftar Rombel Isti'dadiyah");
    Sembunyikan("cardIcon");
    
    Sembunyikan("cardIcon", () => {

        Tampilkan("tombolHome");
        DataTabel("Kelompok", JSON.parse(localStorage.getItem('Kelompok')).data, "ID, WaliKelas");
        Tampilkan("cardKelompok");
        
    });
    moveHtmlContent("halaman/form.html", "FormKelas", "cardEdit");
}

function AbsensiButton() {
    
    UbahText("Absensi", "Absensi Per-Jam Murid Isti'dadiyah");
    Sembunyikan("cardIcon");
    Sembunyikan("cardRekap")
    Sembunyikan("cardKelompok", () => {
        
        DataTabelSelect("Santri", JSON.parse(localStorage.getItem('db')).data);

        Tampilkan("tombolHome");

        Tampilkan("cardSantri");
        Tampilkan("cardFilter");

        initializeFilter("K");
        IsiBulan("filterBulan");
        getHijriDate();

        updateStatusTombol();

        fetchDataFromAppScript({
            "Absen": { "durasi": 24 * 60 * 60 * 1000 }
        }, true);
        
    });

    moveHtmlContent("halaman/form.html", "FormData", "cardEdit");
    
}

function GagalButton() {
    
    UbahText("Offline", "Data yang gagal di kirim");
    Sembunyikan("cardIcon");
    Sembunyikan("cardKelompok", () => {

        DataTabelSelect("Santri", JSON.parse(localStorage.getItem('db')).data);

        Tampilkan("tombolHome");
        Tampilkan("cardPost");

        loadFailedDataFromCache();
        
    });

}

function BiodataButton() {
    UbahText("Biodata", "Biodata Lengkap Santri Isti'dadiyah");
    Sembunyikan("cardIcon");

    Sembunyikan("cardFilter");

    Sembunyikan("cardKelompok", () => {

        DataTabel("Santri", JSON.parse(localStorage.getItem('db')).data, "Nama, KelMD");

        Tampilkan("tombolHome");
        Tampilkan("cardSantri");

        initializeFilter("KelMD");

        getHijriDate();
    });

    moveHtmlContent("halaman/form.html", "FormData", "cardEdit");
    
}

function GuruButton() {
    UbahText("Asatidz", "Biodata Asatidz dan Asayidzah Isti'dadiyah")
    Sembunyikan("cardIcon");
    Sembunyikan("cardKelompok", () => {

        DataTabel("Guru", JSON.parse(localStorage.getItem('Guru')).data, "Nama");

        Tampilkan("tombolHome");
        Tampilkan("cardGuru");
        Tampilkan("cardTabel");
    
    });

    moveHtmlContent("halaman/form.html", "FormGuru", "cardEdit");

}

function SettingButton() {
    Tampilkan("tombolHome");
    Sembunyikan("cardKelompok");
    Sembunyikan("cardIcon", () => {
        Tampilkan("cardSetting");
    });
}

function RekapButton() {
    Sembunyikan("cardSantri", () => {

        DataTabelRekap("Rekap", JSON.parse(localStorage.getItem('Absen')).data, "Nama, Kelas, A, I, S");

        Tampilkan("cardRekap");
    });
}

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


  
// Fungsi untuk menangani logout dan menghapus cache (localStorage)
function logout() {
    //if (confirm('Apakah Anda yakin ingin keluar? Data login akan dihapus!')) {
        // Hapus cache (localStorage)
        localStorage.removeItem('userID');
        localStorage.removeItem('userName');

        // Arahkan kembali ke halaman login
        window.location.href = 'login.html'; // Pengalihan ke login.html setelah logout
    //}
}
