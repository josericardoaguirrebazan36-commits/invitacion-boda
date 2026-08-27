/* =====================================================
   INVITACIÓN DE BODA
   OMAR & WENDY
===================================================== */


/* =====================================================
   FUNCIONES AUXILIARES
===================================================== */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


/* =====================================================
   CONFIGURACIÓN
===================================================== */

const URL_GOOGLE_SCRIPT =
    "https://script.google.com/macros/s/AKfycbywp4BXSX_viv4KHA2MI0AUTD70ugkNtQ0e0Ah4laVR3RPf9TlowYJbGl3YbBf9uDA/exec";

const ZOOM_ENLACE =
    "https://us02web.zoom.us/j/740351363?pwd=MEYrV1VxZitlTDZDYUpYTUVJQlIwdz09";

const ZOOM_ID =
    "740-351-363";

const ZOOM_CLAVE =
    "323256";

const YAPE_NUMERO =
    "+51 992 418 572";


/* =====================================================
   CÓDIGO DEL INVITADO
===================================================== */

const parametros =
    new URLSearchParams(window.location.search);

const codigoInvitado =
    parametros.get("codigo");

console.log(
    "Código del invitado:",
    codigoInvitado
);


/* =====================================================
   GALERÍA
===================================================== */

const fotos =
    $$(".galeria-fotos img");

const lightbox =
    $("#lightbox");

const imagenGrande =
    $("#imagenGrande");

const cerrarLightboxBtn =
    $("#cerrarLightbox");

const galeria =
    $(".galeria-fotos");

let scrollActual = 0;


/* Abrir imagen */

fotos.forEach((foto) => {

    foto.addEventListener("click", () => {

        if (!lightbox || !imagenGrande) return;

        imagenGrande.src = foto.src;
        imagenGrande.alt = foto.alt;

        scrollActual =
            window.scrollY;

        document.documentElement.classList.add(
            "no-scroll"
        );

        document.body.classList.add(
            "no-scroll"
        );

        lightbox.classList.add(
            "activo"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );

    });

});


/* Cerrar lightbox */

function cerrarLightbox() {

    if (!lightbox) return;

    lightbox.classList.remove(
        "activo"
    );

    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );

    document.documentElement.classList.remove(
        "no-scroll"
    );

    document.body.classList.remove(
        "no-scroll"
    );

    setTimeout(() => {

        window.scrollTo({
            top: scrollActual,
            behavior: "instant"
        });

    }, 50);

}


if (cerrarLightboxBtn) {

    cerrarLightboxBtn.addEventListener(
        "click",
        cerrarLightbox
    );

}


if (lightbox) {

    lightbox.addEventListener(
        "click",
        (e) => {

            if (e.target === lightbox) {
                cerrarLightbox();
            }

        }
    );

}


/* =====================================================
   FLECHAS DE GALERÍA
===================================================== */

const botonDerecha =
    $(".flecha-galeria.derecha");

const botonIzquierda =
    $(".flecha-galeria.izquierda");


if (botonDerecha && galeria) {

    botonDerecha.addEventListener(
        "click",
        () => {

            galeria.scrollBy({
                left: 300,
                behavior: "smooth"
            });

        }
    );

}


if (botonIzquierda && galeria) {

    botonIzquierda.addEventListener(
        "click",
        () => {

            galeria.scrollBy({
                left: -300,
                behavior: "smooth"
            });

        }
    );

}


/* =====================================================
   CONTADOR
===================================================== */

const fechaBoda =
    new Date(
        "October 9, 2026 00:00:00"
    ).getTime();


