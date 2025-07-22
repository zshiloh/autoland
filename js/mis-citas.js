window.API_URL = window.API_URL || 'http://localhost:8081/api';

const elementos = {
    loading: document.getElementById('loading-container'),
    loginRequired: document.getElementById('login-required-message'),
    tokenInvalid: document.getElementById('token-invalid-message'),
    error: document.getElementById('error-message'),
    errorText: document.getElementById('error-text'),
    noCitas: document.getElementById('no-citas-message'),
    citasHeader: document.getElementById('citas-header'),
    citasContainer: document.getElementById('citas-container'),
    nuevaCitaFooter: document.getElementById('nueva-cita-footer'),
    usuarioNombreSinCitas: document.getElementById('usuario-nombre-sin-citas'),
    usuarioNombreConCitas: document.getElementById('usuario-nombre-con-citas'),
    contadorCitas: document.getElementById('contador-citas'),
    citaTemplate: document.getElementById('cita-template')
};

const confirmacionElementos = {
    container: document.getElementById('confirmacion-cancelar'),
    placa: document.getElementById('confirmacion-placa'),
    btnConfirmar: document.getElementById('confirmar-cancelacion'),
    btnCancelar: document.getElementById('cancelar-cancelacion'),
    btnTexto: document.getElementById('btn-confirmar-text')
};

function ocultarTodosLosContenedores() {
    Object.values(elementos).forEach(elemento => {
        if (elemento && elemento.style) {
            elemento.style.display = 'none';
        }
    });
}

function mostrarLoading() {
    console.log('Mostrando loading...');
    ocultarTodosLosContenedores();
    if (elementos.loading) {
        elementos.loading.style.display = 'block';
    }
}

function mostrarLoginRequerido() {
    console.log('Mostrando login requerido...');
    ocultarTodosLosContenedores();
    if (elementos.loginRequired) {
        elementos.loginRequired.style.display = 'block';
    }
}

function mostrarTokenInvalido() {
    console.log('Mostrando token inválido...');
    ocultarTodosLosContenedores();
    if (elementos.tokenInvalid) {
        elementos.tokenInvalid.style.display = 'block';
    }
}

function mostrarError(mensaje) {
    console.log('Mostrando error:', mensaje);
    ocultarTodosLosContenedores();
    if (elementos.errorText) {
        elementos.errorText.textContent = mensaje;
    }
    if (elementos.error) {
        elementos.error.style.display = 'block';
    }
}

function mostrarSinCitas(nombreUsuario) {
    console.log('Ejecutando mostrarSinCitas con nombre:', nombreUsuario);
    ocultarTodosLosContenedores();

    if (elementos.usuarioNombreSinCitas) {
        elementos.usuarioNombreSinCitas.textContent = nombreUsuario || 'Usuario';
    }

    if (elementos.noCitas) {
        elementos.noCitas.style.display = 'block';
    }
}

function mostrarConCitas(citas, nombreUsuario) {
    console.log('Ejecutando mostrarConCitas con nombre:', nombreUsuario);
    console.log('Número de citas:', citas.length);

    ocultarTodosLosContenedores();

    console.log('Elemento usuarioNombreConCitas:', elementos.usuarioNombreConCitas);
    console.log('¿Existe el elemento?', elementos.usuarioNombreConCitas !== null);

    if (elementos.usuarioNombreConCitas) {
        elementos.usuarioNombreConCitas.textContent = nombreUsuario || 'Usuario';

        elementos.usuarioNombreConCitas.style.display = 'inline';

        console.log('✅ Nombre asignado y mostrado:', elementos.usuarioNombreConCitas.textContent);
    }

    if (elementos.usuarioNombreConCitas) {
        elementos.usuarioNombreConCitas.textContent = nombreUsuario || 'Usuario';
        console.log('✅ Nombre asignado:', elementos.usuarioNombreConCitas.textContent);
    } else {
        console.error('❌ No se encontró el elemento usuario-nombre-con-citas');
    }

    if (elementos.usuarioNombreConCitas) {
        elementos.usuarioNombreConCitas.textContent = nombreUsuario || 'Usuario';
    }

    if (elementos.contadorCitas) {
        elementos.contadorCitas.textContent = `${citas.length} cita${citas.length !== 1 ? 's' : ''}`;
    }

    if (elementos.citasHeader) {
        elementos.citasHeader.style.display = 'block';
    }

    if (elementos.citasContainer) {
        elementos.citasContainer.style.display = 'block';
        elementos.citasContainer.innerHTML = '';

        citas.forEach(cita => {
            try {
                const citaElement = crearElementoCita(cita);
                elementos.citasContainer.appendChild(citaElement);
            } catch (error) {
                console.error('Error creando elemento de cita:', error, cita);
            }
        });
    }

    if (elementos.nuevaCitaFooter) {
        elementos.nuevaCitaFooter.style.display = 'block';
    }
}

