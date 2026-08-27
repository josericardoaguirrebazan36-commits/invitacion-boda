/* =====================================================
   AUXILIARES
===================================================== */

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);


/* =====================================================
   CÓDIGO DEL INVITADO
===================================================== */

const parametros = new URLSearchParams(location.search);
const codigoInvitado = parametros.get("codigo");

console.log("Código:", codigoInvitado);


/* =====================================================
   GOOGLE APPS SCRIPT
===================================================== */

const URL_GOOGLE_SCRIPT =
"https://script.google.com/macros/s/AKfycbywp4BXSX_viv4KHA2MI0AUTD70ugkNtQ0e0Ah4laVR3RPf9TlowYJbGl3YbBf9uDA/exec";


/* =====================================================
   CONTADOR
===================================================== */

const fechaBoda =
new Date("October 9, 2026 00:00:00").getTime();

function actualizarContador() {

    let d = fechaBoda - Date.now();

    if (d < 0) d = 0;

    $("#dias").textContent =
        String(Math.floor(d / 86400000)).padStart(2,"0");

    $("#horas").textContent =
        String(Math.floor((d % 86400000) / 3600000)).padStart(2,"0");

    $("#minutos").textContent =
        String(Math.floor((d % 3600000) / 60000)).padStart(2,"0");

    $("#segundos").textContent =
        String(Math.floor((d % 60000) / 1000)).padStart(2,"0");
}

actualizarContador();
setInterval(actualizarContador,1000);


/* =====================================================
   GALERÍA
===================================================== */

const fotos = $$(".galeria-fotos img");
const galeria = $(".galeria-fotos");

const lightbox = $("#lightbox");
const imagenGrande = $("#imagenGrande");

fotos.forEach(foto => {

    foto.addEventListener("click", () => {

        imagenGrande.src = foto.src;
        imagenGrande.alt = foto.alt;

        lightbox.classList.add("activo");
        lightbox.setAttribute("aria-hidden","false");

        document.body.classList.add("no-scroll");
    });

    foto.addEventListener("dragstart", e => e.preventDefault());
});


function cerrarLightbox(){

    lightbox.classList.remove("activo");
    lightbox.setAttribute("aria-hidden","true");

    document.body.classList.remove("no-scroll");
}

$("#cerrarLightbox").addEventListener(
    "click",
    cerrarLightbox
);

lightbox.addEventListener("click",e=>{

    if(e.target === lightbox)
        cerrarLightbox();

});


$(".flecha-galeria.derecha").addEventListener(
    "click",
    () => galeria.scrollBy({
        left:300,
        behavior:"smooth"
    })
);

$(".flecha-galeria.izquierda").addEventListener(
    "click",
    () => galeria.scrollBy({
        left:-300,
        behavior:"smooth"
    })
);


/* =====================================================
   MODAL PERSONAS
===================================================== */

let cantidad = 1;

const modalAsistencia = $("#modalAsistencia");

function actualizarCantidad(){

    $("#cantidadPersonas").textContent = cantidad;

    $("#cantidadPersonas")
        .parentElement
        .querySelector("small")
        .textContent =
        cantidad === 1 ? "persona" : "personas";
}


$("#btnAsistire").addEventListener("click",()=>{

    cantidad = 1;

    actualizarCantidad();

    modalAsistencia.classList.add("activo");
    modalAsistencia.setAttribute("aria-hidden","false");

    document.body.classList.add("no-scroll");
});


$("#restarPersona").addEventListener("click",()=>{

    if(cantidad > 1){

        cantidad--;
        actualizarCantidad();

    }

});


$("#sumarPersona").addEventListener("click",()=>{

    if(cantidad < 10){

        cantidad++;
        actualizarCantidad();

    }

});


function cerrarModalPersonas(){

    modalAsistencia.classList.remove("activo");
    modalAsistencia.setAttribute("aria-hidden","true");

    document.body.classList.remove("no-scroll");
}


