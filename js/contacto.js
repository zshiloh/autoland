// contacto.js - ESTE archivo define API_URL para todos
window.API_URL = 'http://localhost:8081/api';

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('form-contacto');

    if (!formulario) return;

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(formulario);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Remover campos que no son parte de la API
        delete data.tc;
        delete data.info;

        // Validación básica
        if (!data.nombre || !data.dni || !data.telefono || !data.email || !data.consulta) {
            alert('Por favor, completa todos los campos obligatorios');
            return;
        }

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Por favor, ingresa un email válido');
            return;
        }

        // Validación de DNI (8 dígitos)
        if (data.dni.length !== 8 || !/^\d+$/.test(data.dni)) {
            alert('El DNI debe tener 8 dígitos');
            return;
        }

        try {
            const response = await fetch(`${window.API_URL}/contacto`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Mensaje enviado correctamente. Te contactaremos pronto.');
                formulario.reset();
            } else if (response.status === 400) {
                const error = await response.text();
                alert(`Error al enviar mensaje: ${error}`);
            } else {
                alert('Error al enviar mensaje. Intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            alert('Error al enviar mensaje. Verifica tu conexión e intenta más tarde.');
        }
    });
});