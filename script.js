/* =====================================================
   CONFIGURACIÓN
===================================================== */

const FECHA_BODA = new Date("2026-10-09T15:00:00-05:00");

/*
 * Coloca aquí la URL de tu Google Apps Script
 * cuando quieras guardar las confirmaciones.
 */
const GOOGLE_SCRIPT_URL = "";


/* =====================================================
   CONTADOR
===================================================== */

function actualizarContador() {

    const ahora = new Date();
    const diferencia = FECHA_BODA - ahora;

    const dias = document.getElementById("dias");
    const horas = document.getElementById("horas");
    const minutos = document.getElementById("minutos");
    const segundos = document.getElementById("segundos");

    if (!dias || !horas || !minutos || !segundos) {
        return;
    }

    if (diferencia <= 0) {

        dias.textContent = "00";
        horas.textContent = "00";
        minutos.textContent = "00";
        segundos.textContent = "00";

        return;
    }

    const totalSegundos = Math.floor(diferencia / 1000);

    const d = Math.floor(totalSegundos / 86400);

    const h = Math.floor(
        (totalSegundos % 86400) / 3600
    );

    const m = Math.floor(
        (totalSegundos % 3600) / 60
    );

    const s = totalSegundos % 60;

    dias.textContent =
        String(d).padStart(2, "0");

    horas.textContent =
        String(h).padStart(2, "0");

    minutos.textContent =
        String(m).padStart(2, "0");

    segundos.textContent =
        String(s).padStart(2, "0");
}

actualizarContador();

setInterval(
    actualizarContador,
    1000
);


/* =====================================================
   GALERÍA
===================================================== */

const fotos = Array.from(
    document.querySelectorAll(".galeria-fotos img")
);

const btnAnterior =
    document.getElementById(
        "galeriaAnterior"
    );

const btnSiguiente =
    document.getElementById(
        "galeriaSiguiente"
    );

let indiceGaleria = 0;


function actualizarGaleria() {

    if (!fotos.length) {
        return;
    }

    /*
     * En escritorio se muestran todas las fotos.
     * En móvil se muestran dos fotografías.
     */

    if (window.innerWidth > 900) {

        fotos.forEach(foto => {
            foto.style.display = "block";
        });

        return;
    }

    fotos.forEach(
        (foto, indice) => {

            const mostrar =
                indice === indiceGaleria ||
                indice ===
                    (indiceGaleria + 1) %
                    fotos.length;

            foto.style.display =
                mostrar
                    ? "block"
                    : "none";
        }
    );
}


function siguienteFoto() {

    if (!fotos.length) {
        return;
    }

    indiceGaleria =
        (indiceGaleria + 1) %
        fotos.length;

    actualizarGaleria();
}


function anteriorFoto() {

    if (!fotos.length) {
        return;
    }

    indiceGaleria =
        (indiceGaleria - 1 + fotos.length) %
        fotos.length;

    actualizarGaleria();
}


if (btnSiguiente) {

    btnSiguiente.addEventListener(
        "click",
        siguienteFoto
    );
}


if (btnAnterior) {

    btnAnterior.addEventListener(
        "click",
        anteriorFoto
    );
}


window.addEventListener(
    "resize",
    actualizarGaleria
);

actualizarGaleria();


/* =====================================================
   LIGHTBOX
===================================================== */

const lightbox =
    document.getElementById(
        "lightbox"
    );

const imagenGrande =
    document.getElementById(
        "imagenGrande"
    );

const cerrarLightbox =
    document.getElementById(
        "cerrarLightbox"
    );


fotos.forEach(
    foto => {

        foto.addEventListener(
            "click",
            () => {

                if (
                    !lightbox ||
                    !imagenGrande
                ) {
                    return;
                }

                imagenGrande.src =
                    foto.src;

                imagenGrande.alt =
                    foto.alt;

                lightbox.classList.add(
                    "activo"
                );

                lightbox.setAttribute(
                    "aria-hidden",
                    "false"
                );

                document.body.classList.add(
                    "no-scroll"
                );
            }
        );
    }
);


