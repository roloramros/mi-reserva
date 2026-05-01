# MiReserva Frontend Standards

Este documento explica cómo mantener y extender el sistema de diseño de MiReserva.

## 🎨 Sistema de Diseño
El proyecto utiliza una paleta de colores basada en **Verde Esmeralda** para representar la identidad del fútbol.

- **Primario:** `emerald-600` (#059669) - Botones principales, acentos activos.
- **Fondo:** `slate-50` (#f8fafc) - Para una interfaz limpia.
- **Texto:** `slate-900` (#0f172a) - Para máxima legibilidad.
- **Tarjetas:** Bordes `slate-100` y sombras `shadow-card`.

## 🏗️ Arquitectura de Componentes
Hemos eliminado la duplicación de código usando un script centralizado:

1.  **Header y Footer:** No edites el HTML de las páginas para cambiar el menú. Edita `public/scripts/ui-components.js`.
2.  **Configuración Tailwind:** Los colores de marca y sombras están en `public/scripts/tailwind-config.js`.
3.  **Tokens CSS:** Las variables globales están en `public/styles/theme.css`.

## 🚀 Cómo crear una nueva página
Para que una nueva página mantenga el diseño estandarizado:

1.  **Estructura Base:**
    ```html
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="scripts/tailwind-config.js"></script>
        <link rel="stylesheet" href="styles/theme.css">
    </head>
    <body class="bg-slate-50">
        <div id="header-placeholder"></div>
        <main class="max-w-7xl mx-auto px-4 py-8">
            <!-- Tu contenido aquí -->
        </main>
        <div id="footer-placeholder"></div>
        <script src="scripts/ui-components.js"></script>
    </body>
    </html>
    ```
2.  **Navegación:** Si quieres que el link se resalte como activo, asegúrate de que el nombre del archivo coincida con el atributo `data-page` en `ui-components.js`.

## 🛠️ Herramientas compartidas
- **Iconos:** FontAwesome 6.4.0 (incluido globalmente).
- **Modales/Alertas:** SweetAlert2 (usado para confirmaciones de reservas).
- **Fuentes:** Inter (definida en el theme.css).
