"use strict";

/* =====================================================
   INVITACIÓN DE BODA — OMAR & WENDY
   JavaScript principal
===================================================== */


/* =====================================================
   CONFIGURACIÓN
===================================================== */

const CONFIG = {

    fechaBoda:
        new Date("2026-10-09T15:00:00-05:00"),

    googleScriptUrl: "",

    maxPersonas: 10,

    numeroYape:
        "+51 992 418 572",

    zoomId:
        "740 351 363",

    zoomClave:
        "323256"

};


/* =====================================================
   UTILIDADES
===================================================== */

const $ = id =>
    document.getElementById(id);


const $$ = selector =>
    Array.from(
        document.querySelectorAll(selector)
    );


function on(
    element,
    event,
    callback,
    options
) {

    if (element) {

        element.addEventListener(
            event,
            callback,
            options
        );

    }

}


function setText(
    element,
    value
) {

    if (element) {

        element.textContent =
            value;

    }

}


function toggleClass(
    element,
    className,
    force
) {

    if (element) {

        element.classList.toggle(
            className,
            force
        );

    }

}


/* =====================================================
   CONTADOR
===================================================== */

const contador = {
    dias: $("dias"),
    horas: $("horas"),
    minutos: $("minutos"),
    segundos: $("segundos")
};


/*
   FECHA DE LA BODA

   9 de octubre de 2026
   3:00 p. m.
   
   Se crea con números para evitar problemas
   de interpretación de fecha entre navegadores.
*/
const fechaBoda = new Date(
    2026,
    9,       // Octubre (0 = enero)
    9,       // Día
    15,      // 3:00 p. m.
    0,
    0
);


function actualizarContador() {

    const ahora = new Date();

    const diferencia =
        fechaBoda.getTime() -
        ahora.getTime();


    /* ================================================
       CUANDO LLEGUE EL DÍA DE LA BODA
    ================================================ */

    if (diferencia <= 0) {

        setText(contador.dias, "00");
        setText(contador.horas, "00");
        setText(contador.minutos, "00");
        setText(contador.segundos, "00");

        return;
    }


    /* ================================================
       CÁLCULO DEL TIEMPO RESTANTE
    ================================================ */

    const totalSegundos =
        Math.floor(diferencia / 1000);


    const dias =
        Math.floor(
            totalSegundos / 86400
        );


    const horas =
        Math.floor(
            (totalSegundos % 86400) / 3600
        );


    const minutos =
        Math.floor(
            (totalSegundos % 3600) / 60
        );


    const segundos =
        totalSegundos % 60;


    /* ================================================
       MOSTRAR RESULTADOS
    ================================================ */

    setText(
        contador.dias,
        String(dias).padStart(2, "0")
    );


    setText(
        contador.horas,
        String(horas).padStart(2, "0")
    );


    setText(
        contador.minutos,
        String(minutos).padStart(2, "0")
    );


    setText(
        contador.segundos,
        String(segundos).padStart(2, "0")
    );
}


/* =====================================================
   INICIAR CONTADOR
===================================================== */

actualizarContador();

setInterval(
    actualizarContador,
    1000
);


/* =====================================================
   GALERÍA
===================================================== */

const fotos =
    $$(".galeria-fotos img");


const galeriaAnterior =
    $("galeriaAnterior");


const galeriaSiguiente =
    $("galeriaSiguiente");


let indiceGaleria = 0;


function obtenerFotosVisibles() {

    return window.innerWidth > 900
        ? fotos.length
        : 2;

}


