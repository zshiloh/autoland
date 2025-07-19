const API_URL = "http://localhost:8081/api";

// Guardar datos de agendar-cita
const btnSiguienteA = document.getElementById('btn-siguiente-a');
if (btnSiguienteA) {
    btnSiguienteA.addEventListener('click', function() {
        const datosAgendar = {
            placa: document.getElementById('placa').value,
            marca: document.getElementById('marca').value,
            modelo: document.getElementById('modelo').value,
            año: document.getElementById('año').value,
            servicio: document.getElementById('servicio').value,
            sucursal: document.getElementById('sucursal').value,
            fecha: document.getElementById('calendario-input').value,
            hora: document.querySelector('.time-button.active')?.textContent || ''
        };
        localStorage.setItem('datosAgendar', JSON.stringify(datosAgendar));
    });
}

// Guardar datos personales
const btnSiguiente = document.getElementById('btn-siguiente');
if (btnSiguiente) {
    btnSiguiente.addEventListener('click', function() {
        const datosPersonales = {
            tipoDocumento: document.getElementById('tipo-documento').value,
            numeroDocumento: document.getElementById('numero-documento').value,
            nombre: document.getElementById('nombre').value,
            apellidos: document.getElementById('apellidos').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value
        };
        localStorage.setItem('datosPersonales', JSON.stringify(datosPersonales));
    });
}

// Confirmar cita y enviar al backend
const btnConfirmar = document.getElementById('btn-confirmar');
if (btnConfirmar) {
    btnConfirmar.addEventListener('click', function() {
        const datosAgendar = JSON.parse(localStorage.getItem('datosAgendar') || '{}');
        const datosPersonales = JSON.parse(localStorage.getItem('datosPersonales') || '{}');
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        const cita = {
            id_usuario: usuario.id_usuario || null,
            placa: datosAgendar.placa,
            marca: datosAgendar.marca,
            modelo: datosAgendar.modelo,
            año: datosAgendar.año,
            servicio: datosAgendar.servicio,
            sucursal: datosAgendar.sucursal,
            fecha: datosAgendar.fecha,
            hora: datosAgendar.hora,
            nombre: datosPersonales.nombre,
            apellidos: datosPersonales.apellidos,
            email: datosPersonales.email,
            telefono: datosPersonales.telefono
        };
        fetch(API_URL + '/citas', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(cita)
        })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(() => {
            localStorage.setItem('mensajeCita', '¡Tu cita fue agendada con éxito!');
            window.location.href = './index.html';
        })
        .catch(() => alert('Error al agendar cita'));
    });
}

// Listar citas del usuario en mis-citas.html
const citasContainer = document.getElementById('citas-lista');
if (citasContainer) {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    fetch(API_URL + '/citas/usuario/' + usuario.id_usuario)
        .then(res => res.json())
        .then(citas => {
            if (citas.length === 0) {
                citasContainer.innerHTML = '<p>No tienes citas registradas.</p>';
            } else {
                citasContainer.innerHTML = citas.map(cita => `
                    <div class="cita-card">
                        <strong>Fecha:</strong> ${cita.fecha} <strong>Hora:</strong> ${cita.hora}<br>
                        <strong>Placa:</strong> ${cita.placa} <strong>Servicio:</strong> ${cita.servicio}<br>
                        <strong>Sucursal:</strong> ${cita.sucursal}
                        <button class="btn btn-sm btn-warning mt-2" onclick="window.location.href='./html/rectificar-cita.html?id=${cita.id_cita}'">Rectificar</button>
                    </div>
                `).join('');
            }
        });
}

// ...código anterior...

// Rectificar cita
const rectificarForm = document.getElementById('rectificar-cita-form');
if (rectificarForm) {
    const params = new URLSearchParams(window.location.search);
    const idCita = params.get('id');
    if (idCita) {
        fetch(API_URL + '/citas/' + idCita)
            .then(res => res.json())
            .then(cita => {
                // Rellena los campos con los datos de la cita
                document.getElementById('placa').value = cita.placa;
                document.getElementById('dni').value = cita.dni || '';
                document.getElementById('fecha-cita').value = cita.fecha;
                document.getElementById('sucursal').value = cita.sucursal;
                // Muestra sección de edición
                document.getElementById('editar-cita-section').style.display = 'block';
            });
    }
    rectificarForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!idCita) return;
        const nuevaCita = {
            fecha: document.getElementById('nuevo-fecha').value,
            hora: document.getElementById('nuevo-hora').value,
            servicio: document.getElementById('nuevo-servicio').value,
            sucursal: document.getElementById('nuevo-sucursal').value
        };
        fetch(API_URL + '/citas/' + idCita, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(nuevaCita)
        })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(() => {
            localStorage.setItem('mensajeCita', '¡Cita rectificada con éxito!');
            window.location.href = '../index.html';
        })
        .catch(() => alert('Error al rectificar cita'));
    });
}