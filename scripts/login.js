document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah form submit default

    const userName = document.getElementById('userName').value;
    const password = document.getElementById('pwd').value;

    // Menampilkan animasi loading
    document.querySelector('.loading-animation').classList.remove('fade-out');
    document.querySelector('.form-container').classList.add('fade-out');

    // Kirim data login ke server (Google Apps Script)
    fetch(`https://script.google.com/macros/s/AKfycbxjihsdj_d2k0KgvbMHmHj-E95OpYl9pHrq98KB5vnFiBcJZwMn0QBCiT5GLwXLwdz5YA/exec?action=login&user=${userName}&pw=${password}`)
        .then(response => response.json())
        .then(data => {
            document.querySelector('.loading-animation').classList.add('fade-out');
            document.querySelector('.form-container').classList.remove('fade-out');

            if (data.success) {
                // Jika login berhasil, ambil data Nama dan ID Guru
                const namaGuru = data.data.Nama; // Sesuaikan dengan nama kolom di sheet
                const idGuru = data.data.ID; // Sesuaikan dengan nama kolom di sheet

                // Menyimpan data ke localStorage dengan key userID dan userName
                localStorage.setItem('userID', idGuru);
                localStorage.setItem('userName', namaGuru);

                // Redirect ke halaman index.html
                window.location.href = "index.html"; // Mengarahkan ke index.html
            } else {
                // Jika login gagal
                alert(data.errors.join("\n"));
            }
        })
        .catch(error => {
            document.querySelector('.loading-animation').classList.add('fade-out');
            document.querySelector('.form-container').classList.remove('fade-out');
            alert('Terjadi kesalahan. Silakan coba lagi.');
        });
});
