# Creative Department

Portfolio de una sola página de Luis E. Ortiz. Sitio estático: HTML, CSS y JavaScript sin build ni dependencias externas.

## Estructura

    index.html            La página
    css/main.css          Estilos
    js/main.js            Animaciones, idioma, reproductor
    js/works.js           La lista de videos (aquí se añaden, quitan o reordenan)
    js/scene3d.js         El objeto 3D de la sección de servicios
    js/vendor/            three.js
    assets/img/           Logo, retrato y favicon
    assets/fonts/         Archivo (variable)
    assets/video/         Videos en 720p, un mp4 por id
    assets/posters/       Un jpg por id

## Añadir un video

1. Exporta el mp4 (720p, H.264) a `assets/video/<id>.mp4` y un frame a `assets/posters/<id>.jpg`.
2. Añade una entrada con ese `id` en `js/works.js`.

## Mover a otro hosting

Todas las rutas son relativas. Copia la carpeta completa a cualquier hosting estático (Netlify, Vercel, cPanel, S3) y funciona igual. Para un dominio propio en GitHub Pages, añade un archivo `CNAME` con el dominio.
