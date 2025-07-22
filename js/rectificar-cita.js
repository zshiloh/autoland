document.addEventListener("DOMContentLoaded", function () {
    const editarSection = document.getElementById("editar-cita-section");
    const confirmarBtn = document.getElementById("btn-confirmar");

    const authRequiredMessage = document.getElementById("auth-required-message");
    const errorGeneralMessage = document.getElementById("error-general-message");
    const errorText = document.getElementById("error-text");
    const actualizacionExitosaMessage = document.getElementById("actualizacion-exitosa-message");

    let citaEncontrada = null;

    const datosGuardados = localStorage.getItem('citaParaModificar');
    if (datosGuardados) {
        try {
            const datosParseados = JSON.parse(datosGuardados);

            if (datosParseados.desdeMisCitas && datosParseados.citaEncontrada) {
                console.log('🚀 Cargando cita desde Mis Citas:', datosParseados.citaEncontrada);

                citaEncontrada = datosParseados.citaEncontrada;

                mostrarSeccionEdicion();

                localStorage.removeItem('citaParaModificar');
            } else {
                mostrarMensajeAuth();
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
            mostrarMensajeAuth();
        }
    } else {
        mostrarMensajeAuth();
    }

    function mostrarSeccionEdicion() {
        if (!verificarAutenticacion()) {
            return;
        }

        editarSection.style.display = "block";

        document.getElementById("nuevo-fecha").value = citaEncontrada.fecha || '';
        document.getElementById("nuevo-hora").value = citaEncontrada.horario || '';
        document.getElementById("nuevo-servicio").value = citaEncontrada.servicio || '';
        document.getElementById("nuevo-sucursal").value = citaEncontrada.sucursal || '';

        const tituloSeccion = document.querySelector('#progreso-section h1');
        if (tituloSeccion) {
            tituloSeccion.textContent = 'Modificar Cita';
        }

        editarSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function ocultarTodosLosMensajes() {
        if (authRequiredMessage) authRequiredMessage.style.display = 'none';
        if (errorGeneralMessage) errorGeneralMessage.style.display = 'none';
        if (actualizacionExitosaMessage) actualizacionExitosaMessage.style.display = 'none';
    }

    function mostrarMensajeAuth() {
        ocultarTodosLosMensajes();
        if (authRequiredMessage) {
            authRequiredMessage.innerHTML = `
                <strong>Acceso requerido</strong><br>
                Esta página solo es accesible desde "Mis Citas". 
                <a href="./mis-citas.html">Ir a Mis Citas</a>
            `;
            authRequiredMessage.style.display = 'block';
            authRequiredMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function mostrarError(mensaje) {
        ocultarTodosLosMensajes();
        if (errorText) errorText.textContent = mensaje;
        if (errorGeneralMessage) {
            errorGeneralMessage.style.display = 'block';
            errorGeneralMessage.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function mostrarActualizacionExitosa() {
        ocultarTodosLosMensajes();
        if (actualizacionExitosaMessage) {
            actualizacionExitosaMessage.style.display = 'block';
            actualizacionExitosaMessage.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function verificarAutenticacion() {
        const token = localStorage.getItem('token');
        if (!token) {
            mostrarMensajeAuth();
            return false;
        }
        return true;
    }

    function mostrarErrorCheckbox(mostrar) {
        const terminosSection = document.getElementById('terminos-section');
        const errorMsg = document.getElementById('checkbox-error');

        if (mostrar) {
            if (terminosSection) terminosSection.classList.add('error');
            if (errorMsg) {
                errorMsg.style.display = 'block';
                errorMsg.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        } else {
            if (terminosSection) terminosSection.classList.remove('error');
            if (errorMsg) errorMsg.style.display = 'none';
        }
    }

    if (confirmarBtn) {
        confirmarBtn.addEventListener("click", function (e) {
            e.preventDefault();

            if (!citaEncontrada) {
                mostrarError("No hay datos de cita disponibles para modificar.");
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                mostrarError("Debes iniciar sesión para modificar una cita.");
                setTimeout(() => {
                    window.location.href = './login.html';
                }, 2000);
                return;
            }

            const terminosCheckbox = document.getElementById("terminos-checkbox");
            if (!terminosCheckbox || !terminosCheckbox.checked) {
                mostrarErrorCheckbox(true);
                return;
            }
            mostrarErrorCheckbox(false);

            const nuevaFecha = document.getElementById("nuevo-fecha").value;
            const nuevaHora = document.getElementById("nuevo-hora").value;
            const nuevoServicio = document.getElementById("nuevo-servicio").value;
            const nuevaSucursal = document.getElementById("nuevo-sucursal").value;

            if (!nuevaFecha || !nuevaHora || !nuevoServicio || !nuevaSucursal) {
                mostrarError("Por favor, completa todos los campos para actualizar la cita.");
                return;
            }

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

            const originalText = confirmarBtn.textContent;
            confirmarBtn.disabled = true;
            confirmarBtn.textContent = "Actualizando...";

            const apiUrl = window.API_URL || "http://localhost:8081/api";

            console.log("=== ACTUALIZANDO CITA ===");
            console.log("ID Cita:", citaEncontrada.id_cita);
            console.log("Datos de actualización:", datosActualizacion);

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

                    mostrarActualizacionExitosa();

                    setTimeout(() => {
                        window.location.href = './mis-citas.html';
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

    const terminosCheckboxListener = document.getElementById('terminos-checkbox');
    if (terminosCheckboxListener) {
        terminosCheckboxListener.addEventListener('change', function () {
            if (this.checked) {
                mostrarErrorCheckbox(false);
            }
        });
    }
});