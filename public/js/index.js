const hamburger = document.getElementById('hamburger');
const sideMenu = document.getElementById('side-menu');
const closeBtn = document.getElementById('close-btn');

hamburger.addEventListener('click', () => {
    sideMenu.classList.toggle('show');
});

closeBtn.addEventListener('click', () => {
    sideMenu.classList.remove('show');
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sideMenu.classList.remove('show');
    }
});

const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        document.querySelectorAll('.local-link').forEach(link => {
            if (!isLocalhost) link.style.display = 'none';
        });
        document.querySelectorAll('.github-link').forEach(link => {
            if (isLocalhost) link.style.display = 'none';
        });