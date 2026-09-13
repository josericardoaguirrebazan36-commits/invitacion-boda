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
     * Fecha de la boda:
     * 9 de octubre de 2026
     * 4:00 p. m.
     * Hora de Lima, Perú: UTC-5
     *
     * IMPORTANTE:
     * Mantén esta hora sincronizada con la hora
     * mostrada en el HTML.
     */
    fechaBoda: new Date(
        "2026-10-09T16:00:00-05:00"
    ),

    /*
     * URL de Google Apps Script.
     * Déjala vacía si todavía no la utilizas.
     */
    googleScriptUrl: "https://script.google.com/macros/s/AKfycbwDqd04rZS957Zi6sMJTnmDQSCzyHuX5JTDYUZjajNCekJogwuHQHUacK0znV9Br9FX/exec",

    /*
     * Máximo de personas permitidas
     */
    maxPersonas: 10,

    /*
     * Números de Yape
     */
    numeroYape: "+51 992 418 572",

    /*
     * Si tienes un segundo número de Yape,
     * colócalo aquí.
     *
     * Si no lo tienes, déjalo vacío.
     */
    numeroYape2: "",

    /*
     * Datos de Zoom
     */
    zoomId: "740 351 363",

    zoomClave: "323256"

};


/* =====================================================
   UTILIDADES
===================================================== */

const $ = id => document.getElementById(id);


const $$ = selector =>
    Array.from(
        document.querySelectorAll(selector)
    );


/* =====================================================
   CÓDIGO PERSONALIZADO DE LA INVITACIÓN
===================================================== */

/*
 * El enlace puede tener esta forma:
 * https://tusitio.com/?codigo=001
 *
 * El código se envía a Google Apps Script
 * para localizar al invitado en la hoja de cálculo.
 */
const parametrosURL =
    new URLSearchParams(window.location.search);

const codigoInvitado =
    (parametrosURL.get("codigo") || "").trim();


/* =====================================================
   ACCESIBILIDAD
===================================================== */

const prefiereMenosMovimiento =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let ultimoElementoEnfocado = null;

function guardarFoco() {
    const activo = document.activeElement;

    if (activo && activo !== document.body) {
        ultimoElementoEnfocado = activo;
    }
}

function restaurarFoco() {
    if (
        ultimoElementoEnfocado &&
        typeof ultimoElementoEnfocado.focus === "function"
    ) {
        setTimeout(() => {
            ultimoElementoEnfocado.focus();
        }, 0);
    }

    ultimoElementoEnfocado = null;
}

function elementosEnfocables(contenedor) {
    if (!contenedor) {
        return [];
    }

    return Array.from(
        contenedor.querySelectorAll(
            "a[href], button:not([disabled]), input:not([disabled]), " +
            "textarea:not([disabled]), select:not([disabled]), " +
            "[tabindex]:not([tabindex='-1'])"
        )
    ).filter(
        elemento =>
            !elemento.hasAttribute("hidden") &&
            elemento.getAttribute("aria-hidden") !== "true"
    );
}

function mantenerFocoEnModal(event, modal) {
    if (
        !modal ||
        !modal.classList.contains("activo") ||
        event.key !== "Tab"
    ) {
        return;
    }

    const enfocable = elementosEnfocables(modal);

    if (!enfocable.length) {
        event.preventDefault();
        return;
    }

    const primero = enfocable[0];
    const ultimo = enfocable[enfocable.length - 1];

    if (event.shiftKey && document.activeElement === primero) {
        event.preventDefault();
        ultimo.focus();
    } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        primero.focus();
    }
}


function on(
    element,
    event,
    callback,
    options
) {

    if (!element) {
        return;
    }

    element.addEventListener(
        event,
        callback,
        options
    );

}


function setText(
    element,
    value
) {

    if (!element) {
        return;
    }

    element.textContent = value;

}


function toggleClass(
    element,
    className,
    force
) {

    if (!element) {
        return;
    }

    element.classList.toggle(
        className,
        force
    );

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


const fechaBoda =
    CONFIG.fechaBoda;


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
     * dejamos el contador en cero.
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

    return Math.min(
        2,
        fotos.length
    );

}


function actualizarGaleria() {

    if (!fotos.length) {
        return;
    }


    const visibles =
        obtenerFotosVisibles();


    /*
     * Si todas las fotos caben,
     * las mostramos todas.
     */

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


    guardarFoco();

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

    restaurarFoco();

}


