
function home() {
    UbahText("Isti'dadiyah", "Aplikasi Khusus Guru");
    
    Sembunyikan("tombolHome");
    Sembunyikan("cardSantri");
    Sembunyikan("cardGuru");
    Sembunyikan("cardPost");
    Sembunyikan("cardRekap")

    Sembunyikan("cardSetting", () => {
        Tampilkan("cardIcon");
        DataTabel("Kelompok", JSON.parse(localStorage.getItem('Kelompok')).data, "ID, WaliKelas");
        moveHtmlContent("halaman/form.html", "FormKelas", "cardEdit");
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
    Sembunyikan("cardRekap");
    IsiBulan("filterBulan");
    Sembunyikan("cardKelompok", () => {
        
        TabelSelect2("Santri", JSON.parse(localStorage.getItem('db')).data, "M,1,2");

        Tampilkan("tombolHome");

        Tampilkan("cardSantri");
        Tampilkan("cardFilter");

        initializeFilter("K");

        getHijriDate();
        updateStatusTombol2();
    
        fetchDataFromAppScript({
            "Absen": {}
        }, true);

        
    });

    //moveHtmlContent("halaman/form.html", "FormData", "cardEdit");
    
}

function GagalButton() {
    
    UbahText("Offline", "Data yang gagal di kirim");
    Sembunyikan("cardIcon");
    Sembunyikan("cardKelompok", () => {

        addToFailedTable(JSON.parse(localStorage.getItem('failedData')).data);

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

        fetchDataFromAppScript({
            "db": { "Diniyah": "Isti", "StatusSantri": "Mukim" },
        }, true);
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

function SimpanData(storageKey) {
    const jsonData = generateJSON(storageKey);
    //UpdateLocalSemua(storageKey, jsonData)
}


function reloadDataWithLoading() {
    // Sembunyikan ikon dan tampilkan indikator loading
    document.getElementById("syncIcon").style.display = "none"; // Menyembunyikan ikon
    document.getElementById("loadingIndicator").style.display = "block"; // Menampilkan loading

    // Panggil fungsi untuk mengambil data, misalnya fetchDataFromAppScript
    fetchDataFromAppScript({
        'db': { 'Diniyah': 'Isti', 'StatusSantri': 'Mukim' }, // Cache 24 jam
        'Absen': {}, // Default cache duration
        'Kelompok': {},
        'Guru': {},
        'Pelajaran': {}
    }, true).then(() => {
        // Sembunyikan indikator loading dan tampilkan kembali ikon setelah proses selesai
        document.getElementById("loadingIndicator").style.display = "none";
        document.getElementById("syncIcon").style.display = "inline-block"; // Menampilkan kembali ikon
    }).catch((error) => {
        console.error("Terjadi kesalahan:", error);
        // Pastikan indikator loading disembunyikan jika terjadi error dan tampilkan ikon lagi
        document.getElementById("loadingIndicator").style.display = "none";
        document.getElementById("syncIcon").style.display = "inline-block";
    });
}


  
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
