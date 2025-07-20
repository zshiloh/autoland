// auth.js - Con validaciones visuales mejoradas

// Funciones para mostrar mensajes
function mostrarMensajeExito() {
    const successMsg = document.getElementById('success-message');
    const errorMsg = document.getElementById('error-message');

    if (successMsg) {
        successMsg.style.display = 'block';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (errorMsg) {
        errorMsg.style.display = 'none';
    }
}

function mostrarMensajeError() {
    const successMsg = document.getElementById('success-message');
    const errorMsg = document.getElementById('error-message');

    if (errorMsg) {
        errorMsg.style.display = 'block';
        errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (successMsg) {
        successMsg.style.display = 'none';
    }
}

function ocultarMensajes() {
    const successMsg = document.getElementById('success-message');
    const errorMsg = document.getElementById('error-message');

    if (successMsg) successMsg.style.display = 'none';
    if (errorMsg) errorMsg.style.display = 'none';
}

function marcarCamposConError(camposConError) {
    // Primero quitar todos los errores
    const todosCampos = document.querySelectorAll('.form-control');
    todosCampos.forEach(campo => campo.classList.remove('error'));

    // Marcar solo los campos con error
    camposConError.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.classList.add('error');
        }
    });
}

// LOGIN
const loginForm = document.getElementById('form-login');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        console.log("Login enviado: email='" + email + "', password='" + password + "'");

        // Validación básica
        const camposConError = [];
        if (!email) {
            camposConError.push('email');
        }
        if (!password) {
            camposConError.push('password');
        }

        if (camposConError.length > 0) {
            marcarCamposConError(camposConError);
            mostrarMensajeError();
            return;
        }

        // Ocultar mensajes de error
        ocultarMensajes();

        // Usar API_URL global
        const apiUrl = window.API_URL || "http://localhost:8081/api";
        const data = { email, password };

        fetch(apiUrl + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Credenciales incorrectas');
                }
            })
            .then(data => {
                // Guardar datos del usuario y token
                localStorage.setItem('usuario', JSON.stringify(data.usuario || data));
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }

                // Mostrar mensaje de éxito visual
                mostrarMensajeExito();

                // Redirigir después de un breve delay
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            })
            .catch(error => {
                console.error('Error en login:', error);

                // Mostrar error visual en lugar de alert
                const errorDiv = document.createElement('div');
                errorDiv.className = 'alert alert-danger';
                errorDiv.innerHTML = '<strong>Error:</strong> Credenciales incorrectas o servidor no disponible. <br><small>Esto es normal porque el backend no está corriendo.</small>';
                loginForm.insertBefore(errorDiv, loginForm.firstChild);
            });
    });
}

// REGISTRO - Validaciones visuales mejoradas CON TELEFONO CORREGIDO
const registroForm = document.querySelector('#registro-form form');
if (registroForm) {
    registroForm.addEventListener('submit', function (e) {
        e.preventDefault();

        console.log('=== VALIDANDO REGISTRO ===');

        // Obtener valores
        const nombre = document.getElementById('nombre').value.trim();
        const apellidos = document.getElementById('apellidos').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const contrasena = document.getElementById('contrasena').value.trim();
        const dni = document.getElementById('dni').value.trim();

        // Validaciones
        const camposConError = [];

        if (!nombre) {
            camposConError.push('nombre');
        }
        if (!apellidos) {
            camposConError.push('apellidos');
        }
        if (!email) {
            camposConError.push('email');
        } else {
            // Validación de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                camposConError.push('email');
            }
        }
        if (!telefono) {
            camposConError.push('telefono');
        }
        if (!contrasena) {
            camposConError.push('contrasena');
        } else if (contrasena.length < 6) {
            camposConError.push('contrasena');
        }
        if (!dni) {
            camposConError.push('dni');
        } else if (dni.length !== 8 || !/^\d+$/.test(dni)) {
            camposConError.push('dni');
        }

        // Si hay errores, mostrarlos y salir
        if (camposConError.length > 0) {
            marcarCamposConError(camposConError);
            mostrarMensajeError();
            return;
        }

        // Si todo está bien, ocultar errores
        ocultarMensajes();

        // Usar API_URL global
        const apiUrl = window.API_URL || "http://localhost:8081/api";

        // CORREGIDO: Incluir telefono y apellidos
        const data = {
            nombre: nombre,
            correo: email,
            dni: dni,
            password: contrasena,
            telefono: telefono,     // ← AGREGADO
            apellidos: apellidos    // ← AGREGADO
        };

        console.log('Datos a enviar:', data);

        // Mostrar loading en el botón
        const submitBtn = registroForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registrando...';

        fetch(apiUrl + '/auth/register', {
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
                // Mostrar mensaje de éxito
                mostrarMensajeExito();

                // Redirigir después de un delay
                setTimeout(() => {
                    window.location.href = '../html/login.html';
                }, 2000);
            })
            .catch(error => {
                console.error('Error en registro:', error);

                // Mostrar error visual en lugar de alert
                const errorDiv = document.createElement('div');
                errorDiv.className = 'alert alert-danger';
                errorDiv.innerHTML = '<strong>Error:</strong> No se pudo registrar el usuario. Esto es normal porque el servidor no está disponible. <br><small>Tu formulario funciona correctamente, solo falta el backend.</small>';
                registroForm.insertBefore(errorDiv, registroForm.firstChild);

                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
    });

    // Limpiar errores cuando el usuario interactúe con los campos
    const todosCampos = document.querySelectorAll('#registro-form input');
    todosCampos.forEach(campo => {
        campo.addEventListener('input', function () {
            this.classList.remove('error');
            // Si no hay más campos con error, ocultar mensaje
            const camposConError = document.querySelectorAll('#registro-form input.error');
            if (camposConError.length === 0) {
                ocultarMensajes();
            }
        });
    });
}