// index.js (backend)
import cors from 'cors';
app.use(cors());

// Helpers
const api = (path) => `${API_BASE_URL}${path}`;
const toastError = (msg) => alert(msg); // puedes cambiar a toasts de Bootstrap si quieres

// Renderizar tabla
function renderTabla(peliculas) {
  const tbody = $('#tabla-peliculas');
  tbody.empty();
  peliculas.forEach(p => {
    tbody.append(`
      <tr data-id="${p.id}">
        <td>${p.id}</td>
        <td>${p.titulo}</td>
        <td>${p.año}</td>
        <td>${p.genero}</td>
        <td>${p.director}</td>
        <td>
          <button class="btn btn-sm btn-warning btn-editar">Editar</button>
          <button class="btn btn-sm btn-danger btn-eliminar">Eliminar</button>
        </td>
      </tr>
    `);
  });
}

// Cargar lista
async function cargarPeliculas() {
  try {
    const res = await fetch(api('/peliculas'));
    const data = await res.json();
    renderTabla(data);
  } catch (e) {
    toastError('Error al cargar películas');
    console.error(e);
  }
}

// Crear
$('#form-crear').on('submit', async function (e) {
  e.preventDefault();
  const body = {
    titulo: this.titulo.value.trim(),
    año: Number(this.año.value),
    genero: this.genero.value.trim(),
    director: this.director.value.trim()
  };
  try {
    const res = await fetch(api('/peliculas'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Error al crear');
    this.reset();
    cargarPeliculas();
  } catch (e) {
    toastError('No se pudo crear la película');
    console.error(e);
  }
});

// Abrir modal de edición
$(document).on('click', '.btn-editar', async function () {
  const id = $(this).closest('tr').data('id');
  try {
    const res = await fetch(api(`/peliculas/${id}`));
    const p = await res.json();
    $('#editar-id').val(p.id);
    $('#editar-titulo').val(p.titulo);
    $('#editar-año').val(p.año);
    $('#editar-genero').val(p.genero);
    $('#editar-director').val(p.director);
    const modal = new bootstrap.Modal(document.getElementById('modalEditar'));
    modal.show();
  } catch (e) {
    toastError('No se pudo cargar la película');
    console.error(e);
  }
});

// Guardar edición
$('#form-editar').on('submit', async function (e) {
  e.preventDefault();
  const id = $('#editar-id').val();
  const body = {
    titulo: $('#editar-titulo').val().trim(),
    año: Number($('#editar-año').val()),
    genero: $('#editar-genero').val().trim(),
    director: $('#editar-director').val().trim()
  };
  try {
    const res = await fetch(api(`/peliculas/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Error al editar');
    cargarPeliculas();
    bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide();
  } catch (e) {
    toastError('No se pudo editar la película');
    console.error(e);
  }
});

// Eliminar
$(document).on('click', '.btn-eliminar', async function () {
  const id = $(this).closest('tr').data('id');
  if (!confirm('¿Seguro que quieres eliminar esta película?')) return;
  try {
    const res = await fetch(api(`/peliculas/${id}`), { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar');
    cargarPeliculas();
  } catch (e) {
    toastError('No se pudo eliminar la película');
    console.error(e);
  }
});

// Refrescar manual
$('#btn-refrescar').on('click', cargarPeliculas);

// Inicial
$(document).ready(cargarPeliculas);
