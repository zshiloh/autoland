// navbar.js - Funcionalidad del navbar (sin conflictos)

document.addEventListener('DOMContentLoaded', function () {
    console.log('navbar.js iniciado');

    const usuarioDropdown = document.getElementById('usuario-dropdown');
    const loginNavItem = document.getElementById('login-nav-item');
    const usuarioNombre = document.getElementById('usuario-nombre');
    const logoutLink = document.getElementById('logout-link');

    function verificarAutenticacion() {
        const token = localStorage.getItem('token');
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

        if (token && usuario.nombre) {

            if (usuarioDropdown) {
                usuarioDropdown.style.display = 'block';
            }
            if (loginNavItem) {
                loginNavItem.style.display = 'none';
            }
            if (usuarioNombre) {
                usuarioNombre.textContent = usuario.nombre;
            }

            console.log('Usuario autenticado:', usuario.nombre);
        } else {

            if (usuarioDropdown) {
                usuarioDropdown.style.display = 'none';
            }
            if (loginNavItem) {
                loginNavItem.style.display = 'block';
            }

            console.log('Usuario no autenticado');
        }
    }

    function cerrarSesion() {
        console.log('Cerrando sesión...');

        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('datosAgendar');
        localStorage.removeItem('datosPersonales');

        verificarAutenticacion();

        window.location.href = '../index.html';
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            cerrarSesion();
        });
    }

    verificarAutenticacion();

    window.addEventListener('storage', function (e) {
        if (e.key === 'token' || e.key === 'usuario') {
            verificarAutenticacion();
        }
    });

    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {

        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {

                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            });
        });
    }

    function resaltarPaginaActual() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        navLinks.forEach(link => {
            link.classList.remove('active');

            const linkPath = link.getAttribute('href');
            if (linkPath && currentPath.includes(linkPath.replace('../', '').replace('./', ''))) {
                link.classList.add('active');
            }
        });
    }

    resaltarPaginaActual();

    let lastScrollTop = 0;
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 0) {
            navbar?.classList.add('navbar-scrolled');
        } else {
            navbar?.classList.remove('navbar-scrolled');
        }

        lastScrollTop = scrollTop;
    });

    console.log('navbar.js configurado correctamente');
});