fotos.forEach(
    foto => {

        if (!foto.hasAttribute("tabindex")) {
            foto.setAttribute("tabindex", "0");
        }

        if (!foto.hasAttribute("role")) {
            foto.setAttribute("role", "button");
        }

        if (!foto.hasAttribute("aria-label")) {
            foto.setAttribute(
                "aria-label",
                "Abrir fotografía en tamaño grande"
            );
        }

        on(
            foto,
            "click",
            () =>
                abrirLightbox(foto)
        );

        on(
            foto,
            "keydown",
            event => {

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

        console.warn(
            "No se encontró el modal solicitado."
        );

        return;

    }


    guardarFoco();

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

        restaurarFoco();

    }

}


function cerrarTodosLosModales() {

    Object.values(modales)
        .forEach(
            modal => {

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

            }
        );


    document.body.classList.remove(
        "no-scroll"
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
   BOTONES PRINCIPALES
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


/* =====================================================
   ASISTENCIA PRESENCIAL
===================================================== */

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


/* =====================================================
   ESTADO DE CONFIRMACIÓN DEL INVITADO
===================================================== */

const estadoRsvp = $("estadoRsvp");
const textoEstadoRsvp = $("textoEstadoRsvp");

/* Guardamos la respuesta por código para mantenerla al recargar. */
const claveRsvp =
    `rsvpConfirmado_${codigoInvitado || window.location.pathname}`;

function mostrarEstadoRsvp(tipo, personas = 0) {
    const opciones = document.querySelector(".rsvp-opciones");
    const titulo = document.querySelector("#confirmacion h2");

    if (opciones) {
        opciones.hidden = true;
    }

    if (titulo) {
        titulo.textContent = "¡Gracias por confirmar!";
    }

    if (textoEstadoRsvp) {
        let mensaje =
            "Tu confirmación ya fue registrada. Muchas gracias por acompañarnos.";

        if (tipo === "presencial") {
            mensaje =
                `Tu asistencia presencial para ${personas} ${
                    personas === 1 ? "persona" : "personas"
                } ya fue registrada. ¡Muchas gracias por acompañarnos!`;
        } else if (tipo === "zoom") {
            mensaje =
                "Tu confirmación para acompañarnos por Zoom ya fue registrada. ¡Muchas gracias!";
        } else if (tipo === "no_asistire") {
            mensaje =
                "Tu respuesta ya fue registrada. Muchas gracias por avisarnos.";
        }

        textoEstadoRsvp.textContent = mensaje;
    }

    if (estadoRsvp) {
        estadoRsvp.hidden = false;
        estadoRsvp.classList.add("visible");
    }
}

function guardarEstadoRsvp(tipo, personas = 0) {
    try {
        localStorage.setItem(
            claveRsvp,
            JSON.stringify({
                confirmado: true,
                tipo,
                personas,
                fecha: new Date().toISOString()
            })
        );
    } catch (error) {
        console.warn("No se pudo guardar el estado de confirmación.", error);
    }

    mostrarEstadoRsvp(tipo, personas);
}

function cargarEstadoRsvp() {
    try {
        const guardado = localStorage.getItem(claveRsvp);

        if (!guardado) {
            return;
        }

        const respuesta = JSON.parse(guardado);

        if (respuesta && respuesta.confirmado) {
            mostrarEstadoRsvp(
                respuesta.tipo || "presencial",
                Number(respuesta.personas) || 1
            );
        }
    } catch (error) {
        console.warn("No se pudo recuperar la confirmación.", error);
    }
}


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
   CONFIRMACIONES
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
            }. ¡Nos alegra mucho contar contigo!
            `;


        case "zoom":

            return "Hemos registrado que nos acompañarás por Zoom. ¡Muchas gracias por estar con nosotros!";


        case "no_asistire":

            return "Hemos registrado tu respuesta. Muchas gracias por avisarnos y por ser parte de este momento tan especial.";


        default:

            return "Hemos registrado tu respuesta. Muchas gracias por avisarnos.";

    }

}


/* =====================================================
   ESTADO DE CARGA DE LA CONFIRMACIÓN
===================================================== */

/*
 * Muestra un indicador de carga mientras esperamos
 * a que Google Apps Script procese la respuesta.
 */
function mostrarCargandoConfirmacion() {

    const boton =
        $("confirmarPresencial");

    if (!boton) {
        return;
    }

    boton.disabled = true;
    boton.setAttribute(
        "aria-busy",
        "true"
    );

    /*
     * Guardamos el texto original para restaurarlo
     * si fuera necesario.
     */
    if (!boton.dataset.textoOriginal) {
        boton.dataset.textoOriginal =
            boton.textContent.trim();
    }

    boton.innerHTML = `
        <span
            class="indicador-cargando"
            aria-hidden="true"
        ></span>
        <span>Confirmando...</span>
    `;

    /*
     * El estilo se agrega aquí para que no dependa
     * de cambios adicionales en tu archivo CSS.
     */
    const estilo =
        document.createElement("style");

    estilo.id =
        "estilo-indicador-cargando";

    estilo.textContent = `
        .indicador-cargando {
            display: inline-block;
            width: 1.15em;
            height: 1.15em;
            margin-right: 0.55em;
            border: 0.16em solid currentColor;
            border-right-color: transparent;
            border-radius: 50%;
            vertical-align: -0.2em;
            animation: girar-indicador 0.8s linear infinite;
        }

        @keyframes girar-indicador {
            to {
                transform: rotate(360deg);
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .indicador-cargando {
                animation: none;
                border-right-color: currentColor;
                opacity: 0.65;
            }
        }
    `;

    if (!document.getElementById(
        "estilo-indicador-cargando"
    )) {
        document.head.appendChild(estilo);
    }

}


function restaurarBotonConfirmacion() {

    const boton =
        $("confirmarPresencial");

    if (!boton) {
        return;
    }

    boton.disabled = false;
    boton.removeAttribute(
        "aria-busy"
    );

    const textoOriginal =
        boton.dataset.textoOriginal;

    if (textoOriginal) {
        boton.textContent =
            textoOriginal;
    }

}


/* =====================================================
   ENVÍO DE CONFIRMACIÓN
===================================================== */

async function enviarConfirmacion(
    tipo,
    personas = 0
) {

    const datos = {

        /*
         * Código personalizado de la invitación.
         * Ejemplo: 001, 002, 003...
         */
        codigo: codigoInvitado,

        /*
         * "respuesta" coincide con lo que espera
         * Google Apps Script.
         */
        respuesta: tipo,

        /*
         * Conservamos "tipo" por compatibilidad
         * con versiones anteriores del sistema.
         */
        tipo,

        personas,

        fecha:
            new Date().toISOString()

    };


    /*
     * Si Google Apps Script está activo, necesitamos
     * el código personalizado para saber qué fila
     * debe actualizarse.
     */
    if (
        CONFIG.googleScriptUrl &&
        !codigoInvitado
    ) {

        restaurarBotonConfirmacion();

        mostrarExito(
            "No encontramos el código de tu invitación. Por favor, utiliza el enlace personalizado que recibiste."
        );

        return;

    }


    /*
     * Si no hay Google Apps Script,
     * la confirmación funciona igualmente
     * de forma visual.
     */

    if (!CONFIG.googleScriptUrl) {

        guardarEstadoRsvp(
            tipo,
            personas
        );

        guardarEstadoRsvp(
            tipo,
            personas
        );

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


        restaurarBotonConfirmacion();

        mostrarExito(
            "No pudimos confirmar el envío en este momento. Por favor, revisa tu conexión e inténtalo nuevamente. Si el problema continúa, comunícate con Omar Ulloa al +51 992 418 572."
        );

    }

}


const confirmarPresencial =
    $("confirmarPresencial");


const confirmarZoom =
    $("confirmarZoom");


const confirmarNoAsistire =
    $("confirmarNoAsistire");


on(
    confirmarPresencial,
    "click",
    async () => {

        /*
         * Evita dobles envíos y muestra el indicador
         * inmediatamente después de confirmar.
         */
        mostrarCargandoConfirmacion();

        await enviarConfirmacion(
            "presencial",
            cantidad
        );

    }
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

    if (!texto) {
        return false;
    }


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
     * Método alternativo
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
   COPIAR NÚMEROS DE YAPE
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


    /*
     * Si no existe el botón o no hay número,
     * simplemente no hacemos nada.
     */

    if (
        !boton ||
        !numero
    ) {

        return;

    }


    on(
        boton,
        "click",
        async () => {

            const copiado =
                await copiarTexto(
                    numero
                );


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

    } catch (error) {

        /*
         * Los navegadores pueden bloquear
         * el autoplay.
         */

        console.log(
            "Autoplay bloqueado. Esperando interacción del usuario."
        );

    }

}


/* =====================================================
   AUTOPLAY
===================================================== */

window.addEventListener(
    "load",
    () => {

        if (!prefiereMenosMovimiento) {
            reproducirMusica();
        }

    }
);


/* =====================================================
   PRIMERA INTERACCIÓN
===================================================== */

function iniciarMusicaConInteraccion() {

    if (
        prefiereMenosMovimiento ||
        !musica
    ) {
        return;
    }


    if (musica.paused) {

        musica.play()
            .catch(() => {});

    }

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

            if (!musica.paused) {

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


actualizarEstadoMusica();


/* Recuperar la confirmación al volver a abrir o recargar la invitación */
cargarEstadoRsvp();


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
   ANIMACIONES AL HACER SCROLL
===================================================== */

const elementosAnimados =
    $(
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
   CERRAR CON ESC
===================================================== */

on(
    document,
    "keydown",
    event => {

        if (event.key === "Escape") {
            cerrarGaleria();
            cerrarTodosLosModales();
            return;
        }

        if (event.key !== "Tab") {
            return;
        }

        const modalActivo =
            Object.values(modales).find(
                modal =>
                    modal &&
                    modal.classList.contains("activo")
            );

        if (modalActivo) {
            mantenerFocoEnModal(
                event,
                modalActivo
            );
        }

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
   COMPROBACIÓN FINAL
===================================================== */

console.log(
    "✓ Invitación de boda de Omar & Wendy cargada correctamente."
);


console.log(
    "✓ Contador:",
    fechaBoda.toLocaleString(
        "es-PE",
        {
            timeZone:
                "America/Lima"
        }
    )
);

console.log(
    "✓ Código de invitación:",
    codigoInvitado || "(no proporcionado)"
);


/* =====================================================
   LIMPIEZA AL CERRAR LA PÁGINA
===================================================== */

window.addEventListener(
    "beforeunload",
    () => {

        clearInterval(
            intervaloContador
        );

    }
);

});