$("#cerrarModal").addEventListener(
    "click",
    cerrarModalPersonas
);


modalAsistencia.addEventListener("click",e=>{

    if(e.target === modalAsistencia)
        cerrarModalPersonas();

});


/* =====================================================
   ENVIAR RESPUESTA
===================================================== */

async function enviarRespuesta(respuesta,personas){

    if(!codigoInvitado){

        alert(
            "No se pudo identificar tu invitación."
        );

        return false;
    }

    try{

        await fetch(
            URL_GOOGLE_SCRIPT,
            {
                method:"POST",
                mode:"no-cors",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    codigo:codigoInvitado,
                    respuesta:respuesta,
                    personas:personas
                })
            }
        );

        return true;

    }catch(error){

        console.error(error);

        return false;
    }
}


/* =====================================================
   CONFIRMAR PRESENCIAL
===================================================== */

$("#confirmarPresencial").addEventListener(
    "click",
    async ()=>{

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

        if(enviado){

            cerrarModalPersonas();

            mostrarExito(
                "¡Muchas gracias!",
                `Hemos registrado tu asistencia para ${cantidad} ${
                    cantidad === 1 ? "persona" : "personas"
                }. ¡Nos alegra mucho contar contigo! ❤️`,
                "presencial"
            );

        }else{

            alert(
                "No se pudo registrar la respuesta. Inténtalo nuevamente."
            );

        }

    }
);


/* =====================================================
   MODAL ZOOM / NO ASISTIR
===================================================== */

const modalOpcion = $("#modalOpcion");

let opcionSeleccionada = "";


function abrirOpcion(tipo){

    opcionSeleccionada = tipo;

    if(tipo === "zoom"){

        $("#iconoOpcion").textContent = "💻";

        $("#tituloOpcion").textContent =
            "Asistir por Zoom";

        $("#textoOpcion").textContent =
            "¿Confirmas que participarás de la boda por Zoom?";

        $("#confirmarOpcion").textContent =
            "SÍ, ASISTIRÉ POR ZOOM";

        modalOpcion.classList.add("zoom-modal");

    }else{

        $("#iconoOpcion").textContent = "🤍";

        $("#tituloOpcion").textContent =
            "No podré asistir";

        $("#textoOpcion").textContent =
            "¿Confirmas que no podrás acompañarnos en persona?";

        $("#confirmarOpcion").textContent =
            "SÍ, NO PODRÉ ASISTIR";

        modalOpcion.classList.remove("zoom-modal");
    }

    modalOpcion.classList.add("activo");

    modalOpcion.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add("no-scroll");
}


$("#btnZoom").addEventListener(
    "click",
    ()=>abrirOpcion("zoom")
);


$("#btnNoAsistire").addEventListener(
    "click",
    ()=>abrirOpcion("no")
);


function cerrarOpcion(){

    modalOpcion.classList.remove("activo");

    modalOpcion.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove("no-scroll");
}


$("#cerrarOpcion").addEventListener(
    "click",
    cerrarOpcion
);


$("#cancelarOpcion").addEventListener(
    "click",
    cerrarOpcion
);


modalOpcion.addEventListener("click",e=>{

    if(e.target === modalOpcion)
        cerrarOpcion();

});


/* =====================================================
   CONFIRMAR ZOOM / NO ASISTIR
===================================================== */

