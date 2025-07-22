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

function ocultarTodosLosMensajesConfirmar() {
    const errorFaltanDatos = document.getElementById('error-faltan-datos-message');
    const errorNoAutenticado = document.getElementById('error-no-autenticado-message');
    const citaAgendadaExitosa = document.getElementById('cita-agendada-exitosa-message');
    const errorGeneralCita = document.getElementById('error-general-cita-message');

    if (errorFaltanDatos) errorFaltanDatos.style.display = 'none';
    if (errorNoAutenticado) errorNoAutenticado.style.display = 'none';
    if (citaAgendadaExitosa) citaAgendadaExitosa.style.display = 'none';
    if (errorGeneralCita) errorGeneralCita.style.display = 'none';
}

function mostrarErrorFaltanDatos() {
    ocultarTodosLosMensajesConfirmar();
    const errorMsg = document.getElementById('error-faltan-datos-message');
    if (errorMsg) {
        errorMsg.style.display = 'block';
        errorMsg.scrollIntoView({ behavior: 'smooth' });
    }
}

function mostrarErrorNoAutenticado() {
    ocultarTodosLosMensajesConfirmar();
    const errorMsg = document.getElementById('error-no-autenticado-message');
    if (errorMsg) {
        errorMsg.style.display = 'block';
        errorMsg.scrollIntoView({ behavior: 'smooth' });
    }
}

function mostrarCitaAgendadaExitosa() {
    ocultarTodosLosMensajesConfirmar();
    const successMsg = document.getElementById('cita-agendada-exitosa-message');
    if (successMsg) {
        successMsg.style.display = 'block';
        successMsg.scrollIntoView({ behavior: 'smooth' });
    }
}

function mostrarErrorGeneralCita(mensaje) {
    ocultarTodosLosMensajesConfirmar();
    const errorMsg = document.getElementById('error-general-cita-message');
    const errorText = document.getElementById('error-general-text');
    if (errorMsg && errorText) {
        errorText.textContent = mensaje;
        errorMsg.style.display = 'block';
        errorMsg.scrollIntoView({ behavior: 'smooth' });
    }
}

function marcarCamposConError(camposConError) {
    const todosCampos = document.querySelectorAll('.form-control, .form-select');
    todosCampos.forEach(campo => campo.classList.remove('error'));
    camposConError.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.classList.add('error');
        }
    });
}

function validarPrimerPaso() {
    const camposConError = [];

    const placa = document.getElementById('placa').value.trim();
    if (!placa) {
        camposConError.push('placa');
    }

    const marca = document.getElementById('marca').value;
    if (!marca || marca === 'Seleccione marca') {
        camposConError.push('marca');
    }

    const modelo = document.getElementById('modelo').value;
    if (!modelo || modelo === 'Seleccione modelo') {
        camposConError.push('modelo');
    }

    const año = document.getElementById('año').value;
    if (!año || año === 'Seleccione año del modelo') {
        camposConError.push('año');
    }

    const servicio = document.getElementById('servicio').value;
    if (!servicio || servicio === 'Seleccione servicio') {
        camposConError.push('servicio');
    }

    const sucursal = document.getElementById('sucursal').value;
    if (!sucursal || sucursal === 'Seleccione local') {
        camposConError.push('sucursal');
    }

    const fecha = document.getElementById('calendario-input').value;
    if (!fecha) {
        camposConError.push('calendario-input');
    }

    const horaSeleccionada = document.querySelector('.time-button.active');
    if (!horaSeleccionada) {
        camposConError.push('hora');
    }

    return camposConError;
}

function validarDatosPersonales() {
    const camposConError = [];

    const numeroDocumento = document.getElementById('numero-documento').value.trim();
    if (!numeroDocumento) {
        camposConError.push('numero-documento');
    }

    const nombre = document.getElementById('nombre').value.trim();
    if (!nombre) {
        camposConError.push('nombre');
    }

    const apellidos = document.getElementById('apellidos').value.trim();
    if (!apellidos) {
        camposConError.push('apellidos');
    }

    const email = document.getElementById('email').value.trim();
    if (!email) {
        camposConError.push('email');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            camposConError.push('email');
        }
    }

    const telefono = document.getElementById('telefono').value.trim();
    if (!telefono) {
        camposConError.push('telefono');
    }

    return camposConError;
}