function cerrarGaleria() {

    if (!lightbox) {
        return;
    }

    lightbox.classList.remove(
        "activo"
    );

    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "no-scroll"
    );
}


if (cerrarLightbox) {

    cerrarLightbox.addEventListener(
        "click",
        cerrarGaleria
    );
}


if (lightbox) {

    lightbox.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                lightbox
            ) {
                cerrarGaleria();
            }

        }
    );
}


/* =====================================================
   CONFIRMACIÓN
===================================================== */

const btnAsistire =
    document.getElementById(
        "btnAsistire"
    );

const btnZoom =
    document.getElementById(
        "btnZoom"
    );

const btnNoAsistire =
    document.getElementById(
        "btnNoAsistire"
    );


/* =====================================================
   MODAL PRESENCIAL
===================================================== */

const modalAsistencia =
    document.getElementById(
        "modalAsistencia"
    );

const cerrarModal =
    document.getElementById(
        "cerrarModal"
    );

const restarPersona =
    document.getElementById(
        "restarPersona"
    );

const sumarPersona =
    document.getElementById(
        "sumarPersona"
    );

const cantidadPersonas =
    document.getElementById(
        "cantidadPersonas"
    );

const textoPersonas =
    document.getElementById(
        "textoPersonas"
    );

const confirmarPresencial =
    document.getElementById(
        "confirmarPresencial"
    );

let cantidad = 1;


function actualizarCantidad() {

    if (
        !cantidadPersonas ||
        !textoPersonas
    ) {
        return;
    }

    cantidadPersonas.textContent =
        cantidad;

    textoPersonas.textContent =
        cantidad === 1
            ? "persona"
            : "personas";
}


function abrirModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.add(
        "activo"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "no-scroll"
    );
}


function cerrarModalGenerico(modal) {

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "activo"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "no-scroll"
    );
}


if (btnAsistire) {

    btnAsistire.addEventListener(
        "click",
        () => {

            cantidad = 1;

            actualizarCantidad();

            abrirModal(
                modalAsistencia
            );
        }
    );
}


if (restarPersona) {

    restarPersona.addEventListener(
        "click",
        () => {

            if (cantidad > 1) {

                cantidad--;

                actualizarCantidad();
            }
        }
    );
}


if (sumarPersona) {

    sumarPersona.addEventListener(
        "click",
        () => {

            /*
             * Máximo de 10 personas por respuesta.
             */

            if (cantidad < 10) {

                cantidad++;

                actualizarCantidad();
            }
        }
    );
}


if (cerrarModal) {

    cerrarModal.addEventListener(
        "click",
        () => {

            cerrarModalGenerico(
                modalAsistencia
            );
        }
    );
}


/* =====================================================
   MODAL ZOOM
===================================================== */

const modalZoom =
    document.getElementById(
        "modalZoom"
    );

const cerrarZoom =
    document.getElementById(
        "cerrarZoom"
    );

const cancelarZoom =
    document.getElementById(
        "cancelarZoom"
    );

const confirmarZoom =
    document.getElementById(
        "confirmarZoom"
    );


if (btnZoom) {

    btnZoom.addEventListener(
        "click",
        () => {

            abrirModal(
                modalZoom
            );
        }
    );
}


if (cerrarZoom) {

    cerrarZoom.addEventListener(
        "click",
        () => {

            cerrarModalGenerico(
                modalZoom
            );
        }
    );
}


if (cancelarZoom) {

    cancelarZoom.addEventListener(
        "click",
        () => {

            cerrarModalGenerico(
                modalZoom
            );
        }
    );
}


/* =====================================================
   MODAL NO ASISTIR
===================================================== */

const modalNoAsistire =
    document.getElementById(
        "modalNoAsistire"
    );

const cerrarNoAsistire =
    document.getElementById(
        "cerrarNoAsistire"
    );

