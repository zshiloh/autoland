const API_URL = "http://localhost:8081/api";

// LOGIN - Corregido para coincidir con tu documentación
const loginForm = document.getElementById('form-login');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        console.log("Login enviado: email='" + email + "', password='" + password + "'");

        // Validación básica
        if (!email || !password) {
            alert('Por favor, completa todos los campos');
            return;
        }

        // Usar los campos exactos de tu documentación
        const data = { email, password };

        fetch(API_URL + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Login fallido');
                }
            })
            .then(data => {
                // Guardar datos del usuario y token
                localStorage.setItem('usuario', JSON.stringify(data.usuario || data));
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                alert('¡Bienvenido!');
                window.location.href = '../index.html';
            })
            .catch(error => {
                console.error('Error en login:', error);
                alert('Email o contraseña incorrectos');
            });
    });
}

// REGISTRO - Corregido para usar el selector correcto
const registroForm = document.querySelector('#registro-form form');
if (registroForm) {
    registroForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Obtener valores
        const nombre = document.getElementById('nombre').value.trim();
        const apellidos = document.getElementById('apellidos').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const contrasena = document.getElementById('contrasena').value.trim();
        const dni = document.getElementById('dni').value.trim();

        // Validación básica
        if (!nombre || !apellidos || !email || !telefono || !contrasena || !dni) {
            alert('Por favor, completa todos los campos');
            return;
        }

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, ingresa un email válido');
            return;
        }

        // Validación de DNI (8 dígitos)
        if (dni.length !== 8 || !/^\d+$/.test(dni)) {
            alert('El DNI debe tener 8 dígitos');
            return;
        }

        // Validación de contraseña (mínimo 6 caracteres)
        if (contrasena.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        // Campos según tu documentación API
        const data = {
            nombre: nombre,
            correo: email, // Tu API espera "correo"
            dni: dni,
            password: contrasena // Tu API espera "password"
        };

        fetch(API_URL + '/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    return res.text().then(text => {
                        throw new Error(text || 'Error en el registro');
                    });
                }
            })
            .then(data => {
                alert('Usuario registrado con éxito');
                window.location.href = '../html/login.html';
            })
            .catch(error => {
                console.error('Error en registro:', error);
                alert('Error al registrar usuario: ' + error.message);
            });
    });
}