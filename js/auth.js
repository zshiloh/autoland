const API_URL = "http://localhost:8081/api";

// LOGIN
const loginForm = document.getElementById('form-login');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const contrasena = document.getElementById('password').value.trim();

        console.log("Login enviado: email='" + email + "', contrasena='" + contrasena + "'");

        const data = { email, contrasena };

        fetch(API_URL + '/usuarios/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(data => {
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            localStorage.setItem('token', data.token);
            window.location.href = '../index.html';
        })
        .catch(() => alert('Email o contraseña incorrectos'));
    });
}


// REGISTRO
const registroForm = document.querySelector('#registro-form form');
if (registroForm) {
    registroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const data = {
            nombre: document.getElementById('nombre').value,
            apellidos: document.getElementById('apellidos').value,
            email: document.getElementById('email').value,
            contrasena: document.getElementById('contrasena').value,
            dni: document.getElementById('dni').value,
            telefono: document.getElementById('telefono').value
        };
        fetch(API_URL + '/usuarios', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(() => {
            alert('Usuario registrado con éxito');
            window.location.href = '../html/login.html';
        })
        .catch(() => alert('Error al registrar usuario'));
    });
}