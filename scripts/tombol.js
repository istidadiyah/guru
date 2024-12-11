
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
    Sembunyikan("cardKelompok", () => {
        
        TabelSelect2("Santri", JSON.parse(localStorage.getItem('db')).data, "M,1,2");

        Tampilkan("tombolHome");

        Tampilkan("cardSantri");
        Tampilkan("cardFilter");

        initializeFilter("K");
        IsiBulan("filterBulan");
        getHijriDate();

        updateStatusTombol();

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
