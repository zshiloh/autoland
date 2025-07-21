// rectificar-cita.js - Funcionalidad refactorizada sin HTML hardcodeado

document.addEventListener("DOMContentLoaded", function () {
    const buscarBtn = document.getElementById("buscar-cita-btn");
    const editarSection = document.getElementById("editar-cita-section");
    const confirmarBtn = document.getElementById("btn-confirmar");

    // Referencias a elementos de mensajes pre-existentes en HTML
    const authRequiredMessage = document.getElementById("auth-required-message");
    const citaEncontradaMessage = document.getElementById("cita-encontrada-message");
    const errorGeneralMessage = document.getElementById("error-general-message");
    const errorText = document.getElementById("error-text");
    const actualizacionExitosaMessage = document.getElementById("actualizacion-exitosa-message");

    let citaEncontrada = null; // Almacenar datos de la cita encontrada

    // Función para ocultar todos los mensajes
    function ocultarTodosLosMensajes() {
        authRequiredMessage.style.display = 'none';
        citaEncontradaMessage.style.display = 'none';
        errorGeneralMessage.style.display = 'none';
        actualizacionExitosaMessage.style.display = 'none';
    }

    // Función para mostrar mensaje de autenticación requerida
    function mostrarMensajeAuth() {
        ocultarTodosLosMensajes();
        authRequiredMessage.style.display = 'block';
        authRequiredMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Función para mostrar mensaje de éxito al encontrar cita
    function mostrarCitaEncontrada() {
        ocultarTodosLosMensajes();
        citaEncontradaMessage.style.display = 'block';
        citaEncontradaMessage.scrollIntoView({ behavior: 'smooth' });
    }

    // Función para mostrar mensaje de error general
    function mostrarError(mensaje) {
        ocultarTodosLosMensajes();
        errorText.textContent = mensaje;
        errorGeneralMessage.style.display = 'block';
        errorGeneralMessage.scrollIntoView({ behavior: 'smooth' });
    }

    // Función para mostrar mensaje de actualización exitosa
    function mostrarActualizacionExitosa() {
        ocultarTodosLosMensajes();
        actualizacionExitosaMessage.style.display = 'block';
        actualizacionExitosaMessage.scrollIntoView({ behavior: 'smooth' });
    }

    // Función para verificar autenticación
    function verificarAutenticacion() {
        const token = localStorage.getItem('token');
        if (!token) {
            mostrarMensajeAuth();
            return false;
        }
        return true;
    }

    // Función para mostrar/ocultar error del checkbox
    function mostrarErrorCheckbox(mostrar) {
        const terminosSection = document.getElementById('terminos-section');
        const errorMsg = document.getElementById('checkbox-error');

        if (mostrar) {
            terminosSection.classList.add('error');
            if (errorMsg) {
                errorMsg.style.display = 'block';
                errorMsg.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        } else {
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
            if (!verificarAutenticacion()) {
                return;
            }

            // Obtener datos del formulario de búsqueda
            const placa = document.getElementById("placa").value.trim();
            const dni = document.getElementById("dni").value.trim();
            const fechaCita = document.getElementById("fecha-cita").value;
            const sucursal = document.getElementById("sucursal").value;

            // Validar campos requeridos
            if (!placa || !dni) {
                mostrarError("Por favor, ingresa la placa y el DNI para buscar la cita.");
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

            // Llamar al endpoint de búsqueda CON TOKEN
            fetch(apiUrl + '/citas/buscar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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

                    // Mostrar mensaje de éxito
                    mostrarCitaEncontrada();

                    // Scroll hacia la sección de edición
                    editarSection.scrollIntoView({ behavior: 'smooth' });
                })
                .catch(error => {
                    console.error('Error al buscar cita:', error);
                    mostrarError(error.message);

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
                mostrarError("Primero debes buscar una cita antes de confirmar cambios.");
                return;
            }

            // Verificar que el usuario esté logueado
            const token = localStorage.getItem('token');
            if (!token) {
                mostrarError("Debes iniciar sesión para modificar una cita.");
                setTimeout(() => {
                    window.location.href = './login.html';
                }, 2000);
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
                mostrarError("Por favor, completa todos los campos para actualizar la cita.");
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

            // Llamar al endpoint de actualización CON TOKEN
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

                    // Mostrar mensaje de éxito
                    mostrarActualizacionExitosa();

                    // Redirigir después de 3 segundos
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 3000);
                })
                .catch(error => {
                    console.error('Error al actualizar cita:', error);
                    mostrarError(error.message);

                    // Restaurar botón
                    confirmarBtn.disabled = false;
                    confirmarBtn.textContent = originalText;
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