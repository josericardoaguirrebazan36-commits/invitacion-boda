"use strict";

/* =====================================================
   INVITACIÓN DE BODA — OMAR & WENDY
   JavaScript principal
===================================================== */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       CONFIGURACIÓN
    ===================================================== */

    const CONFIG = {

        /*
         * 9 de octubre de 2026
         * 3:00 p. m.
         * Hora de Lima, Perú: UTC-5
         */
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

        dias:
            $("dias"),

        horas:
            $("horas"),

        minutos:
            $("minutos"),

        segundos:
            $("segundos")

    };


    /*
     * Fecha exacta de la boda.
     *
     * Se utiliza ISO con -05:00 para que todos los
     * navegadores interpreten correctamente la hora
     * de Lima, Perú.
     */

    const fechaBoda =
        new Date(
            "2026-10-09T15:00:00-05:00"
        );


    function actualizarContador() {

        if (
            !contador.dias ||
            !contador.horas ||
            !contador.minutos ||
            !contador.segundos
        ) {

            return;

        }


        const ahora =
            Date.now();


        const diferencia =
            fechaBoda.getTime() -
            ahora;


        /*
         * Si la boda ya comenzó,
         * dejamos todo en cero.
         */

        if (diferencia <= 0) {

            setText(
                contador.dias,
                "00"
            );

            setText(
                contador.horas,
                "00"
            );

            setText(
                contador.minutos,
                "00"
            );

            setText(
                contador.segundos,
                "00"
            );

            return;

        }


        const totalSegundos =
            Math.floor(
                diferencia / 1000
            );


        const dias =
            Math.floor(
                totalSegundos / 86400
            );


        const horas =
            Math.floor(
                (
                    totalSegundos % 86400
                ) / 3600
            );


        const minutos =
            Math.floor(
                (
                    totalSegundos % 3600
                ) / 60
            );


        const segundos =
            totalSegundos % 60;


        setText(
            contador.dias,
            String(dias).padStart(
                2,
                "0"
            )
        );


        setText(
            contador.horas,
            String(horas).padStart(
                2,
                "0"
            )
        );


        setText(
            contador.minutos,
            String(minutos).padStart(
                2,
                "0"
            )
        );


        setText(
            contador.segundos,
            String(segundos).padStart(
                2,
                "0"
            )
        );

    }


    /*
     * Ejecutar inmediatamente
     */

    actualizarContador();


    /*
     * Actualizar cada segundo
     */

    const intervaloContador =
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

        if (window.innerWidth > 900) {

            return fotos.length;

        }

        return 2;

    }


    function actualizarGaleria() {

        if (!fotos.length) {

            return;

        }


        const visibles =
            obtenerFotosVisibles();


        if (visibles >= fotos.length) {

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

            console.error(
                "No se encontró el modal."
            );

            return;

        }


        /*
         * Cerramos primero cualquier modal abierto.
         */

        Object.values(modales)
            .forEach(
                otroModal => {

                    if (
                        otroModal &&
                        otroModal !== modal
                    ) {

                        otroModal.classList.remove(
                            "activo"
                        );

                        otroModal.setAttribute(
                            "aria-hidden",
                            "true"
                        );

                    }

                }
            );


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


        /*
         * Solo quitamos no-scroll si no hay
         * otro modal activo.
         */

        const hayModalActivo =
            Object.values(modales)
                .some(
                    otroModal =>
                        otroModal &&
                        otroModal.classList.contains(
                            "activo"
                        )
                );


        if (!hayModalActivo) {

            document.body.classList.remove(
                "no-scroll"
            );

        }

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
       BOTONES DE CONFIRMACIÓN
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


    /*
     * ASISTENCIA PRESENCIAL
     */

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


        /*
         * Si todavía no se ha configurado
         * Google Apps Script, mostramos
         * igualmente la confirmación.
         */

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
       CONFIRMACIONES
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
       COPIAR TEXTO
    ===================================================== */

    async function copiarTexto(texto) {

        /*
         * Método moderno
         */

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            try {

                await navigator.clipboard.writeText(
                    texto
                );

                return true;

            } catch (error) {

                console.warn(
                    "Clipboard API no disponible.",
                    error
                );

            }

        }


        /*
         * Método alternativo para navegadores
         * donde Clipboard API no está disponible.
         */

        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            texto;


        textarea.style.position =
            "fixed";

        textarea.style.left =
            "-9999px";

        textarea.style.top =
            "0";

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

            console.error(
                "No se pudo copiar:",
                error
            );

        }


        document.body.removeChild(
            textarea
        );


        return resultado;

    }


    /* =====================================================
       COPIAR ZOOM
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

    }


    on(
        copiarZoom,
        "click",
        async () => {

            const copiado =
                await copiarTexto(
                    obtenerTextoZoom()
                );


            if (!copiado) {

                return;

            }


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
    );


    /* =====================================================
       CERRAR CON ESC
    ===================================================== */

    on(
        document,
        "keydown",
        event => {

            if (
                event.key !==
                "Escape"
            ) {

                return;

            }


            cerrarGaleria();

            cerrarTodosLosModales();

        }
    );


    /* =====================================================
       GALERÍA CON TECLADO
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

            }


            else if (
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

            if (
                !opcionesCalendario ||
                !btnMostrarCalendario
            ) {

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

function configurarCopiarYape(
botonId,
numero,
mensajeId
) {


const boton =
    $(botonId);

const mensaje =
    $(mensajeId);


on(
    boton,
    "click",
    async () => {

        const copiado =
            await copiarTexto(numero);


        if (!copiado) {

            return;

        }


        toggleClass(
            mensaje,
            "visible",
            true
        );


        setText(
            mensaje,
            "Número copiado ✓"
        );


        setTimeout(
            () => {

                toggleClass(
                    mensaje,
                    "visible",
                    false
                );

            },
            2500
        );

    }
);


}

configurarCopiarYape(
"copiarYape",
CONFIG.numeroYape,
"mensajeCopiado"
);

configurarCopiarYape(
"copiarYape2",
CONFIG.numeroYape2,
"mensajeCopiado2"
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


/* =====================================================
   ACTUALIZAR ESTADO DEL BOTÓN
===================================================== */

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


