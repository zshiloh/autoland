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
        const placa = document.getElementById('placa').value.trim();
        const marca = document.getElementById('marca').value;
        const modelo = document.getElementById('modelo').value;
        const año = document.getElementById('año').value;
        const servicio = document.getElementById('servicio').value;
        const sucursal = document.getElementById('sucursal').value;
        const fecha = document.getElementById('calendario-input').value;
        const horaSeleccionada = document.querySelector('.time-button.active');

        // Validaciones
        if (!placa) {
            alert('Por favor, ingresa la placa del vehículo');
            return;
        }
        if (marca === 'Seleccione marca') {
            alert('Por favor, selecciona una marca');
            return;
        }
        if (modelo === 'Seleccione modelo') {
            alert('Por favor, selecciona un modelo');
            return;
        }
        if (año === 'Seleccione año del modelo') {
            alert('Por favor, selecciona el año');
            return;
        }
        if (servicio === 'Seleccione servicio') {
            alert('Por favor, selecciona un servicio');
            return;
        }
        if (sucursal === 'Seleccione local') {
            alert('Por favor, selecciona una sucursal');
            return;
        }
        if (!fecha) {
            alert('Por favor, selecciona una fecha');
            return;
        }
        if (!horaSeleccionada) {
            alert('Por favor, selecciona una hora');
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
        const numeroDocumento = document.getElementById('numero-documento').value.trim();
        const nombre = document.getElementById('nombre').value.trim();
        const apellidos = document.getElementById('apellidos').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();

        // Validaciones
        if (!numeroDocumento) {
            alert('Por favor, ingresa el número de documento');
            return;
        }
        if (!nombre) {
            alert('Por favor, ingresa tu nombre');
            return;
        }
        if (!apellidos) {
            alert('Por favor, ingresa tus apellidos');
            return;
        }
        if (!email) {
            alert('Por favor, ingresa tu email');
            return;
        }
        if (!telefono) {
            alert('Por favor, ingresa tu teléfono');
            return;
        }

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, ingresa un email válido');
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

        // VALIDACIÓN DEL CHECKBOX - CORREGIDO
        const terminosCheckbox = document.getElementById('terminos-checkbox');
        if (!terminosCheckbox || !terminosCheckbox.checked) {
            alert('Debes aceptar los términos y condiciones para continuar');
            return; // Detiene la ejecución si no está marcado
        }

        const datosAgendar = JSON.parse(localStorage.getItem('datosAgendar') || '{}');
        const datosPersonales = JSON.parse(localStorage.getItem('datosPersonales') || '{}');

        // Verificar que existen los datos
        if (!datosAgendar.fecha || !datosPersonales.nombre) {
            alert('Error: Faltan datos de la cita. Por favor, vuelve a llenar el formulario.');
            window.location.href = './agendar-cita.html';
            return;
        }

        // Estructurar los datos según tu documentación API
        const cita = {
            fecha: datosAgendar.fecha,
            horario: datosAgendar.hora, // Tu API espera "horario" no "hora"
            servicio: datosAgendar.servicio,
            estado: "pendiente",
            concesionario: datosAgendar.sucursal // Tu API espera "concesionario" no "sucursal"
        };

        // Mostrar loading
        const originalText = btnConfirmar.textContent;
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

                // Mostrar error específico
                let errorMessage = 'Error al agendar cita';
                if (error.message.includes('401')) {
                    errorMessage = 'Debes iniciar sesión para agendar una cita';
                } else if (error.message.includes('400')) {
                    errorMessage = 'Datos inválidos. Verifica la información ingresada';
                } else {
                    errorMessage = 'Error al agendar cita: ' + error.message;
                }

                alert(errorMessage);

                // Restaurar botón
                btnConfirmar.disabled = false;
                btnConfirmar.textContent = originalText;
            });
    });
}

// Obtener información del usuario usando /api/auth/me
const citasContainer = document.getElementById('citas-lista');
if (citasContainer) {
    const token = localStorage.getItem('token');

    if (!token) {
        citasContainer.innerHTML = `
            <div class="alert alert-warning">
                <h4>Inicia sesión para ver tus citas</h4>
                <p>Para acceder a tu historial de citas, debes iniciar sesión.</p>
                <a href="./login.html" class="btn btn-primary">Iniciar sesión</a>
            </div>
        `;
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
                <p>La funcionalidad de mostrar el historial de citas está en desarrollo.</p>
                <p>Una vez que tengas tu API completa, aquí se mostrarán todas tus citas agendadas.</p>
                <a href="./agendar-cita.html" class="btn btn-warning">Agendar nueva cita</a>
            </div>
        `;
        })
        .catch(error => {
            console.error('Error al obtener usuario:', error);
            citasContainer.innerHTML = `
            <div class="alert alert-danger">
                <h4>Error al cargar tus citas</h4>
                <p>Hubo un problema al acceder a tu información.</p>
                <a href="./login.html" class="btn btn-primary">Iniciar sesión nuevamente</a>
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

        // Validar checkbox de términos
        const terminosCheckbox = document.getElementById('terminos-checkbox');
        if (!terminosCheckbox || !terminosCheckbox.checked) {
            alert('Debes aceptar los términos y condiciones');
            return;
        }

        const datosActualizados = {
            fecha: document.getElementById('nuevo-fecha').value,
            horario: document.getElementById('nuevo-hora').value,
            servicio: document.getElementById('nuevo-servicio').value,
            estado: "Agregar revisión de frenos", // Ejemplo según tu documentación
            concesionario: document.getElementById('nuevo-sucursal').value
        };

        // Validar que se ingresaron datos
        if (!datosActualizados.fecha || !datosActualizados.horario || !datosActualizados.servicio || !datosActualizados.concesionario) {
            alert('Por favor, completa todos los campos para rectificar la cita');
            return;
        }

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