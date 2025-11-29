console.log("app.js cargado correctamente");

//Detectar si estamos en Railway o en local
const API_BASE_URL = window.location.hostname.includes("railway.app")
  ? "https://peliculas-app-production.up.railway.app"
  : "http://localhost:3000";

//Helpers
const api = (path) => `${API_BASE_URL}${path}`;
const toastError = (msg) => alert(msg);

//Renderizar la tabla de películas
function renderTabla(peliculas) {
  const tbody = document.querySelector("#tabla-peliculas");
  tbody.innerHTML = "";

  peliculas.forEach((p) => {
    tbody.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.titulo}</td>
        <td>${p.año}</td>
        <td>${p.descripcion}</td>
        <td>
          ${p.imagen ? `<img src="${p.imagen}" width="60">` : "—"}
        </td>
        <td>
          <button class="btn btn-warning btn-sm btn-editar" data-id="${p.id}">Editar</button>
          <button class="btn btn-danger btn-sm btn-eliminar" data-id="${p.id}">Eliminar</button>
        </td>
      </tr>
    `;
  });

  activarBotones();
}

//Cargar lista de películas
async function cargarPeliculas() {
  try {
    const res = await fetch(api("/peliculas"));
    const data = await res.json();
    renderTabla(data);
  } catch (err) {
    toastError("Error al cargar películas");
  }
}

//Crear nueva película
document.querySelector("#form-crear").addEventListener("submit", async function (e) {
  e.preventDefault();

  const body = {
    titulo: this.titulo.value.trim(),
    año: Number(this.año.value),
    descripcion: this.descripcion.value.trim(),
    imagen: this.imagen.value.trim() || null
  };

  try {
    const res = await fetch(api("/peliculas"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error();

    this.reset();
    cargarPeliculas();
    bootstrap.Modal.getInstance(document.getElementById("modalCrear")).hide();

  } catch (err) {
    toastError("No se pudo crear la película");
  }
});

//Activar botones (editar y eliminar)
function activarBotones() {
  // Editar
  document.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      try {
        const res = await fetch(api(`/peliculas/${id}`));
        const p = await res.json();

        document.querySelector("#editar-id").value = p.id;
        document.querySelector("#editar-titulo").value = p.titulo;
        document.querySelector("#editar-año").value = p.año;
        document.querySelector("#editar-descripcion").value = p.descripcion;
        document.querySelector("#editar-imagen").value = p.imagen || "";

        new bootstrap.Modal(document.getElementById("modalEditar")).show();

      } catch {
        toastError("No se pudo cargar la película a editar");
      }
    });
  });

  // Eliminar
  document.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      if (!confirm("¿Seguro que deseas eliminar esta película?")) return;

      try {
        const res = await fetch(api(`/peliculas/${id}`), {
          method: "DELETE",
        });

        if (!res.ok) throw new Error();

        cargarPeliculas();

      } catch {
        toastError("Error al eliminar la película");
      }
    });
  });
}

//Guardar cambios (editar)
document.querySelector("#form-editar").addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = document.querySelector("#editar-id").value;

  const body = {
    titulo: document.querySelector("#editar-titulo").value.trim(),
    año: Number(document.querySelector("#editar-año").value),
    descripcion: document.querySelector("#editar-descripcion").value.trim(),
    imagen: document.querySelector("#editar-imagen").value.trim() || null,
  };

  try {
    const res = await fetch(api(`/peliculas/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error();

    cargarPeliculas();
    bootstrap.Modal.getInstance(document.getElementById("modalEditar")).hide();

  } catch {
    toastError("Error al editar");
  }
});

//Cargar al iniciar
cargarPeliculas();
