/* ================= AUXILIARES ================= */

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const bloquearScroll = () => {
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");
};

const desbloquearScroll = () => {
    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");
};


/* ================= CONTADOR ================= */

const fechaBoda =
    new Date("October 9, 2026 00:00:00").getTime();

function actualizarContador() {

    let diferencia = fechaBoda - Date.now();

    if (diferencia < 0) diferencia = 0;

    $("#dias").textContent =
        String(Math.floor(diferencia / 86400000)).padStart(2,"0");

    $("#horas").textContent =
        String(Math.floor(diferencia % 86400000 / 3600000)).padStart(2,"0");

    $("#minutos").textContent =
        String(Math.floor(diferencia % 3600000 / 60000)).padStart(2,"0");

    $("#segundos").textContent =
        String(Math.floor(diferencia % 60000 / 1000)).padStart(2,"0");
}

actualizarContador();
setInterval(actualizarContador,1000);


/* ================= CÓDIGO INVITADO ================= */

const parametros =
    new URLSearchParams(window.location.search);

const codigoInvitado =
    parametros.get("codigo");

console.log("Código:",codigoInvitado);


/* ================= GALERÍA ================= */

const galeria = $(".galeria-fotos");
const fotos = $$(".galeria-fotos img");
const lightbox = $("#lightbox");
const imagenGrande = $("#imagenGrande");

fotos.forEach(foto => {

    foto.addEventListener("click",() => {

        imagenGrande.src = foto.src;
        imagenGrande.alt = foto.alt;

        lightbox.classList.add("activo");

        bloquearScroll();

    });

});

$("#cerrarLightbox").addEventListener("click",cerrarLightbox);

lightbox.addEventListener("click",e => {

    if(e.target === lightbox) {
        cerrarLightbox();
    }

});

function cerrarLightbox() {

    lightbox.classList.remove("activo");

    desbloquearScroll();

}

$("#galeriaSiguiente").addEventListener("click",() => {

    galeria.scrollBy({
        left:300,
        behavior:"smooth"
    });

});

$("#galeriaAnterior").addEventListener("click",() => {

    galeria.scrollBy({
        left:-300,
        behavior:"smooth"
    });

});


/* ================= GOOGLE APPS SCRIPT ================= */

const URL_GOOGLE_SCRIPT =
"https://script.google.com/macros/s/AKfycbywp4BXSX_viv4KHA2MI0AUTD70ugkNtQ0e0Ah4laVR3RPf9TlowYJbGl3YbBf9uDA/exec";


async function enviarRespuesta(respuesta,personas) {

    if(!codigoInvitado) {

        alert(
            "No se pudo identificar tu invitación."
        );

        return false;
    }

    const datos = {
        codigo:codigoInvitado,
        respuesta:respuesta,
        personas:personas
    };

    try {

        await fetch(
            URL_GOOGLE_SCRIPT,
            {
                method:"POST",
                mode:"no-cors",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(datos)
            }
        );

        return true;

    } catch(error) {

        console.error(error);

        return false;
    }
}


/* ================= MODAL PERSONAS ================= */

const modalAsistencia =
    $("#modalAsistencia");

let cantidad = 1;

function abrirModal(modal) {

    modal.classList.add("activo");
    modal.setAttribute("aria-hidden","false");

    bloquearScroll();
}

function cerrarModal(modal) {

    modal.classList.remove("activo");
    modal.setAttribute("aria-hidden","true");

    desbloquearScroll();
}


$("#btnAsistire").addEventListener("click",() => {

    cantidad = 1;

    actualizarCantidad();

    abrirModal(modalAsistencia);

});


function actualizarCantidad() {

    $("#cantidadPersonas").textContent = cantidad;

    $("#cantidadPersonas")
        .parentElement
        .querySelector("small")
        .textContent =
        cantidad === 1 ? "persona" : "personas";
}


$("#restarPersona").addEventListener("click",() => {

    if(cantidad > 1) {

        cantidad--;

        actualizarCantidad();

    }

});


$("#sumarPersona").addEventListener("click",() => {

    if(cantidad < 10) {

        cantidad++;

        actualizarCantidad();

    }

});


$("#cerrarModal").addEventListener(
    "click",
    () => cerrarModal(modalAsistencia)
);


/* ================= ASISTENCIA PRESENCIAL ================= */

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

        cerrarModal(modalAsistencia);

        boton.disabled = false;
        boton.textContent = "CONFIRMAR ASISTENCIA";

        if(enviado) {

            mostrarExito(
                `Hemos registrado tu asistencia para ${cantidad} ${
                    cantidad === 1 ? "persona" : "personas"
                }. ¡Nos alegra mucho contar contigo! ❤️`
            );

        } else {

            alert("No se pudo registrar la respuesta.");

        }

    }
);


