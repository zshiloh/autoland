// contacto.js - Refactorizado para usar notificaciones inline

window.API_URL = 'http://localhost:8081/api';

// Funciones para mostrar mensajes usando los mismos IDs que el resto de la app
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

// Función para marcar campos con error
function marcarCamposConError(campos) {
    // Primero quitar todos los errores
    const todosCampos = document.querySelectorAll('#form-contacto input, #form-contacto select, #form-contacto textarea');
    todosCampos.forEach(campo => campo.classList.remove('error'));

    // Marcar campos con error
    campos.forEach(nombreCampo => {
        const campo = document.querySelector(`#form-contacto [name="${nombreCampo}"]`);
        if (campo) {
            campo.classList.add('error');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('form-contacto');

    if (!formulario) return;

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Ocultar mensajes anteriores
        ocultarMensajes();

        const formData = new FormData(formulario);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Remover campos que no son parte de la API
        delete data.tc;
        delete data.info;

        // Validación básica con marcado de campos
        const camposConError = [];

        if (!data.nombre) {
            camposConError.push('nombre');
        }
        if (!data.dni) {
            camposConError.push('dni');
        }
        if (!data.telefono) {
            camposConError.push('telefono');
        }
        if (!data.email) {
            camposConError.push('email');
        }
        if (!data.consulta) {
            camposConError.push('consulta');
        }

        // Validación de email
        if (data.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                camposConError.push('email');
            }
        }

        // Validación de DNI (8 dígitos)
        if (data.dni && (data.dni.length !== 8 || !/^\d+$/.test(data.dni))) {
            camposConError.push('dni');
        }

        // Si hay errores, mostrarlos
        if (camposConError.length > 0) {
            marcarCamposConError(camposConError);
            mostrarMensajeError();
            return;
        }

        // Mostrar loading en botón
        const submitBtn = formulario.querySelector('#boton-de-enviar');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        try {
            const response = await fetch(`${window.API_URL}/contacto`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Mostrar mensaje de éxito
                mostrarMensajeExito();
                formulario.reset();

                // Redirigir después de 3 segundos (opcional)
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 3000);
            } else if (response.status === 400) {
                const error = await response.text();
                // Actualizar mensaje de error específico
                const errorMsg = document.getElementById('error-message');
                if (errorMsg) {
                    errorMsg.innerHTML = `⚠️ Error al enviar mensaje: ${error}`;
                }
                mostrarMensajeError();
            } else {
                mostrarMensajeError();
            }
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            // Actualizar mensaje de error para problemas de conexión
            const errorMsg = document.getElementById('error-message');
            if (errorMsg) {
                errorMsg.innerHTML = '⚠️ Error al enviar mensaje. Verifica tu conexión e intenta más tarde.';
            }
            mostrarMensajeError();
        } finally {
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    // Limpiar errores cuando el usuario interactúe con los campos
    const todosCampos = document.querySelectorAll('#form-contacto input, #form-contacto select, #form-contacto textarea');
    todosCampos.forEach(campo => {
        campo.addEventListener('input', function () {
            this.classList.remove('error');
            // Si no hay más campos con error, ocultar mensaje
            const camposConError = document.querySelectorAll('#form-contacto .error');
            if (camposConError.length === 0) {
                ocultarMensajes();
            }
        });

        campo.addEventListener('change', function () {
            this.classList.remove('error');
            // Si no hay más campos con error, ocultar mensaje
            const camposConError = document.querySelectorAll('#form-contacto .error');
            if (camposConError.length === 0) {
                ocultarMensajes();
            }
        });
    });
});