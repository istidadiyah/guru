// scripts/setting.js

function toggleTheme() {
    const themeStylesheet = document.getElementById('themeStylesheet');
    let currentTheme = localStorage.getItem('theme') || 'light';
    console.log(`Current Theme: ${currentTheme}`); // Debugging

    if (currentTheme === 'light') {
        themeStylesheet.setAttribute('href', 'styles/tema/dark.css');
        localStorage.setItem('theme', 'dark');
        console.log('Switched to dark mode'); // Debugging
        document.body.classList.add('dark-mode');
    } else {
        themeStylesheet.setAttribute('href', 'styles/tema/light.css');
        localStorage.setItem('theme', 'light');
        console.log('Switched to light mode'); // Debugging
        document.body.classList.remove('dark-mode');
    }

    // Memicu event 'themeChanged' untuk memberitahu halaman lain
    window.dispatchEvent(new Event('themeChanged'));
}

function initializeTheme() {
    const themeStylesheet = document.getElementById('themeStylesheet');
    const savedTheme = localStorage.getItem('theme') || 'light';
    console.log(`Initializing Theme: ${savedTheme}`); // Debugging

    if (savedTheme === 'dark') {
        themeStylesheet.setAttribute('href', 'styles/tema/dark.css');
    } else {
        themeStylesheet.setAttribute('href', 'styles/tema/light.css');
    }
}

document.addEventListener("DOMContentLoaded", function() {
    initializeTheme();

    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'light';
        darkModeToggle.checked = savedTheme === 'dark';
        console.log(`Toggle Switch Checked: ${darkModeToggle.checked}`); // Debugging
    }

    // Mendengarkan event 'themeChanged' untuk memperbarui elemen saat tema berubah
    window.addEventListener('themeChanged', function() {
        const themeStylesheet = document.getElementById('themeStylesheet');
        const currentTheme = localStorage.getItem('theme') || 'light';
        const curve = document.getElementById('curve');
        console.log(`Theme Changed to: ${currentTheme}`); // Debugging

        if (currentTheme === 'dark') {
            themeStylesheet.setAttribute('href', 'styles/tema/dark.css');
            if (curve) {
                curve.setAttribute('fill', '#333'); // Warna untuk dark mode
            }
        } else {
            themeStylesheet.setAttribute('href', 'styles/tema/light.css');
            if (curve) {
                curve.setAttribute('fill', '#50c6d8'); // Warna untuk light mode
            }
        }
    });
});


// Inisialisasi tema berdasarkan localStorage saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    let currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.classList.add('bg-dark', 'text-white');
        // Menambahkan kelas 'table-dark' ke semua tabel
        document.querySelectorAll('table').forEach(table => {
            table.classList.add('table-dark');
        });
    }
});
