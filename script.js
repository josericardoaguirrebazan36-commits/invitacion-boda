/* =====================================================
   FUNCIONES AUXILIARES
===================================================== */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);


/* =====================================================
   GALERÍA
===================================================== */

const fotos = $$(".galeria-fotos img");

const lightbox = $("#lightbox");

const imagenGrande = $("#imagenGrande");

const cerrarLightboxBtn = $("#cerrarLightbox");

const galeria = $(".galeria-fotos");

let scrollActual = 0;


/* Abrir imagen */

fotos.forEach((foto) => {

    foto.addEventListener("click", () => {

        imagenGrande.src = foto.src;

        imagenGrande.alt = foto.alt;

        scrollActual = window.scrollY;

        document.documentElement.classList.add("no-scroll");

        document.body.classList.add("no-scroll");

        lightbox.classList.add("activo");

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );

    });

});


/* Cerrar lightbox */

function cerrarLightbox() {

    lightbox.classList.remove("activo");

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


cerrarLightboxBtn.addEventListener(
    "click",
    cerrarLightbox
);


/* Cerrar haciendo clic fuera */

lightbox.addEventListener(
    "click",
    (e) => {

        if (e.target === lightbox) {

            cerrarLightbox();

        }

    }
);


/* Cerrar con ESC */

document.addEventListener(
    "keydown",
    (e) => {

        if (
            e.key === "Escape" &&
            lightbox.classList.contains("activo")
        ) {

            cerrarLightbox();

        }

    }
);


/* =====================================================
   FLECHAS GALERÍA
===================================================== */

const botonDerecha =
    $(".flecha-galeria.derecha");

const botonIzquierda =
    $(".flecha-galeria.izquierda");


if (botonDerecha) {

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


if (botonIzquierda) {

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


    if (diferencia <= 0) {

        diferencia = 0;

    }


    const dias =
        Math.floor(
            diferencia / 86400000
        );


    const horas =
        Math.floor(
            (diferencia % 86400000)
            / 3600000
        );


    const minutos =
        Math.floor(
            (diferencia % 3600000)
            / 60000
        );


    const segundos =
        Math.floor(
            (diferencia % 60000)
            / 1000
        );


    $("#dias").textContent =
        String(dias).padStart(2, "0");


    $("#horas").textContent =
        String(horas).padStart(2, "0");


    $("#minutos").textContent =
        String(minutos).padStart(2, "0");


    $("#segundos").textContent =
        String(segundos).padStart(2, "0");

}


actualizarContador();

setInterval(
    actualizarContador,
    1000
);


/* =====================================================
   CÓDIGO DEL INVITADO
===================================================== */

/*
   El código se obtiene automáticamente
   desde la URL.

   Ejemplo:

   ?codigo=001

   ?codigo=002

   ?codigo=003
*/

const parametros =
    new URLSearchParams(
        window.location.search
    );


const codigoInvitado =
    parametros.get("codigo");


console.log(
    "Código del invitado:",
    codigoInvitado
);


/* =====================================================
   CONFIRMACIÓN
===================================================== */

const btnAsistire =
    $("#btnAsistire");

const btnZoom =
    $("#btnZoom");

const btnNoAsistire =
    $("#btnNoAsistire");

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

const mensajeExito =
    $("#mensajeExito");

const textoExito =
    $("#textoExito");

const volverConfirmacion =
    $("#volverConfirmacion");


/* =====================================================
   GOOGLE APPS SCRIPT
===================================================== */

const URL_GOOGLE_SCRIPT =
    "https://script.google.com/macros/s/AKfycbywp4BXSX_viv4KHA2MI0AUTD70ugkNtQ0e0Ah4laVR3RPf9TlowYJbGl3YbBf9uDA/exec";


/* =====================================================
   CANTIDAD DE PERSONAS
===================================================== */

let cantidad = 1;


/* =====================================================
   FUNCIÓN PARA ENVIAR RESPUESTA
===================================================== */

async function enviarRespuesta(
    respuesta,
    personas
) {

    /*
       Primero comprobamos que exista
       el código del invitado.
    */

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
            "Error al enviar:",
            error
        );

        return false;

    }

}


/* =====================================================
   ABRIR MODAL DE PERSONAS
===================================================== */

btnAsistire.addEventListener(
    "click",
    () => {

        cantidad = 1;

        actualizarCantidad();

        modalAsistencia.classList.add(
            "activo"
        );

        modalAsistencia.setAttribute(
            "aria-hidden",
            "false"
        );

        document.documentElement.classList.add(
            "no-scroll"
        );

        document.body.classList.add(
            "no-scroll"
        );

    }
);


/* =====================================================
   ACTUALIZAR CANTIDAD
===================================================== */

function actualizarCantidad() {

    cantidadPersonas.textContent =
        cantidad;


    const texto =
        cantidad === 1
            ? "persona"
            : "personas";


    const pequeno =
        cantidadPersonas
            .parentElement
            .querySelector("small");


    if (pequeno) {

        pequeno.textContent =
            texto;

    }

}