/* =====================================================
   REPRODUCIR MÚSICA
===================================================== */

async function reproducirMusica() {

    if (!musica) {
        return;
    }


    try {

        await musica.play();

    }

    catch (error) {

        /*
         * El navegador puede bloquear
         * el autoplay con sonido.
         * No mostramos ningún error al usuario.
         */

        console.log(
            "Autoplay bloqueado. Esperando interacción del usuario."
        );

    }

}


/* =====================================================
   INTENTAR AUTOPLAY AL CARGAR
===================================================== */

window.addEventListener(
    "load",
    () => {

        reproducirMusica();

    }
);


/* =====================================================
   PRIMERA INTERACCIÓN
===================================================== */

/*
 * Si el navegador bloqueó el autoplay,
 * cualquier primera interacción del usuario
 * permitirá iniciar la música.
 */

function iniciarMusicaConInteraccion() {

    if (!musica) {
        return;
    }


    if (musica.paused) {

        musica.play()
            .catch(() => {});

    }


    document.removeEventListener(
        "pointerdown",
        iniciarMusicaConInteraccion
    );

}


document.addEventListener(
    "pointerdown",
    iniciarMusicaConInteraccion,
    {
        once: true
    }
);


/* =====================================================
   BOTÓN DE MÚSICA
===================================================== */

on(
    botonMusica,
    "click",
    async () => {

        if (!musica) {
            return;
        }


        try {

            if (
                !musica.paused
            ) {

                musica.pause();

            }

            else {

                await musica.play();

            }

        }

        catch (error) {

            console.error(
                "No se pudo reproducir la música:",
                error
            );

        }

    }
);


/* =====================================================
   EVENTO PLAY
===================================================== */

on(
    musica,
    "play",
    () => {

        musicaReproduciendo =
            true;

        actualizarEstadoMusica();

    }
);


/* =====================================================
   EVENTO PAUSE
===================================================== */

on(
    musica,
    "pause",
    () => {

        musicaReproduciendo =
            false;

        actualizarEstadoMusica();

    }
);


/* =====================================================
   EVENTO ENDED
===================================================== */

on(
    musica,
    "ended",
    () => {

        musicaReproduciendo =
            false;

        actualizarEstadoMusica();

    }
);


/* =====================================================
   ESTADO INICIAL
===================================================== */

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
       COMPROBACIÓN
    ===================================================== */

    console.log(
        "✓ Invitación de boda de Omar & Wendy cargada correctamente."
    );

    console.log(
        "✓ Contador:",
        fechaBoda.toLocaleString(
            "es-PE",
            {
                timeZone: "America/Lima"
            }
        )
    );


});
