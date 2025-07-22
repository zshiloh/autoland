// reclamos.js - Con validación personalizada y checkbox como confirmar-cita

// Funciones para mostrar mensajes (iguales que agendar-cita)
function mostrarMensajeExito() {
    console.log('Mostrando mensaje de éxito');
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
    console.log('Mostrando mensaje de error');
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

// Función para mostrar error de servidor (cuando validación pasa pero falla conexión)
function mostrarErrorServidor() {
    const successMsg = document.getElementById('success-message');
    const errorMsg = document.getElementById('error-message');

    if (errorMsg) {
        errorMsg.innerHTML = '<strong>Error:</strong> Por favor intentalo más tarde o servidor no disponible.';
        errorMsg.style.display = 'block';
        errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (successMsg) {
        successMsg.style.display = 'none';
    }
}

// Función para mostrar/ocultar error del checkbox (EXACTA de confirmar-cita)
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

// Función para marcar campos con error (igual que agendar-cita)
function marcarCamposConError(campos) {
    console.log('Marcando campos con error:', campos);
    // Primero quitar todos los errores (incluir AMBOS formularios)
    const todosCampos = document.querySelectorAll('#form-reclamo select, #formulario-datos input, #formulario-datos textarea');
    todosCampos.forEach(campo => campo.classList.remove('error'));

    // Marcar campos con error
    campos.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.classList.add('error');
            console.log('Campo marcado con error:', campoId);
        }
    });
}

// Función de validación personalizada (como agendar-cita)
function validarFormularioReclamo() {
    const camposConError = [];

    // Validar campos de datos personales (lado izquierdo)
    const nombres = document.getElementById('nombres').value.trim();
    if (!nombres) {
        camposConError.push('nombres');
    }

    const apellidos = document.getElementById('apellidos').value.trim();
    if (!apellidos) {
        camposConError.push('apellidos');
    }

    const dni = document.getElementById('dni-reclamo').value.trim();
    if (!dni) {
        camposConError.push('dni-reclamo');
    } else if (dni.length !== 8 || !/^\d+$/.test(dni)) {
        camposConError.push('dni-reclamo');
    }

    const telefono = document.getElementById('telefono-reclamo').value.trim();
    if (!telefono) {
        camposConError.push('telefono-reclamo');
    }

    const email = document.getElementById('email-reclamo').value.trim();
    if (!email) {
        camposConError.push('email-reclamo');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            camposConError.push('email-reclamo');
        }
    }

    const ciudad = document.getElementById('ciudad').value.trim();
    if (!ciudad) {
        camposConError.push('ciudad');
    }

    const placa = document.getElementById('placa-reclamo').value.trim();
    if (!placa) {
        camposConError.push('placa-reclamo');
    }

    const detalle = document.getElementById('detalle').value.trim();
    if (!detalle) {
        camposConError.push('detalle');
    }

    // Validar campos del formulario de reclamo (lado derecho)
    const tipo = document.getElementById('tipo').value;
    if (!tipo) {
        camposConError.push('tipo');
    }

    const servicio = document.getElementById('servicio-reclamo').value;
    if (!servicio) {
        camposConError.push('servicio-reclamo');
    }

    const motivo = document.getElementById('motivo').value;
    if (!motivo) {
        camposConError.push('motivo');
    }

    const local = document.getElementById('local').value;
    if (!local) {
        camposConError.push('local');
    }

    return camposConError;
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('reclamos.js iniciado');

    const formReclamo = document.getElementById('form-reclamo');
    console.log('Formulario encontrado:', formReclamo ? 'SÍ' : 'NO');

    if (formReclamo) {
        formReclamo.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('=== FORMULARIO RECLAMO ENVIADO ===');

            // Ocultar mensajes anteriores
            ocultarMensajes();
            mostrarErrorCheckbox(false); // Ocultar error de checkbox

            // Validar campos normales
            const camposConError = validarFormularioReclamo();

            // Validar checkbox de términos CON VALIDACIÓN VISUAL (igual que confirmar-cita)
            const terminosCheckbox = document.getElementById('terminos-checkbox');
            if (!terminosCheckbox || !terminosCheckbox.checked) {
                mostrarErrorCheckbox(true);
            } else {
                mostrarErrorCheckbox(false);
            }

            if (camposConError.length > 0 || !terminosCheckbox || !terminosCheckbox.checked) {
                console.log('Errores encontrados:', camposConError);
                if (camposConError.length > 0) {
                    marcarCamposConError(camposConError);
                    mostrarMensajeError();
                }
                return;
            }

            // Si todo está bien, preparar datos
            const tipo = document.getElementById('tipo').value;
            const servicio = document.getElementById('servicio-reclamo').value;
            const motivo = document.getElementById('motivo').value;
            const local = document.getElementById('local').value;

            const data = {
                tipo: tipo,
                servicio: servicio,
                motivo: motivo,
                local: local
            };

            console.log('Datos a enviar:', data);

            // Mostrar loading en botón
            const submitBtn = formReclamo.querySelector('#boton-de-enviar');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            // Usar API_URL global
            const apiUrl = window.API_URL || "http://localhost:8081/api";
            console.log('Enviando a:', apiUrl + '/reclamos');

            fetch(apiUrl + '/reclamos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(res => {
                    console.log('Respuesta del servidor:', res.status);
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error('Error del servidor al enviar reclamo');
                    }
                })
                .then(data => {
                    console.log('Reclamo enviado exitosamente:', data);
                    // Mostrar mensaje de éxito
                    mostrarMensajeExito();
                    formReclamo.reset();

                    // Redirigir después de 3 segundos
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 3000);
                })
                .catch(error => {
                    console.error('Error al enviar reclamo:', error);
                    // Usar función específica para errores de servidor
                    mostrarErrorServidor();
                })
                .finally(() => {
                    // Restaurar botón
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    console.log('Botón restaurado');
                });
        });

        // Limpiar errores cuando el usuario interactúe con los campos (AMBOS formularios)
        const todosCampos = document.querySelectorAll('#form-reclamo select, #formulario-datos input, #formulario-datos textarea');
        todosCampos.forEach(campo => {
            campo.addEventListener('change', function () {
                this.classList.remove('error');
                // Si no hay más campos con error, ocultar mensaje
                const camposConError = document.querySelectorAll('#form-reclamo .error, #formulario-datos .error');
                if (camposConError.length === 0) {
                    ocultarMensajes();
                }
            });

            // Para inputs también escuchar 'input'
            if (campo.tagName === 'INPUT' || campo.tagName === 'TEXTAREA') {
                campo.addEventListener('input', function () {
                    this.classList.remove('error');
                    const camposConError = document.querySelectorAll('#form-reclamo .error, #formulario-datos .error');
                    if (camposConError.length === 0) {
                        ocultarMensajes();
                    }
                });
            }
        });

        // Limpiar error del checkbox cuando se marque (EXACTO de confirmar-cita)
        const terminosCheckbox = document.getElementById('terminos-checkbox');
        if (terminosCheckbox) {
            terminosCheckbox.addEventListener('change', function () {
                if (this.checked) {
                    mostrarErrorCheckbox(false);

                    // AGREGAR: Verificar si ya no hay más errores para ocultar mensaje principal
                    const camposConError = document.querySelectorAll('#form-reclamo .error, #formulario-datos .error');
                    if (camposConError.length === 0) {
                        ocultarMensajes(); // Ocultar mensaje "Por favor completa los campos"
                    }
                }
            });
        }
    }
});