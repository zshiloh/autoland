const API_URL = "http://localhost:8081/api";

const formReclamo = document.getElementById('form-reclamo');
if (formReclamo) {
    formReclamo.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validar que todos los campos requeridos estén llenos
        const tipo = formReclamo.tipo.value;
        const servicio = formReclamo.servicio.value;
        const motivo = formReclamo.motivo.value;
        const local = formReclamo.local.value;
        const checkbox = formReclamo.tc.checked;

        // Validaciones
        if (!tipo) {
            alert('Por favor, selecciona el tipo de solicitud');
            return;
        }
        if (!servicio) {
            alert('Por favor, selecciona el tipo de servicio');
            return;
        }
        if (!motivo) {
            alert('Por favor, selecciona el motivo de contacto');
            return;
        }
        if (!local) {
            alert('Por favor, selecciona el local');
            return;
        }
        if (!checkbox) {
            alert('Debes aceptar los términos y condiciones');
            return;
        }

        const data = {
            tipo: tipo,
            servicio: servicio,
            motivo: motivo,
            local: local,
            // Puedes agregar más campos si los tienes en el formulario de datos personales
        };

        // Mostrar mensaje de carga
        const submitBtn = formReclamo.querySelector('#boton-de-enviar');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        fetch(API_URL + '/reclamos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Error al enviar reclamo');
                }
            })
            .then(data => {
                alert('Su reclamo ha sido procesado exitosamente. Nos pondremos en contacto con usted pronto.');
                formReclamo.reset();
                window.location.href = '../index.html';
            })
            .catch(error => {
                console.error('Error al enviar reclamo:', error);
                alert('Error al enviar reclamo. Por favor, intenta nuevamente.');
            })
            .finally(() => {
                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
    });
}