function actualizarContador() {

    let diferencia =
        fechaBoda - Date.now();

    if (diferencia < 0) {
        diferencia = 0;
    }


    const dias =
        Math.floor(
            diferencia / 86400000
        );

    const horas =
        Math.floor(
            (diferencia % 86400000) /
            3600000
        );

    const minutos =
        Math.floor(
            (diferencia % 3600000) /
            60000
        );

    const segundos =
        Math.floor(
            (diferencia % 60000) /
            1000
        );


    if ($("#dias"))
        $("#dias").textContent =
            String(dias).padStart(2, "0");

    if ($("#horas"))
        $("#horas").textContent =
            String(horas).padStart(2, "0");

    if ($("#minutos"))
        $("#minutos").textContent =
            String(minutos).padStart(2, "0");

    if ($("#segundos"))
        $("#segundos").textContent =
            String(segundos).padStart(2, "0");

}


actualizarContador();

setInterval(
    actualizarContador,
    1000
);


/* =====================================================
   NOMBRE DEL INVITADO
===================================================== */

const nombreInvitado =
    $("#nombreInvitado");


/*
   Si posteriormente quieres que el nombre
   venga también desde Google Sheets,
   aquí podemos conectarlo.

   Por ahora mostramos el código únicamente
   en consola para no modificar el diseño.
*/

if (!codigoInvitado) {

    console.warn(
        "La invitación se abrió sin código."
    );

}


/* =====================================================
   ELEMENTOS DE CONFIRMACIÓN
===================================================== */

const btnAsistire =
    $("#btnAsistire");

const btnZoom =
    $("#btnZoom");

const btnNoAsistire =
    $("#btnNoAsistire");


/* =====================================================
   MODAL DE PERSONAS
===================================================== */

const modalAsistencia =
    $("#modalAsistencia");

const cerrarModal =
    $("#cerrarModal");

const restarPersona =
    $("#restarPersona");

const sumarPersona =
    $("#sumarPersona");

const cantidadPersonas =
    $("#cantidadPersonas");

const confirmarPresencial =
    $("#confirmarPresencial");

let cantidad = 1;


/* =====================================================
   MENSAJE DE ÉXITO
===================================================== */

const mensajeExito =
    $("#mensajeExito");

const textoExito =
    $("#textoExito");

const volverConfirmacion =
    $("#volverConfirmacion");


/* =====================================================
   MODAL PERSONALIZADO DE CONFIRMACIÓN
===================================================== */

/*
   Estos elementos corresponden a la ventana
   personalizada que reemplaza a window.confirm().
*/

const modalConfirmacion =
    $("#modalConfirmacion");

const textoModalConfirmacion =
    $("#textoModalConfirmacion");

const tituloModalConfirmacion =
    $("#tituloModalConfirmacion");

const iconoModalConfirmacion =
    $("#iconoModalConfirmacion");

const cancelarConfirmacion =
    $("#cancelarConfirmacion");

const aceptarConfirmacion =
    $("#aceptarConfirmacion");

let accionPendiente = null;


/* =====================================================
   MODAL ZOOM
===================================================== */

const modalZoom =
    $("#modalZoom");

const cerrarModalZoom =
    $("#cerrarModalZoom");

const enlaceZoom =
    $("#enlaceZoom");

const idZoom =
    $("#idZoom");

const claveZoom =
    $("#claveZoom");

const copiarZoom =
    $("#copiarZoom");

const abrirZoom =
    $("#abrirZoom");


/* =====================================================
   BLOQUEAR / DESBLOQUEAR SCROLL
===================================================== */

function bloquearScroll() {

    document.documentElement.classList.add(
        "no-scroll"
    );

    document.body.classList.add(
        "no-scroll"
    );

}


function desbloquearScroll() {

    document.documentElement.classList.remove(
        "no-scroll"
    );

    document.body.classList.remove(
        "no-scroll"
    );

}


/* =====================================================
   GOOGLE APPS SCRIPT
===================================================== */

async function enviarRespuesta(
    respuesta,
    personas
) {

    if (!codigoInvitado) {

        alert(
            "No se pudo identificar tu invitación. Por favor, utiliza el enlace que te enviaron."
        );

        return false;

    }


    const datos = {

        codigo:
            codigoInvitado,

        respuesta:
            respuesta,

        personas:
            personas

    };


    console.log(
        "Enviando respuesta:",
        datos
    );


    try {

        await fetch(
            URL_GOOGLE_SCRIPT,
            {

                method: "POST",

                mode: "no-cors",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(datos)

            }
        );


        return true;

    } catch (error) {

        console.error(
            "Error al registrar respuesta:",
            error
        );

        return false;

    }

}