$("#confirmarOpcion").addEventListener(
    "click",
    async ()=>{

        const boton = $("#confirmarOpcion");

        boton.disabled = true;
        boton.textContent = "ENVIANDO...";

        let respuesta;
        let mensaje;

        if(opcionSeleccionada === "zoom"){

            respuesta =
                "Sí, pero podré asistir por Zoom";

            mensaje =
                "Hemos registrado que nos acompañarás por Zoom. ❤️";

        }else{

            respuesta =
                "Disculpa, no podré asistir";

            mensaje =
                "Gracias por avisarnos. Te agradecemos mucho por tomarte el tiempo de confirmarlo. ❤️";
        }

        const enviado =
            await enviarRespuesta(
                respuesta,
                0
            );

        boton.disabled = false;

        if(enviado){

            cerrarOpcion();

            mostrarExito(
                opcionSeleccionada === "zoom"
                    ? "¡Nos alegra mucho!"
                    : "Gracias por avisarnos",
                mensaje,
                opcionSeleccionada
            );

        }else{

            alert(
                "No se pudo registrar la respuesta. Inténtalo nuevamente."
            );

        }

    }
);


/* =====================================================
   MENSAJE DE ÉXITO
===================================================== */

function mostrarExito(titulo,mensaje,tipo){

    $("#tituloExito").textContent = titulo;
    $("#textoExito").textContent = mensaje;

    const datosZoom = $("#datosZoom");

    if(tipo === "zoom"){

        datosZoom.style.display = "block";

        $("#iconoExito").textContent = "💻";

    }else{

        datosZoom.style.display = "none";

        $("#iconoExito").textContent =
            tipo === "no" ? "🤍" : "✓";
    }

    $("#mensajeExito").classList.add("mostrar");

    $("#mensajeExito").setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add("no-scroll");
}


$("#volverConfirmacion").addEventListener(
    "click",
    ()=>{

        $("#mensajeExito").classList.remove("mostrar");

        $("#mensajeExito").setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove("no-scroll");
    }
);


/* =====================================================
   COPIAR ZOOM
===================================================== */

const ENLACE_ZOOM =
"https://us02web.zoom.us/j/740351363?pwd=MEYrV1VxZitlTDZDYUpYTUVJQlIwdz09";


$("#btnCopiarZoom").addEventListener(
    "click",
    async ()=>{

        try{

            await navigator.clipboard.writeText(
                ENLACE_ZOOM
            );

            const mensaje =
                $("#mensajeZoomCopiado");

            mensaje.classList.add("mostrar");

            setTimeout(
                ()=>mensaje.classList.remove("mostrar"),
                2500
            );

        }catch(error){

            alert(
                "No se pudo copiar automáticamente. Puedes copiar el enlace manualmente."
            );

        }

    }
);


/* =====================================================
   COPIAR YAPE
===================================================== */

$("#btnCopiarYape").addEventListener(
    "click",
    async ()=>{

        try{

            await navigator.clipboard.writeText(
                "+51 992 418 572"
            );

            const mensaje =
                $("#mensajeYape");

            mensaje.classList.add("mostrar");

            setTimeout(
                ()=>mensaje.classList.remove("mostrar"),
                2500
            );

        }catch(error){

            alert(
                "No se pudo copiar el número."
            );

        }

    }
);


/* =====================================================
   CALENDARIO
===================================================== */

$("#btnMostrarCalendario").addEventListener(
    "click",
    ()=>{

        const opciones =
            $("#opcionesCalendario");

        opciones.classList.toggle("mostrar");

        const abierto =
            opciones.classList.contains("mostrar");

        $("#btnMostrarCalendario")
            .setAttribute(
                "aria-expanded",
                abierto
            );
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
    async ()=>{

        try{

            if(!reproduciendo){

                await musica.play();

                reproduciendo = true;

                botonMusica.textContent = "⏸";

                botonMusica.classList.add(
                    "reproduciendo"
                );

            }else{

                musica.pause();

                reproduciendo = false;

                botonMusica.textContent = "🎵";

                botonMusica.classList.remove(
                    "reproduciendo"
                );

            }

        }catch(error){

            console.error(error);

        }

    }
);


/* =====================================================
   TECLADO
===================================================== */

document.addEventListener("keydown",e=>{

    if(e.key === "Escape"){

        cerrarLightbox();
        cerrarModalPersonas();
        cerrarOpcion();

    }

});
