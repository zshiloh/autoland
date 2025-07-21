// reclamos.js - Refactorizado para usar notificaciones inline

// Funciones para mostrar mensajes usando los mismos IDs que el resto de la app
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

function mostrarMensajeError(mensajePersonalizado = null) {
    console.log('Mostrando mensaje de error:', mensajePersonalizado);
    const successMsg = document.getElementById('success-message');
    const errorMsg = document.getElementById('error-message');

    if (errorMsg) {
        // Si hay un mensaje personalizado, usarlo
        if (mensajePersonalizado) {
            errorMsg.innerHTML = `⚠️ ${mensajePersonalizado}`;
        }
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

// Función para marcar campos con error
function marcarCamposConError(campos) {
    console.log('Marcando campos con error:', campos);
    // Primero quitar todos los errores
    const todosCampos = document.querySelectorAll('#form-reclamo select, #form-reclamo input');
    todosCampos.forEach(campo => campo.classList.remove('error'));

    // Marcar campos con error
    campos.forEach(nombreCampo => {
        const campo = document.querySelector(`#form-reclamo [name="${nombreCampo}"]`);
        if (campo) {
            campo.classList.add('error');
            console.log('Campo marcado con error:', nombreCampo);
        }
    });
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

            // Validar que todos los campos requeridos estén llenos
            const tipo = formReclamo.tipo.value;
            const servicio = formReclamo.servicio.value;
            const motivo = formReclamo.motivo.value;
            const local = formReclamo.local.value;
            const checkbox = formReclamo.tc.checked;

            console.log('Valores del formulario:', { tipo, servicio, motivo, local, checkbox });

            // Validaciones con marcado de campos
            const camposConError = [];

            if (!tipo) {
                camposConError.push('tipo');
            }
            if (!servicio) {
                camposConError.push('servicio');
            }
            if (!motivo) {
                camposConError.push('motivo');
            }
            if (!local) {
                camposConError.push('local');
            }
            if (!checkbox) {
                camposConError.push('tc');
            }

            // Si hay errores, mostrarlos
            if (camposConError.length > 0) {
                console.log('Errores encontrados:', camposConError);
                marcarCamposConError(camposConError);
                mostrarMensajeError('Por favor, completa todos los campos requeridos.');
                return;
            }

            const data = {
                tipo: tipo,
                servicio: servicio,
                motivo: motivo,
                local: local
            };

            // Mostrar mensaje de carga
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

                    // Mostrar error usando notificación inline (NO alert)
                    mostrarMensajeError('Error al enviar reclamo. Por favor, intenta nuevamente.');
                })
                .finally(() => {
                    // Restaurar botón
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    console.log('Botón restaurado');
                });
        });

        // Limpiar errores cuando el usuario interactúe con los campos
        const todosCampos = document.querySelectorAll('#form-reclamo select, #form-reclamo input[type="checkbox"]');
        todosCampos.forEach(campo => {
            campo.addEventListener('change', function () {
                this.classList.remove('error');
                // Si no hay más campos con error, ocultar mensaje
                const camposConError = document.querySelectorAll('#form-reclamo .error');
                if (camposConError.length === 0) {
                    ocultarMensajes();
                }
            });
        });
    }
});