"use strict";

/* =====================================================
   INVITACIÓN DE BODA — OMAR & WENDY
   JavaScript principal
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       CONFIGURACIÓN
    ===================================================== */

    const CONFIG = {
        fechaBoda: new Date("2026-10-09T16:00:00-05:00"),

        googleScriptUrl:
            "https://script.google.com/macros/s/AKfycbwDqd04rZS957Zi6sMJTnmDQSCzyHuX5JTDYUZjajNCekJogwuHQHUacK0znV9Br9FX/exec",

        maxPersonas: 10,

        yapeNumero: "+51 992 418 572",
        yapeNumero2: "+51 942 530 706",

        zoomId: "740 351 363",
        zoomClave: "323256"
    };


    /* =====================================================
       UTILIDADES
    ===================================================== */

    function $(id) {
        return document.getElementById(id);
    }

    function $$(selector) {
        return document.querySelectorAll(selector);
    }

    function on(element, event, callback, options) {
        if (!element) return;

        element.addEventListener(
            event,
            callback,
            options || false
        );
    }

    function setText(element, text) {
        if (!element) return;
        element.textContent = text;
    }


    /* =====================================================
       ELEMENTOS PRINCIPALES
    ===================================================== */

    const body = document.body;

    const aumentarTexto = $("aumentarTexto");
    const contrasteTexto = $("contrasteTexto");


    /* =====================================================
       CÓDIGO DE INVITACIÓN
    ===================================================== */

    let codigoInvitado = "";

    try {
        const parametros = new URLSearchParams(
            window.location.search
        );

        codigoInvitado =
            parametros.get("codigo") ||
            parametros.get("invitado") ||
            "";
    } catch (error) {
        console.warn(
            "No se pudo leer el código de invitación.",
            error
        );
    }


    /* =====================================================
       ACCESIBILIDAD
    ===================================================== */

    if (aumentarTexto) {

        on(
            aumentarTexto,
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                const activo =
                    body.classList.toggle("texto-grande");

                aumentarTexto.setAttribute(
                    "aria-pressed",
                    activo ? "true" : "false"
                );

                aumentarTexto.classList.toggle(
                    "activo",
                    activo
                );
            }
        );
    }


    if (contrasteTexto) {

        on(
            contrasteTexto,
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                const activo =
                    body.classList.toggle("alto-contraste");

                contrasteTexto.setAttribute(
                    "aria-pressed",
                    activo ? "true" : "false"
                );

                contrasteTexto.classList.toggle(
                    "activo",
                    activo
                );
            }
        );
    }


    /* =====================================================
       NOMBRE DEL INVITADO
    ===================================================== */

    const nombreInvitado = $("nombreInvitado");

    if (
        nombreInvitado &&
        codigoInvitado
    ) {

        const nombre =
            codigoInvitado
                .replace(/[-_+]/g, " ")
                .trim();

        if (nombre) {
            nombreInvitado.textContent =
                "Invitación para " + nombre;
        }
    }


    /* =====================================================
       CUENTA REGRESIVA
    ===================================================== */

    const dias = $("dias");
    const horas = $("horas");
    const minutos = $("minutos");
    const segundos = $("segundos");

    function actualizarContador() {

        const ahora = new Date();

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
            Math.floor(diferencia / 1000);

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
    }

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


    function mostrarFoto(indice) {

        if (!fotos.length) return;

        fotoActual =
            (indice + fotos.length) %
            fotos.length;

        fotos.forEach(
            function (foto, index) {

                foto.classList.toggle(
                    "activa",
                    index === fotoActual
                );
            }
        );
    }


    on(
        galeriaAnterior,
        "click",
        function () {
            mostrarFoto(
                fotoActual - 1
            );
        }
    );


    on(
        galeriaSiguiente,
        "click",
        function () {
            mostrarFoto(
                fotoActual + 1
            );
        }
    );


    mostrarFoto(0);


    /* =====================================================
       LIGHTBOX
    ===================================================== */

    const lightbox = $("lightbox");
    const imagenGrande = $("imagenGrande");
    const cerrarLightbox = $("cerrarLightbox");


    function abrirLightbox(foto) {

        if (
            !foto ||
            !lightbox ||
            !imagenGrande
        ) {
            return;
        }

        imagenGrande.src =
            foto.currentSrc ||
            foto.src;

        imagenGrande.alt =
            foto.alt ||
            "Fotografía de la boda";

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

        if (cerrarLightbox) {
            cerrarLightbox.focus();
        }
    }


    function cerrarLightboxFuncion() {

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
    }


    fotos.forEach(
        function (foto) {

            foto.setAttribute(
                "tabindex",
                "0"
            );

            foto.setAttribute(
                "role",
                "button"
            );

            on(
                foto,
                "click",
                function () {
                    abrirLightbox(foto);
                }
            );

            on(
                foto,
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        abrirLightbox(foto);
                    }
                }
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
        function (event) {

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

    let elementoAnterior = null;


    function abrirModal(modal) {

        if (!modal) return;

        elementoAnterior =
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

        if (primerElemento) {
            setTimeout(
                function () {
                    primerElemento.focus();
                },
                50
            );
        }
    }


    function cerrarModalFuncion(modal) {

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
            elementoAnterior &&
            typeof elementoAnterior.focus === "function"
        ) {

            setTimeout(
                function () {
                    elementoAnterior.focus();
                },
                50
            );
        }

        elementoAnterior = null;
    }


    /* =====================================================
       BOTÓN ASISTIR
    ===================================================== */

    on(
        btnAsistire,
        "click",
        function () {
            abrirModal(
                modalAsistencia
            );
        }
    );


    /* =====================================================
       BOTÓN ZOOM
    ===================================================== */

    on(
        btnZoom,
        "click",
        function () {
            abrirModal(
                modalZoom
            );
        }
    );


    /* =====================================================
       BOTÓN NO ASISTIR
    ===================================================== */

    on(
        btnNoAsistire,
        "click",
        function () {
            abrirModal(
                modalNoAsistire
            );
        }
    );


    /* =====================================================
       CERRAR MODALES
    ===================================================== */

    on(
        cerrarModal,
        "click",
        function () {
            cerrarModalFuncion(
                modalAsistencia
            );
        }
    );


    on(
        cerrarZoom,
        "click",
        function () {
            cerrarModalFuncion(
                modalZoom
            );
        }
    );


    on(
        cancelarZoom,
        "click",
        function () {
            cerrarModalFuncion(
                modalZoom
            );
        }
    );


    on(
        cerrarNoAsistire,
        "click",
        function () {
            cerrarModalFuncion(
                modalNoAsistire
            );
        }
    );


    on(
        cancelarNoAsistire,
        "click",
        function () {
            cerrarModalFuncion(
                modalNoAsistire
            );
        }
    );


    on(
        volverConfirmacion,
        "click",
        function () {
            cerrarModalFuncion(
                mensajeExito
            );
        }
    );


    /* =====================================================
       CERRAR AL HACER CLICK FUERA
    ===================================================== */

    [
        modalAsistencia,
        modalZoom,
        modalNoAsistire,
        mensajeExito
    ].forEach(
        function (modal) {

            on(
                modal,
                "click",
                function (event) {

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

    let personas = 1;


    function actualizarPersonas() {

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
    }


    on(
        restarPersona,
        "click",
        function () {

            personas--;

            actualizarPersonas();
        }
    );


    on(
        sumarPersona,
        "click",
        function () {

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
        "rsvp_omar_wendy_" +
        (
            codigoInvitado ||
            window.location.pathname
        );


    function guardarEstadoRsvp(
        tipo,
        cantidad
    ) {

        try {

            localStorage.setItem(
                claveRsvp,
                JSON.stringify({
                    tipo: tipo,
                    personas: cantidad,
                    fecha: new Date().toISOString()
                })
            );

        } catch (error) {

            console.warn(
                "No se pudo guardar el RSVP.",
                error
            );
        }
    }


    function obtenerEstadoRsvp() {

        try {

            const guardado =
                localStorage.getItem(
                    claveRsvp
                );

            if (!guardado) {
                return null;
            }

            return JSON.parse(
                guardado
            );

        } catch (error) {

            console.warn(
                "No se pudo leer el RSVP.",
                error
            );

            return null;
        }
    }


    function mostrarEstadoRsvp(
        tipo,
        cantidad
    ) {

        if (!estadoRsvp) return;

        let mensaje =
            "Tu confirmación ya fue registrada.";


        if (
            tipo === "presencial"
        ) {

            mensaje =
                cantidad === 1
                    ? "Has confirmado tu asistencia presencial."
                    : "Has confirmado tu asistencia presencial para " +
                      cantidad +
                      " personas.";
        }


        if (
            tipo === "zoom"
        ) {

            mensaje =
                "Has confirmado que te conectarás por Zoom.";
        }


        if (
            tipo === "no_asistire"
        ) {

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
            function (boton) {

                if (boton) {
                    boton.hidden = true;
                }
            }
        );
    }


    function cargarEstadoRsvp() {

        const estado =
            obtenerEstadoRsvp();

        if (!estado) return;

        mostrarEstadoRsvp(
            estado.tipo,
            estado.personas || 1
        );
    }


    cargarEstadoRsvp();


    /* =====================================================
       INDICADOR DE CARGA
    ===================================================== */

    function prepararIndicadorCarga() {

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
                display: inline-flex !important;
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
    }


    prepararIndicadorCarga();


    /* =====================================================
       MODAL DE ÉXITO
    ===================================================== */

    const textoExito =
        $("textoExito");


    function mostrarExito(
        tipo,
        cantidad
    ) {

        if (!textoExito) return;

        let mensaje =
            "Tu respuesta fue registrada correctamente.";


        if (
            tipo === "presencial"
        ) {

            mensaje =
                cantidad === 1
                    ? "Hemos registrado tu asistencia presencial. ¡Nos alegra muchísimo poder compartir este día contigo!"
                    : "Hemos registrado tu asistencia presencial para " +
                      cantidad +
                      " personas. ¡Nos alegra muchísimo poder compartir este día con ustedes!";
        }


        if (
            tipo === "zoom"
        ) {

            mensaje =
                "Hemos registrado que nos acompañarás por Zoom. ¡Nos encantará tenerte con nosotros a distancia!";
        }


        if (
            tipo === "no_asistire"
        ) {

            mensaje =
                "Hemos registrado tu respuesta. Muchas gracias por avisarnos y por ser parte de este momento tan especial.";
        }


        if (
            tipo === "error"
        ) {

            mensaje =
                "No pudimos confirmar la conexión con el servidor. Por favor, comunícate con Omar Ulloa al +51 992 418 572 para confirmar tu respuesta.";
        }


        textoExito.textContent =
            mensaje;

        abrirModal(
            mensajeExito
        );
    }


    /* =====================================================
       ENVIAR RSVP
    ===================================================== */

    async function enviarRsvp(
        tipo,
        cantidad
    ) {

        const datos = {
            codigo: codigoInvitado,
            tipo: tipo,
            personas: cantidad,
            nombre: codigoInvitado,
            fecha: new Date().toISOString()
        };


        /* ---------------------------------------------
           SIN GOOGLE SCRIPT
        --------------------------------------------- */

        if (!CONFIG.googleScriptUrl) {

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
             * no-cors no permite leer la respuesta.
             * Si fetch no lanza error, consideramos
             * enviado el registro.
             */

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
    }


    /* =====================================================
       CONFIRMAR ASISTENCIA PRESENCIAL
    ===================================================== */

    const confirmarPresencial =
        $("confirmarPresencial");


    on(
        confirmarPresencial,
        "click",
        async function () {

            if (
                confirmarPresencial.disabled
            ) {
                return;
            }

            confirmarPresencial.disabled =
                true;

            confirmarPresencial.classList.add(
                "indicador-cargando"
            );

            try {

                await enviarRsvp(
                    "presencial",
                    personas
                );

                cerrarModalFuncion(
                    modalAsistencia
                );

            } finally {

                confirmarPresencial.disabled =
                    false;

                confirmarPresencial.classList.remove(
                    "indicador-cargando"
                );
            }
        }
    );


    /* =====================================================
       CONFIRMAR ZOOM
    ===================================================== */

    /*
     * IMPORTANTE:
     *
     * Al hacer clic en "Zoom" solamente
     * se abre el modal.
     *
     * NO se registra automáticamente.
     *
     * Si tu HTML tiene un botón con id
     * "confirmarZoom", se utilizará.
     */

    const confirmarZoom =
        $("confirmarZoom");


    on(
        confirmarZoom,
        "click",
        async function () {

            if (
                confirmarZoom.disabled
            ) {
                return;
            }

            confirmarZoom.disabled =
                true;

            confirmarZoom.classList.add(
                "indicador-cargando"
            );

            try {

                await enviarRsvp(
                    "zoom",
                    1
                );

                cerrarModalFuncion(
                    modalZoom
                );

            } finally {

                confirmarZoom.disabled =
                    false;

                confirmarZoom.classList.remove(
                    "indicador-cargando"
                );
            }
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
        async function () {

            if (
                confirmarNoAsistire.disabled
            ) {
                return;
            }

            confirmarNoAsistire.disabled =
                true;

            confirmarNoAsistire.classList.add(
                "indicador-cargando"
            );

            try {

                await enviarRsvp(
                    "no_asistire",
                    0
                );

                cerrarModalFuncion(
                    modalNoAsistire
                );

            } finally {

                confirmarNoAsistire.disabled =
                    false;

                confirmarNoAsistire.classList.remove(
                    "indicador-cargando"
                );
            }
        }
    );


    /* =====================================================
       COPIAR TEXTO
    ===================================================== */

    const copiarYape =
        $("copiarYape");

    const copiarYape2 =
        $("copiarYape2");

    const mensajeCopiado =
        $("mensajeCopiado");

    const mensajeCopiado2 =
        $("mensajeCopiado2");

    const copiarZoom =
        $("copiarZoom");

    const zoomCopiado =
        $("zoomCopiado");


    async function copiarTexto(
        texto,
        mensaje
    ) {

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

                textarea.style.left =
                    "-9999px";

                textarea.style.top =
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
                    function () {

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
    }


    on(
        copiarYape,
        "click",
        function () {

            copiarTexto(
                CONFIG.yapeNumero,
                mensajeCopiado
            );
        }
    );


    on(
        copiarYape2,
        "click",
        function () {

            copiarTexto(
                CONFIG.yapeNumero2,
                mensajeCopiado2
            );
        }
    );


    on(
        copiarZoom,
        "click",
        function () {

            const datosZoom =
                "ID de reunión: " +
                CONFIG.zoomId +
                "\nClave: " +
                CONFIG.zoomClave;

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


    function actualizarBotonMusica() {

        if (!botonMusica) return;

        botonMusica.setAttribute(
            "aria-label",
            musicaReproduciendo
                ? "Pausar música"
                : "Reproducir música"
        );

        botonMusica.setAttribute(
            "aria-pressed",
            musicaReproduciendo
                ? "true"
                : "false"
        );

        botonMusica.classList.toggle(
            "reproduciendo",
            musicaReproduciendo
        );
    }


    async function reproducirMusica() {

        if (!musica) {
            return false;
        }

        try {

            await musica.play();

            musicaReproduciendo =
                true;

            actualizarBotonMusica();

            return true;

        } catch (error) {

            console.warn(
                "El navegador no permitió reproducir la música.",
                error
            );

            musicaReproduciendo =
                false;

            actualizarBotonMusica();

            return false;
        }
    }


    function pausarMusica() {

        if (!musica) return;

        musica.pause();

        musicaReproduciendo =
            false;

        actualizarBotonMusica();
    }


    /*
     * SOLO EL BOTÓN PUEDE INICIAR LA MÚSICA.
     *
     * No hay autoplay.
     * No hay window.load.
     * No hay pointerdown global.
     */

    on(
        botonMusica,
        "click",
        function () {

            if (
                musicaReproduciendo
            ) {

                pausarMusica();

            } else {

                reproducirMusica();
            }
        }
    );


    on(
        musica,
        "play",
        function () {

            musicaReproduciendo =
                true;

            actualizarBotonMusica();
        }
    );


    on(
        musica,
        "pause",
        function () {

            musicaReproduciendo =
                false;

            actualizarBotonMusica();
        }
    );


    actualizarBotonMusica();


    /* =====================================================
       CALENDARIO
    ===================================================== */

    function crearEventoCalendario() {

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
            "https://calendar.google.com/calendar/render" +
            "?action=TEMPLATE" +
            "&text=" +
            titulo +
            "&dates=" +
            inicio +
            "/" +
            fin +
            "&details=" +
            detalles;

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );
    }


    const botonesCalendario =
        $$("[data-calendario]");


    botonesCalendario.forEach(
        function (boton) {

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
            ".evento-card, " +
            ".historia-header, " +
            ".galeria-wrapper, " +
            ".rsvp-card, " +
            ".regalo, " +
            ".regalos-final"
        );


    if (
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                function (
                    entradas,
                    observador
                ) {

                    entradas.forEach(
                        function (entrada) {

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
            function (elemento) {

                observer.observe(
                    elemento
                );
            }
        );

    } else {

        elementosAnimados.forEach(
            function (elemento) {

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
        function (event) {

            if (
                event.key !== "Escape"
            ) {
                return;
            }


            if (
                lightbox &&
                lightbox.classList.contains(
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


            for (
                let i = 0;
                i < modales.length;
                i++
            ) {

                const modal =
                    modales[i];

                if (
                    modal &&
                    modal.classList.contains(
                        "activo"
                    )
                ) {

                    cerrarModalFuncion(
                        modal
                    );

                    return;
                }
            }
        }
    );


    /* =====================================================
       TRAMPA DE FOCO PARA MODALES
    ===================================================== */

    on(
        document,
        "keydown",
        function (event) {

            if (
                event.key !== "Tab"
            ) {
                return;
            }


            const modales = [
                modalAsistencia,
                modalZoom,
                modalNoAsistire,
                mensajeExito
            ];


            for (
                let i = 0;
                i < modales.length;
                i++
            ) {

                const modal =
                    modales[i];

                if (
                    !modal ||
                    !modal.classList.contains(
                        "activo"
                    )
                ) {
                    continue;
                }


                const elementos =
                    Array.from(
                        modal.querySelectorAll(
                            "button, a, input, select, textarea, [tabindex]:not([tabindex='-1'])"
                        )
                    ).filter(
                        function (elemento) {

                            return (
                                !elemento.disabled &&
                                elemento.offsetParent !== null
                            );
                        }
                    );


                if (!elementos.length) {
                    continue;
                }


                const primero =
                    elementos[0];

                const ultimo =
                    elementos[
                        elementos.length - 1
                    ];


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

                break;
            }
        }
    );


    /* =====================================================
       VISIBILITYCHANGE
    ===================================================== */

    on(
        document,
        "visibilitychange",
        function () {

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
        function () {

            clearInterval(
                intervaloContador
            );

            if (musica) {
                musica.pause();
            }
        }
    );


    /* =====================================================
       INICIALIZACIÓN FINAL
    ===================================================== */

    if (aumentarTexto) {
        aumentarTexto.setAttribute(
            "aria-pressed",
            body.classList.contains(
                "texto-grande"
            )
                ? "true"
                : "false"
        );
    }

    if (contrasteTexto) {
        contrasteTexto.setAttribute(
            "aria-pressed",
            body.classList.contains(
                "alto-contraste"
            )
                ? "true"
                : "false"
        );
    }

});