const cancelarNoAsistire =
    document.getElementById(
        "cancelarNoAsistire"
    );

const confirmarNoAsistire =
    document.getElementById(
        "confirmarNoAsistire"
    );


if (btnNoAsistire) {

    btnNoAsistire.addEventListener(
        "click",
        () => {

            abrirModal(
                modalNoAsistire
            );
        }
    );
}


if (cerrarNoAsistire) {

    cerrarNoAsistire.addEventListener(
        "click",
        () => {

            cerrarModalGenerico(
                modalNoAsistire
            );
        }
    );
}


if (cancelarNoAsistire) {

    cancelarNoAsistire.addEventListener(
        "click",
        () => {

            cerrarModalGenerico(
                modalNoAsistire
            );
        }
    );
}


/* =====================================================
   MODAL DE ÉXITO
===================================================== */

const mensajeExito =
    document.getElementById(
        "mensajeExito"
    );

const textoExito =
    document.getElementById(
        "textoExito"
    );

const volverConfirmacion =
    document.getElementById(
        "volverConfirmacion"
    );


function mostrarExito(mensaje) {

    if (textoExito) {

        textoExito.textContent =
            mensaje;
    }

    cerrarModalGenerico(
        modalAsistencia
    );

    cerrarModalGenerico(
        modalZoom
    );

    cerrarModalGenerico(
        modalNoAsistire
    );

    abrirModal(
        mensajeExito
    );
}


if (volverConfirmacion) {

    volverConfirmacion.addEventListener(
        "click",
        () => {

            cerrarModalGenerico(
                mensajeExito
            );
        }
    );
}


/* =====================================================
   ENVÍO DE CONFIRMACIÓN
===================================================== */

async function enviarConfirmacion(
    tipo,
    personas = 0
) {

    /*
     * Si todavía no se ha configurado
     * Google Apps Script, la respuesta
     * se muestra igualmente en pantalla.
     */

    if (!GOOGLE_SCRIPT_URL) {

        if (tipo === "presencial") {

            mostrarExito(
                `Hemos registrado tu confirmación para asistir presencialmente con ${personas} ${
                    personas === 1
                        ? "persona"
                        : "personas"
                }. ¡Nos alegra mucho contar contigo!`
            );

        } else if (tipo === "zoom") {

            mostrarExito(
                "Hemos registrado que nos acompañarás por Zoom. ¡Muchas gracias por estar con nosotros!"
            );

        } else {

            mostrarExito(
                "Hemos registrado tu respuesta. Muchas gracias por avisarnos y por ser parte de este momento."
            );
        }

        return;
    }


    const datos = {
        tipo: tipo,
        personas: personas,
        fecha: new Date().toISOString()
    };


    try {

        await fetch(
            GOOGLE_SCRIPT_URL,
            {
                method: "POST",

                mode: "no-cors",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body: JSON.stringify(
                    datos
                )
            }
        );


        if (tipo === "presencial") {

            mostrarExito(
                `¡Gracias! Hemos registrado tu asistencia presencial con ${personas} ${
                    personas === 1
                        ? "persona"
                        : "personas"
                }.`
            );

        } else if (tipo === "zoom") {

            mostrarExito(
                "¡Gracias! Hemos registrado tu asistencia por Zoom."
            );

        } else {

            mostrarExito(
                "Hemos registrado tu respuesta. Muchas gracias por avisarnos."
            );
        }

    } catch (error) {

        console.error(
            "Error al enviar confirmación:",
            error
        );

        mostrarExito(
            "Tu respuesta ha sido recibida. Muchas gracias por avisarnos."
        );
    }
}


/* =====================================================
   BOTONES DE CONFIRMACIÓN
===================================================== */

if (confirmarPresencial) {

    confirmarPresencial.addEventListener(
        "click",
        () => {

            enviarConfirmacion(
                "presencial",
                cantidad
            );
        }
    );
}


if (confirmarZoom) {

    confirmarZoom.addEventListener(
        "click",
        () => {

            enviarConfirmacion(
                "zoom"
            );
        }
    );
}