function mostrarErrorCheckbox(mostrar) {
    const terminosSection = document.getElementById('terminos-section');
    const errorMsg = document.getElementById('checkbox-error');

    if (mostrar) {
        terminosSection.classList.add('error');
        errorMsg.style.display = 'block';
        errorMsg.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    } else {
        terminosSection.classList.remove('error');
        errorMsg.style.display = 'none';
    }
}

const btnSiguienteA = document.getElementById('btn-siguiente-a');
if (btnSiguienteA) {
    btnSiguienteA.addEventListener('click', function (e) {
        e.preventDefault();

        console.log('=== VALIDANDO DATOS AGENDAR ===');

        const camposConError = validarPrimerPaso();

        if (camposConError.length > 0) {
            marcarCamposConError(camposConError.filter(campo => campo !== 'hora'));
            mostrarMensajeError();
            return;
        }

        const placa = document.getElementById('placa').value.trim();
        const marca = document.getElementById('marca').value;
        const modelo = document.getElementById('modelo').value;
        const año = document.getElementById('año').value;
        const servicio = document.getElementById('servicio').value;
        const sucursal = document.getElementById('sucursal').value;
        const fecha = document.getElementById('calendario-input').value;
        const horaSeleccionada = document.querySelector('.time-button.active');

        const datosAgendar = {
            placa: placa,
            marca: marca,
            modelo: modelo,
            año: año,
            servicio: servicio,
            sucursal: sucursal,
            fecha: fecha,
            hora: horaSeleccionada.textContent
        };

        console.log('Datos a guardar:', datosAgendar);
        localStorage.setItem('datosAgendar', JSON.stringify(datosAgendar));

        mostrarMensajeExito();
        setTimeout(() => {
            window.location.href = './ingresar-datos.html';
        }, 1500);
    });
}

const btnSiguiente = document.getElementById('btn-siguiente');
if (btnSiguiente) {
    btnSiguiente.addEventListener('click', function (e) {
        e.preventDefault();

        console.log('=== VALIDANDO DATOS PERSONALES ===');

        const camposConError = validarDatosPersonales();

        if (camposConError.length > 0) {
            marcarCamposConError(camposConError);
            mostrarMensajeError();
            return;
        }

        const tipoDocumento = document.getElementById('tipo-documento').value;
        const numeroDocumento = document.getElementById('numero-documento').value.trim();
        const nombre = document.getElementById('nombre').value.trim();
        const apellidos = document.getElementById('apellidos').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();

        const datosPersonales = {
            tipoDocumento: tipoDocumento,
            numeroDocumento: numeroDocumento,
            nombre: nombre,
            apellidos: apellidos,
            email: email,
            telefono: telefono
        };

        console.log('Datos personales a guardar:', datosPersonales);
        localStorage.setItem('datosPersonales', JSON.stringify(datosPersonales));

        mostrarMensajeExito();
        setTimeout(() => {
            window.location.href = './confirmar-cita.html';
        }, 1500);
    });
}

