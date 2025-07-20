// citas.js - Con mensaje único arriba

// Función para obtener headers con token de autorización
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

// Función para mostrar mensaje de éxito
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

// Función para mostrar mensaje de error
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

// Función para ocultar todos los mensajes
function ocultarMensajes() {
    const successMsg = document.getElementById('success-message');
    const errorMsg = document.getElementById('error-message');
    
    if (successMsg) successMsg.style.display = 'none';
    if (errorMsg) errorMsg.style.display = 'none';
}

// Función para marcar campos con error (solo borde rojo)
function marcarCamposConError(camposConError) {
    // Primero quitar todos los errores
    const todosCampos = document.querySelectorAll('.form-control, .form-select');
    todosCampos.forEach(campo => campo.classList.remove('error'));
    
    // Marcar solo los campos con error
    camposConError.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.classList.add('error');
        }
    });
}

// Función para validar el primer paso
function validarPrimerPaso() {
    const camposConError = [];
    
    // Validar placa
    const placa = document.getElementById('placa').value.trim();
    if (!placa) {
        camposConError.push('placa');
    }
    
    // Validar marca
    const marca = document.getElementById('marca').value;
    if (!marca || marca === 'Seleccione marca') {
        camposConError.push('marca');
    }
    
    // Validar modelo
    const modelo = document.getElementById('modelo').value;
    if (!modelo || modelo === 'Seleccione modelo') {
        camposConError.push('modelo');
    }
    
    // Validar año
    const año = document.getElementById('año').value;
    if (!año || año === 'Seleccione año del modelo') {
        camposConError.push('año');
    }
    
    // Validar servicio
    const servicio = document.getElementById('servicio').value;
    if (!servicio || servicio === 'Seleccione servicio') {
        camposConError.push('servicio');
    }
    
    // Validar sucursal
    const sucursal = document.getElementById('sucursal').value;
    if (!sucursal || sucursal === 'Seleccione local') {
        camposConError.push('sucursal');
    }
    
    // Validar fecha
    const fecha = document.getElementById('calendario-input').value;
    if (!fecha) {
        camposConError.push('calendario-input');
    }
    
    // Validar hora
    const horaSeleccionada = document.querySelector('.time-button.active');
    if (!horaSeleccionada) {
        // Para la hora no hay un campo específico que marcar, así que solo agregamos al contador
        camposConError.push('hora');
    }
    
    return camposConError;
}

// Función para validar datos personales
function validarDatosPersonales() {
    const camposConError = [];
    
    // Validar número de documento
    const numeroDocumento = document.getElementById('numero-documento').value.trim();
    if (!numeroDocumento) {
        camposConError.push('numero-documento');
    }
    
    // Validar nombre
    const nombre = document.getElementById('nombre').value.trim();
    if (!nombre) {
        camposConError.push('nombre');
    }
    
    // Validar apellidos
    const apellidos = document.getElementById('apellidos').value.trim();
    if (!apellidos) {
        camposConError.push('apellidos');
    }
    
    // Validar email
    const email = document.getElementById('email').value.trim();
    if (!email) {
        camposConError.push('email');
    } else {
        // Validación de formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            camposConError.push('email');
        }
    }
    
    // Validar teléfono
    const telefono = document.getElementById('telefono').value.trim();
    if (!telefono) {
        camposConError.push('telefono');
    }
    
    return camposConError;
}

// Función para mostrar/ocultar error del checkbox
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

// Guardar datos de agendar-cita
const btnSiguienteA = document.getElementById('btn-siguiente-a');
if (btnSiguienteA) {
    btnSiguienteA.addEventListener('click', function(e) {
        e.preventDefault();
        
        console.log('=== VALIDANDO DATOS AGENDAR ===');
        
        // Validar todos los campos
        const camposConError = validarPrimerPaso();
        
        if (camposConError.length > 0) {
            // Mostrar mensaje de error y marcar campos
            marcarCamposConError(camposConError.filter(campo => campo !== 'hora'));
            mostrarMensajeError();
            return;
        }
        
        // Si todo está bien, guardar datos
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
        
        // Mostrar mensaje de éxito antes de continuar
        mostrarMensajeExito();
        
        // Redirigir después de un breve delay
        setTimeout(() => {
            window.location.href = './ingresar-datos.html';
        }, 1500);
    });
}

// Guardar datos personales
const btnSiguiente = document.getElementById('btn-siguiente');
if (btnSiguiente) {
    btnSiguiente.addEventListener('click', function(e) {
        e.preventDefault();
        
        console.log('=== VALIDANDO DATOS PERSONALES ===');
        
        // Validar todos los campos
        const camposConError = validarDatosPersonales();
        
        if (camposConError.length > 0) {
            // Mostrar mensaje de error y marcar campos
            marcarCamposConError(camposConError);
            mostrarMensajeError();
            return;
        }
        
        // Si todo está bien, guardar datos
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
        
        // Mostrar mensaje de éxito
        mostrarMensajeExito();
        
        // Redirigir después de un breve delay
        setTimeout(() => {
            window.location.href = './confirmar-cita.html';
        }, 1500);
    });
}

