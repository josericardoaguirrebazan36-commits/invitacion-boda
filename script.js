/* =====================================================
   UTILIDADES
===================================================== */

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);


/* =====================================================
   CONTADOR
===================================================== */

const fechaBoda =
    new Date("2026-10-09T00:00:00").getTime();

function actualizarContador() {

    let diferencia = fechaBoda - Date.now();

    if (diferencia < 0) diferencia = 0;

    $("#dias").textContent =
        String(Math.floor(diferencia / 86400000)).padStart(2,"0");

    $("#horas").textContent =
        String(Math.floor((diferencia % 86400000) / 3600000)).padStart(2,"0");

    $("#minutos").textContent =
        String(Math.floor((diferencia % 3600000) / 60000)).padStart(2,"0");

    $("#segundos").textContent =
        String(Math.floor((diferencia % 60000) / 1000)).padStart(2,"0");
}

actualizarContador();
setInterval(actualizarContador,1000);


/* =====================================================
   CÓDIGO DEL INVITADO
===================================================== */

const parametros =
    new URLSearchParams(location.search);

const codigoInvitado =
    parametros.get("codigo");

console.log("Código:",codigoInvitado);


/* =====================================================
   GOOGLE APPS SCRIPT
===================================================== */

const URL_GOOGLE_SCRIPT =
"https://script.google.com/macros/s/AKfycbywp4BXSX_viv4KHA2MI0AUTD70ugkNtQ0e0Ah4laVR3RPf9TlowYJbGl3YbBf9uDA/exec";


async function enviarRespuesta(respuesta,personas) {

    if (!codigoInvitado) {

        alert(
            "No se pudo identificar tu invitación. Utiliza el enlace que recibiste."
        );

        return false;
    }

    try {

        await fetch(URL_GOOGLE_SCRIPT,{
            method:"POST",
            mode:"no-cors",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                codigo:codigoInvitado,
                respuesta,
                personas
            })
        });

        return true;

    } catch(error) {

        console.error(error);
        return false;
    }
}


/* =====================================================
   MODALES
===================================================== */

function abrirModal(modal) {

    modal.classList.add("activo");
    modal.setAttribute("aria-hidden","false");

    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");
}


function cerrarModal(modal) {

    modal.classList.remove("activo");
    modal.setAttribute("aria-hidden","true");

    if (!$$(".modal.activo").length) {

        document.documentElement.classList.remove("no-scroll");
        document.body.classList.remove("no-scroll");
    }
}


/* =====================================================
   MODAL PRESENCIAL
===================================================== */

const modalAsistencia = $("#modalAsistencia");

let cantidad = 1;

function actualizarCantidad() {

    $("#cantidadPersonas").textContent = cantidad;

    $("#textoPersonas").textContent =
        cantidad === 1 ? "persona" : "personas";
}


$("#btnAsistire").addEventListener("click",() => {

    cantidad = 1;
    actualizarCantidad();

    abrirModal(modalAsistencia);
});


$("#restarPersona").addEventListener("click",() => {

    if (cantidad > 1) {

        cantidad--;
        actualizarCantidad();
    }
});


$("#sumarPersona").addEventListener("click",() => {

    if (cantidad < 10) {

        cantidad++;
        actualizarCantidad();
    }
});


$("#cerrarModal").addEventListener(
    "click",
    () => cerrarModal(modalAsistencia)
);


$("#confirmarPresencial").addEventListener(
    "click",
    async () => {

        const boton = $("#confirmarPresencial");

        boton.disabled = true;
        boton.textContent = "ENVIANDO...";

        const enviado =
            await enviarRespuesta(
                "Sí, ahí estaré",
                cantidad
            );

        boton.disabled = false;
        boton.textContent = "CONFIRMAR ASISTENCIA";

        cerrarModal(modalAsistencia);

        if (enviado) {

            mostrarExito(
                `Hemos registrado tu asistencia para ${cantidad} ${
                    cantidad === 1 ? "persona" : "personas"
                }. ¡Nos alegra mucho contar contigo! ❤️`
            );

        } else {

            alert(
                "No se pudo registrar la respuesta. Inténtalo nuevamente."
            );
        }
    }
);


/* =====================================================
   MODAL ZOOM
===================================================== */

const modalZoom = $("#modalZoom");

$("#btnZoom").addEventListener(
    "click",
    () => abrirModal(modalZoom)
);


$("#cerrarZoom").addEventListener(
    "click",
    () => cerrarModal(modalZoom)
);


$("#cancelarZoom").addEventListener(
    "click",
    () => cerrarModal(modalZoom)
);


$("#confirmarZoom").addEventListener(
    "click",
    async () => {

        const boton = $("#confirmarZoom");

        boton.disabled = true;
        boton.textContent = "REGISTRANDO...";

        const enviado =
            await enviarRespuesta(
                "Sí, pero podré asistir por Zoom",
                0
            );

        boton.disabled = false;
        boton.textContent = "SÍ, CONFIRMAR";

        cerrarModal(modalZoom);

        if (enviado) {

            mostrarExito(
                "Hemos registrado que nos acompañarás por Zoom. ¡Será una alegría tenerte con nosotros! ❤️"
            );

        } else {

            alert(
                "No se pudo registrar la respuesta. Inténtalo nuevamente."
            );
        }
    }
);