const btnConfirmar = document.getElementById('btn-confirmar');
if (btnConfirmar) {
    btnConfirmar.addEventListener('click', function (e) {
        e.preventDefault();

        const terminosCheckbox = document.getElementById('terminos-checkbox');
        if (!terminosCheckbox || !terminosCheckbox.checked) {
            mostrarErrorCheckbox(true);
            return;
        }

        mostrarErrorCheckbox(false);

        const datosAgendar = JSON.parse(localStorage.getItem('datosAgendar') || '{}');
        const datosPersonales = JSON.parse(localStorage.getItem('datosPersonales') || '{}');

        if (!datosAgendar.fecha || !datosPersonales.nombre) {
            mostrarErrorFaltanDatos();
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            mostrarErrorNoAutenticado();
            return;
        }

        const apiUrl = window.API_URL || "http://localhost:8081/api";

        const cita = {
            placa: datosAgendar.placa,
            marca: datosAgendar.marca,
            modelo: datosAgendar.modelo,
            anio: datosAgendar.año,
            servicio: datosAgendar.servicio,
            sucursal: datosAgendar.sucursal,
            fecha: datosAgendar.fecha,
            horario: datosAgendar.hora,
            observaciones: ""
        };

        const originalText = btnConfirmar.textContent;
        btnConfirmar.disabled = true;
        btnConfirmar.textContent = 'Enviando...';

        console.log('=== CREANDO CITA ===');
        console.log('Token:', token ? 'Presente' : 'Ausente');
        console.log('Datos de cita:', cita);

        fetch(apiUrl + '/citas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(cita)
        })
            .then(res => {
                console.log('Respuesta status:', res.status);
                if (res.ok) {
                    return res.json();
                } else {
                    return res.text().then(text => {
                        throw new Error(text || 'Error al crear cita');
                    });
                }
            })
            .then(data => {
                console.log('Cita creada exitosamente:', data);

                localStorage.removeItem('datosAgendar');
                localStorage.removeItem('datosPersonales');

                mostrarCitaAgendadaExitosa();

                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 3000);
            })
            .catch(error => {
                console.error('Error al agendar cita:', error);
                mostrarErrorGeneralCita(error.message);

                btnConfirmar.disabled = false;
                btnConfirmar.textContent = originalText;
            });
    });
}

const terminosCheckbox = document.getElementById('terminos-checkbox');
if (terminosCheckbox) {
    terminosCheckbox.addEventListener('change', function () {
        if (this.checked) {
            mostrarErrorCheckbox(false);
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {

    const todosCampos = document.querySelectorAll('.form-control, .form-select');
    todosCampos.forEach(campo => {
        campo.addEventListener('change', function () {
            this.classList.remove('error');
            const camposConError = document.querySelectorAll('.form-control.error, .form-select.error');
            if (camposConError.length === 0) {
                ocultarMensajes();
            }
        });

        campo.addEventListener('input', function () {
            this.classList.remove('error');
            const camposConError = document.querySelectorAll('.form-control.error, .form-select.error');
            if (camposConError.length === 0) {
                ocultarMensajes();
            }
        });
    });

    document.querySelectorAll('.time-button').forEach(btn => {
        btn.addEventListener('click', function () {
            const camposConError = document.querySelectorAll('.form-control.error, .form-select.error');
            if (camposConError.length === 0) {
                ocultarMensajes();
            }
        });
    });
});

const citasContainer = document.getElementById('citas-lista');
if (citasContainer) {
    const token = localStorage.getItem('token');

    if (!token) {
        citasContainer.innerHTML = `
            <div class="alert alert-warning" id="login-requerido-citas">
                <h4>Inicia sesión para ver tus citas</h4>
                <p>Para acceder a tu historial de citas, debes iniciar sesión.</p>
                <a href="./login.html" class="btn btn-primary">Iniciar sesión</a>
            </div>
        `;
    } else {
        const apiUrl = window.API_URL || "http://localhost:8081/api";

        fetch(apiUrl + '/auth/me', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('No autorizado');
                }
            })
            .then(usuario => {
                citasContainer.innerHTML = `
                <div class="alert alert-info" id="bienvenida-usuario-citas">
                    <h4>¡Hola ${usuario.nombre || 'Usuario'}!</h4>
                    <p>La funcionalidad de mostrar el historial de citas está en desarrollo.</p>
                    <p>Una vez que tengas tu API completa, aquí se mostrarán todas tus citas agendadas.</p>
                    <a href="./agendar-cita.html" class="btn btn-warning">Agendar nueva cita</a>
                </div>
            `;
            })
            .catch(error => {
                console.error('Error al obtener usuario:', error);
                citasContainer.innerHTML = `
                <div class="alert alert-danger" id="error-cargar-citas">
                    <h4>Error al cargar tus citas</h4>
                    <p>Hubo un problema al acceder a tu información.</p>
                    <a href="./login.html" class="btn btn-primary">Iniciar sesión nuevamente</a>
                </div>
            `;
            });
    }
}