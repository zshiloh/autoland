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
    const todosCampos = document.querySelectorAll('.form-control');
    todosCampos.forEach(campo => campo.classList.remove('error'));

    camposConError.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.classList.add('error');
        }
    });
}

function mostrarErrorServidor(mensaje, esLogin = false) {
    const errorServerElement = document.getElementById('error-servidor-message');
    if (errorServerElement) {
        const errorText = errorServerElement.querySelector('.error-text');
        if (errorText) {
            errorText.textContent = mensaje;
        }
        errorServerElement.style.display = 'block';
        errorServerElement.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    const form = esLogin ? document.getElementById('form-login') : document.querySelector('#registro-form form');
    if (!form) return;
    const alertasAnteriores = form.querySelectorAll('.alert-danger');
    alertasAnteriores.forEach(alerta => alerta.remove());

    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.innerHTML = `<strong>Error:</strong> ${mensaje}`;
    form.insertBefore(errorDiv, form.firstChild);
    errorDiv.scrollIntoView({ behavior: 'smooth' });
}

const loginForm = document.getElementById('form-login');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        console.log("Login enviado: email='" + email + "', password='" + password + "'");

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
        ocultarMensajes();

        const apiUrl = window.API_URL || "http://localhost:8081/api";
        const data = { email, password };
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Iniciando sesión...';

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
                localStorage.setItem('usuario', JSON.stringify(data.usuario || data));
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                mostrarMensajeExito();
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            })
            .catch(error => {
                console.error('Error en login:', error);
                mostrarErrorServidor('Credenciales incorrectas o servidor no disponible.', true);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
    });
}

const registroForm = document.querySelector('#registro-form form');
if (registroForm) {
    registroForm.addEventListener('submit', function (e) {
        e.preventDefault();

        console.log('=== VALIDANDO REGISTRO ===');

        const nombre = document.getElementById('nombre').value.trim();
        const apellidos = document.getElementById('apellidos').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const contrasena = document.getElementById('contrasena').value.trim();
        const dni = document.getElementById('dni').value.trim();
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
        if (camposConError.length > 0) {
            marcarCamposConError(camposConError);
            mostrarMensajeError();
            return;
        }

        ocultarMensajes();

        const apiUrl = window.API_URL || "http://localhost:8081/api";
        const data = {
            nombre: nombre,
            correo: email,
            dni: dni,
            password: contrasena,
            telefono: telefono,
            apellidos: apellidos
        };

        console.log('Datos a enviar:', data);
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

                mostrarMensajeExito();

                setTimeout(() => {
                    window.location.href = '../html/login.html';
                }, 2000);
            })
            .catch(error => {
                console.error('Error en registro:', error);
                mostrarErrorServidor('No se pudo registrar el usuario.', false);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
    });

    const todosCampos = document.querySelectorAll('#registro-form input');
    todosCampos.forEach(campo => {
        campo.addEventListener('input', function () {
            this.classList.remove('error');
            const camposConError = document.querySelectorAll('#registro-form input.error');
            if (camposConError.length === 0) {
                ocultarMensajes();
            }
        });
    });
}