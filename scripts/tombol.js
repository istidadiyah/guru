function moveHtmlContent(sourceUrl, sourceDivId, targetDivId) {
  // Ambil elemen target di mana konten akan dipindahkan
  const targetDiv = document.getElementById(targetDivId);
  if (!targetDiv) {
      console.error(`Target div dengan ID ${targetDivId} tidak ditemukan.`);
      return;
  }

  // Fetch HTML dari URL yang diberikan
  fetch(sourceUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error(`Gagal memuat halaman: ${response.statusText}`);
          }
          return response.text();
      })
      .then(htmlText => {
          // Buat elemen dummy untuk memparsing HTML yang diambil
          const parser = new DOMParser();
          const htmlDocument = parser.parseFromString(htmlText, 'text/html');
          const sourceDiv = htmlDocument.getElementById(sourceDivId);

          // Pastikan sourceDiv ditemukan
          if (!sourceDiv) {
              console.error(`Div dengan ID ${sourceDivId} tidak ditemukan di halaman sumber.`);
              return;
          }

          // Pindahkan isi dari sourceDiv (.modal-content) ke target modal di index.html
          const targetContent = targetDiv.querySelector('.modal-content');
          if (targetContent) {
              targetContent.innerHTML = sourceDiv.innerHTML;
          } else {
              console.error('Target modal tidak memiliki elemen .modal-content.');
          }
      })
      .catch(error => {
          console.error('Error saat memindahkan konten:', error);
      });
}


// Fungsi untuk memindahkan konten berdasarkan ID
function moveHtmlContentFromJS(sourceId, targetDivId) {
  // Ambil elemen target di mana konten akan dipindahkan
  const targetDiv = document.getElementById(targetDivId);
  if (!targetDiv) {
      console.error(`Target div dengan ID ${targetDivId} tidak ditemukan.`);
      return;
  }

  // Ambil HTML dari objek `htmlTemplates` dengan ID tertentu
  const contentHTML = htmlTemplates[sourceId];
  if (!contentHTML) {
      console.error(`Sumber HTML dengan ID ${sourceId} tidak ditemukan.`);
      return;
  }

  // Pindahkan konten ke elemen target
  targetDiv.innerHTML = contentHTML;
}


function home() {
    UbahText("Isti'dadiyah", "Aplikasi Khusus Guru");
    
    Sembunyikan("tombolHome");
    Sembunyikan("cardSantri");
    Sembunyikan("cardGuru");
    Sembunyikan("cardPost");

    Sembunyikan("cardSetting", () => {
        Tampilkan("cardIcon");
        DataTabelTanpaTombol("Kelompok", globalJsonData.SemuaData.Kelompok, "ID, WaliKelas");
        Tampilkan("cardKelompok");
        
    });
}

function KelasButton() {
    UbahText("Data Kelas", "Daftar Rombel Isti'dadiyah");
    Sembunyikan("cardIcon");
    
    Sembunyikan("cardIcon", () => {

        Tampilkan("tombolHome");
        DataTabel("Kelompok", globalJsonData.SemuaData.Kelompok, "ID, WaliKelas");
        Tampilkan("cardKelompok");
        

    });
    moveHtmlContent("halaman/form.html", "FormKelas", "cardEdit");
}

function AbsensiButton() {
    
    UbahText("Absensi", "Absensi Per-Jam Murid Isti'dadiyah");
    Sembunyikan("cardIcon");

    Sembunyikan("cardKelompok", () => {

        DataTabelSelect("Santri", globalJsonData.Santri, "Nama, KelMD");

        Tampilkan("tombolHome");
        Tampilkan("filterJam");
        Tampilkan("filterBulan");
        Tampilkan("filterTanggal");

        Tampilkan("cardSantri");
        Tampilkan("cardFilter");

        populateKelMDFilter();
        initializeKelMDFilter();
        IsiBulan("filterBulan")
        
    });

    moveHtmlContent("halaman/form.html", "FormData", "cardEdit");
    
}

function BiodataButton() {
    UbahText("Biodata", "Biodata Lengkap Santri Isti'dadiyah");
    Sembunyikan("cardIcon");

    Sembunyikan("cardFilter");
    Sembunyikan("filterJam");
    Sembunyikan("filterBulan");
    Sembunyikan("filterTanggal");

    Sembunyikan("cardKelompok", () => {

        DataTabel("Santri", globalJsonData.Santri, "Nama, KelMD");
        Tampilkan("tombolHome");
        Tampilkan("cardSantri");

        populateKelMDFilter();
        initializeKelMDFilter();

    });

    moveHtmlContent("halaman/form.html", "FormData", "cardEdit");
    
}

function GuruButton() {
    UbahText("Asatidz", "Biodata Asatidz dan Asayidzah Isti'dadiyah")
    Sembunyikan("cardIcon");
    Sembunyikan("cardKelompok", () => {

        DataTabel("Guru", globalJsonData.SemuaData.Guru, "ID, Nama");

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
