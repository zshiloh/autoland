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

function marcarCamposConError(campos) {
    console.log('Marcando campos con error:', campos);
    const todosCampos = document.querySelectorAll('#form-reclamo select, #formulario-datos input, #formulario-datos textarea');
    todosCampos.forEach(campo => campo.classList.remove('error'));

    campos.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.classList.add('error');
            console.log('Campo marcado con error:', campoId);
        }
    });
}

function validarFormularioReclamo() {
    const camposConError = [];

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

            ocultarMensajes();
            mostrarErrorCheckbox(false);

            const camposConError = validarFormularioReclamo();

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


            const tipo = document.getElementById('tipo').value;
            const servicio = document.getElementById('servicio-reclamo').value;
            const motivo = document.getElementById('motivo').value;
            const local = document.getElementById('local').value;

            const data = {
                nombres: document.getElementById('nombres').value.trim(),
                apellidos: document.getElementById('apellidos').value.trim(),
                dni: document.getElementById('dni-reclamo').value.trim(),
                telefono: document.getElementById('telefono-reclamo').value.trim(),
                email: document.getElementById('email-reclamo').value.trim(),
                ciudad: document.getElementById('ciudad').value.trim(),
                placa: document.getElementById('placa-reclamo').value.trim(),
                detalle: document.getElementById('detalle').value.trim(),

                tipo: tipo,
                servicio: servicio,
                motivo: motivo,
                local: local
            };

            console.log('Datos a enviar:', data);

            const submitBtn = formReclamo.querySelector('#boton-de-enviar');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

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
                    mostrarMensajeExito();
                    formReclamo.reset();

                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 3000);
                })
                .catch(error => {
                    console.error('Error al enviar reclamo:', error);
                    mostrarErrorServidor();
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    console.log('Botón restaurado');
                });
        });

        const todosCampos = document.querySelectorAll('#form-reclamo select, #formulario-datos input, #formulario-datos textarea');
        todosCampos.forEach(campo => {
            campo.addEventListener('change', function () {
                this.classList.remove('error');
                const camposConError = document.querySelectorAll('#form-reclamo .error, #formulario-datos .error');
                if (camposConError.length === 0) {
                    ocultarMensajes();
                }
            });

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

        const terminosCheckbox = document.getElementById('terminos-checkbox');
        if (terminosCheckbox) {
            terminosCheckbox.addEventListener('change', function () {
                if (this.checked) {
                    mostrarErrorCheckbox(false);

                    const camposConError = document.querySelectorAll('#form-reclamo .error, #formulario-datos .error');
                    if (camposConError.length === 0) {
                        ocultarMensajes();
                    }
                }
            });
        }
    }
});