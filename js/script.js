document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".locales-acordeon-item");

  items.forEach(item => {
    const boton = item.querySelector(".locales-local");
    const contenido = item.querySelector(".locales-contenido");
    const icono = item.querySelector(".locales-icono");

    boton.addEventListener("click", () => {
      const visible = contenido.style.display === "block";

      document.querySelectorAll(".locales-contenido").forEach(c => c.style.display = "none");
      document.querySelectorAll(".locales-icono").forEach(i => i.textContent = "▾");

      if (!visible) {
        contenido.style.display = "block";
        icono.textContent = "▴";
      }
    });
  });
});
