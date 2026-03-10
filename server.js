// ════════════════════════════════════════════════════════════
//  TORO SENTAO — API Placeholder (Node.js / Express)
//  
//  Este archivo es la base para cuando quieras agregar un
//  backend real. Por ahora el sitio funciona solo con
//  archivos estáticos (sin servidor).
//
//  Para activarlo en el futuro:
//  1. Instala Node.js en el servidor
//  2. Ejecuta: npm install
//  3. Ejecuta: node api/server.js
// ════════════════════════════════════════════════════════════

// ─── Dependencias (instalar con: npm install express cors) ───
// const express = require('express');
// const cors    = require('cors');
// const app     = express();
// const PORT    = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());
// app.use(express.static('../'));  // Sirve los archivos HTML/CSS/JS


// ════════════════════════════════════════════════════════════
//  ENDPOINTS FUTUROS
// ════════════════════════════════════════════════════════════

/*
  ── GET /api/menu ──────────────────────────────────────────
  Retorna todos los platos del menú desde la base de datos.

  app.get('/api/menu', async (req, res) => {
    try {
      const menu = await db.query('SELECT * FROM menu WHERE disponible = true ORDER BY categoria');
      res.json({ ok: true, data: menu });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });


  ── POST /api/reservaciones ────────────────────────────────
  Recibe una solicitud de reservación y la guarda.

  app.post('/api/reservaciones', async (req, res) => {
    const { nombre, telefono, fecha, hora, personas, nota } = req.body;

    // Validaciones básicas
    if (!nombre || !telefono || !fecha || !personas) {
      return res.status(400).json({ ok: false, error: 'Campos obligatorios faltantes' });
    }

    try {
      const result = await db.query(
        'INSERT INTO reservaciones (nombre, telefono, fecha, hora, personas, nota) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, telefono, fecha, hora, personas, nota]
      );

      // Enviar notificación por WhatsApp al restaurante
      await notificarWhatsApp(nombre, fecha, hora, personas);

      res.json({ ok: true, id: result.insertId, mensaje: 'Reservación guardada exitosamente' });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });


  ── POST /api/contacto ─────────────────────────────────────
  Formulario de contacto general.

  app.post('/api/contacto', async (req, res) => {
    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ ok: false, error: 'Todos los campos son requeridos' });
    }

    try {
      // Guardar en BD y/o enviar email
      await db.query(
        'INSERT INTO contactos (nombre, email, mensaje, fecha) VALUES (?, ?, ?, NOW())',
        [nombre, email, mensaje]
      );
      res.json({ ok: true, mensaje: 'Mensaje recibido. Te contactaremos pronto.' });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });


  ── GET /api/testimonios ───────────────────────────────────
  Retorna testimonios aprobados.

  app.get('/api/testimonios', async (req, res) => {
    const testimonios = await db.query(
      'SELECT * FROM testimonios WHERE aprobado = true ORDER BY fecha DESC LIMIT 10'
    );
    res.json({ ok: true, data: testimonios });
  });


  ── Iniciar servidor ───────────────────────────────────────
  app.listen(PORT, () => {
    console.log(`🐂 Toro Sentao API corriendo en http://localhost:${PORT}`);
  });
*/


// ════════════════════════════════════════════════════════════
//  ESTRUCTURA DE BASE DE DATOS (MySQL / MariaDB)
//  Ejecuta este SQL en tu servidor de base de datos
// ════════════════════════════════════════════════════════════

/*
  Archivo: api/schema.sql
  Ejecutar con: mysql -u root -p toro_sentao < api/schema.sql

  CREATE DATABASE IF NOT EXISTS toro_sentao;
  USE toro_sentao;

  -- Tabla de menú
  CREATE TABLE menu (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    categoria   ENUM('carnes','acomps','bebidas') NOT NULL,
    emoji       VARCHAR(10),
    nombre      VARCHAR(120) NOT NULL,
    descripcion TEXT,
    precio      DECIMAL(6,2),
    etiqueta    VARCHAR(50),
    badge       VARCHAR(50),
    disponible  BOOLEAN DEFAULT TRUE,
    orden       INT DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabla de reservaciones
  CREATE TABLE reservaciones (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    telefono    VARCHAR(20) NOT NULL,
    fecha       DATE NOT NULL,
    hora        TIME NOT NULL,
    personas    TINYINT NOT NULL,
    nota        TEXT,
    estado      ENUM('pendiente','confirmada','cancelada') DEFAULT 'pendiente',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabla de testimonios
  CREATE TABLE testimonios (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    texto       TEXT NOT NULL,
    autor       VARCHAR(80) NOT NULL,
    lugar       VARCHAR(80),
    estrellas   TINYINT DEFAULT 5,
    aprobado    BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabla de contactos
  CREATE TABLE contactos (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    email       VARCHAR(150),
    mensaje     TEXT NOT NULL,
    leido       BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
*/

console.log('Toro Sentao API — Listo para integración futura.');
