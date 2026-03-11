// ════════════════════════════════════════════════════════════
//  TORO SENTAO — Formulario de Reservaciones
//  Conectado a Google Sheets via Google Apps Script
// ════════════════════════════════════════════════════════════

// ─── CONFIGURACIÓN ───────────────────────────────────────────
// ⭐ IMPORTANTE: Pega aquí tu URL de Google Apps Script
// (Te la doy en las instrucciones paso a paso)
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz3PeZjPA_Xgz72EwVVyjZbmZLLWVc3JjsMJVztEHCqGBh1MeJpTt3p1YusL0RA7GMu/exec';

// ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  const form       = document.getElementById('reservaForm');
  const submitBtn  = document.getElementById('submitBtn');
  const btnText    = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  const formSuccess= document.getElementById('formSuccess');
  const formError  = document.getElementById('formError');
  const retryBtn   = document.getElementById('retryBtn');

  // ── Fecha mínima = mañana ──────────────────────────────────
  const fechaInput = document.getElementById('fecha');
  const hoy = new Date();
  hoy.setDate(hoy.getDate() + 1);
  const yyyy = hoy.getFullYear();
  const mm   = String(hoy.getMonth() + 1).padStart(2, '0');
  const dd   = String(hoy.getDate()).padStart(2, '0');
  fechaInput.min = `${yyyy}-${mm}-${dd}`;

  // No permitir lunes (día = 1)
  fechaInput.addEventListener('change', () => {
    const d = new Date(fechaInput.value + 'T00:00:00');
    if (d.getDay() === 1) {
      showFieldError('fecha', 'Los lunes estamos cerrados. Elige otro día.');
      fechaInput.value = '';
    } else {
      clearFieldError('fecha');
    }
  });

  // ── Validación en tiempo real ─────────────────────────────
  ['nombre','telefono','fecha','hora','personas'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('blur', () => validateField(id));
    el.addEventListener('input', () => {
      if (el.classList.contains('invalid')) validateField(id);
    });
  });

  function validateField(id) {
    const el  = document.getElementById(id);
    const val = el.value.trim();

    const rules = {
      nombre:   { test: v => v.length >= 2,                    msg: 'Ingresa tu nombre completo.' },
      telefono: { test: v => /^[\d\s\-+()]{7,15}$/.test(v),   msg: 'Número de teléfono no válido.' },
      fecha:    { test: v => v !== '',                          msg: 'Selecciona una fecha.' },
      hora:     { test: v => v !== '',                          msg: 'Selecciona una hora.' },
      personas: { test: v => v !== '',                          msg: 'Indica cuántas personas.' },
    };

    const rule = rules[id];
    if (!rule) return true;

    if (!rule.test(val)) {
      showFieldError(id, rule.msg);
      el.classList.add('invalid');
      el.classList.remove('valid');
      return false;
    } else {
      clearFieldError(id);
      el.classList.remove('invalid');
      el.classList.add('valid');
      return true;
    }
  }

  function showFieldError(id, msg) {
    const el = document.getElementById(`err-${id}`);
    if (el) el.textContent = msg;
  }
  function clearFieldError(id) {
    const el = document.getElementById(`err-${id}`);
    if (el) el.textContent = '';
  }

  function validateAll() {
    const fields = ['nombre','telefono','fecha','hora','personas'];
    return fields.map(validateField).every(Boolean);
  }

  // ── Envío del formulario ──────────────────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    // Mostrar loading
    setLoading(true);

    const data = {
      nombre:   document.getElementById('nombre').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      fecha:    formatFecha(document.getElementById('fecha').value),
      hora:     document.getElementById('hora').value,
      personas: document.getElementById('personas').value,
      ocasion:  document.getElementById('ocasion').value,
      notas:    document.getElementById('notas').value.trim(),
      timestamp: new Date().toLocaleString('es-PA', { timeZone: 'America/Panama' }),
    };

    try {
      // Si no hay URL configurada → modo demo
      if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === 'TU_URL_AQUI') {
        await new Promise(r => setTimeout(r, 1500)); // simular envío
        showSuccess(data.nombre, data.telefono);
        return;
      }

      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode:   'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // no-cors siempre da opaque response, lo tratamos como éxito
      showSuccess(data.nombre, data.telefono);

    } catch (err) {
      console.error('Error al enviar:', err);
      showError('No se pudo conectar. Intenta por WhatsApp.');
    } finally {
      setLoading(false);
    }
  });

  // ── Helpers UI ────────────────────────────────────────────
  function setLoading(loading) {
    submitBtn.disabled = loading;
    btnText.style.display    = loading ? 'none' : 'inline';
    btnLoading.style.display = loading ? 'inline-flex' : 'none';
  }

  function showSuccess(nombre, telefono) {
    form.style.display = 'none';
    document.getElementById('successName').textContent = nombre;
    document.getElementById('successTel').textContent  = telefono;
    formSuccess.classList.add('visible');
    formError.classList.remove('visible');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // También enviar WhatsApp de confirmación al restaurante
    const msg = encodeURIComponent(
      `🐂 *Nueva Reservación — Toro Sentao*\n\n` +
      `👤 *Nombre:* ${nombre}\n` +
      `📱 *Teléfono:* ${telefono}\n` +
      `📅 *Fecha:* ${document.getElementById('fecha').value}\n` +
      `⏰ *Hora:* ${document.getElementById('hora').value}\n` +
      `👥 *Personas:* ${document.getElementById('personas').value}\n` +
      `🎉 *Ocasión:* ${document.getElementById('ocasion').value}\n` +
      `📝 *Notas:* ${document.getElementById('notas').value || 'Ninguna'}`
    );
    // Notificar al restaurante por WhatsApp
    const waNum = (typeof TORO_DATA !== 'undefined') ? TORO_DATA.config.whatsapp : '50760000000';
    window.open(`https://wa.me/${waNum}?text=${msg}`, '_blank');
  }

  function showError(msg) {
    document.getElementById('errorMsg').textContent = msg;
    formError.classList.add('visible');
    formSuccess.classList.remove('visible');
  }

  retryBtn.addEventListener('click', () => {
    formError.classList.remove('visible');
    form.style.display = 'block';
  });

  function formatFecha(isoDate) {
    if (!isoDate) return '';
    const [y, m, d] = isoDate.split('-');
    const dias  = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const fecha = new Date(isoDate + 'T00:00:00');
    return `${dias[fecha.getDay()]} ${d} de ${meses[parseInt(m)-1]} de ${y}`;
  }

});