// Confirmar cita y enviar al backend
const btnConfirmar = document.getElementById('btn-confirmar');
if (btnConfirmar) {
    btnConfirmar.addEventListener('click', function(e) {
        e.preventDefault();
        
        // VALIDACIÓN DEL CHECKBOX CON MENSAJE VISUAL
        const terminosCheckbox = document.getElementById('terminos-checkbox');
        if (!terminosCheckbox || !terminosCheckbox.checked) {
            mostrarErrorCheckbox(true);
            return;
        }
        
        // Ocultar error si el checkbox está marcado
        mostrarErrorCheckbox(false);
        
        const datosAgendar = JSON.parse(localStorage.getItem('datosAgendar') || '{}');
        const datosPersonales = JSON.parse(localStorage.getItem('datosPersonales') || '{}');
        
        // Verificar que existen los datos
        if (!datosAgendar.fecha || !datosPersonales.nombre) {
            // Crear mensaje de error visual en lugar de alert
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger';
            errorDiv.innerHTML = '<strong>Error:</strong> Faltan datos de la cita. <a href="./agendar-cita.html">Volver a llenar el formulario</a>';
            document.querySelector('.info-section').insertBefore(errorDiv, document.querySelector('.info-card'));
            return;
        }
        
        // Usar API_URL (debe estar definido en contacto.js)
        const apiUrl = window.API_URL || "http://localhost:8081/api";
        
        // Estructurar los datos según tu documentación API
        const cita = {
            fecha: datosAgendar.fecha,
            horario: datosAgendar.hora,
            servicio: datosAgendar.servicio,
            estado: "pendiente",
            concesionario: datosAgendar.sucursal
        };

        // Mostrar loading
        const originalText = btnConfirmar.textContent;
        btnConfirmar.disabled = true;
        btnConfirmar.textContent = 'Enviando...';

        fetch(apiUrl + '/citas', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(cita)
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                return res.text().then(text => {
                    throw new Error(text || 'Error al crear cita');
                });
            }
        })
        .then(data => {
            // Limpiar datos del localStorage
            localStorage.removeItem('datosAgendar');
            localStorage.removeItem('datosPersonales');
            
            // Mostrar mensaje de éxito visual en lugar de alert
            const successDiv = document.createElement('div');
            successDiv.className = 'alert alert-success';
            successDiv.innerHTML = '<strong>¡Éxito!</strong> Tu cita fue agendada correctamente. Serás redirigido al inicio...';
            document.querySelector('.info-section').insertBefore(successDiv, document.querySelector('.info-card'));
            
            // Redirigir después de 3 segundos
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 3000);
        })
        .catch(error => {
            console.error('Error al agendar cita:', error);
            
            // Mostrar error visual en lugar de alert
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger';
            errorDiv.innerHTML = '<strong>Error:</strong> No se pudo agendar la cita. Esto es normal porque el servidor no está disponible. <br><small>Tu formulario funciona correctamente, solo falta el backend.</small>';
            document.querySelector('.info-section').insertBefore(errorDiv, document.querySelector('.info-card'));
            
            // Restaurar botón
            btnConfirmar.disabled = false;
            btnConfirmar.textContent = originalText;
        });
    });
}

// Limpiar error cuando el usuario marque el checkbox
const terminosCheckbox = document.getElementById('terminos-checkbox');
if (terminosCheckbox) {
    terminosCheckbox.addEventListener('change', function() {
        if (this.checked) {
            mostrarErrorCheckbox(false);
        }
    });
}

// Agregar eventos para limpiar errores cuando el usuario interactúe con los campos
document.addEventListener('DOMContentLoaded', function() {
    // Limpiar errores en tiempo real
    const todosCampos = document.querySelectorAll('.form-control, .form-select');
    todosCampos.forEach(campo => {
        campo.addEventListener('change', function() {
            this.classList.remove('error');
            // Si no hay más campos con error, ocultar mensaje
            const camposConError = document.querySelectorAll('.form-control.error, .form-select.error');
            if (camposConError.length === 0) {
                ocultarMensajes();
            }
        });
        
        campo.addEventListener('input', function() {
            this.classList.remove('error');
            // Si no hay más campos con error, ocultar mensaje
            const camposConError = document.querySelectorAll('.form-control.error, .form-select.error');
            if (camposConError.length === 0) {
                ocultarMensajes();
            }
        });
    });
    
    // Para los botones de hora
    document.querySelectorAll('.time-button').forEach(btn => {
        btn.addEventListener('click', function() {
            // Si había error por no seleccionar hora, ocultarlo
            const camposConError = document.querySelectorAll('.form-control.error, .form-select.error');
            if (camposConError.length === 0) {
                ocultarMensajes();
            }
        });
    });
});

// Obtener información del usuario
const citasContainer = document.getElementById('citas-lista');
if (citasContainer) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        citasContainer.innerHTML = `
            <div class="alert alert-warning">
                <h4>Inicia sesión para ver tus citas</h4>
                <p>Para acceder a tu historial de citas, debes iniciar sesión.</p>
                <a href="./login.html" class="btn btn-primary">Iniciar sesión</a>
            </div>
        `;
    } else {
        const apiUrl = window.API_URL || "http://localhost:8081/api";
        
        fetch(apiUrl + '/auth/me', {
            headers: getAuthHeaders()
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
                <div class="alert alert-info">
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
                <div class="alert alert-danger">
                    <h4>Error al cargar tus citas</h4>
                    <p>Hubo un problema al acceder a tu información.</p>
                    <a href="./login.html" class="btn btn-primary">Iniciar sesión nuevamente</a>
                </div>
            `;
        });
    }
}