/* =====================================================
   ACTUALIZAR CANTIDAD
===================================================== */

function actualizarCantidad() {

    if (!cantidadPersonas) return;

    cantidadPersonas.textContent =
        cantidad;


    const texto =
        cantidad === 1
            ? "persona"
            : "personas";


    const pequeno =
        cantidadPersonas.parentElement
            ?.querySelector("small");


    if (pequeno) {

        pequeno.textContent =
            texto;

    }

}


/* =====================================================
   ABRIR MODAL DE PERSONAS
===================================================== */

if (btnAsistire) {

    btnAsistire.addEventListener(
        "click",
        () => {

            cantidad = 1;

            actualizarCantidad();

            if (modalAsistencia) {

                modalAsistencia.classList.add(
                    "activo"
                );

                modalAsistencia.setAttribute(
                    "aria-hidden",
                    "false"
                );

            }

            bloquearScroll();

        }
    );

}


/* =====================================================
   SUMAR PERSONA
===================================================== */

if (sumarPersona) {

    sumarPersona.addEventListener(
        "click",
        () => {

            if (cantidad < 10) {

                cantidad++;

                actualizarCantidad();

            }

        }
    );

}


/* =====================================================
   RESTAR PERSONA
===================================================== */

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


/* =====================================================
   CERRAR MODAL PERSONAS
===================================================== */

function cerrarVentanaAsistencia() {

    if (!modalAsistencia) return;

    modalAsistencia.classList.remove(
        "activo"
    );

    modalAsistencia.setAttribute(
        "aria-hidden",
        "true"
    );

    desbloquearScroll();

}


if (cerrarModal) {

    cerrarModal.addEventListener(
        "click",
        cerrarVentanaAsistencia
    );

}


if (modalAsistencia) {

    modalAsistencia.addEventListener(
        "click",
        (e) => {

            if (e.target === modalAsistencia) {

                cerrarVentanaAsistencia();

            }

        }
    );

}


/* =====================================================
   CONFIRMAR ASISTENCIA PRESENCIAL
===================================================== */

if (confirmarPresencial) {

    confirmarPresencial.addEventListener(
        "click",
        async () => {

            if (confirmarPresencial.disabled)
                return;


            confirmarPresencial.disabled =
                true;

            confirmarPresencial.textContent =
                "ENVIANDO...";


            const enviado =
                await enviarRespuesta(
                    "Sí, ahí estaré",
                    cantidad
                );


            if (enviado) {

                cerrarVentanaAsistencia();


                mostrarMensajeExito(
                    `Hemos registrado tu asistencia para ${cantidad} ${
                        cantidad === 1
                            ? "persona"
                            : "personas"
                    }. ¡Nos alegra mucho contar contigo! ❤️`
                );

            } else {

                alert(
                    "No se pudo registrar la confirmación. Por favor, inténtalo nuevamente."
                );

            }


            confirmarPresencial.disabled =
                false;

            confirmarPresencial.textContent =
                "CONFIRMAR ASISTENCIA";

        }
    );

}


/* =====================================================
   MODAL PERSONALIZADO
===================================================== */

