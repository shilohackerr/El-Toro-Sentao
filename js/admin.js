// ════════════════════════════════════════════════════════════
//  TORO SENTAO — Panel de Administración
//  Contraseña, gestión de reservaciones, filtros, export
// ════════════════════════════════════════════════════════════

// ─── CONFIGURACIÓN ───────────────────────────────────────────
// ⭐ Cambia esta contraseña antes de subir a GitHub
const ADMIN_PASSWORD = 'torosentao2025';

// ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // ── Referencias DOM ───────────────────────────────────────
  const loginScreen  = document.getElementById('loginScreen');
  const adminPanel   = document.getElementById('adminPanel');
  const loginBtn     = document.getElementById('loginBtn');
  const logoutBtn    = document.getElementById('logoutBtn');
  const adminPass    = document.getElementById('adminPass');
  const loginError   = document.getElementById('loginError');
  const sidebarToggle= document.getElementById('sidebarToggle');
  const adminSidebar = document.getElementById('adminSidebar');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose   = document.getElementById('modalClose');
  const toast        = document.getElementById('toast');

  // ── Datos en memoria (localStorage como base de datos) ────
  let reservaciones = cargarReservaciones();

  // ── AUTENTICACIÓN ─────────────────────────────────────────
  // Verificar si ya inició sesión
  if (sessionStorage.getItem('ts_admin') === 'ok') {
    mostrarPanel();
  }

  loginBtn.addEventListener('click', () => login());
  adminPass.addEventListener('keydown', e => { if (e.key === 'Enter') login(); });

  function login() {
    if (adminPass.value === ADMIN_PASSWORD) {
      sessionStorage.setItem('ts_admin', 'ok');
      loginError.classList.remove('visible');
      mostrarPanel();
    } else {
      loginError.classList.add('visible');
      adminPass.value = '';
      adminPass.focus();
      adminPass.style.borderColor = '#e74c3c';
      setTimeout(() => adminPass.style.borderColor = '', 2000);
    }
  }

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('ts_admin');
    adminPanel.style.display = 'none';
    loginScreen.style.display = 'flex';
    adminPass.value = '';
  });

  function mostrarPanel() {
    loginScreen.style.display = 'none';
    adminPanel.style.display  = 'grid';
    actualizarFecha();
    renderTabla();
    renderHoy();
    renderStats();
  }

  // ── SIDEBAR MOBILE ────────────────────────────────────────
  sidebarToggle.addEventListener('click', () => {
    adminSidebar.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (!adminSidebar.contains(e.target) && e.target !== sidebarToggle) {
      adminSidebar.classList.remove('open');
    }
  });

  // ── NAVEGACIÓN DE VISTAS ──────────────────────────────────
  const viewTitles = {
    reservaciones: 'Reservaciones',
    hoy:           'Reservaciones de Hoy',
    stats:         'Resumen General',
  };

  document.querySelectorAll('.sidebar-link').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-link').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`view-${btn.dataset.view}`).classList.add('active');
      document.getElementById('viewTitle').textContent = viewTitles[btn.dataset.view];
      adminSidebar.classList.remove('open');
    });
  });

  // ── FECHA EN HEADER ───────────────────────────────────────
  function actualizarFecha() {
    const ahora = new Date();
    const opciones = { weekday:'long', year:'numeric', month:'long', day:'numeric' };
    document.getElementById('adminDate').textContent =
      ahora.toLocaleDateString('es-PA', opciones);
  }

  // ── DATOS — localStorage como BD simple ──────────────────
  function cargarReservaciones() {
    try {
      const raw = localStorage.getItem('ts_reservaciones');
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    // Datos demo para mostrar cómo se ve el panel
    return generarDemoData();
  }

  function guardarReservaciones() {
    localStorage.setItem('ts_reservaciones', JSON.stringify(reservaciones));
  }

  function generarDemoData() {
    const hoy   = new Date();
    const manana = new Date(); manana.setDate(hoy.getDate() + 1);
    const ayer   = new Date(); ayer.setDate(hoy.getDate() - 1);

    const fmt = d => d.toLocaleDateString('es-PA', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

    return [
      { id:1, nombre:'Carlos Martínez',  telefono:'6123-4567', fecha: fmt(hoy),    hora:'01:00 PM', personas:'4', ocasion:'Reunión familiar',   notas:'Mesa cerca de la ventana',    estado:'Confirmada', timestamp: hoy.toLocaleString('es-PA') },
      { id:2, nombre:'Ana Rodríguez',    telefono:'6234-5678', fecha: fmt(hoy),    hora:'12:30 PM', personas:'2', ocasion:'Aniversario',         notas:'Decoración especial por favor', estado:'Pendiente',  timestamp: hoy.toLocaleString('es-PA') },
      { id:3, nombre:'Jorge Pérez',      telefono:'6345-6789', fecha: fmt(hoy),    hora:'07:00 PM', personas:'6', ocasion:'Cumpleaños',          notas:'Pastel incluido',             estado:'Pendiente',  timestamp: hoy.toLocaleString('es-PA') },
      { id:4, nombre:'María López',      telefono:'6456-7890', fecha: fmt(manana), hora:'01:30 PM', personas:'3', ocasion:'Visita regular',      notas:'',                            estado:'Confirmada', timestamp: manana.toLocaleString('es-PA') },
      { id:5, nombre:'Roberto González', telefono:'6567-8901', fecha: fmt(manana), hora:'06:00 PM', personas:'2', ocasion:'Reunión de negocios', notas:'Requieren factura',           estado:'Pendiente',  timestamp: manana.toLocaleString('es-PA') },
      { id:6, nombre:'Laura Castillo',   telefono:'6678-9012', fecha: fmt(ayer),   hora:'02:00 PM', personas:'5', ocasion:'Despedida',          notas:'',                            estado:'Completada', timestamp: ayer.toLocaleString('es-PA') },
      { id:7, nombre:'Diego Herrera',    telefono:'6789-0123', fecha: fmt(ayer),   hora:'12:00 PM', personas:'2', ocasion:'Visita regular',      notas:'',                            estado:'Completada', timestamp: ayer.toLocaleString('es-PA') },
    ];
  }

  // ── TABLA PRINCIPAL ───────────────────────────────────────
  let filteredData = [...reservaciones];

  function renderTabla(data = reservaciones) {
    filteredData = data;
    const tbody = document.getElementById('reservaTableBody');
    const empty = document.getElementById('tableEmpty');

    if (data.length === 0) {
      tbody.innerHTML = '';
      empty.style.display = 'block';
      return;
    }
    empty.style.display = 'none';

    tbody.innerHTML = data.map(r => `
      <tr onclick="abrirModal(${r.id})">
        <td><span style="color:rgba(245,236,215,.3);font-size:.8rem">#${r.id}</span></td>
        <td class="td-cliente">
          <strong>${r.nombre}</strong>
          <span>📱 ${r.telefono}</span>
        </td>
        <td class="td-fecha">
          <strong>${r.fecha}</strong>
          <span>⏰ ${r.hora}</span>
        </td>
        <td style="text-align:center">
          <strong style="font-size:1.1rem;color:var(--cream)">${r.personas}</strong>
          <span style="font-size:.7rem;color:rgba(245,236,215,.4);display:block">personas</span>
        </td>
        <td style="font-size:.82rem;color:rgba(245,236,215,.55)">${r.ocasion}</td>
        <td><span class="badge-estado badge-${r.estado}">${r.estado}</span></td>
        <td class="td-acciones" onclick="event.stopPropagation()">
          ${r.estado === 'Pendiente' ? `<button class="btn-accion btn-confirmar" onclick="cambiarEstado(${r.id},'Confirmada')">✅ OK</button>` : ''}
          ${r.estado !== 'Cancelada' && r.estado !== 'Completada' ? `<button class="btn-accion btn-cancelar" onclick="cambiarEstado(${r.id},'Cancelada')">✕</button>` : ''}
          <button class="btn-accion btn-wa" onclick="contactarWA(${r.id})">💬</button>
        </td>
      </tr>
    `).join('');
  }

  // ── FILTROS ───────────────────────────────────────────────
  const searchInput   = document.getElementById('searchInput');
  const filterEstado  = document.getElementById('filterEstado');
  const filterFecha   = document.getElementById('filterFecha');

  function aplicarFiltros() {
    const q      = searchInput.value.toLowerCase();
    const estado = filterEstado.value;
    const fecha  = filterFecha.value;
    const hoyStr = new Date().toLocaleDateString('es-PA', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
    const mananaDate = new Date(); mananaDate.setDate(mananaDate.getDate()+1);
    const mananaStr  = mananaDate.toLocaleDateString('es-PA', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

    let data = reservaciones.filter(r => {
      const matchQ      = !q || r.nombre.toLowerCase().includes(q) || r.telefono.includes(q);
      const matchEstado = estado === 'all' || r.estado === estado;
      let matchFecha    = true;
      if (fecha === 'hoy')    matchFecha = r.fecha === hoyStr;
      if (fecha === 'manana') matchFecha = r.fecha === mananaStr;
      return matchQ && matchEstado && matchFecha;
    });

    renderTabla(data);
  }

  searchInput.addEventListener('input',   aplicarFiltros);
  filterEstado.addEventListener('change', aplicarFiltros);
  filterFecha.addEventListener('change',  aplicarFiltros);

  // ── CAMBIAR ESTADO ────────────────────────────────────────
  window.cambiarEstado = (id, nuevoEstado) => {
    const idx = reservaciones.findIndex(r => r.id === id);
    if (idx === -1) return;
    reservaciones[idx].estado = nuevoEstado;
    guardarReservaciones();
    aplicarFiltros();
    renderHoy();
    renderStats();
    showToast(`Reservación de ${reservaciones[idx].nombre} → ${nuevoEstado}`);
  };

  // ── CONTACTAR POR WHATSAPP ────────────────────────────────
  window.contactarWA = (id) => {
    const r = reservaciones.find(r => r.id === id);
    if (!r) return;
    const tel = r.telefono.replace(/\D/g,'');
    const msg = encodeURIComponent(
      `Hola ${r.nombre} 👋, te contactamos de *Toro Sentao*.\n\n` +
      `Tu reservación para el *${r.fecha}* a las *${r.hora}* para *${r.personas} persona(s)* está siendo procesada.\n\n` +
      `¡Te esperamos! 🐂🔥`
    );
    const waNum = (typeof TORO_DATA !== 'undefined') ? tel : tel;
    window.open(`https://wa.me/507${waNum}?text=${msg}`, '_blank');
  };

  // ── MODAL DETALLE ─────────────────────────────────────────
  window.abrirModal = (id) => {
    const r = reservaciones.find(r => r.id === id);
    if (!r) return;

    document.getElementById('modalContent').innerHTML = `
      <h3 class="modal-title">🐂 Reservación #${r.id}</h3>
      <div class="modal-row"><span class="mlabel">Cliente</span>    <span class="mval">${r.nombre}</span></div>
      <div class="modal-row"><span class="mlabel">Teléfono</span>   <span class="mval">${r.telefono}</span></div>
      <div class="modal-row"><span class="mlabel">Fecha</span>      <span class="mval">${r.fecha}</span></div>
      <div class="modal-row"><span class="mlabel">Hora</span>       <span class="mval">${r.hora}</span></div>
      <div class="modal-row"><span class="mlabel">Personas</span>   <span class="mval">${r.personas}</span></div>
      <div class="modal-row"><span class="mlabel">Ocasión</span>    <span class="mval">${r.ocasion}</span></div>
      <div class="modal-row"><span class="mlabel">Notas</span>      <span class="mval">${r.notas || '—'}</span></div>
      <div class="modal-row"><span class="mlabel">Estado</span>     <span class="mval"><span class="badge-estado badge-${r.estado}">${r.estado}</span></span></div>
      <div class="modal-row"><span class="mlabel">Recibida</span>   <span class="mval">${r.timestamp}</span></div>
      <div class="modal-actions">
        ${r.estado === 'Pendiente'  ? `<button class="btn-accion btn-confirmar" style="flex:1;padding:12px" onclick="cambiarEstado(${r.id},'Confirmada');cerrarModal()">✅ Confirmar</button>` : ''}
        ${r.estado !== 'Cancelada' && r.estado !== 'Completada' ? `<button class="btn-accion btn-cancelar" style="flex:1;padding:12px" onclick="cambiarEstado(${r.id},'Cancelada');cerrarModal()">✕ Cancelar</button>` : ''}
        ${r.estado === 'Confirmada' ? `<button class="btn-accion btn-confirmar" style="flex:1;padding:12px;background:rgba(52,152,219,.2);color:#3498db;border-color:rgba(52,152,219,.3)" onclick="cambiarEstado(${r.id},'Completada');cerrarModal()">🏁 Completar</button>` : ''}
        <button class="btn-accion btn-wa" style="flex:1;padding:12px" onclick="contactarWA(${r.id})">💬 WhatsApp</button>
      </div>
    `;
    modalOverlay.style.display = 'flex';
  };

  window.cerrarModal = () => { modalOverlay.style.display = 'none'; };
  modalClose.addEventListener('click',   cerrarModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) cerrarModal(); });

  // ── VISTA HOY ─────────────────────────────────────────────
  function renderHoy() {
    const hoyStr = new Date().toLocaleDateString('es-PA', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
    const deHoy  = reservaciones.filter(r => r.fecha === hoyStr);
    const totalPersonas = deHoy.reduce((s, r) => s + parseInt(r.personas || 0), 0);
    const pendientes    = deHoy.filter(r => r.estado === 'Pendiente').length;
    const confirmadas   = deHoy.filter(r => r.estado === 'Confirmada').length;

    document.getElementById('hoyStats').innerHTML = `
      <div class="stat-card"><span class="stat-num">${deHoy.length}</span><span class="stat-label">Reservaciones</span></div>
      <div class="stat-card"><span class="stat-num">${totalPersonas}</span><span class="stat-label">Personas esperadas</span></div>
      <div class="stat-card"><span class="stat-num">${pendientes}</span><span class="stat-label">Pendientes</span></div>
      <div class="stat-card"><span class="stat-num">${confirmadas}</span><span class="stat-label">Confirmadas</span></div>
    `;

    const sorted = [...deHoy].sort((a,b) => a.hora.localeCompare(b.hora));
    document.getElementById('hoyList').innerHTML = sorted.length
      ? sorted.map(r => `
        <div class="hoy-card" onclick="abrirModal(${r.id})" style="cursor:pointer">
          <div class="hoy-hora">${r.hora}</div>
          <div class="hoy-info">
            <strong>${r.nombre}</strong>
            <span>📱 ${r.telefono} · ${r.ocasion} · <span class="badge-estado badge-${r.estado}" style="font-size:.65rem">${r.estado}</span></span>
          </div>
          <div class="hoy-personas"><strong>${r.personas}</strong>personas</div>
        </div>
      `).join('')
      : '<p style="color:rgba(245,236,215,.4);text-align:center;padding:40px">No hay reservaciones para hoy.</p>';
  }

  // ── VISTA STATS ───────────────────────────────────────────
  function renderStats() {
    const total      = reservaciones.length;
    const confirmadas= reservaciones.filter(r => r.estado === 'Confirmada').length;
    const pendientes = reservaciones.filter(r => r.estado === 'Pendiente').length;
    const canceladas = reservaciones.filter(r => r.estado === 'Cancelada').length;
    const completadas= reservaciones.filter(r => r.estado === 'Completada').length;
    const personas   = reservaciones.reduce((s,r) => s + parseInt(r.personas||0), 0);

    document.getElementById('statsGrid').innerHTML = `
      <div class="stats-card"><h4>Total Reservaciones</h4><div class="stats-big">${total}</div><div class="stats-sub">Desde el inicio</div></div>
      <div class="stats-card"><h4>Personas Atendidas</h4><div class="stats-big">${personas}</div><div class="stats-sub">Total acumulado</div></div>
      <div class="stats-card"><h4>Confirmadas</h4><div class="stats-big" style="color:#2ecc71">${confirmadas}</div><div class="stats-sub">Listas para atender</div></div>
      <div class="stats-card"><h4>Pendientes</h4><div class="stats-big" style="color:var(--gold)">${pendientes}</div><div class="stats-sub">Esperan confirmación</div></div>
      <div class="stats-card"><h4>Completadas</h4><div class="stats-big" style="color:#3498db">${completadas}</div><div class="stats-sub">Servicio completado</div></div>
      <div class="stats-card"><h4>Canceladas</h4><div class="stats-big" style="color:#e74c3c">${canceladas}</div><div class="stats-sub">No se presentaron</div></div>
    `;
  }

  // ── EXPORTAR CSV ──────────────────────────────────────────
  document.getElementById('exportBtn').addEventListener('click', () => {
    const headers = ['ID','Nombre','Teléfono','Fecha','Hora','Personas','Ocasión','Notas','Estado','Recibida'];
    const rows    = filteredData.map(r =>
      [r.id, r.nombre, r.telefono, r.fecha, r.hora, r.personas, r.ocasion, r.notas, r.estado, r.timestamp]
      .map(v => `"${(v||'').toString().replace(/"/g,'""')}"`)
      .join(',')
    );
    const csv  = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `reservaciones-toro-sentao-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 Exportando reservaciones...');
  });

  // ── TOAST ─────────────────────────────────────────────────
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3000);
  }

  // ── Agregar reservación desde el formulario público ────────
  // Esta función la llama reservaciones.js al guardar exitosamente
  window.agregarReservacionAdmin = (data) => {
    const newId = reservaciones.length ? Math.max(...reservaciones.map(r=>r.id)) + 1 : 1;
    reservaciones.unshift({
      id:        newId,
      nombre:    data.nombre,
      telefono:  data.telefono,
      fecha:     data.fecha,
      hora:      data.hora,
      personas:  data.personas,
      ocasion:   data.ocasion,
      notas:     data.notas,
      estado:    'Pendiente',
      timestamp: data.timestamp,
    });
    guardarReservaciones();
  };

});
