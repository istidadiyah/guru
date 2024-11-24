let loginData = [];
const CACHE_KEY = 'loginDataCache';
const scriptPostURL = 'https://script.google.com/macros/s/AKfycbxjihsdj_d2k0KgvbMHmHj-E95OpYl9pHrq98KB5vnFiBcJZwMn0QBCiT5GLwXLwdz5YA/exec?action=SatuSheet&sheetName=Guru';
let dataLoaded = false; // Menandakan apakah data telah dimuat

async function fetchDataFromAppScript(forceRefresh = false) {
    const url = scriptPostURL;

    const processData = (data) => {
        if (data && Array.isArray(data.Guru)) {
            loginData = data.Guru; // Mengambil array dari properti 'Guru'
            const cacheObject = {
                data: data.Guru,
                timestamp: new Date().getTime()
            };
            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
                console.log("Data dan timestamp disimpan ke cache.");
                dataLoaded = true; // Tandai bahwa data telah berhasil dimuat
            } catch (e) {
                console.error("Gagal menyimpan data ke cache:", e);
            }
        } else {
            console.error("Data tidak lengkap atau tidak valid.");
        }
    };

    const fetchFromServer = async () => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            const data = await response.json();
            console.log("Data diterima:", data);
            processData(data);
        } catch (error) {
            console.error("Terjadi kesalahan saat mengambil data:", error);
        }
    };

    if (forceRefresh) {
        console.log("Force refresh aktif. Mengambil data dari server dan memperbarui cache.");
        await fetchFromServer();
        return;
    }

    // Cek apakah data ada di cache
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
        const cacheObject = JSON.parse(cachedData);
        const currentTime = new Date().getTime();
        const cacheAge = currentTime - cacheObject.timestamp;

        // Misalnya, kita anggap cache valid selama 5 menit (300000 ms)
        if (cacheAge < 300000) {
            console.log("Menggunakan data dari cache.");
            loginData = cacheObject.data; // Pastikan loginData diisi dengan data dari cache
            dataLoaded = true; // Tandai bahwa data telah dimuat
            return;
        } else {
            console.log("Cache sudah kadaluarsa. Mengambil data baru dari server.");
        }
    }

    // Jika tidak ada cache atau cache sudah kadaluarsa, ambil data dari server
    await fetchFromServer();
}

// Panggil fetch data saat halaman dimuat
fetchDataFromAppScript();

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const userName = document.getElementById('userName').value.trim();
    const password = document.getElementById('pwd').value.trim();

    const loadingAnimation = document.querySelector('.loading-animation');
    const formContainer = document.querySelector('.form-container');

    // Cek apakah data sudah dimuat
    if (!dataLoaded) {
        // Tampilkan loading animation karena data belum tersedia
        formContainer.classList.remove('active');
        formContainer.classList.add('inactive');
        loadingAnimation.classList.remove('fade-out');
        loadingAnimation.classList.add('fade-in');

        // Tunggu hingga data selesai dimuat
        await fetchDataFromAppScript();
    }

    // Proses login setelah data tersedia
    try {
        console.log('Login data:', loginData);

        if (!Array.isArray(loginData)) {
            throw new Error('Login data is not an array');
        }

        const user = loginData.find(user => user.ID === userName && user.pw === password);

        if (user) {
            localStorage.setItem('userID', user.ID);
            localStorage.setItem('userName', user.Nama);
            window.location.href = 'index.html';
        } else {
            alert('Username atau password salah');
            // Sembunyikan loading animation dan tampilkan form lagi
            loadingAnimation.classList.remove('fade-in');
            loadingAnimation.classList.add('fade-out');
            formContainer.classList.remove('inactive');
            formContainer.classList.add('active');
        }
    } catch (err) {
        console.error('Error during login process:', err);
        alert('Terjadi kesalahan saat memproses login');
        // Sembunyikan loading animation dan tampilkan form lagi
        loadingAnimation.classList.remove('fade-in');
        loadingAnimation.classList.add('fade-out');
        formContainer.classList.remove('inactive');
        formContainer.classList.add('active');
    }
});