function abrirConfirmacion(
    tipo
) {

    accionPendiente =
        tipo;


    if (!modalConfirmacion)
        return;


    if (
        tipo === "zoom"
    ) {

        if (tituloModalConfirmacion)
            tituloModalConfirmacion.textContent =
                "Confirmar asistencia";

        if (textoModalConfirmacion)
            textoModalConfirmacion.textContent =
                "¿Confirmas que participarás de la boda por Zoom?";

        if (iconoModalConfirmacion)
            iconoModalConfirmacion.textContent =
                "💻";

        if (aceptarConfirmacion)
            aceptarConfirmacion.textContent =
                "SÍ, CONFIRMAR";

    }


    if (
        tipo === "no"
    ) {

        if (tituloModalConfirmacion)
            tituloModalConfirmacion.textContent =
                "Confirmar respuesta";

        if (textoModalConfirmacion)
            textoModalConfirmacion.textContent =
                "¿Confirmas que no podrás asistir a la celebración?";

        if (iconoModalConfirmacion)
            iconoModalConfirmacion.textContent =
                "🤍";

        if (aceptarConfirmacion)
            aceptarConfirmacion.textContent =
                "SÍ, CONFIRMAR";

    }


    modalConfirmacion.classList.add(
        "activo"
    );

    modalConfirmacion.setAttribute(
        "aria-hidden",
        "false"
    );

    bloquearScroll();

}


function cerrarConfirmacion() {

    if (!modalConfirmacion)
        return;

    modalConfirmacion.classList.remove(
        "activo"
    );

    modalConfirmacion.setAttribute(
        "aria-hidden",
        "true"
    );

    accionPendiente =
        null;

    desbloquearScroll();

}


/* =====================================================
   BOTÓN ZOOM
===================================================== */

if (btnZoom) {

    btnZoom.addEventListener(
        "click",
        () => {

            abrirConfirmacion(
                "zoom"
            );

        }
    );

}


/* =====================================================
   BOTÓN NO ASISTIR
===================================================== */

if (btnNoAsistire) {

    btnNoAsistire.addEventListener(
        "click",
        () => {

            abrirConfirmacion(
                "no"
            );

        }
    );

}


/* =====================================================
   CANCELAR MODAL PERSONALIZADO
===================================================== */

if (cancelarConfirmacion) {

    cancelarConfirmacion.addEventListener(
        "click",
        cerrarConfirmacion
    );

}


/* =====================================================
   CLIC FUERA DEL MODAL
===================================================== */

if (modalConfirmacion) {

    modalConfirmacion.addEventListener(
        "click",
        (e) => {

            if (
                e.target ===
                modalConfirmacion
            ) {

                cerrarConfirmacion();

            }

        }
    );

}


/* =====================================================
   ACEPTAR CONFIRMACIÓN
===================================================== */

if (aceptarConfirmacion) {

    aceptarConfirmacion.addEventListener(
        "click",
        async () => {

            if (!accionPendiente)
                return;


            const accion =
                accionPendiente;


            aceptarConfirmacion.disabled =
                true;

            aceptarConfirmacion.textContent =
                "REGISTRANDO...";


            let enviado = false;


            /* ==============================
               ZOOM
            ============================== */

            if (accion === "zoom") {

                enviado =
                    await enviarRespuesta(
                        "Sí, pero podré asistir por Zoom",
                        0
                    );


                if (enviado) {

                    cerrarConfirmacion();

                    mostrarMensajeExito(
                        "Hemos registrado que nos acompañarás por Zoom. ¡Será una alegría tenerte con nosotros! ❤️"
                    );

                    setTimeout(
                        mostrarModalZoom,
                        500
                    );

                }

            }


            /* ==============================
               NO ASISTIRÁ
            ============================== */

            if (accion === "no") {

                enviado =
                    await enviarRespuesta(
                        "Disculpa, no podré asistir",
                        0
                    );


                if (enviado) {

                    cerrarConfirmacion();

                    mostrarMensajeExito(
                        "Gracias por avisarnos. Agradecemos mucho que nos hayas confirmado tu respuesta. ❤️"
                    );

                }

            }


            if (!enviado) {

                alert(
                    "No se pudo registrar la respuesta. Por favor, inténtalo nuevamente."
                );

            }


            aceptarConfirmacion.disabled =
                false;

            aceptarConfirmacion.textContent =
                "SÍ, CONFIRMAR";

        }
    );

}


/* =====================================================
   MENSAJE DE ÉXITO
===================================================== */