function actualizarGaleria() {

    if (!fotos.length) {

        return;
    }


    const visibles =
        obtenerFotosVisibles();


    if (visibles === fotos.length) {

        fotos.forEach(
            foto => {

                foto.style.display =
                    "block";

            }
        );

        return;
    }


    fotos.forEach(
        (
            foto,
            indice
        ) => {

            const posicion =
                (
                    indice -
                    indiceGaleria +
                    fotos.length
                ) %
                fotos.length;


            foto.style.display =
                posicion < visibles
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
        (
            indiceGaleria + 1
        ) %
        fotos.length;


    actualizarGaleria();

}


function anteriorFoto() {

    if (!fotos.length) {

        return;
    }


    indiceGaleria =
        (
            indiceGaleria -
            1 +
            fotos.length
        ) %
        fotos.length;


    actualizarGaleria();

}


on(
    galeriaSiguiente,
    "click",
    siguienteFoto
);


on(
    galeriaAnterior,
    "click",
    anteriorFoto
);


on(
    window,
    "resize",
    actualizarGaleria
);


actualizarGaleria();


/* =====================================================
   LIGHTBOX
===================================================== */

const lightbox =
    $("lightbox");


const imagenGrande =
    $("imagenGrande");


const cerrarLightbox =
    $("cerrarLightbox");


function abrirLightbox(foto) {

    if (
        !lightbox ||
        !imagenGrande ||
        !foto
    ) {

        return;
    }


    imagenGrande.src =
        foto.currentSrc ||
        foto.src;


    imagenGrande.alt =
        foto.alt ||
        "Fotografía de Omar y Wendy";


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


    if (imagenGrande) {

        imagenGrande.removeAttribute(
            "src"
        );

    }

}


fotos.forEach(
    foto => {

        on(
            foto,
            "click",
            () =>
                abrirLightbox(foto)
        );

    }
);


on(
    cerrarLightbox,
    "click",
    cerrarGaleria
);


on(
    lightbox,
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


/* =====================================================
   MODALES
===================================================== */

const modales = {

    asistencia:
        $("modalAsistencia"),

    zoom:
        $("modalZoom"),

    noAsistire:
        $("modalNoAsistire"),

    exito:
        $("mensajeExito")

};


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


    const primerElemento =
        modal.querySelector(
            "button, a, input, textarea, select"
        );


    if (primerElemento) {

        setTimeout(
            () =>
                primerElemento.focus(),
            50
        );

    }

}


function cerrarModal(modal) {

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


function cerrarTodosLosModales() {

    Object.values(modales)
        .forEach(
            modal =>
                cerrarModal(modal)
        );

}


Object.values(modales)
    .forEach(
        modal => {

            on(
                modal,
                "click",
                event => {

                    if (
                        event.target ===
                        modal
                    ) {

                        cerrarModal(
                            modal
                        );

                    }

                }
            );

        }
    );


/* =====================================================
   CONFIRMACIÓN
===================================================== */

const btnAsistire =
    $("btnAsistire");


const btnZoom =
    $("btnZoom");


const btnNoAsistire =
    $("btnNoAsistire");


const cerrarModalAsistencia =
    $("cerrarModal");


const cerrarModalZoom =
    $("cerrarZoom");


const cancelarZoom =
    $("cancelarZoom");


const cerrarModalNoAsistire =
    $("cerrarNoAsistire");


const cancelarNoAsistire =
    $("cancelarNoAsistire");


const volverConfirmacion =
    $("volverConfirmacion");


/* =====================================================
   CONTROL DE PERSONAS
===================================================== */

const restarPersona =
    $("restarPersona");


const sumarPersona =
    $("sumarPersona");


const cantidadPersonas =
    $("cantidadPersonas");


const textoPersonas =
    $("textoPersonas");


let cantidad = 1;


function actualizarCantidad() {

    setText(
        cantidadPersonas,
        cantidad
    );


    setText(
        textoPersonas,
        cantidad === 1
            ? "persona"
            : "personas"
    );


    if (restarPersona) {

        restarPersona.disabled =
            cantidad <= 1;

    }


    if (sumarPersona) {

        sumarPersona.disabled =
            cantidad >=
            CONFIG.maxPersonas;

    }

}


function cambiarCantidad(valor) {

    cantidad =
        Math.min(
            CONFIG.maxPersonas,
            Math.max(
                1,
                cantidad + valor
            )
        );


    actualizarCantidad();

}


on(
    btnAsistire,
    "click",
    () => {

        cantidad = 1;

        actualizarCantidad();

        abrirModal(
            modales.asistencia
        );

    }
);


on(
    restarPersona,
    "click",
    () =>
        cambiarCantidad(-1)
);


on(
    sumarPersona,
    "click",
    () =>
        cambiarCantidad(1)
);


on(
    cerrarModalAsistencia,
    "click",
    () =>
        cerrarModal(
            modales.asistencia
        )
);


actualizarCantidad();


/* =====================================================
   MODAL ZOOM
===================================================== */

on(
    btnZoom,
    "click",
    () =>
        abrirModal(
            modales.zoom
        )
);


on(
    cerrarModalZoom,
    "click",
    () =>
        cerrarModal(
            modales.zoom
        )
);


on(
    cancelarZoom,
    "click",
    () =>
        cerrarModal(
            modales.zoom
        )
);


/* =====================================================
   MODAL NO ASISTIR
===================================================== */

on(
    btnNoAsistire,
    "click",
    () =>
        abrirModal(
            modales.noAsistire
        )
);


on(
    cerrarModalNoAsistire,
    "click",
    () =>
        cerrarModal(
            modales.noAsistire
        )
);


on(
    cancelarNoAsistire,
    "click",
    () =>
        cerrarModal(
            modales.noAsistire
        )
);


/* =====================================================
   MENSAJE DE ÉXITO
===================================================== */

const textoExito =
    $("textoExito");


function mostrarExito(mensaje) {

    cerrarTodosLosModales();


    setText(
        textoExito,
        mensaje
    );


    abrirModal(
        modales.exito
    );

}


on(
    volverConfirmacion,
    "click",
    () =>
        cerrarModal(
            modales.exito
        )
);


/* =====================================================
   ENVÍO DE CONFIRMACIÓN
===================================================== */

function obtenerMensajeConfirmacion(
    tipo,
    personas
) {

    switch (tipo) {

        case "presencial":

            return `Hemos registrado tu confirmación para asistir presencialmente con ${personas} ${
                personas === 1
                    ? "persona"
                    : "personas"
            }. ¡Nos alegra mucho contar contigo!`;


        case "zoom":

            return "Hemos registrado que nos acompañarás por Zoom. ¡Muchas gracias por estar con nosotros!";


        default:

            return "Hemos registrado tu respuesta. Muchas gracias por avisarnos y por ser parte de este momento.";

    }

}


async function enviarConfirmacion(
    tipo,
    personas = 0
) {

    const datos = {

        tipo,

        personas,

        fecha:
            new Date().toISOString()

    };


    if (!CONFIG.googleScriptUrl) {

        mostrarExito(
            obtenerMensajeConfirmacion(
                tipo,
                personas
            )
        );

        return;
    }


    try {

        await fetch(
            CONFIG.googleScriptUrl,
            {

                method: "POST",

                mode: "no-cors",

                headers: {

                    "Content-Type":
                        "text/plain;charset=utf-8"

                },

                body:
                    JSON.stringify(
                        datos
                    )

            }
        );


        mostrarExito(
            obtenerMensajeConfirmacion(
                tipo,
                personas
            )
        );


    } catch (error) {

        console.error(
            "Error al enviar la confirmación:",
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

const confirmarPresencial =
    $("confirmarPresencial");


const confirmarZoom =
    $("confirmarZoom");


const confirmarNoAsistire =
    $("confirmarNoAsistire");


on(
    confirmarPresencial,
    "click",
    () =>
        enviarConfirmacion(
            "presencial",
            cantidad
        )
);


on(
    confirmarZoom,
    "click",
    () =>
        enviarConfirmacion(
            "zoom"
        )
);


on(
    confirmarNoAsistire,
    "click",
    () =>
        enviarConfirmacion(
            "no_asistire"
        )
);


/* =====================================================
   COPIAR DATOS DE ZOOM
===================================================== */

const copiarZoom =
    $("copiarZoom");


const zoomCopiado =
    $("zoomCopiado");


function obtenerTextoZoom() {

    return `Videoconferencia — Boda de Omar y Wendy

ID de reunión: ${CONFIG.zoomId}
Clave: ${CONFIG.zoomClave}

Te recomendamos anotar estos datos con anticipación para tenerlos a la mano el día de la boda.

Estos datos son reservados. Por favor, no los compartas con otras personas.`;


async function copiarTexto(
    texto
) {

    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        await navigator.clipboard.writeText(
            texto
        );

        return true;
    }


    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        texto;


    textarea.style.position =
        "fixed";

    textarea.style.opacity =
        "0";


    document.body.appendChild(
        textarea
    );


    textarea.focus();

    textarea.select();


    let resultado = false;


    try {

        resultado =
            document.execCommand(
                "copy"
            );

    } catch (error) {

        resultado = false;

    }


    document.body.removeChild(
        textarea
    );


    return resultado;

}


on(
    copiarZoom,
    "click",
    async () => {

        try {

            const copiado =
                await copiarTexto(
                    obtenerTextoZoom()
                );


            if (copiado) {

                toggleClass(
                    zoomCopiado,
                    "visible",
                    true
                );


                setText(
                    zoomCopiado,
                    "Datos copiados ✓"
                );


                setTimeout(
                    () => {

                        toggleClass(
                            zoomCopiado,
                            "visible",
                            false
                        );

                    },
                    3000
                );

            }

        } catch (error) {

            console.error(
                "No se pudieron copiar los datos de Zoom:",
                error
            );

        }

    }
);


/* =====================================================
   CERRAR CON ESC
===================================================== */

on(
    document,
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {

            return;
        }


        cerrarGaleria();

        cerrarTodosLosModales();

    }
);


/* =====================================================
   NAVEGACIÓN DE GALERÍA CON TECLADO
===================================================== */

on(
    document,
    "keydown",
    event => {

        if (
            !lightbox ||
            !lightbox.classList.contains(
                "activo"
            )
        ) {

            return;
        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            siguienteFoto();

        } else if (
            event.key ===
            "ArrowLeft"
        ) {

            anteriorFoto();

        }

    }
);


/* =====================================================
   GUARDAR LA FECHA
===================================================== */

const btnMostrarCalendario =
    $("btnMostrarCalendario");


const opcionesCalendario =
    $("opcionesCalendario");


on(
    btnMostrarCalendario,
    "click",
    () => {

        if (!opcionesCalendario) {

            return;
        }


        const visible =
            opcionesCalendario.classList.toggle(
                "visible"
            );


        btnMostrarCalendario.setAttribute(
            "aria-expanded",
            String(visible)
        );

    }
);


/* =====================================================
   COPIAR YAPE
===================================================== */

const copiarYape =
    $("copiarYape");


const numeroYape =
    $("numeroYape");


const mensajeCopiado =
    $("mensajeCopiado");


on(
    copiarYape,
    "click",
    async () => {

        if (!numeroYape) {

            return;
        }


        try {

            const copiado =
                await copiarTexto(
                    CONFIG.numeroYape
                );


            if (copiado) {

                toggleClass(
                    mensajeCopiado,
                    "visible",
                    true
                );


                setTimeout(
                    () => {

                        toggleClass(
                            mensajeCopiado,
                            "visible",
                            false
                        );

                    },
                    2500
                );

            }

        } catch (error) {

            console.error(
                "No se pudo copiar el número:",
                error
            );

        }

    }
);


/* =====================================================
   MÚSICA
===================================================== */

const musica =
    $("musicaBoda");


const botonMusica =
    $("botonMusica");


let musicaReproduciendo =
    false;


function actualizarEstadoMusica() {

    toggleClass(
        botonMusica,
        "reproduciendo",
        musicaReproduciendo
    );


    if (botonMusica) {

        botonMusica.setAttribute(
            "aria-label",
            musicaReproduciendo
                ? "Pausar música"
                : "Reproducir música"
        );

    }

}


on(
    botonMusica,
    "click",
    async () => {

        if (!musica) {

            return;
        }


        try {

            if (
                musicaReproduciendo
            ) {

                musica.pause();

            } else {

                await musica.play();

            }

        } catch (error) {

            console.error(
                "No se pudo reproducir la música:",
                error
            );

        }

    }
);


on(
    musica,
    "play",
    () => {

        musicaReproduciendo =
            true;

        actualizarEstadoMusica();

    }
);


on(
    musica,
    "pause",
    () => {

        musicaReproduciendo =
            false;

        actualizarEstadoMusica();

    }
);


on(
    musica,
    "ended",
    () => {

        musicaReproduciendo =
            false;

        actualizarEstadoMusica();

    }
);


actualizarEstadoMusica();


/* =====================================================
   ANIMACIONES AL HACER SCROLL
===================================================== */

const elementosAnimados =
    $$(
        ".evento-card, .regalo, .rsvp-card"
    );


document.documentElement.classList.add(
    "js"
);


if (
    "IntersectionObserver" in window &&
    elementosAnimados.length
) {

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;
                        }


                        entry.target.classList.add(
                            "visible"
                        );


                        observer.unobserve(
                            entry.target
                        );

                    }
                );

            },
            {

                threshold: 0.12,

                rootMargin:
                    "0px 0px -40px 0px"

            }
        );


    elementosAnimados.forEach(
        elemento => {

            elemento.classList.add(
                "animar-entrada"
            );


            observer.observe(
                elemento
            );

        }
    );

}


/* =====================================================
   PAUSAR MÚSICA AL SALIR DE LA PÁGINA
===================================================== */

on(
    document,
    "visibilitychange",
    () => {

        if (
            document.hidden &&
            musica &&
            !musica.paused
        ) {

            musica.pause();

        }

    }
);


/* =====================================================
   FINAL
===================================================== */

console.log(
    "✓ Invitación de boda de Omar & Wendy cargada correctamente."
);
