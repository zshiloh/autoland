const API_URL = "http://localhost:8081/api";

// Función para obtener headers con token de autorización
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

// Guardar datos de agendar-cita
const btnSiguienteA = document.getElementById('btn-siguiente-a');
if (btnSiguienteA) {
    btnSiguienteA.addEventListener('click', function (e) {
        e.preventDefault();

        // Validar que todos los campos estén llenos
        const placa = document.getElementById('placa').value;
        const marca = document.getElementById('marca').value;
        const modelo = document.getElementById('modelo').value;
        const año = document.getElementById('año').value;
        const servicio = document.getElementById('servicio').value;
        const sucursal = document.getElementById('sucursal').value;
        const fecha = document.getElementById('calendario-input').value;
        const horaSeleccionada = document.querySelector('.time-button.active');

        if (!placa || !marca || !modelo || !año || !servicio || !sucursal || !fecha || !horaSeleccionada) {
            alert('Por favor, completa todos los campos y selecciona una hora');
            return;
        }

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

        localStorage.setItem('datosAgendar', JSON.stringify(datosAgendar));
        window.location.href = './ingresar-datos.html';
    });
}

// Guardar datos personales
const btnSiguiente = document.getElementById('btn-siguiente');
if (btnSiguiente) {
    btnSiguiente.addEventListener('click', function (e) {
        e.preventDefault();

        // Validar campos
        const tipoDocumento = document.getElementById('tipo-documento').value;
        const numeroDocumento = document.getElementById('numero-documento').value;
        const nombre = document.getElementById('nombre').value;
        const apellidos = document.getElementById('apellidos').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;

        if (!tipoDocumento || !numeroDocumento || !nombre || !apellidos || !email || !telefono) {
            alert('Por favor, completa todos los campos');
            return;
        }

        const datosPersonales = {
            tipoDocumento: tipoDocumento,
            numeroDocumento: numeroDocumento,
            nombre: nombre,
            apellidos: apellidos,
            email: email,
            telefono: telefono
        };

        localStorage.setItem('datosPersonales', JSON.stringify(datosPersonales));
        window.location.href = './confirmar-cita.html';
    });
}

// Confirmar cita y enviar al backend
const btnConfirmar = document.getElementById('btn-confirmar');
if (btnConfirmar) {
    btnConfirmar.addEventListener('click', function (e) {
        e.preventDefault();

        // Verificar que se aceptaron los términos
        const terminosCheckbox = document.getElementById('terminos-checkbox');
        if (terminosCheckbox && !terminosCheckbox.checked) {
            alert('Debes aceptar los términos y condiciones');
            return;
        }

        const datosAgendar = JSON.parse(localStorage.getItem('datosAgendar') || '{}');
        const datosPersonales = JSON.parse(localStorage.getItem('datosPersonales') || '{}');

        // Estructurar los datos según tu documentación API
        const cita = {
            fecha: datosAgendar.fecha,
            horario: datosAgendar.hora, // Tu API espera "horario" no "hora"
            servicio: datosAgendar.servicio,
            estado: "pendiente",
            concesionario: datosAgendar.sucursal // Tu API espera "concesionario" no "sucursal"
        };

        // Mostrar loading
        btnConfirmar.disabled = true;
        btnConfirmar.textContent = 'Enviando...';

        fetch(API_URL + '/citas', {
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

                alert('¡Tu cita fue agendada con éxito!');
                window.location.href = '../index.html';
            })
            .catch(error => {
                console.error('Error al agendar cita:', error);
                alert('Error al agendar cita: ' + error.message + '\nVerifica que hayas iniciado sesión.');

                // Restaurar botón
                btnConfirmar.disabled = false;
                btnConfirmar.textContent = 'Confirmar cita';
            });
    });
}

// Obtener información del usuario usando /api/auth/me
const citasContainer = document.getElementById('citas-lista');
if (citasContainer) {
    const token = localStorage.getItem('token');

    if (!token) {
        citasContainer.innerHTML = '<div class="alert alert-warning">Debes iniciar sesión para ver tus citas. <a href="./login.html">Iniciar sesión</a></div>';
        return;
    }

    fetch(API_URL + '/auth/me', {
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
            // Aquí podrías obtener las citas del usuario si tienes un endpoint
            // Por ahora mostramos mensaje de desarrollo
            citasContainer.innerHTML = `
            <div class="alert alert-info">
                <h4>¡Hola ${usuario.nombre || 'Usuario'}!</h4>
                <p>La funcionalidad de mostrar citas está en desarrollo.</p>
                <p>Una vez que tengas tu API lista, aquí se mostrarán todas tus citas.</p>
            </div>
        `;
        })
        .catch(error => {
            console.error('Error al obtener usuario:', error);
            citasContainer.innerHTML = `
            <div class="alert alert-danger">
                Error al cargar tus citas. 
                <a href="./login.html">Iniciar sesión nuevamente</a>
            </div>
        `;
        });
}

// Rectificar cita
const rectificarForm = document.getElementById('rectificar-cita-form');
if (rectificarForm) {
    const params = new URLSearchParams(window.location.search);
    const idCita = params.get('id');

    if (idCita) {
        // Obtener datos de la cita específica
        fetch(API_URL + '/citas/' + idCita, {
            headers: getAuthHeaders()
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Error al obtener cita');
                }
            })
            .then(cita => {
                // Rellenar campos con datos de la cita
                if (document.getElementById('fecha-cita')) {
                    document.getElementById('fecha-cita').value = cita.fecha;
                }
                if (document.getElementById('sucursal')) {
                    document.getElementById('sucursal').value = cita.concesionario;
                }
                // Mostrar sección de edición
                const editarSection = document.getElementById('editar-cita-section');
                if (editarSection) {
                    editarSection.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error al cargar cita:', error);
                alert('Error al cargar los datos de la cita: ' + error.message);
            });
    }

    rectificarForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!idCita) {
            alert('ID de cita no encontrado');
            return;
        }

        const datosActualizados = {
            fecha: document.getElementById('nuevo-fecha').value,
            horario: document.getElementById('nuevo-hora').value,
            servicio: document.getElementById('nuevo-servicio').value,
            estado: "Agregar revisión de frenos", // Ejemplo según tu documentación
            concesionario: document.getElementById('nuevo-sucursal').value
        };

        fetch(API_URL + '/citas/' + idCita, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(datosActualizados)
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Error al actualizar cita');
                }
            })
            .then(data => {
                alert('¡Cita rectificada con éxito!');
                window.location.href = '../index.html';
            })
            .catch(error => {
                console.error('Error al rectificar cita:', error);
                alert('Error al rectificar cita: ' + error.message);
            });
    });
}