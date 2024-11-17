// Variabel global untuk menyimpan data JSON dari Google Sheets
let globalJsonData = {};

// Fungsi untuk mengambil data dari Google Sheets dan menyimpan dalam variabel global
function fetchDataFromAppScript() {
    const url = 'https://script.google.com/macros/s/AKfycbwjX0LlvlFL8J3adpszyIB-U8FLsYX8nnD7zIhoHbjDk7AvjT5ND2jHZLzcFIfFd4GKdg/exec';

    // Tampilkan loading spinner saat proses pengambilan data dimulai
    var loadingSpinner = document.getElementById("loadingSpinner");


    // Mengambil data dari API menggunakan fetch
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();  // Mengonversi response menjadi JSON
        })
        .then(data => {
            console.log("Data diterima:", data);

            if (data) {
                // Simpan data ke variabel global
                globalJsonData = data;

                // Hanya menampilkan data "Kelompok" di tabel
                if (data.SemuaData && data.SemuaData.Kelompok) {
                    DataTabel("Kelompok", data.SemuaData.Kelompok, "ID, Wali Kelas");
                } else {
                    console.error("Data Kelompok tidak ditemukan.");
                }
            } else {
                console.error("Data tidak lengkap atau tidak valid.");
            }
        })
        .catch(error => {
            console.error("Terjadi kesalahan saat mengambil data:", error);
        })
        .finally(() => {
            // Sembunyikan loading spinner setelah data berhasil diambil dan diproses
            if (loadingSpinner) {
                loadingSpinner.style.display = "none";
            }
        });
}







// Fungsi untuk mengirimkan data ke server menggunakan POST dengan fetch
async function postJSON(header) {
    antrianCount++;
    updateAntrianCounter();

    // Link Santri Baru
    const url = "https://script.google.com/macros/s/AKfycbwjX0LlvlFL8J3adpszyIB-U8FLsYX8nnD7zIhoHbjDk7AvjT5ND2jHZLzcFIfFd4GKdg/exec";

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: header
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response:", data);

        // Tindakan tambahan jika response sukses
        //alert("Data berhasil dikirim!");

    } catch (error) {
        console.error("Gagal mengirim data:", error);
        alert("Terjadi kesalahan saat mengirim data.");
    } finally {
        // Pastikan antrian berkurang setelah respons diterima atau terjadi error
        antrianCount--;
        updateAntrianCounter();
    }
}

let antrianCount = 0;

// Function to update the queue display on screen
function updateAntrianCounter() {
    const antrianElement = document.getElementById('antrianCounter');
    if (antrianElement) {
        // Set the counter text
        antrianElement.textContent = antrianCount;

        // Show or hide the counter based on antrianCount
        if (antrianCount > 0) {
            // If the count is greater than 0, show the counter with animation
            antrianElement.style.display = 'block';
            antrianElement.classList.add('queue-anim');
        } else {
            // If the count is 0, hide the counter with a fade effect
            antrianElement.classList.remove('queue-anim');
            setTimeout(() => {
                antrianElement.style.display = 'none';
            }, 500); // Delay the hiding of the counter to allow for the fade-out animation
        }
    }
}
