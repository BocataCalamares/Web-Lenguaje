function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
}

// Función para cargar y mostrar las noticias
async function cargarNoticias() {
    const contenedorNoticias = document.getElementById('contenedor-noticias');

    // Mostrar mensaje de carga
    contenedorNoticias.innerHTML = '<p>Cargando noticias...</p>';

    try {
        // Carga asíncrona con fetch
        const respuesta = await fetch('noticias.json');

        // Verificar si la respuesta fue exitosa
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        const noticias = datos.noticias;

        // Limpiar contenedor
        contenedorNoticias.innerHTML = '';

        // Generar HTML para cada noticia usando template literals
        noticias.forEach(noticia => {
            const article = document.createElement('article');
            article.className = 'noticia';
            article.dataset.id = noticia.id;
            article.dataset.importante = noticia.importante;

            // Uso de template literals para construir el HTML
            article.innerHTML = `
                <header>
                    <h3>${noticia.titulo}</h3>
                    <span class="fecha">${formatearFecha(noticia.fecha)}</span>
                    <span class="categoria">${noticia.categoria}</span>
                </header>
                <div class="contenido-noticia">
                    <p>${noticia.contenido}</p>
                </div>
                <footer>
                    <span class="leer-mas">Leer más →</span>
                </footer>
            `;

            contenedorNoticias.appendChild(article);
        });

        // Aplicar clase destacada si el botón está activo
        const btnDestacar = document.getElementById('btn-destacar');
        if (btnDestacar && btnDestacar.classList.contains('activo')) {
            destacarNoticiasImportantes();
        }

    } catch (error) {
        console.error('Error al cargar las noticias:', error);
        contenedorNoticias.innerHTML = `
            <p class="error">Error al cargar las noticias. Por favor, recarga la página.</p>
            <p class="error-detalle">${error.message}</p>
        `;
    }
}

// Función para destacar noticias importantes
function destacarNoticiasImportantes() {
    const noticias = document.querySelectorAll('.noticia');
    const btnDestacar = document.getElementById('btn-destacar');

    noticias.forEach(noticia => {
        const esImportante = noticia.dataset.importante === 'true';

        if (esImportante) {
            // classList.toggle para añadir/quitar la clase
            noticia.classList.toggle('noticia-destacada');
        }
    });

    // Cambiar texto del botón según estado
    if (btnDestacar) {
        const hayDestacadas = document.querySelectorAll('.noticia-destacada').length > 0;
        if (hayDestacadas) {
            btnDestacar.textContent = 'Quitar destacadas';
            btnDestacar.classList.add('activo');
        } else {
            btnDestacar.textContent = 'Destacar noticias importantes';
            btnDestacar.classList.remove('activo');
        }
    }
}

// Configurar evento cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Cargar noticias
    cargarNoticias();

    // Configurar botón destacar
    const btnDestacar = document.getElementById('btn-destacar');
    if (btnDestacar) {
        btnDestacar.addEventListener('click', destacarNoticiasImportantes);
    }
});