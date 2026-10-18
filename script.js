// SILOTECH - Menú para celulares
const menuBoton = document.getElementById('menuBoton');
const menuNavegacion = document.getElementById('menuNavegacion');

menuBoton.addEventListener('click', () => {
  const abierto = menuNavegacion.classList.toggle('abierto');
  menuBoton.setAttribute('aria-expanded', String(abierto));
  menuBoton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
});

// Al elegir una sección, cerramos el menú móvil.
menuNavegacion.querySelectorAll('a').forEach(enlace => {
  enlace.addEventListener('click', () => {
    menuNavegacion.classList.remove('abierto');
    menuBoton.setAttribute('aria-expanded', 'false');
    menuBoton.setAttribute('aria-label', 'Abrir menú');
  });
});

// Animaciones al bajar por la página.
const elementos = document.querySelectorAll('.revelar');
if ('IntersectionObserver' in window) {
  const observador = new IntersectionObserver((entradas, obs) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
        obs.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });
  elementos.forEach(elemento => observador.observe(elemento));
} else {
  elementos.forEach(elemento => elemento.classList.add('visible'));
}

// Descarga de SiloMonitor: el enlace al APK se encuentra en index.html.
// GitHub Releases entrega la última versión publicada con el nombre SiloMonitor.apk.

// SILOTECH - Envío de consultas mediante Formspree.
const formularioContacto = document.getElementById('formularioContacto');
const botonEnviarConsulta = document.getElementById('botonEnviarConsulta');
const estadoFormulario = document.getElementById('estadoFormulario');
const modalConfirmacion = document.getElementById('modalConfirmacion');
const cerrarConfirmacion = document.getElementById('cerrarConfirmacion');
let focoAntesDelModal = null;

function mostrarConfirmacion() {
  if (!modalConfirmacion || !cerrarConfirmacion) return;
  focoAntesDelModal = document.activeElement;
  modalConfirmacion.hidden = false;
  document.body.classList.add('confirmacion-abierta');
  cerrarConfirmacion.focus();
}

function ocultarConfirmacion() {
  if (!modalConfirmacion) return;
  modalConfirmacion.hidden = true;
  document.body.classList.remove('confirmacion-abierta');
  if (focoAntesDelModal && typeof focoAntesDelModal.focus === 'function') {
    focoAntesDelModal.focus();
  }
}

if (cerrarConfirmacion && modalConfirmacion) {
  cerrarConfirmacion.addEventListener('click', ocultarConfirmacion);
  modalConfirmacion.addEventListener('click', (evento) => {
    if (evento.target === modalConfirmacion) ocultarConfirmacion();
  });
  document.addEventListener('keydown', (evento) => {
    if (modalConfirmacion.hidden) return;
    if (evento.key === 'Escape') ocultarConfirmacion();
    if (evento.key === 'Tab') {
      evento.preventDefault();
      cerrarConfirmacion.focus();
    }
  });
}


if (formularioContacto && botonEnviarConsulta && estadoFormulario) {
  formularioContacto.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    if (!formularioContacto.reportValidity()) return;

    botonEnviarConsulta.disabled = true;
    botonEnviarConsulta.textContent = 'Enviando...';
    estadoFormulario.textContent = 'Estamos enviando tu consulta...';
    estadoFormulario.style.color = '';

    try {
      const respuesta = await fetch(formularioContacto.action, {
        method: 'POST',
        body: new FormData(formularioContacto),
        headers: { 'Accept': 'application/json' }
      });

      if (!respuesta.ok) {
        throw new Error('Formspree no aceptó el envío.');
      }

      estadoFormulario.textContent = '';
      formularioContacto.reset();
      mostrarConfirmacion();
    } catch (error) {
      estadoFormulario.textContent = 'No pudimos enviar tu consulta. Intentá nuevamente o escribinos por correo o WhatsApp.';
      estadoFormulario.style.color = '#b42318';
      console.error('Error al enviar la consulta:', error);
    } finally {
      botonEnviarConsulta.disabled = false;
      botonEnviarConsulta.textContent = 'Enviar consulta';
    }
  });
}
