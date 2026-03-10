# 🐂 Toro Sentao — Sitio Web Oficial

**Restaurante de carnes a la leña · Cuesta de Piedra, Chiriquí, Panamá**

---

## ✅ Qué incluye este proyecto

```
toro-sentao/
├── index.html          ← Página principal (todo el contenido)
├── netlify.toml        ← Configuración para Netlify (hosting)
├── css/
│   └── style.css       ← Todos los estilos visuales
├── js/
│   ├── data.js         ← ⭐ EDITA ESTO para cambiar menú y precios
│   └── main.js         ← Código de interactividad (no tocar)
├── api/
│   └── server.js       ← Base para backend futuro (Node.js)
├── images/
│   └── favicon.svg     ← Ícono del sitio (pestaña del navegador)
└── README.md           ← Este archivo
```

---

## 🚀 Cómo subir el sitio (Netlify — GRATIS)

### Opción A: Arrastrar y soltar (la más fácil)

1. Ve a **https://netlify.com** y crea una cuenta gratuita.
2. En el dashboard, busca la sección **"Deploy manually"**.
3. Arrastra la carpeta `toro-sentao` completa al área indicada.
4. ¡Listo! El sitio estará en línea en segundos.

### Opción B: Con GitHub (recomendado para actualizaciones)

1. Sube la carpeta `toro-sentao` a un repositorio en **https://github.com**.
2. En Netlify → **"New site from Git"** → conecta tu repositorio.
3. Cada vez que edites archivos en GitHub, el sitio se actualiza automáticamente.

---

## ✏️ Cómo actualizar el contenido

### Cambiar el número de WhatsApp
Abre `js/data.js` y busca:
```javascript
whatsapp: "50760000000",  // ← Pon el número real aquí
```
> ⚠️ El número debe ir sin espacios ni guiones: `507XXXXXXXX`

### Agregar o cambiar platos del menú
En `js/data.js`, dentro del array `menu: [...]`, cada plato es un bloque como este:
```javascript
{
  id: 13,                        // Número único
  categoria: "carnes",           // carnes | acomps | bebidas
  emoji: "🥩",                   // Emoji decorativo
  nombre: "Nombre del plato",
  descripcion: "Descripción...",
  precio: "12.00",               // O "Consultar" si varía
  etiqueta: "Especial",          // Texto del badge superior
  badge: "Nuevo",                // Texto del badge inferior
  disponible: true,              // false = oculta el plato
},
```

### Agregar una foto real del restaurante
Reemplaza el placeholder del Hero Section:
1. Pon tu foto en la carpeta `images/` (ejemplo: `images/restaurante.jpg`).
2. En `index.html`, busca la sección `.hero-bg` y agrega como fondo:
   ```css
   background-image: url('images/restaurante.jpg');
   ```
3. En `css/style.css`, ajusta `.hero-bg` para que la foto se vea bien.

### Cambiar redes sociales
En `js/data.js`:
```javascript
instagram: "https://instagram.com/TU_USUARIO",
facebook:  "https://facebook.com/TU_PAGINA",
```

### Actualizar el horario
En `index.html`, busca la sección `footer-horario-detalle` y edita las horas directamente.

---

## 🌐 Dominio propio (opcional)

Si el restaurante quiere su propia dirección web (ej: `www.torosentao.com`):

1. Compra el dominio en **Namecheap** (~$12/año) o **GoDaddy**.
2. En Netlify → **Site settings** → **Domain management** → **Add custom domain**.
3. Sigue las instrucciones para apuntar el DNS de Namecheap a Netlify.
4. Netlify agrega HTTPS (candado de seguridad) automáticamente y gratis.

---

## 📱 Compatibilidad

- ✅ Celular Android y iPhone
- ✅ Tablet
- ✅ Computadora (Windows, Mac, Linux)
- ✅ Chrome, Firefox, Safari, Edge

---

## 🔧 Funcionalidades incluidas

| Función | Estado |
|---------|--------|
| Diseño responsive (móvil/desktop) | ✅ Incluido |
| Animación de partículas (brasas) | ✅ Incluido |
| Menú filtrable por categoría | ✅ Incluido |
| Slider de testimonios | ✅ Incluido |
| Botón flotante de WhatsApp | ✅ Incluido |
| Mapa de Google Maps integrado | ✅ Incluido |
| Efecto parallax en el hero | ✅ Incluido |
| Animaciones al hacer scroll | ✅ Incluido |
| HTTPS y seguridad (vía Netlify) | ✅ Incluido |
| SEO básico (metaetiquetas) | ✅ Incluido |
| Base de datos (formulario reservas) | 🔜 Próxima fase |

---

## 📞 Soporte

¿Dudas con el sitio? Contacta al desarrollador.

---

*Diseñado con ❤️ para Chiriquí · © 2025 Toro Sentao*
