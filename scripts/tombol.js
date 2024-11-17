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
    Sembunyikan("cardSetting", () => {
        Tampilkan("cardIcon");
        Tampilkan("cardKelompok")
    });
}

function SettingButton() {
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



  


// ---------------------------- Modal Form -------------------------
// Definisikan konten HTML dalam JavaScript sebagai obyek
const htmlTemplates = {
  'FormData': `
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" id="editModalLabel">Edit Data</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                  <form id="editForm">
                      <div class="mb-3">
                          <label for="Nama" class="form-label">Nama</label>
                          <input type="text" class="form-control" id="Nama" name="Nama">
                      </div>
                      <div class="mb-3">
                          <label for="KelMD" class="form-label">Kelas</label>
                          <input type="text" class="form-control" id="KelMD" name="KelMD">
                      </div>
                      <div class="mb-3">
                          <label for="Kelas" class="form-label">Kelas</label>
                          <select class="form-select" id="Kelas" name="Kelas">
                              <option value="10A">10A</option>
                              <option value="11B">11B</option>
                              <option value="12C">12C</option>
                          </select>
                      </div>
                      <button type="submit" class="btn btn-primary">Save Changes</button>
                  </form>
              </div>
          </div>
      </div>
  `,
  // Tambahkan lebih banyak template jika diperlukan
};