function crearElementoCita(cita) {
    if (!elementos.citaTemplate) {
        console.error('Template de cita no encontrado');
        return document.createElement('div');
    }

    const template = elementos.citaTemplate.content.cloneNode(true);

    const citaId = template.querySelector('.cita-id');
    if (citaId) citaId.textContent = cita.id_cita || 'N/A';

    const estadoBadge = template.querySelector('.cita-estado-badge');
    if (estadoBadge) {
        estadoBadge.textContent = cita.estado || 'Pendiente';
        estadoBadge.className = obtenerClaseEstado(cita.estado);
    }

    const placa = template.querySelector('.cita-placa');
    if (placa) placa.textContent = cita.placa || 'No especificada';

    const vehiculoInfo = template.querySelector('.cita-vehiculo-info');
    if (vehiculoInfo) {
        vehiculoInfo.textContent = `${cita.marca || ''} ${cita.modelo || ''} ${cita.anio || ''}`.trim();
    }

    const fecha = template.querySelector('.cita-fecha');
    if (fecha) fecha.textContent = cita.fecha || 'No especificada';

    const hora = template.querySelector('.cita-hora');
    if (hora) hora.textContent = cita.horario || 'No especificada';

    const servicio = template.querySelector('.cita-servicio');
    if (servicio) servicio.textContent = cita.servicio || 'No especificado';

    const sucursal = template.querySelector('.cita-sucursal');
    if (sucursal) sucursal.textContent = cita.sucursal || 'No especificada';

    if (cita.observaciones && cita.observaciones.trim()) {
        const observacionesContainer = template.querySelector('.cita-observaciones-container');
        const observaciones = template.querySelector('.cita-observaciones');

        if (observacionesContainer) observacionesContainer.style.display = 'block';
        if (observaciones) observaciones.textContent = cita.observaciones;
    }

    const fechaCreacion = template.querySelector('.cita-fecha-creacion');
    if (fechaCreacion) fechaCreacion.textContent = formatearFecha(cita.fecha_creacion);

    if (cita.estado === 'pendiente') {
        const acciones = template.querySelector('.cita-acciones');
        if (acciones) acciones.style.display = 'block';

        const btnModificar = template.querySelector('.btn-modificar-cita');
        if (btnModificar) {
            btnModificar.setAttribute('data-cita-id', cita.id_cita);
            btnModificar.setAttribute('data-placa', cita.placa || '');
            btnModificar.setAttribute('data-marca', cita.marca || '');
            btnModificar.setAttribute('data-modelo', cita.modelo || '');
            btnModificar.setAttribute('data-anio', cita.anio || '');
            btnModificar.setAttribute('data-servicio', cita.servicio || '');
            btnModificar.setAttribute('data-sucursal', cita.sucursal || '');
            btnModificar.setAttribute('data-fecha', cita.fecha || '');
            btnModificar.setAttribute('data-horario', cita.horario || '');
            btnModificar.setAttribute('data-observaciones', cita.observaciones || '');
        }

        const btnCancelar = template.querySelector('.btn-cancelar-cita');
        if (btnCancelar) btnCancelar.setAttribute('data-cita-id', cita.id_cita);
    }

    return template;
}

function obtenerClaseEstado(estado) {
    switch (estado?.toLowerCase()) {
        case 'pendiente':
            return 'badge bg-warning text-dark';
        case 'confirmada':
            return 'badge bg-success';
        case 'completada':
            return 'badge bg-primary';
        case 'cancelada':
            return 'badge bg-danger';
        default:
            return 'badge bg-secondary';
    }
}

function formatearFecha(fechaISO) {
    if (!fechaISO) return 'No especificada';

    try {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error formateando fecha:', error);
        return fechaISO;
    }
}

