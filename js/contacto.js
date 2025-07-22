// contacto.js - Con función para checkbox como confirmar-cita

window.API_URL = 'http://localhost:8081/api';

// Funciones para mostrar mensajes (iguales que agendar-cita)
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
    // Primero quitar todos los errores
    const todosCampos = document.querySelectorAll('#form-contacto input, #form-contacto select, #form-contacto textarea');
    todosCampos.forEach(campo => campo.classList.remove('error'));

    // Marcar campos con error
    campos.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.classList.add('error');
        }
    });
}

// Función de validación personalizada (como agendar-cita)
function validarFormularioContacto() {
    const camposConError = [];

    // Validar nombre
    const nombre = document.getElementById('nombre').value.trim();
    if (!nombre) {
        camposConError.push('nombre');
    }

    // Validar DNI
    const dni = document.getElementById('dni').value.trim();
    if (!dni) {
        camposConError.push('dni');
    } else if (dni.length !== 8 || !/^\d+$/.test(dni)) {
        camposConError.push('dni');
    }

    // Validar teléfono
    const telefono = document.getElementById('telefono').value.trim();
    if (!telefono) {
        camposConError.push('telefono');
    }

    // Validar email
    const email = document.getElementById('email').value.trim();
    if (!email) {
        camposConError.push('email');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            camposConError.push('email');
        }
    }

    // Validar consulta
    const consulta = document.getElementById('consulta').value;
    if (!consulta) {
        camposConError.push('consulta');
    }

    // Validar mensaje
    const mensaje = document.getElementById('mensaje').value.trim();
    if (!mensaje) {
        camposConError.push('mensaje');
    }

    return camposConError;
}

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('form-contacto');

    if (!formulario) return;

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();

        console.log('=== VALIDANDO FORMULARIO CONTACTO ===');

        // Ocultar mensajes anteriores
        ocultarMensajes();
        mostrarErrorCheckbox(false); // Ocultar error de checkbox

        // Validar campos normales
        const camposConError = validarFormularioContacto();

        // Validar checkbox de términos CON VALIDACIÓN VISUAL (igual que confirmar-cita)
        const terminosCheckbox = document.getElementById('terminos-checkbox');
        if (!terminosCheckbox || !terminosCheckbox.checked) {
            mostrarErrorCheckbox(true);
            // No agregamos a camposConError porque se maneja visualmente aparte
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
        const formData = new FormData(formulario);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Remover campos que no son parte de la API
        delete data.tc;
        delete data.info;

        console.log('Datos a enviar:', data);

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
                console.error('Error 400:', error);
                mostrarMensajeError();
            } else {
                mostrarMensajeError();
            }
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            // Usar función específica para errores de servidor
            mostrarErrorServidor();
        } finally {
            // Restaurar botón
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    // Limpiar errores cuando el usuario interactúe con los campos (igual que agendar-cita)
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

    // Limpiar error del checkbox cuando se marque (EXACTO de confirmar-cita)
    const terminosCheckbox = document.getElementById('terminos-checkbox');
    if (terminosCheckbox) {
        terminosCheckbox.addEventListener('change', function () {
            if (this.checked) {
                mostrarErrorCheckbox(false);
            }
        });
    }
});