function mostrarMensajeExito(
    mensaje
) {

    if (!mensajeExito)
        return;


    if (textoExito)
        textoExito.textContent =
            mensaje;


    mensajeExito.classList.add(
        "mostrar"
    );

    mensajeExito.setAttribute(
        "aria-hidden",
        "false"
    );

    bloquearScroll();

}


/* =====================================================
   CERRAR MENSAJE DE ÉXITO
===================================================== */

if (volverConfirmacion) {

    volverConfirmacion.addEventListener(
        "click",
        () => {

            if (mensajeExito) {

                mensajeExito.classList.remove(
                    "mostrar"
                );

                mensajeExito.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }

            desbloquearScroll();

        }
    );

}


/* =====================================================
   MODAL ZOOM
===================================================== */

function mostrarModalZoom() {

    if (!modalZoom)
        return;


    if (enlaceZoom) {

        enlaceZoom.textContent =
            ZOOM_ENLACE;

        enlaceZoom.href =
            ZOOM_ENLACE;

    }


    if (idZoom)
        idZoom.textContent =
            ZOOM_ID;


    if (claveZoom)
        claveZoom.textContent =
            ZOOM_CLAVE;


    modalZoom.classList.add(
        "activo"
    );

    modalZoom.setAttribute(
        "aria-hidden",
        "false"
    );

    bloquearScroll();

}


/* =====================================================
   CERRAR MODAL ZOOM
===================================================== */

function cerrarVentanaZoom() {

    if (!modalZoom)
        return;


    modalZoom.classList.remove(
        "activo"
    );

    modalZoom.setAttribute(
        "aria-hidden",
        "true"
    );

    desbloquearScroll();

}


if (cerrarModalZoom) {

    cerrarModalZoom.addEventListener(
        "click",
        cerrarVentanaZoom
    );

}


if (modalZoom) {

    modalZoom.addEventListener(
        "click",
        (e) => {

            if (
                e.target === modalZoom
            ) {

                cerrarVentanaZoom();

            }

        }
    );

}


/* =====================================================
   COPIAR ENLACE ZOOM
===================================================== */

if (copiarZoom) {

    copiarZoom.addEventListener(
        "click",
        async () => {

            try {

                await navigator.clipboard.writeText(
                    ZOOM_ENLACE
                );


                const textoOriginal =
                    copiarZoom.textContent;


                copiarZoom.textContent =
                    "✓ ENLACE COPIADO";


                copiarZoom.classList.add(
                    "copiado"
                );


                setTimeout(
                    () => {

                        copiarZoom.textContent =
                            textoOriginal;

                        copiarZoom.classList.remove(
                            "copiado"
                        );

                    },
                    2200
                );


            } catch (error) {

                console.error(
                    "No se pudo copiar:",
                    error
                );

                copiarTextoFallback(
                    ZOOM_ENLACE
                );

            }

        }
    );

}


/* =====================================================
   ABRIR ZOOM
===================================================== */

if (abrirZoom) {

    abrirZoom.addEventListener(
        "click",
        () => {

            window.open(
                ZOOM_ENLACE,
                "_blank",
                "noopener,noreferrer"
            );

        }
    );

}


/* =====================================================
   COPIAR YAPE
===================================================== */

/*
   Compatible con cualquiera de estos IDs:

   #copiarYape
   #copiarNumeroYape
*/

const copiarYape =
    $("#copiarYape") ||
    $("#copiarNumeroYape");


async function copiarNumeroYape() {

    try {

        await navigator.clipboard.writeText(
            YAPE_NUMERO
        );


        if (copiarYape) {

            const textoOriginal =
                copiarYape.textContent;


            copiarYape.textContent =
                "✓ NÚMERO COPIADO";


            copiarYape.classList.add(
                "copiado"
            );


            setTimeout(
                () => {

                    copiarYape.textContent =
                        textoOriginal;

                    copiarYape.classList.remove(
                        "copiado"
                    );

                },
                2200
            );

        }


    } catch (error) {

        console.error(
            "No se pudo copiar el número:",
            error
        );

        copiarTextoFallback(
            YAPE_NUMERO
        );

    }

}


