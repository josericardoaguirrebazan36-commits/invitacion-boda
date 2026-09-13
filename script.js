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

        fechaBoda: new Date(
            "2026-10-09T16:00:00-05:00"
        ),

        googleScriptUrl:
            "https://script.google.com/macros/s/AKfycbwDqd04rZS957Zi6sMJTnmDQSCzyHuX5JTDYUZjajNCekJogwuHQHUacK0znV9Br9FX/exec",

        maxPersonas: 10,

        yapeNumero:
            "+51 992 418 572",

        yapeNumero2:
            "+51 942 530 706",

        zoomId:
            "740 351 363",

        zoomClave:
            "323256"
    };


    /* =====================================================
       UTILIDADES
    ===================================================== */

    const $ = (selector) => {
        return document.getElementById(selector);
    };

    const $$ = (selector) => {
        return document.querySelectorAll(selector);
    };

    const on = (element, event, callback, options) => {

        if (!element) return;

        element.addEventListener(
            event,
            callback,
            options
        );
    };

    const setText = (element, text) => {

        if (!element) return;

        element.textContent = text;
    };

    const toggleClass = (
        element,
        className,
        force
    ) => {

        if (!element) return;

        element.classList.toggle(
            className,
            force
        );
    };


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const body = document.body;

    const aumentarTexto =
        $("aumentarTexto");

    const contrasteTexto =
        $("contrasteTexto");


    /* =====================================================
       CÓDIGO DE INVITACIÓN
    ===================================================== */

    const parametros =
        new URLSearchParams(
            window.location.search
        );

    const codigoInvitado =
        parametros.get("codigo") ||
        parametros.get("invitado") ||
        "";


    /* =====================================================
       ACCESIBILIDAD
    ===================================================== */

    on(
        aumentarTexto,
        "click",
        () => {

            const activo =
                body.classList.toggle(
                    "texto-grande"
                );

            aumentarTexto.setAttribute(
                "aria-pressed",
                String(activo)
            );
        }
    );


    on(
        contrasteTexto,
        "click",
        () => {

            const activo =
                body.classList.toggle(
                    "alto-contraste"
                );

            contrasteTexto.setAttribute(
                "aria-pressed",
                String(activo)
            );
        }
    );


    /* =====================================================
       NOMBRE DEL INVITADO
    ===================================================== */

    const nombreInvitado =
        $("nombreInvitado");

    if (codigoInvitado) {

        const nombre =
            codigoInvitado
                .replace(/[-_+]/g, " ")
                .trim();

        if (nombre) {

            setText(
                nombreInvitado,
                `Invitación para ${nombre}`
            );
        }
    }


    /* =====================================================
       CUENTA REGRESIVA
    ===================================================== */

    const dias =
        $("dias");

    const horas =
        $("horas");

    const minutos =
        $("minutos");

    const segundos =
        $("segundos");


    const actualizarContador = () => {

        const ahora =
            new Date();

        const diferencia =
            CONFIG.fechaBoda.getTime() -
            ahora.getTime();


        if (diferencia <= 0) {

            setText(dias, "00");
            setText(horas, "00");
            setText(minutos, "00");
            setText(segundos, "00");

            return;
        }


        const totalSegundos =
            Math.floor(
                diferencia / 1000
            );

        const cantidadDias =
            Math.floor(
                totalSegundos / 86400
            );

        const cantidadHoras =
            Math.floor(
                (totalSegundos % 86400) / 3600
            );

        const cantidadMinutos =
            Math.floor(
                (totalSegundos % 3600) / 60
            );

        const cantidadSegundos =
            totalSegundos % 60;


        setText(
            dias,
            String(cantidadDias).padStart(2, "0")
        );

        setText(
            horas,
            String(cantidadHoras).padStart(2, "0")
        );

        setText(
            minutos,
            String(cantidadMinutos).padStart(2, "0")
        );

        setText(
            segundos,
            String(cantidadSegundos).padStart(2, "0")
        );
    };


    actualizarContador();


    const intervaloContador =
        setInterval(
            actualizarContador,
            1000
        );


    /* =====================================================
       GALERÍA
    ===================================================== */

    const fotos =
        Array.from(
            document.querySelectorAll(
                ".galeria-fotos img"
            )
        );

    const galeriaAnterior =
        $("galeriaAnterior");

    const galeriaSiguiente =
        $("galeriaSiguiente");

    let fotoActual = 0;


    const mostrarFoto = (indice) => {

        if (!fotos.length) return;

        fotoActual =
            (indice + fotos.length) %
            fotos.length;


        fotos.forEach(
            (foto, index) => {

                foto.classList.toggle(
                    "activa",
                    index === fotoActual
                );
            }
        );
    };


    on(
        galeriaAnterior,
        "click",
        () => {
            mostrarFoto(
                fotoActual - 1
            );
        }
    );


    on(
        galeriaSiguiente,
        "click",
        () => {
            mostrarFoto(
                fotoActual + 1
            );
        }
    );


    mostrarFoto(0);


    /* =====================================================
       LIGHTBOX
    ===================================================== */

    const lightbox =
        $("lightbox");

    const imagenGrande =
        $("imagenGrande");

    const cerrarLightbox =
        $("cerrarLightbox");


    const abrirLightbox = (foto) => {

        if (!foto || !lightbox) return;

        imagenGrande.src =
            foto.currentSrc ||
            foto.src;

        imagenGrande.alt =
            foto.alt || "Fotografía";

        lightbox.classList.add(
            "activo"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );

        body.classList.add(
            "sin-scroll"
        );

        cerrarLightbox?.focus();
    };


    const cerrarLightboxFuncion = () => {

        if (!lightbox) return;

        lightbox.classList.remove(
            "activo"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );

        body.classList.remove(
            "sin-scroll"
        );

        if (imagenGrande) {

            imagenGrande.src = "";
            imagenGrande.alt = "";
        }
    };


    fotos.forEach(
        (foto) => {

            on(
                foto,
                "click",
                () => {
                    abrirLightbox(foto);
                }
            );

            on(
                foto,
                "keydown",
                (event) => {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        abrirLightbox(foto);
                    }
                }
            );

            foto.setAttribute(
                "tabindex",
                "0"
            );
        }
    );


    on(
        cerrarLightbox,
        "click",
        cerrarLightboxFuncion
    );


    on(
        lightbox,
        "click",
        (event) => {

            if (
                event.target === lightbox
            ) {

                cerrarLightboxFuncion();
            }
        }
    );


    /* =====================================================
       MODALES
    ===================================================== */

    const modalAsistencia =
        $("modalAsistencia");

    const modalZoom =
        $("modalZoom");

    const modalNoAsistire =
        $("modalNoAsistire");

    const mensajeExito =
        $("mensajeExito");


    const btnAsistire =
        $("btnAsistire");

    const btnZoom =
        $("btnZoom");

    const btnNoAsistire =
        $("btnNoAsistire");


    const cerrarModal =
        $("cerrarModal");

    const cerrarZoom =
        $("cerrarZoom");

    const cerrarNoAsistire =
        $("cerrarNoAsistire");


    const cancelarZoom =
        $("cancelarZoom");

    const cancelarNoAsistire =
        $("cancelarNoAsistire");


    const volverConfirmacion =
        $("volverConfirmacion");


    let modalAnterior =
        null;


    const abrirModal = (modal) => {

        if (!modal) return;

        modalAnterior =
            document.activeElement;

        modal.classList.add(
            "activo"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        body.classList.add(
            "sin-scroll"
        );


        const primerElemento =
            modal.querySelector(
                "button, input, select, textarea, a"
            );

        primerElemento?.focus();
    };


    const cerrarModalFuncion = (modal) => {

        if (!modal) return;

        modal.classList.remove(
            "activo"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        body.classList.remove(
            "sin-scroll"
        );


        if (
            modalAnterior &&
            typeof modalAnterior.focus === "function"
        ) {

            modalAnterior.focus();
        }

        modalAnterior = null;
    };


    on(
        btnAsistire,
        "click",
        () => {
            abrirModal(
                modalAsistencia
            );
        }
    );


    on(
        btnZoom,
        "click",
        () => {
            abrirModal(
                modalZoom
            );
        }
    );


    on(
        btnNoAsistire,
        "click",
        () => {
            abrirModal(
                modalNoAsistire
            );
        }
    );


    on(
        cerrarModal,
        "click",
        () => {
            cerrarModalFuncion(
                modalAsistencia
            );
        }
    );


    on(
        cerrarZoom,
        "click",
        () => {
            cerrarModalFuncion(
                modalZoom
            );
        }
    );


    on(
        cancelarZoom,
        "click",
        () => {
            cerrarModalFuncion(
                modalZoom
            );
        }
    );


    on(
        cerrarNoAsistire,
        "click",
        () => {
            cerrarModalFuncion(
                modalNoAsistire
            );
        }
    );


    on(
        cancelarNoAsistire,
        "click",
        () => {
            cerrarModalFuncion(
                modalNoAsistire
            );
        }
    );


    on(
        volverConfirmacion,
        "click",
        () => {
            cerrarModalFuncion(
                mensajeExito
            );
        }
    );


    /* =====================================================
       CERRAR MODALES HACIENDO CLICK FUERA
    ===================================================== */

    [
        modalAsistencia,
        modalZoom,
        modalNoAsistire,
        mensajeExito
    ].forEach(
        (modal) => {

            on(
                modal,
                "click",
                (event) => {

                    if (
                        event.target === modal
                    ) {

                        cerrarModalFuncion(
                            modal
                        );
                    }
                }
            );
        }
    );


    /* =====================================================
       CANTIDAD DE PERSONAS
    ===================================================== */

    const restarPersona =
        $("restarPersona");

    const sumarPersona =
        $("sumarPersona");

    const cantidadPersonas =
        $("cantidadPersonas");

    const textoPersonas =
        $("textoPersonas");

    let personas =
        1;


    const actualizarPersonas = () => {

        personas =
            Math.max(
                1,
                Math.min(
                    CONFIG.maxPersonas,
                    personas
                )
            );


        setText(
            cantidadPersonas,
            String(personas)
        );


        setText(
            textoPersonas,
            personas === 1
                ? "persona"
                : "personas"
        );


        if (restarPersona) {

            restarPersona.disabled =
                personas <= 1;
        }


        if (sumarPersona) {

            sumarPersona.disabled =
                personas >= CONFIG.maxPersonas;
        }
    };


    on(
        restarPersona,
        "click",
        () => {

            personas--;

            actualizarPersonas();
        }
    );


    on(
        sumarPersona,
        "click",
        () => {

            personas++;

            actualizarPersonas();
        }
    );


    actualizarPersonas();


    /* =====================================================
       ESTADO RSVP
    ===================================================== */

    const estadoRsvp =
        $("estadoRsvp");

    const textoEstadoRsvp =
        $("textoEstadoRsvp");


    const claveRsvp =
        `rsvp_omar_wendy_${
            codigoInvitado ||
            window.location.pathname
        }`;


    const guardarEstadoRsvp = (
        tipo,
        cantidad
    ) => {

        try {

            localStorage.setItem(
                claveRsvp,
                JSON.stringify({
                    tipo,
                    personas: cantidad,
                    fecha: new Date().toISOString()
                })
            );

        } catch (error) {

            console.warn(
                "No se pudo guardar el estado RSVP.",
                error
            );
        }
    };


    const obtenerEstadoRsvp = () => {

        try {

            const guardado =
                localStorage.getItem(
                    claveRsvp
                );

            if (!guardado) return null;

            return JSON.parse(
                guardado
            );

        } catch (error) {

            console.warn(
                "No se pudo leer el estado RSVP.",
                error
            );

            return null;
        }
    };


    const mostrarEstadoRsvp = (
        tipo,
        cantidad
    ) => {

        if (!estadoRsvp) return;


        let mensaje =
            "Tu confirmación ya fue registrada.";


        if (tipo === "presencial") {

            mensaje =
                cantidad === 1
                    ? "Has confirmado tu asistencia presencial."
                    : `Has confirmado tu asistencia presencial para ${cantidad} personas.`;
        }


        if (tipo === "zoom") {

            mensaje =
                "Has confirmado que te conectarás por Zoom.";
        }


        if (tipo === "no_asistire") {

            mensaje =
                "Has indicado que no podrás asistir.";
        }


        setText(
            textoEstadoRsvp,
            mensaje
        );


        estadoRsvp.hidden = false;


        [
            btnAsistire,
            btnZoom,
            btnNoAsistire
        ].forEach(
            (boton) => {

                if (boton) {

                    boton.hidden = true;
                }
            }
        );
    };


    const cargarEstadoRsvp = () => {

        const estado =
            obtenerEstadoRsvp();

        if (!estado) return;

        mostrarEstadoRsvp(
            estado.tipo,
            estado.personas || 1
        );
    };


    cargarEstadoRsvp();


    /* =====================================================
       INDICADOR DE CARGA
    ===================================================== */

    const mostrarCargandoConfirmacion = () => {

        if (
            document.getElementById(
                "estilo-indicador-cargando"
            )
        ) {
            return;
        }


        const estilo =
            document.createElement(
                "style"
            );

        estilo.id =
            "estilo-indicador-cargando";

        estilo.textContent = `
            .indicador-cargando {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }

            .indicador-cargando::before {
                content: "";
                width: 16px;
                height: 16px;
                border: 2px solid currentColor;
                border-right-color: transparent;
                border-radius: 50%;
                animation: giro-cargando .7s linear infinite;
            }

            @keyframes giro-cargando {
                to {
                    transform: rotate(360deg);
                }
            }
        `;

        document.head.appendChild(
            estilo
        );
    };


    mostrarCargandoConfirmacion();


    /* =====================================================
       ENVIAR RSVP
    ===================================================== */

    const enviarRsvp = async (
        tipo,
        cantidad = 1
    ) => {

        const datos = {

            codigo:
                codigoInvitado,

            tipo:
                tipo,

            personas:
                cantidad,

            nombre:
                codigoInvitado,

            fecha:
                new Date().toISOString()
        };


        /* ---------------------------------------------
           SI NO HAY GOOGLE SCRIPT
        --------------------------------------------- */

        if (
            !CONFIG.googleScriptUrl
        ) {

            guardarEstadoRsvp(
                tipo,
                cantidad
            );

            mostrarEstadoRsvp(
                tipo,
                cantidad
            );

            return true;
        }


        try {

            const respuesta =
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
                            JSON.stringify(datos)
                    }
                );


            /*
             * Con no-cors el navegador no permite
             * leer el contenido de la respuesta.
             *
             * Si fetch termina sin error,
             * consideramos enviado el registro.
             */

            void respuesta;


            /* -----------------------------------------
               CORRECCIÓN:
               GUARDAR EL RSVP TAMBIÉN DESPUÉS
               DEL ENVÍO EXITOSO
            ----------------------------------------- */

            guardarEstadoRsvp(
                tipo,
                cantidad
            );


            mostrarExito(
                tipo,
                cantidad
            );


            return true;

        } catch (error) {

            console.error(
                "Error al enviar RSVP:",
                error
            );


            mostrarExito(
                "error",
                cantidad
            );


            return false;
        }
    };


    /* =====================================================
       MODAL DE ÉXITO
    ===================================================== */

    const textoExito =
        $("textoExito");


    const mostrarExito = (
        tipo,
        cantidad
    ) => {

        if (!textoExito) return;


        let mensaje =
            "Tu respuesta fue registrada correctamente.";


        if (tipo === "presencial") {

            mensaje =
                cantidad === 1
                    ? "Hemos registrado tu asistencia presencial. ¡Nos alegra muchísimo poder compartir este día contigo!"
                    : `Hemos registrado tu asistencia presencial para ${cantidad} personas. ¡Nos alegra muchísimo poder compartir este día con ustedes!`;
        }


        if (tipo === "zoom") {

            mensaje =
                "Hemos registrado que nos acompañarás por Zoom. ¡Nos encantará tenerte con nosotros a distancia!";
        }


        if (tipo === "no_asistire") {

            mensaje =
                "Hemos registrado tu respuesta. Muchas gracias por avisarnos y por ser parte de este momento tan especial.";
        }


        if (tipo === "error") {

            mensaje =
                "No pudimos confirmar la conexión con el servidor. Por favor, comunícate con Omar Ulloa al +51 992 418 572 para confirmar tu respuesta.";
        }


        setText(
            textoExito,
            mensaje
        );


        abrirModal(
            mensajeExito
        );
    };


    /* =====================================================
       CONFIRMACIÓN PRESENCIAL
    ===================================================== */

    const confirmarPresencial =
        $("confirmarPresencial");


    on(
        confirmarPresencial,
        "click",
        async () => {

            confirmarPresencial.disabled =
                true;

            confirmarPresencial.classList.add(
                "indicador-cargando"
            );


            await enviarRsvp(
                "presencial",
                personas
            );


            cerrarModalFuncion(
                modalAsistencia
            );


            confirmarPresencial.disabled =
                false;

            confirmarPresencial.classList.remove(
                "indicador-cargando"
            );
        }
    );


    /* =====================================================
       CONFIRMACIÓN ZOOM
    ===================================================== */

    const confirmarZoomInterno =
        async () => {

            await enviarRsvp(
                "zoom",
                1
            );

            cerrarModalFuncion(
                modalZoom
            );
        };


    /*
     * En el modal Zoom actualmente el HTML
     * no tiene botón "confirmar Zoom".
     *
     * Por eso se mantiene la confirmación
     * al seleccionar "Me conectaré por Zoom".
     */


    on(
        btnZoom,
        "click",
        async () => {

            abrirModal(
                modalZoom
            );


            /*
             * El registro se realiza al abrir
             * el modal, tal como estaba planteado.
             */

            await confirmarZoomInterno();
        }
    );


    /* =====================================================
       NO ASISTIR
    ===================================================== */

    const confirmarNoAsistire =
        $("confirmarNoAsistire");


    on(
        confirmarNoAsistire,
        "click",
        async () => {

            confirmarNoAsistire.disabled =
                true;

            confirmarNoAsistire.classList.add(
                "indicador-cargando"
            );


            await enviarRsvp(
                "no_asistire",
                0
            );


            cerrarModalFuncion(
                modalNoAsistire
            );


            confirmarNoAsistire.disabled =
                false;

            confirmarNoAsistire.classList.remove(
                "indicador-cargando"
            );
        }
    );


    /* =====================================================
       COPIAR YAPE
    ===================================================== */

    const copiarYape =
        $("copiarYape");

    const copiarYape2 =
        $("copiarYape2");

    const mensajeCopiado =
        $("mensajeCopiado");

    const mensajeCopiado2 =
        $("mensajeCopiado2");


    const copiarTexto = async (
        texto,
        mensaje
    ) => {

        try {

            if (
                navigator.clipboard &&
                window.isSecureContext
            ) {

                await navigator.clipboard.writeText(
                    texto
                );

            } else {

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

                document.execCommand(
                    "copy"
                );

                textarea.remove();
            }


            if (mensaje) {

                mensaje.classList.add(
                    "visible"
                );

                setTimeout(
                    () => {

                        mensaje.classList.remove(
                            "visible"
                        );

                    },
                    2200
                );
            }


            return true;

        } catch (error) {

            console.error(
                "No se pudo copiar:",
                error
            );

            return false;
        }
    };


    on(
        copiarYape,
        "click",
        () => {

            copiarTexto(
                CONFIG.yapeNumero,
                mensajeCopiado
            );
        }
    );


    on(
        copiarYape2,
        "click",
        () => {

            copiarTexto(
                CONFIG.yapeNumero2,
                mensajeCopiado2
            );
        }
    );


    /* =====================================================
       COPIAR ZOOM
    ===================================================== */

    const copiarZoom =
        $("copiarZoom");

    const zoomCopiado =
        $("zoomCopiado");


    on(
        copiarZoom,
        "click",
        () => {

            const datosZoom =
                `ID de reunión: ${CONFIG.zoomId}\nClave: ${CONFIG.zoomClave}`;


            copiarTexto(
                datosZoom,
                zoomCopiado
            );
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


    const actualizarBotonMusica = () => {

        if (!botonMusica) return;


        botonMusica.setAttribute(
            "aria-label",
            musicaReproduciendo
                ? "Pausar música"
                : "Reproducir música"
        );


        botonMusica.setAttribute(
            "aria-pressed",
            String(musicaReproduciendo)
        );


        toggleClass(
            botonMusica,
            "reproduciendo",
            musicaReproduciendo
        );
    };


    const reproducirMusica =
        async () => {

            if (!musica) return false;


            try {

                await musica.play();

                musicaReproduciendo =
                    true;

                actualizarBotonMusica();

                return true;

            } catch (error) {

                console.warn(
                    "La reproducción de música fue bloqueada.",
                    error
                );

                musicaReproduciendo =
                    false;

                actualizarBotonMusica();

                return false;
            }
        };


    const pausarMusica = () => {

        if (!musica) return;


        musica.pause();

        musicaReproduciendo =
            false;

        actualizarBotonMusica();
    };


    on(
        botonMusica,
        "click",
        () => {

            if (
                musicaReproduciendo
            ) {

                pausarMusica();

            } else {

                reproducirMusica();
            }
        }
    );


    /*
     * IMPORTANTE:
     *
     * NO usamos autoplay.
     * NO agregamos pointerdown global.
     * La música solamente comienza cuando
     * el visitante pulsa el botón.
     */


    on(
        musica,
        "play",
        () => {

            musicaReproduciendo =
                true;

            actualizarBotonMusica();
        }
    );


    on(
        musica,
        "pause",
        () => {

            musicaReproduciendo =
                false;

            actualizarBotonMusica();
        }
    );


    actualizarBotonMusica();


    /* =====================================================
       CALENDARIO
    ===================================================== */

    const crearEventoCalendario = () => {

        const inicio =
            "20261009T160000";

        const fin =
            "20261009T230000";


        const titulo =
            encodeURIComponent(
                "Boda de Omar y Wendy"
            );

        const detalles =
            encodeURIComponent(
                "Discurso de boda a las 4:00 p. m. y recepción a las 7:00 p. m."
            );


        const url =
            `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${inicio}/${fin}&details=${detalles}`;


        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );
    };


    const botonesCalendario =
        $$("[data-calendario]");


    botonesCalendario.forEach(
        (boton) => {

            on(
                boton,
                "click",
                crearEventoCalendario
            );
        }
    );


    /* =====================================================
       ANIMACIONES AL HACER SCROLL
    ===================================================== */

    const elementosAnimados =
        $$(
            ".evento-card, .historia-header, .galeria-wrapper, .rsvp-card, .regalo, .regalos-final"
        );


    if (
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                (entradas, observador) => {

                    entradas.forEach(
                        (entrada) => {

                            if (
                                entrada.isIntersecting
                            ) {

                                entrada.target.classList.add(
                                    "visible"
                                );

                                observador.unobserve(
                                    entrada.target
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
            (elemento) => {

                observer.observe(
                    elemento
                );
            }
        );

    } else {

        elementosAnimados.forEach(
            (elemento) => {

                elemento.classList.add(
                    "visible"
                );
            }
        );
    }


    /* =====================================================
       TECLADO — ESC
    ===================================================== */

    on(
        document,
        "keydown",
        (event) => {

            if (
                event.key !== "Escape"
            ) {
                return;
            }


            if (
                lightbox?.classList.contains(
                    "activo"
                )
            ) {

                cerrarLightboxFuncion();

                return;
            }


            const modales = [
                modalAsistencia,
                modalZoom,
                modalNoAsistire,
                mensajeExito
            ];


            const modalAbierto =
                modales.find(
                    (modal) =>
                        modal?.classList.contains(
                            "activo"
                        )
                );


            if (modalAbierto) {

                cerrarModalFuncion(
                    modalAbierto
                );
            }
        }
    );


    /* =====================================================
       TRAMPA DE FOCO BÁSICA PARA MODALES
    ===================================================== */

    const mantenerFocoModal = (
        modal,
        event
    ) => {

        if (
            !modal ||
            !modal.classList.contains(
                "activo"
            )
        ) {
            return;
        }


        if (
            event.key !== "Tab"
        ) {
            return;
        }


        const elementos =
            Array.from(
                modal.querySelectorAll(
                    "button, a, input, select, textarea, [tabindex]:not([tabindex='-1'])"
                )
            ).filter(
                (elemento) =>
                    !elemento.disabled &&
                    elemento.offsetParent !== null
            );


        if (!elementos.length) {
            return;
        }


        const primero =
            elementos[0];

        const ultimo =
            elementos[elementos.length - 1];


        if (
            event.shiftKey &&
            document.activeElement === primero
        ) {

            event.preventDefault();

            ultimo.focus();

        } else if (
            !event.shiftKey &&
            document.activeElement === ultimo
        ) {

            event.preventDefault();

            primero.focus();
        }
    };


    on(
        document,
        "keydown",
        (event) => {

            [
                modalAsistencia,
                modalZoom,
                modalNoAsistire,
                mensajeExito
            ].forEach(
                (modal) => {

                    mantenerFocoModal(
                        modal,
                        event
                    );
                }
            );
        }
    );


    /* =====================================================
       VISIBILITYCHANGE
       PAUSAR MÚSICA SI SE ABANDONA LA PÁGINA
    ===================================================== */

    on(
        document,
        "visibilitychange",
        () => {

            if (
                document.hidden &&
                musicaReproduciendo
            ) {

                pausarMusica();
            }
        }
    );


    /* =====================================================
       LIMPIEZA
    ===================================================== */

    on(
        window,
        "beforeunload",
        () => {

            clearInterval(
                intervaloContador
            );

            if (musica) {

                musica.pause();
            }
        }
    );

});