function cargarMisCitas() {
    console.log('=== INICIANDO CARGA DE MIS CITAS ===');

    const token = localStorage.getItem('token');

    if (!token) {
        console.log('No hay token - mostrando login requerido');
        mostrarLoginRequerido();
        return;
    }

    console.log('Token encontrado, mostrando loading...');
    mostrarLoading();

    const apiUrl = window.API_URL || "http://localhost:8081/api";

    fetch(apiUrl + '/citas/mis-citas', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => {
            console.log('Respuesta mis citas:', res.status);
            if (res.ok) {
                return res.json();
            } else if (res.status === 401) {
                throw new Error('TOKEN_INVALIDO');
            } else {
                throw new Error('Error al cargar citas');
            }
        })
        .then(citas => {
            console.log('Citas recibidas:', citas);

            const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
            const nombreUsuario = `${usuario.nombre || ''} ${usuario.apellidos || ''}`.trim();

            if (!citas || citas.length === 0) {
                console.log('Sin citas - llamando mostrarSinCitas');
                mostrarSinCitas(nombreUsuario);
            } else {
                console.log('Con citas - llamando mostrarConCitas');
                mostrarConCitas(citas, nombreUsuario);
            }
        })
        .catch(error => {
            console.error('Error al cargar citas:', error);

            if (error.message === 'TOKEN_INVALIDO') {
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
                mostrarTokenInvalido();
            } else {
                mostrarError(error.message);
            }
        });
}

function modificarCita(citaData) {
    console.log('=== MODIFICAR CITA ===');
    console.log('Datos de la cita:', citaData);

    const datosCitaCompletos = {
        id_cita: citaData.citaId,
        placa: citaData.placa,
        citaEncontrada: {
            id_cita: citaData.citaId,
            placa: citaData.placa,
            marca: citaData.marca,
            modelo: citaData.modelo,
            anio: citaData.anio,
            servicio: citaData.servicio,
            sucursal: citaData.sucursal,
            fecha: citaData.fecha,
            horario: citaData.horario,
            observaciones: citaData.observaciones || ''
        },
        desdeMisCitas: true
    };

    localStorage.setItem('citaParaModificar', JSON.stringify(datosCitaCompletos));
    window.location.href = './rectificar-cita.html';
}

function mostrarConfirmacionCancelar(citaId, placaCita) {
    console.log('=== MOSTRAR CONFIRMACIÓN ===');
    console.log('citaId:', citaId, 'placaCita:', placaCita);

    if (!confirmacionElementos.container) {
        console.error('❌ No se encontró elemento confirmacion-cancelar');
        return;
    }

    if (confirmacionElementos.placa) {
        confirmacionElementos.placa.textContent = placaCita || 'Sin placa';
    }

    if (confirmacionElementos.btnConfirmar) {
        confirmacionElementos.btnConfirmar.setAttribute('data-cita-id', citaId);
    }

    confirmacionElementos.container.className = 'alert alert-warning border-warning mostrar';
    const botones = confirmacionElementos.container.querySelector('#confirmacion-botones');
    if (botones) botones.style.display = 'flex';
    if (confirmacionElementos.btnConfirmar) confirmacionElementos.btnConfirmar.disabled = false;
    if (confirmacionElementos.btnTexto) confirmacionElementos.btnTexto.textContent = 'Sí, cancelar cita';

    confirmacionElementos.container.style.display = 'block';

    confirmacionElementos.container.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

    console.log('✅ Confirmación mostrada');
}

function ocultarConfirmacionCancelar() {
    console.log('Ocultando confirmación...');
    if (confirmacionElementos.container) {
        confirmacionElementos.container.style.display = 'none';
    }
}