if (copiarYape) {

    copiarYape.addEventListener(
        "click",
        copiarNumeroYape
    );

}


/* =====================================================
   COPIAR TEXTO DE RESPALDO
===================================================== */

function copiarTextoFallback(
    texto
) {

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

    textarea.select();

    try {

        document.execCommand(
            "copy"
        );

    } catch (error) {

        console.error(
            "No se pudo copiar:",
            error
        );

    }

    textarea.remove();

}


/* =====================================================
   CALENDARIO
===================================================== */

const btnMostrarCalendario =
    $("#btnMostrarCalendario");

const opcionesCalendario =
    $("#opcionesCalendario");


if (
    btnMostrarCalendario &&
    opcionesCalendario
) {

    btnMostrarCalendario.addEventListener(
        "click",
        () => {

            opcionesCalendario.classList.toggle(
                "mostrar"
            );


            const abierto =
                opcionesCalendario.classList.contains(
                    "mostrar"
                );


            btnMostrarCalendario.setAttribute(
                "aria-expanded",
                abierto
            );

        }
    );

}


/* =====================================================
   MÚSICA
===================================================== */

const musica =
    $("#musicaBoda");

const botonMusica =
    $("#botonMusica");

let reproduciendo =
    false;


if (
    musica &&
    botonMusica
) {

    botonMusica.addEventListener(
        "click",
        async () => {

            try {

                if (!reproduciendo) {

                    await musica.play();

                    reproduciendo =
                        true;

                    botonMusica.textContent =
                        "⏸";

                    botonMusica.classList.add(
                        "reproduciendo"
                    );

                    botonMusica.setAttribute(
                        "aria-label",
                        "Pausar música"
                    );

                } else {

                    musica.pause();

                    reproduciendo =
                        false;

                    botonMusica.textContent =
                        "🎵";

                    botonMusica.classList.remove(
                        "reproduciendo"
                    );

                    botonMusica.setAttribute(
                        "aria-label",
                        "Reproducir música"
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
   EVITAR ARRASTRAR IMÁGENES
===================================================== */

fotos.forEach(
    (foto) => {

        foto.addEventListener(
            "dragstart",
            (e) => {

                e.preventDefault();

            }
        );

    }
);


/* =====================================================
   TECLA ESC
===================================================== */

document.addEventListener(
    "keydown",
    (e) => {

        if (e.key !== "Escape")
            return;


        if (
            lightbox &&
            lightbox.classList.contains(
                "activo"
            )
        ) {

            cerrarLightbox();

            return;

        }


        if (
            modalAsistencia &&
            modalAsistencia.classList.contains(
                "activo"
            )
        ) {

            cerrarVentanaAsistencia();

            return;

        }


        if (
            modalConfirmacion &&
            modalConfirmacion.classList.contains(
                "activo"
            )
        ) {

            cerrarConfirmacion();

            return;

        }


        if (
            modalZoom &&
            modalZoom.classList.contains(
                "activo"
            )
        ) {

            cerrarVentanaZoom();

            return;

        }


        if (
            mensajeExito &&
            mensajeExito.classList.contains(
                "mostrar"
            )
        ) {

            mensajeExito.classList.remove(
                "mostrar"
            );

            mensajeExito.setAttribute(
                "aria-hidden",
                "true"
            );

            desbloquearScroll();

        }

    }
);


/* =====================================================
   EVITAR DOBLE CLIC PARA ZOOM
===================================================== */

document.addEventListener(
    "dblclick",
    (e) => {

        e.preventDefault();

    },
    {
        passive: false
    }
);


/* =====================================================
   INICIALIZACIÓN
===================================================== */

actualizarCantidad();

console.log(
    "Invitación de boda cargada correctamente."
);

console.log(
    "Código:",
    codigoInvitado || "No especificado"
);

console.log(
    "Zoom:",
    ZOOM_ID
);

console.log(
    "Yape:",
    YAPE_NUMERO
);
