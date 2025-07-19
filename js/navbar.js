document.addEventListener('DOMContentLoaded', function () {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    const usuarioDropdown = document.getElementById('usuario-dropdown');
    const usuarioNombre = document.getElementById('usuario-nombre');
    const loginNavItem = document.getElementById('login-nav-item');
    if (usuario && usuario.nombre) {
        usuarioDropdown.style.display = 'block';
        usuarioNombre.textContent = usuario.nombre;
        if (loginNavItem) loginNavItem.style.display = 'none';
    } else {
        usuarioDropdown.style.display = 'none';
        if (loginNavItem) loginNavItem.style.display = 'block';
    }
    // Logout
    const logout = document.getElementById('logout-link');
    if (logout) {
        logout.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('usuario');
            localStorage.removeItem('token');
            window.location.href = '../index.html';
        });
    }
});