function ejecutarCancelacion(citaId) {
    console.log('=== EJECUTAR CANCELACIÓN ===');
    console.log('citaId:', citaId);

    const token = localStorage.getItem('token');
    const apiUrl = window.API_URL || "http://localhost:8081/api";

    if (confirmacionElementos.btnTexto) {
        confirmacionElementos.btnTexto.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Cancelando...';
    }
    if (confirmacionElementos.btnConfirmar) {
        confirmacionElementos.btnConfirmar.disabled = true;
    }

    fetch(apiUrl + `/citas/${citaId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => {
            console.log('Respuesta del servidor:', res.status);
            if (res.ok) {
                mostrarMensajeExitoCancelacion();
                setTimeout(() => {
                    cargarMisCitas();
                    ocultarConfirmacionCancelar();
                }, 2000);
            } else {
                throw new Error('Error al cancelar cita');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarErrorCancelacion();

            // Restaurar botón
            if (confirmacionElementos.btnTexto) {
                confirmacionElementos.btnTexto.innerHTML = '<i class="fas fa-times me-1"></i> Sí, cancelar cita';
            }
            if (confirmacionElementos.btnConfirmar) {
                confirmacionElementos.btnConfirmar.disabled = false;
            }
        });
}

function mostrarMensajeExitoCancelacion() {
    if (!confirmacionElementos.container) return;

    confirmacionElementos.container.className = 'alert alert-success border-success';

    const titulo = confirmacionElementos.container.querySelector('h5');
    const texto = confirmacionElementos.container.querySelector('p');
    const botones = confirmacionElementos.container.querySelector('#confirmacion-botones');

    if (titulo) titulo.textContent = '¡Cita cancelada exitosamente!';
    if (texto) texto.textContent = 'La cita ha sido eliminada de tu lista. Actualizando...';
    if (botones) botones.style.display = 'none';
}

function mostrarErrorCancelacion() {
    if (!confirmacionElementos.container) return;

    confirmacionElementos.container.className = 'alert alert-danger border-danger';

    const titulo = confirmacionElementos.container.querySelector('h5');
    const texto = confirmacionElementos.container.querySelector('p');

    if (titulo) titulo.textContent = 'Error al cancelar';
    if (texto) texto.textContent = 'No se pudo cancelar la cita. Inténtalo nuevamente.';
}

function cancelarCita(citaId) {
    console.log('=== CANCELAR CITA ===');
    console.log('citaId:', citaId);

    const citaElement = document.querySelector(`[data-cita-id="${citaId}"]`).closest('.card');
    const placaCita = citaElement?.querySelector('.cita-placa')?.textContent || 'Sin placa';

    console.log('Placa encontrada:', placaCita);

    mostrarConfirmacionCancelar(citaId, placaCita);
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('=== DOM CARGADO - INICIALIZANDO MIS CITAS ===');

    if (document.getElementById('citas-container')) {
        cargarMisCitas();
    }

    console.log('=== CONFIGURANDO EVENT LISTENERS DE CONFIRMACIÓN ===');

    if (confirmacionElementos.btnConfirmar) {
        confirmacionElementos.btnConfirmar.addEventListener('click', function () {
            const citaId = this.getAttribute('data-cita-id');
            console.log('Clic en confirmar cancelación, citaId:', citaId);
            if (citaId) {
                ejecutarCancelacion(citaId);
            }
        });
        console.log('✅ Event listener confirmar configurado');
    }

    if (confirmacionElementos.btnCancelar) {
        confirmacionElementos.btnCancelar.addEventListener('click', function () {
            console.log('Clic en cancelar cancelación');
            ocultarConfirmacionCancelar();
        });
        console.log('✅ Event listener cancelar configurado');
    }
});

document.addEventListener('click', function (e) {
    if (e.target.closest('.btn-modificar-cita')) {
        const btn = e.target.closest('.btn-modificar-cita');
        const citaData = {
            citaId: btn.getAttribute('data-cita-id'),
            placa: btn.getAttribute('data-placa'),
            marca: btn.getAttribute('data-marca'),
            modelo: btn.getAttribute('data-modelo'),
            anio: btn.getAttribute('data-anio'),
            servicio: btn.getAttribute('data-servicio'),
            sucursal: btn.getAttribute('data-sucursal'),
            fecha: btn.getAttribute('data-fecha'),
            horario: btn.getAttribute('data-horario'),
            observaciones: btn.getAttribute('data-observaciones')
        };
        modificarCita(citaData);
    }

    if (e.target.closest('.btn-cancelar-cita')) {
        const btn = e.target.closest('.btn-cancelar-cita');
        const citaId = btn.getAttribute('data-cita-id');
        if (citaId) {
            cancelarCita(citaId);
        }
    }
});

window.cargarMisCitas = cargarMisCitas;

console.log('✅ mis-citas.js cargado completamente');