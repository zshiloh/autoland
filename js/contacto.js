const API_URL = 'http://localhost:8081/api';

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('form-contacto');
    const modal = document.getElementById('modalContacto');
    const mensaje = document.getElementById('mensaje');

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(formulario);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        delete data.tc;
        delete data.info;

        try {
            const response = await fetch(`${API_URL}/contacto`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                mensaje.textContent = 'Mensaje enviado correctamente.';
                formulario.reset();
            } else if (response.status === 400) {
                const error = await response.text();
                mensaje.textContent = `Error al enviar mensaje: ${error}`;
            } else {
                mensaje.textContent = 'Error al enviar mensaje. Intenta nuevamente.';
            }
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            mensaje.textContent = 'Error al enviar mensaje. Intenta más tarde.';
        }

        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    });
});
