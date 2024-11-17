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
    Sembunyikan("cardTabel");
    Sembunyikan("tombolHome");
    Sembunyikan("cardSetting", () => {
        
        Tampilkan("cardIcon");
        Tampilkan("cardKelompok")
    });
}

function KelasButton() {
    Tampilkan("tombolHome");
    Sembunyikan("cardIcon");
    Tampilkan("cardKelompok");
}

function AbsensiButton() {
    
    Sembunyikan("cardIcon");
    Sembunyikan("cardKelompok", () => {
        Tampilkan("cardTabel");
        Sembunyikan("cardGuru");
        Sembunyikan("cardPelajaran")
    });   
}

function BiodataButton() {
    
    Sembunyikan("cardIcon");
    Sembunyikan("cardKelompok", () => {

        DataTabel("Santri", globalJsonData.Santri, "Nama, KelMD");

        Tampilkan("tombolHome");
        Tampilkan("cardTabel");
        Sembunyikan("cardGuru");
        Sembunyikan("cardPelajaran");
    });

    moveHtmlContent("halaman/form.html", "FormData", "cardEdit")
    isiSelect("Kelas", globalJsonData.SemuaData.Kelompok, "ID") 
    
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


  