if (confirmarNoAsistire) {

    confirmarNoAsistire.addEventListener(
        "click",
        () => {

            enviarConfirmacion(
                "no_asistire"
            );
        }
    );
}


/* =====================================================
   CERRAR MODALES CON ESC
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }

        cerrarGaleria();

        cerrarModalGenerico(
            modalAsistencia
        );

        cerrarModalGenerico(
            modalZoom
        );

        cerrarModalGenerico(
            modalNoAsistire
        );

        cerrarModalGenerico(
            mensajeExito
        );
    }
);


/* =====================================================
   GUARDAR LA FECHA
===================================================== */

const btnMostrarCalendario =
    document.getElementById(
        "btnMostrarCalendario"
    );

const opcionesCalendario =
    document.getElementById(
        "opcionesCalendario"
    );


if (btnMostrarCalendario) {

    btnMostrarCalendario.addEventListener(
        "click",
        () => {

            if (!opcionesCalendario) {
                return;
            }

            opcionesCalendario.classList.toggle(
                "visible"
            );
        }
    );
}


/* =====================================================
   COPIAR YAPE
===================================================== */

const copiarYape =
    document.getElementById(
        "copiarYape"
    );

const numeroYape =
    document.getElementById(
        "numeroYape"
    );

const mensajeCopiado =
    document.getElementById(
        "mensajeCopiado"
    );


if (copiarYape) {

    copiarYape.addEventListener(
        "click",
        async () => {

            if (!numeroYape) {
                return;
            }

            /*
             * Solo se copia el número.
             */

            const numero =
                "+51 992 418 572";

            try {

                await navigator.clipboard.writeText(
                    numero
                );

                if (mensajeCopiado) {

                    mensajeCopiado.classList.add(
                        "visible"
                    );

                    setTimeout(
                        () => {

                            mensajeCopiado.classList.remove(
                                "visible"
                            );

                        },
                        2500
                    );
                }

            } catch (error) {

                console.error(
                    "No se pudo copiar:",
                    error
                );
            }
        }
    );
}


/* =====================================================
   MÚSICA
===================================================== */

const musica =
    document.getElementById(
        "musicaBoda"
    );

const botonMusica =
    document.getElementById(
        "botonMusica"
    );

let musicaReproduciendo = false;


if (botonMusica && musica) {

    botonMusica.addEventListener(
        "click",
        async () => {

            try {

                if (musicaReproduciendo) {

                    musica.pause();

                    musicaReproduciendo =
                        false;

                    botonMusica.classList.remove(
                        "reproduciendo"
                    );

                    botonMusica.setAttribute(
                        "aria-label",
                        "Reproducir música"
                    );

                } else {

                    await musica.play();

                    musicaReproduciendo =
                        true;

                    botonMusica.classList.add(
                        "reproduciendo"
                    );

                    botonMusica.setAttribute(
                        "aria-label",
                        "Pausar música"
                    );
                }

            } catch (error) {

                console.error(
                    "No se pudo reproducir la música:",
                    error
                );
            }
        }
    );
}


/* =====================================================
   ANIMACIÓN SUAVE AL ENTRAR EN PANTALLA
===================================================== */

const elementosAnimados =
    document.querySelectorAll(
        ".evento-card, .regalo, .rsvp-card"
    );


if ("IntersectionObserver" in window) {

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.style.opacity =
                                "1";

                            entry.target.style.transform =
                                "translateY(0)";

                            observer.unobserve(
                                entry.target
                            );
                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    elementosAnimados.forEach(
        elemento => {

            elemento.style.opacity =
                "0";

            elemento.style.transform =
                "translateY(18px)";

            elemento.style.transition =
                "opacity .7s ease, transform .7s ease";

            observer.observe(
                elemento
            );
        }
    );
}


/* =====================================================
   FINAL
===================================================== */

console.log(
    "Invitación Omar & Wendy cargada correctamente."
);