/* =====================================================
   RESTAR PERSONA
===================================================== */

restarPersona.addEventListener(
    "click",
    () => {

        if (cantidad > 1) {

            cantidad--;

            actualizarCantidad();

        }

    }
);


/* =====================================================
   SUMAR PERSONA
===================================================== */

sumarPersona.addEventListener(
    "click",
    () => {

        /*
           Máximo de 10 personas.
        */

        if (cantidad < 10) {

            cantidad++;

            actualizarCantidad();

        }

    }
);


/* =====================================================
   CERRAR MODAL
===================================================== */

function cerrarVentanaAsistencia() {

    modalAsistencia.classList.remove(
        "activo"
    );

    modalAsistencia.setAttribute(
        "aria-hidden",
        "true"
    );

    document.documentElement.classList.remove(
        "no-scroll"
    );

    document.body.classList.remove(
        "no-scroll"
    );

}


cerrarModal.addEventListener(
    "click",
    cerrarVentanaAsistencia
);


/* Clic fuera */

modalAsistencia.addEventListener(
    "click",
    (e) => {

        if (e.target === modalAsistencia) {

            cerrarVentanaAsistencia();

        }

    }
);


/* ESC */

document.addEventListener(
    "keydown",
    (e) => {

        if (
            e.key === "Escape" &&
            modalAsistencia.classList.contains(
                "activo"
            )
        ) {

            cerrarVentanaAsistencia();

        }

    }
);


/* =====================================================
   CONFIRMAR ASISTENCIA PRESENCIAL
===================================================== */

confirmarPresencial.addEventListener(
    "click",
    async () => {

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


/* =====================================================
   ZOOM
===================================================== */

btnZoom.addEventListener(
    "click",
    async () => {

        const confirmar =
            window.confirm(
                "¿Confirmas que participarás por Zoom?"
            );


        if (!confirmar) {

            return;

        }


        btnZoom.disabled = true;


        const enviado =
            await enviarRespuesta(
                "Sí, pero podré asistir por Zoom",
                0
            );


        if (enviado) {

            mostrarMensajeExito(
                "Hemos registrado que nos acompañarás por Zoom. ¡Será una alegría tenerte con nosotros! ❤️"
            );

        } else {

            alert(
                "No se pudo registrar la confirmación. Por favor, inténtalo nuevamente."
            );

        }


        btnZoom.disabled = false;

    }
);


/* =====================================================
   NO ASISTIRÁ
===================================================== */

btnNoAsistire.addEventListener(
    "click",
    async () => {

        const confirmar =
            window.confirm(
                "¿Confirmas que no podrás asistir?"
            );


        if (!confirmar) {

            return;

        }


        btnNoAsistire.disabled = true;


        const enviado =
            await enviarRespuesta(
                "Disculpa, no podré asistir",
                0
            );


        if (enviado) {

            mostrarMensajeExito(
                "Gracias por avisarnos. Te agradecemos mucho por tomarte el tiempo de confirmarlo. ❤️"
            );

        } else {

            alert(
                "No se pudo registrar la respuesta. Por favor, inténtalo nuevamente."
            );

        }


        btnNoAsistire.disabled = false;

    }
);


/* =====================================================
   MENSAJE DE ÉXITO
===================================================== */

function mostrarMensajeExito(mensaje) {

    textoExito.textContent =
        mensaje;


    mensajeExito.classList.add(
        "mostrar"
    );


    mensajeExito.setAttribute(
        "aria-hidden",
        "false"
    );


    document.documentElement.classList.add(
        "no-scroll"
    );

    document.body.classList.add(
        "no-scroll"
    );

}


/* =====================================================
   CERRAR MENSAJE DE ÉXITO
===================================================== */

volverConfirmacion.addEventListener(
    "click",
    () => {

        mensajeExito.classList.remove(
            "mostrar"
        );

        mensajeExito.setAttribute(
            "aria-hidden",
            "true"
        );

        document.documentElement.classList.remove(
            "no-scroll"
        );

        document.body.classList.remove(
            "no-scroll"
        );

    }
);


/* =====================================================
   CALENDARIO
===================================================== */

const btnMostrarCalendario =
    $("#btnMostrarCalendario");

const opcionesCalendario =
    $("#opcionesCalendario");


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


/* =====================================================
   MÚSICA
===================================================== */

const musica =
    $("#musicaBoda");

const botonMusica =
    $("#botonMusica");

let reproduciendo = false;


botonMusica.addEventListener(
    "click",
    async () => {

        try {

            if (!reproduciendo) {

                await musica.play();

                reproduciendo = true;

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

                reproduciendo = false;

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
   INFORMACIÓN DEL INVITADO
===================================================== */

if (!codigoInvitado) {

    console.warn(
        "La invitación se abrió sin código de invitado."
    );

} else {

    console.log(
        "Invitación identificada con código:",
        codigoInvitado
    );

}