/* =====================================================
   MODAL NO ASISTIR
===================================================== */

const modalNoAsistire =
    $("#modalNoAsistire");


$("#btnNoAsistire").addEventListener(
    "click",
    () => abrirModal(modalNoAsistire)
);


$("#cerrarNoAsistire").addEventListener(
    "click",
    () => cerrarModal(modalNoAsistire)
);


$("#cancelarNoAsistire").addEventListener(
    "click",
    () => cerrarModal(modalNoAsistire)
);


$("#confirmarNoAsistire").addEventListener(
    "click",
    async () => {

        const boton =
            $("#confirmarNoAsistire");

        boton.disabled = true;
        boton.textContent = "REGISTRANDO...";

        const enviado =
            await enviarRespuesta(
                "Disculpa, no podré asistir",
                0
            );

        boton.disabled = false;
        boton.textContent = "SÍ, CONFIRMAR";

        cerrarModal(modalNoAsistire);

        if (enviado) {

            mostrarExito(
                "Gracias por avisarnos. Te agradecemos mucho por tomarte el tiempo de confirmarlo. ❤️"
            );

        } else {

            alert(
                "No se pudo registrar la respuesta. Inténtalo nuevamente."
            );
        }
    }
);


/* =====================================================
   MENSAJE DE ÉXITO
===================================================== */

const mensajeExito = $("#mensajeExito");

function mostrarExito(mensaje) {

    $("#textoExito").textContent = mensaje;

    abrirModal(mensajeExito);
}


$("#volverConfirmacion").addEventListener(
    "click",
    () => cerrarModal(mensajeExito)
);


/* =====================================================
   CERRAR MODALES AL HACER CLIC FUERA
===================================================== */

$$(".modal").forEach(modal => {

    modal.addEventListener("click",e => {

        if (e.target === modal) {

            cerrarModal(modal);
        }
    });
});


/* =====================================================
   ESC
===================================================== */

document.addEventListener("keydown",e => {

    if (e.key !== "Escape") return;

    $$(".modal.activo").forEach(modal => {
        cerrarModal(modal);
    });

});


/* =====================================================
   GALERÍA
===================================================== */

const galeria = $(".galeria-fotos");
const fotos = $$(".galeria-fotos img");
const lightbox = $("#lightbox");
const imagenGrande = $("#imagenGrande");


fotos.forEach(foto => {

    foto.addEventListener("click",() => {

        imagenGrande.src = foto.src;
        imagenGrande.alt = foto.alt;

        lightbox.classList.add("activo");
        lightbox.setAttribute("aria-hidden","false");

        document.documentElement.classList.add("no-scroll");
        document.body.classList.add("no-scroll");
    });

});


function cerrarLightbox() {

    lightbox.classList.remove("activo");
    lightbox.setAttribute("aria-hidden","true");

    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");
}


$("#cerrarLightbox").addEventListener(
    "click",
    cerrarLightbox
);


lightbox.addEventListener("click",e => {

    if (e.target === lightbox) {
        cerrarLightbox();
    }
});


$("#galeriaSiguiente").addEventListener(
    "click",
    () => galeria.scrollBy({
        left:300,
        behavior:"smooth"
    })
);


$("#galeriaAnterior").addEventListener(
    "click",
    () => galeria.scrollBy({
        left:-300,
        behavior:"smooth"
    })
);


/* =====================================================
   CALENDARIO
===================================================== */

$("#btnMostrarCalendario").addEventListener(
    "click",
    () => {

        $("#opcionesCalendario")
            .classList.toggle("mostrar");
    }
);


/* =====================================================
   COPIAR YAPE
===================================================== */

$("#copiarYape").addEventListener(
    "click",
    async () => {

        const numero =
            $("#numeroYape").textContent.trim();

        try {

            await navigator.clipboard.writeText(numero);

            const mensaje =
                $("#mensajeCopiado");

            mensaje.classList.add("mostrar");

            setTimeout(() => {
                mensaje.classList.remove("mostrar");
            },2000);

        } catch(error) {

            alert(
                "No se pudo copiar el número."
            );
        }
    }
);


/* =====================================================
   MÚSICA
===================================================== */

const musica = $("#musicaBoda");
const botonMusica = $("#botonMusica");

let reproduciendo = false;


botonMusica.addEventListener(
    "click",
    async () => {

        try {

            if (!reproduciendo) {

                await musica.play();

                reproduciendo = true;
                botonMusica.textContent = "⏸";
                botonMusica.classList.add("reproduciendo");

            } else {

                musica.pause();

                reproduciendo = false;
                botonMusica.textContent = "🎵";
                botonMusica.classList.remove("reproduciendo");
            }

        } catch(error) {

            console.error(error);
        }
    }
);


/* =====================================================
   PROTECCIÓN VISUAL
===================================================== */

fotos.forEach(foto => {

    foto.addEventListener(
        "dragstart",
        e => e.preventDefault()
    );
});
