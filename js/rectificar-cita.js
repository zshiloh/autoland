// rectificar-cita.js - Funcionalidad completa para rectificar citas CON VALIDACIÓN DE AUTENTICACIÓN

document.addEventListener("DOMContentLoaded", function () {
    const buscarBtn = document.getElementById("buscar-cita-btn");
    const editarSection = document.getElementById("editar-cita-section");
    const confirmarBtn = document.getElementById("btn-confirmar");

    let citaEncontrada = null; // Almacenar datos de la cita encontrada

    // Función para verificar autenticación y mostrar mensaje
    function verificarYMostrarMensajeAuth() {
        const token = localStorage.getItem('token');
        if (!token) {
            // Limpiar alertas anteriores
            document.querySelectorAll('.alert-warning').forEach(alert => {
                if (alert.innerHTML.includes('Inicia sesión')) {
                    alert.remove();
                }
            });

            // Mostrar mensaje de que debe iniciar sesión
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-warning';
            alertDiv.innerHTML = `
                <h4>Inicia sesión para buscar tu cita</h4>
                <p>Para acceder a la funcionalidad de rectificar citas, debes iniciar sesión primero.</p>
                <a href="./login.html" class="btn btn-primary">Iniciar sesión</a>
            `;

            // Insertar el mensaje
            const formSection = document.querySelector('.col-lg-9') || document.querySelector('section');
            const firstElement = formSection.querySelector('.alert-info') || formSection.querySelector('h3') || formSection.firstChild;
            formSection.insertBefore(alertDiv, firstElement);

            return false; // No está autenticado
        }
        return true; // Está autenticado
    }

    // Función para mostrar/ocultar error del checkbox
    function mostrarErrorCheckbox(mostrar) {
        const terminosSection = document.getElementById('terminos-section');
        const errorMsg = document.getElementById('checkbox-error');

        if (mostrar) {
            // Solo agregar clase - CSS maneja todo el estilo
            terminosSection.classList.add('error');
            if (errorMsg) {
                errorMsg.style.display = 'block';
                errorMsg.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        } else {
            // Solo quitar clase
            terminosSection.classList.remove('error');
            if (errorMsg) {
                errorMsg.style.display = 'none';
            }
        }
    }

    // Buscar cita
    if (buscarBtn) {
        buscarBtn.addEventListener("click", function (e) {
            e.preventDefault();

            // VERIFICAR AUTENTICACIÓN ANTES DE BUSCAR
            if (!verificarYMostrarMensajeAuth()) {
                return;
            }

            // Obtener datos del formulario de búsqueda
            const placa = document.getElementById("placa").value.trim();
            const dni = document.getElementById("dni").value.trim();
            const fechaCita = document.getElementById("fecha-cita").value;
            const sucursal = document.getElementById("sucursal").value;

            // Validar campos requeridos
            if (!placa || !dni) {
                alert("Por favor, ingresa la placa y el DNI para buscar la cita.");
                return;
            }

            const token = localStorage.getItem('token');

            // Mostrar loading
            const originalText = buscarBtn.textContent;
            buscarBtn.disabled = true;
            buscarBtn.textContent = "Buscando...";

            const apiUrl = window.API_URL || "http://localhost:8081/api";

            // Estructurar datos para búsqueda
            const datosBusqueda = {
                placa: placa,
                dni: dni,
                fecha: fechaCita || null,
                sucursal: sucursal || null
            };

            console.log("=== BUSCANDO CITA ===");
            console.log("Datos de búsqueda:", datosBusqueda);
            console.log("Token disponible:", token ? "SÍ" : "NO");

            // Llamar al endpoint de búsqueda CON TOKEN - MODIFICADO
            fetch(apiUrl + '/citas/buscar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`  // ← LÍNEA AGREGADA
                },
                body: JSON.stringify(datosBusqueda)
            })
                .then(res => {
                    console.log("Status de respuesta:", res.status);
                    if (res.ok) {
                        return res.json();
                    } else {
                        return res.text().then(text => {
                            throw new Error(text || 'Cita no encontrada');
                        });
                    }
                })
                .then(data => {
                    console.log("Cita encontrada:", data);
                    citaEncontrada = data;

                    // Mostrar la sección de edición
                    editarSection.style.display = "block";
                    buscarBtn.textContent = "Cita encontrada";

                    // Pre-llenar los campos de edición con los datos actuales
                    document.getElementById("nuevo-fecha").value = data.fecha;
                    document.getElementById("nuevo-hora").value = data.horario;
                    document.getElementById("nuevo-servicio").value = data.servicio;
                    document.getElementById("nuevo-sucursal").value = data.sucursal;

                    // Limpiar alertas anteriores
                    document.querySelectorAll('.alert').forEach(alert => alert.remove());

                    // Mostrar mensaje de éxito
                    const successDiv = document.createElement('div');
                    successDiv.className = 'alert alert-success';
                    successDiv.innerHTML = '<strong>¡Cita encontrada!</strong> Puedes modificar los datos abajo.';
                    const formSection = document.querySelector('.col-lg-9');
                    formSection.insertBefore(successDiv, formSection.querySelector('h3'));

                    // Scroll hacia la sección de edición
                    editarSection.scrollIntoView({ behavior: 'smooth' });
                })
                .catch(error => {
                    console.error('Error al buscar cita:', error);

                    // Limpiar alertas anteriores
                    document.querySelectorAll('.alert').forEach(alert => alert.remove());

                    // Mostrar error
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'alert alert-danger';
                    errorDiv.innerHTML = '<strong>Error:</strong> ' + error.message;
                    const formSection = document.querySelector('.col-lg-9');
                    formSection.insertBefore(errorDiv, formSection.querySelector('h3'));

                    // Restaurar botón
                    buscarBtn.disabled = false;
                    buscarBtn.textContent = originalText;
                });
        });
    }

    // Confirmar cambios
    if (confirmarBtn) {
        confirmarBtn.addEventListener("click", function (e) {
            e.preventDefault();

            if (!citaEncontrada) {
                alert("Primero debes buscar una cita antes de confirmar cambios.");
                return;
            }

            // Verificar que el usuario esté logueado
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Debes iniciar sesión para modificar una cita.");
                window.location.href = './login.html';
                return;
            }

            // Validar checkbox de términos CON VALIDACIÓN VISUAL
            const terminosCheckbox = document.getElementById("terminos-checkbox");
            if (!terminosCheckbox || !terminosCheckbox.checked) {
                mostrarErrorCheckbox(true);
                return;
            }

            // Ocultar error si el checkbox está marcado
            mostrarErrorCheckbox(false);

            // Obtener nuevos datos del formulario
            const nuevaFecha = document.getElementById("nuevo-fecha").value;
            const nuevaHora = document.getElementById("nuevo-hora").value;
            const nuevoServicio = document.getElementById("nuevo-servicio").value;
            const nuevaSucursal = document.getElementById("nuevo-sucursal").value;

            // Validar campos requeridos
            if (!nuevaFecha || !nuevaHora || !nuevoServicio || !nuevaSucursal) {
                alert("Por favor, completa todos los campos para actualizar la cita.");
                return;
            }

            // Estructurar datos para actualización
            const datosActualizacion = {
                placa: citaEncontrada.placa,
                marca: citaEncontrada.marca,
                modelo: citaEncontrada.modelo,
                anio: citaEncontrada.anio,
                servicio: nuevoServicio,
                sucursal: nuevaSucursal,
                fecha: nuevaFecha,
                horario: nuevaHora,
                observaciones: citaEncontrada.observaciones || ""
            };

            // Mostrar loading
            const originalText = confirmarBtn.textContent;
            confirmarBtn.disabled = true;
            confirmarBtn.textContent = "Actualizando...";

            const apiUrl = window.API_URL || "http://localhost:8081/api";

            console.log("=== ACTUALIZANDO CITA ===");
            console.log("ID Cita:", citaEncontrada.id_cita);
            console.log("Datos de actualización:", datosActualizacion);

            // Llamar al endpoint de actualización CON TOKEN - YA ESTABA BIEN
            fetch(apiUrl + `/citas/${citaEncontrada.id_cita}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(datosActualizacion)
            })
                .then(res => {
                    console.log("Status de actualización:", res.status);
                    if (res.ok) {
                        return res.json();
                    } else {
                        return res.text().then(text => {
                            throw new Error(text || 'Error al actualizar la cita');
                        });
                    }
                })
                .then(data => {
                    console.log("Cita actualizada exitosamente:", data);

                    // Limpiar alertas anteriores
                    document.querySelectorAll('.alert').forEach(alert => alert.remove());

                    // Mostrar mensaje de éxito
                    const successDiv = document.createElement('div');
                    successDiv.className = 'alert alert-success';
                    successDiv.innerHTML = '<strong>¡Éxito!</strong> Tu cita ha sido actualizada correctamente. Serás redirigido al inicio...';

                    const formSection = document.querySelector('.col-lg-9');
                    const h3Element = formSection.querySelector('h3');
                    if (formSection && h3Element) {
                        formSection.insertBefore(successDiv, h3Element);
                    } else {
                        // Si no encuentra el h3, agregar al inicio
                        formSection.insertAdjacentElement('afterbegin', successDiv);
                    }

                    // Scroll hacia arriba para ver el mensaje
                    successDiv.scrollIntoView({ behavior: 'smooth' });

                    // Redirigir después de 3 segundos
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 3000);
                })
                .catch(error => {
                    console.error('Error al actualizar cita:', error);

                    // Limpiar alertas anteriores
                    document.querySelectorAll('.alert-danger').forEach(alert => alert.remove());

                    // Mostrar error
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'alert alert-danger';
                    errorDiv.innerHTML = '<strong>Error:</strong> ' + error.message;

                    const formSection = document.querySelector('.col-lg-9');
                    const h3Element = formSection.querySelector('h3');
                    if (formSection && h3Element) {
                        formSection.insertBefore(errorDiv, h3Element);
                    } else {
                        formSection.insertAdjacentElement('afterbegin', errorDiv);
                    }
                    // Restaurar botón
                    confirmarBtn.disabled = false;
                    confirmarBtn.textContent = originalText;

                    // Scroll hacia arriba para ver el error
                    errorDiv.scrollIntoView({ behavior: 'smooth' });
                });
        });
    }

    // Limpiar error cuando el usuario marque el checkbox
    const terminosCheckboxListener = document.getElementById('terminos-checkbox');
    if (terminosCheckboxListener) {
        terminosCheckboxListener.addEventListener('change', function () {
            if (this.checked) {
                mostrarErrorCheckbox(false);
            }
        });
    }
});