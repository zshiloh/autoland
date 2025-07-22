window.API_URL = 'http://localhost:8081/api';

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
    const todosCampos = document.querySelectorAll('#form-contacto input, #form-contacto select, #form-contacto textarea');
    todosCampos.forEach(campo => campo.classList.remove('error'));
    campos.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.classList.add('error');
        }
    });
}

function validarFormularioContacto() {
    const camposConError = [];

    const nombre = document.getElementById('nombre').value.trim();
    if (!nombre) {
        camposConError.push('nombre');
    }

    const dni = document.getElementById('dni').value.trim();
    if (!dni) {
        camposConError.push('dni');
    } else if (dni.length !== 8 || !/^\d+$/.test(dni)) {
        camposConError.push('dni');
    }

    const telefono = document.getElementById('telefono').value.trim();
    if (!telefono) {
        camposConError.push('telefono');
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

    const consulta = document.getElementById('consulta').value;
    if (!consulta) {
        camposConError.push('consulta');
    }

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

        ocultarMensajes();
        mostrarErrorCheckbox(false);

        const camposConError = validarFormularioContacto();
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

        const formData = new FormData(formulario);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        delete data.tc;
        delete data.info;

        console.log('Datos a enviar:', data);

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
                mostrarMensajeExito();
                formulario.reset();

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
            mostrarErrorServidor();
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    const todosCampos = document.querySelectorAll('#form-contacto input, #form-contacto select, #form-contacto textarea');
    todosCampos.forEach(campo => {
        campo.addEventListener('input', function () {
            this.classList.remove('error');
            const camposConError = document.querySelectorAll('#form-contacto .error');
            if (camposConError.length === 0) {
                ocultarMensajes();
            }
        });

        campo.addEventListener('change', function () {
            this.classList.remove('error');
            const camposConError = document.querySelectorAll('#form-contacto .error');
            if (camposConError.length === 0) {
                ocultarMensajes();
            }
        });
    });

    const terminosCheckbox = document.getElementById('terminos-checkbox');
    if (terminosCheckbox) {
        terminosCheckbox.addEventListener('change', function () {
            if (this.checked) {
                mostrarErrorCheckbox(false);
            }
        });
    }
});