/* ================= MODAL ZOOM ================= */

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


/* ================= CONFIRMAR ZOOM ================= */

$("#confirmarZoom").addEventListener(
    "click",
    async () => {

        const boton = $("#confirmarZoom");

        boton.disabled = true;
        boton.textContent = "ENVIANDO...";

        const enviado =
            await enviarRespuesta(
                "Sí, pero podré asistir por Zoom",
                0
            );

        boton.disabled = false;
        boton.textContent = "SÍ, CONFIRMAR";

        cerrarModal(modalZoom);

        if(enviado) {

            abrirModal($("#modalDatosZoom"));

        } else {

            alert(
                "No se pudo registrar la respuesta."
            );

        }

    }
);


/* ================= MODAL NO ASISTIR ================= */

const modalNo =
    $("#modalNoAsistire");

$("#btnNoAsistire").addEventListener(
    "click",
    () => abrirModal(modalNo)
);

$("#cerrarNoAsistire").addEventListener(
    "click",
    () => cerrarModal(modalNo)
);

$("#cancelarNoAsistire").addEventListener(
    "click",
    () => cerrarModal(modalNo)
);


/* ================= CONFIRMAR NO ASISTIR ================= */

$("#confirmarNoAsistire").addEventListener(
    "click",
    async () => {

        const boton =
            $("#confirmarNoAsistire");

        boton.disabled = true;
        boton.textContent = "ENVIANDO...";

        const enviado =
            await enviarRespuesta(
                "Disculpa, no podré asistir",
                0
            );

        boton.disabled = false;
        boton.textContent = "SÍ, CONFIRMAR";

        cerrarModal(modalNo);

        if(enviado) {

            mostrarExito(
                "Gracias por avisarnos. Te agradecemos mucho por tomarte el tiempo de confirmarlo. ❤️"
            );

        } else {

            alert(
                "No se pudo registrar la respuesta."
            );

        }

    }
);


/* ================= DATOS ZOOM ================= */

$("#cerrarDatosZoom").addEventListener(
    "click",
    () => cerrarModal($("#modalDatosZoom"))
);


/* ================= COPIAR ================= */

$$("[data-copiar]").forEach(boton => {

    boton.addEventListener("click",async() => {

        const texto =
            boton.dataset.copiar;

        try {

            await navigator.clipboard.writeText(texto);

            const textoOriginal =
                boton.textContent;

            boton.textContent =
                "✓ COPIADO";

            setTimeout(() => {

                boton.textContent =
                    textoOriginal;

            },1800);

        } catch(error) {

            console.error(error);

        }

    });

});


/* ================= MENSAJE ÉXITO ================= */

function mostrarExito(mensaje) {

    $("#textoExito").textContent =
        mensaje;

    $("#mensajeExito")
        .classList.add("mostrar");

    $("#mensajeExito")
        .setAttribute("aria-hidden","false");

    bloquearScroll();

}


$("#volverConfirmacion").addEventListener(
    "click",
    () => {

        $("#mensajeExito")
            .classList.remove("mostrar");

        $("#mensajeExito")
            .setAttribute("aria-hidden","true");

        desbloquearScroll();

    }
);


/* ================= CERRAR MODALES CON ESC ================= */

document.addEventListener("keydown",e => {

    if(e.key !== "Escape") return;

    [
        modalAsistencia,
        modalZoom,
        modalNo,
        $("#modalDatosZoom"),
        $("#mensajeExito")
    ].forEach(elemento => {

        if(
            elemento.classList.contains("activo") ||
            elemento.classList.contains("mostrar")
        ) {

            elemento.classList.remove(
                "activo",
                "mostrar"
            );

            elemento.setAttribute(
                "aria-hidden",
                "true"
            );

        }

    });

    desbloquearScroll();

});


/* ================= CALENDARIO ================= */

$("#btnMostrarCalendario")
.addEventListener("click",() => {

    $("#opcionesCalendario")
        .classList.toggle("mostrar");

});


/* ================= MÚSICA ================= */

const musica =
    $("#musicaBoda");

const botonMusica =
    $("#botonMusica");

let reproduciendo = false;

botonMusica.addEventListener(
    "click",
    async () => {

        try {

            if(!reproduciendo) {

                await musica.play();

                reproduciendo = true;

                botonMusica.textContent = "⏸";

            } else {

                musica.pause();

                reproduciendo = false;

                botonMusica.textContent = "🎵";

            }

        } catch(error) {

            console.error(error);

        }

    }
);
