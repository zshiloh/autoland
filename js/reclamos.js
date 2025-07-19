const API_URL = "http://localhost:8081/api";
const formReclamo = document.getElementById('form-reclamo');
if (formReclamo) {
    formReclamo.addEventListener('submit', function(e) {
        e.preventDefault();
        const data = {
            tipo: formReclamo.tipo.value,
            servicio: formReclamo.servicio.value,
            motivo: formReclamo.motivo.value,
            local: formReclamo.local.value,
            // Puedes agregar más campos si los tienes en el formulario de datos personales
        };
        fetch(API_URL + '/reclamos', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(() => {
            localStorage.setItem('mensajeReclamo', 'Su reclamo ha sido procesado');
            window.location.href = '../index.html';
        })
        .catch(() => alert('Error al enviar reclamo'));
    });
}