// navbar.js - Funcionalidad del navbar (sin conflictos)

document.addEventListener('DOMContentLoaded', function() {
    console.log('navbar.js iniciado');
    
    // Elementos del navbar
    const usuarioDropdown = document.getElementById('usuario-dropdown');
    const loginNavItem = document.getElementById('login-nav-item');
    const usuarioNombre = document.getElementById('usuario-nombre');
    const logoutLink = document.getElementById('logout-link');

    // Función para verificar estado de autenticación
    function verificarAutenticacion() {
        const token = localStorage.getItem('token');
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        
        if (token && usuario.nombre) {
            // Usuario logueado - mostrar dropdown, ocultar login
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
            // Usuario no logueado - ocultar dropdown, mostrar login
            if (usuarioDropdown) {
                usuarioDropdown.style.display = 'none';
            }
            if (loginNavItem) {
                loginNavItem.style.display = 'block';
            }
            
            console.log('Usuario no autenticado');
        }
    }

    // Función para cerrar sesión
    function cerrarSesion() {
        console.log('Cerrando sesión...');
        
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('datosAgendar');
        localStorage.removeItem('datosPersonales');
        
        // Actualizar navbar
        verificarAutenticacion();
        
        // Redirigir al home
        window.location.href = '../index.html';
    }

    // Event listener para logout
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            cerrarSesion();
        });
    }

    // Verificar autenticación al cargar la página
    verificarAutenticacion();

    // Actualizar navbar cuando cambie el localStorage (por si el usuario se loguea en otra pestaña)
    window.addEventListener('storage', function(e) {
        if (e.key === 'token' || e.key === 'usuario') {
            verificarAutenticacion();
        }
    });

    // Funcionalidad del menú móvil (si usas Bootstrap collapse)
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Cerrar menú móvil al hacer clic en un link
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Si el menú está abierto en móvil, cerrarlo
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            });
        });
    }

    // Función para resaltar página actual en el navbar
    function resaltarPaginaActual() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            // Comparar el href del link con la página actual
            const linkPath = link.getAttribute('href');
            if (linkPath && currentPath.includes(linkPath.replace('../', '').replace('./', ''))) {
                link.classList.add('active');
            }
        });
    }

    // Resaltar página actual
    resaltarPaginaActual();

    // Efecto del navbar al hacer scroll (opcional)
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Agregar sombra cuando se hace scroll
        if (scrollTop > 0) {
            navbar?.classList.add('navbar-scrolled');
        } else {
            navbar?.classList.remove('navbar-scrolled');
        }
        
        lastScrollTop = scrollTop;
    });

    console.log('navbar.js configurado correctamente');
});