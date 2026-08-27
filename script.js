const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);


/* GALERÍA */
const fotos=$$(".galeria-fotos img"), lightbox=$("#lightbox"),
imagenGrande=$("#imagenGrande"), galeria=$(".galeria-fotos");

fotos.forEach(f=>f.onclick=()=>{
    imagenGrande.src=f.src;
    imagenGrande.alt=f.alt;
    lightbox.classList.add("activo");
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");
});

function cerrarLightbox(){
    lightbox.classList.remove("activo");
    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");
}

$("#cerrarLightbox").onclick=cerrarLightbox;

lightbox.onclick=e=>{
    if(e.target===lightbox) cerrarLightbox();
};

document.onkeydown=e=>{
    if(e.key==="Escape"){
        cerrarLightbox();
        cerrarModal($("#modalAsistencia"));
        cerrarModal($("#modalConfirmarZoom"));
        cerrarModal($("#modalZoom"));
        cerrarModal($("#modalConfirmarNoAsistire"));
    }
};

$("#galeriaSiguiente").onclick=()=>galeria.scrollBy({left:300,behavior:"smooth"});
$("#galeriaAnterior").onclick=()=>galeria.scrollBy({left:-300,behavior:"smooth"});


/* CONTADOR */
const fechaBoda=new Date("October 9, 2026 00:00:00").getTime();

function actualizarContador(){
    let d=Math.max(0,fechaBoda-Date.now());

    $("#dias").textContent=String(Math.floor(d/86400000)).padStart(2,"0");
    $("#horas").textContent=String(Math.floor(d%86400000/3600000)).padStart(2,"0");
    $("#minutos").textContent=String(Math.floor(d%3600000/60000)).padStart(2,"0");
    $("#segundos").textContent=String(Math.floor(d%60000/1000)).padStart(2,"0");
}

actualizarContador();
setInterval(actualizarContador,1000);


/* CÓDIGO INVITADO */
const parametros=new URLSearchParams(location.search);
const codigoInvitado=parametros.get("codigo");

console.log("Código:",codigoInvitado);


/* GOOGLE APPS SCRIPT */
const URL_GOOGLE_SCRIPT=
"https://script.google.com/macros/s/AKfycbywp4BXSX_viv4KHA2MI0AUTD70ugkNtQ0e0Ah4laVR3RPf9TlowYJbGl3YbBf9uDA/exec";


/* ENVÍO */
async function enviarRespuesta(respuesta,personas){
    if(!codigoInvitado){
        alert("No se pudo identificar tu invitación.");
        return false;
    }

    try{
        await fetch(URL_GOOGLE_SCRIPT,{
            method:"POST",
            mode:"no-cors",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                codigo:codigoInvitado,
                respuesta,
                personas
            })
        });

        return true;
    }catch(e){
        console.error(e);
        return false;
    }
}


/* MODALES */
function abrirModal(m){
    m.classList.add("activo");
    m.setAttribute("aria-hidden","false");
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");
}

function cerrarModal(m){
    if(!m)return;
    m.classList.remove("activo");
    m.setAttribute("aria-hidden","true");

    if(!document.querySelector(".modal.activo") &&
       !lightbox.classList.contains("activo")){
        document.documentElement.classList.remove("no-scroll");
        document.body.classList.remove("no-scroll");
    }
}


/* ASISTENCIA PRESENCIAL */
const modalAsistencia=$("#modalAsistencia");
let cantidad=1;

function actualizarCantidad(){
    $("#cantidadPersonas").textContent=cantidad;
    $("#textoPersonas").textContent=cantidad===1?"persona":"personas";
}

$("#btnAsistire").onclick=()=>{
    cantidad=1;
    actualizarCantidad();
    abrirModal(modalAsistencia);
};

$("#restarPersona").onclick=()=>{
    if(cantidad>1){
        cantidad--;
        actualizarCantidad();
    }
};

$("#sumarPersona").onclick=()=>{
    if(cantidad<10){
        cantidad++;
        actualizarCantidad();
    }
};

$("#cerrarModal").onclick=()=>cerrarModal(modalAsistencia);

modalAsistencia.onclick=e=>{
    if(e.target===modalAsistencia) cerrarModal(modalAsistencia);
};


/* CONFIRMAR PRESENCIAL */
$("#confirmarPresencial").onclick=async()=>{
    const btn=$("#confirmarPresencial");

    btn.disabled=true;
    btn.textContent="ENVIANDO...";

    const enviado=await enviarRespuesta("Sí, ahí estaré",cantidad);

    btn.disabled=false;
    btn.textContent="CONFIRMAR ASISTENCIA";

    cerrarModal(modalAsistencia);

    if(enviado){
        alertMensaje(
            `Hemos registrado tu asistencia para ${cantidad} ${
                cantidad===1?"persona":"personas"
            }. ¡Nos alegra mucho contar contigo! ❤️`
        );
    }else{
        alert("No se pudo registrar la confirmación.");
    }
};


/* ZOOM - PRIMERA VENTANA */
const modalConfirmarZoom=$("#modalConfirmarZoom");

$("#btnZoom").onclick=()=>{
    abrirModal(modalConfirmarZoom);
};

$("#cerrarConfirmarZoom").onclick=()=>cerrarModal(modalConfirmarZoom);
$("#cancelarZoom").onclick=()=>cerrarModal(modalConfirmarZoom);


/* CONFIRMAR ZOOM */
$("#confirmarZoom").onclick=async()=>{
    const btn=$("#confirmarZoom");

    btn.disabled=true;
    btn.textContent="REGISTRANDO...";

    const enviado=await enviarRespuesta(
        "Sí, pero podré asistir por Zoom",
        0
    );

    btn.disabled=false;
    btn.textContent="SÍ, CONFIRMAR";

    cerrarModal(modalConfirmarZoom);

    if(enviado){
        abrirModal($("#modalZoom"));
    }else{
        alert("No se pudo registrar la respuesta.");
    }
};


/* DATOS ZOOM */
const enlaceZoom=
"https://us02web.zoom.us/j/740351363?pwd=MEYrV1VxZitlTDZDYUpYTUVJQlIwdz09";

$("#cerrarZoom").onclick=()=>cerrarModal($("#modalZoom"));

$("#btnCopiarZoom").onclick=async()=>{
    try{
        await navigator.clipboard.writeText(enlaceZoom);

        $("#mensajeCopiado").classList.add("mostrar");

        setTimeout(()=>{
            $("#mensajeCopiado").classList.remove("mostrar");
        },2500);

    }catch(e){
        alert("No se pudo copiar el enlace. Puedes copiarlo manualmente.");
    }
};


/* NO ASISTIRÁ - PRIMERA VENTANA */
const modalConfirmarNo=$("#modalConfirmarNoAsistire");

$("#btnNoAsistire").onclick=()=>{
    abrirModal(modalConfirmarNo);
};

$("#cerrarConfirmarNoAsistire").onclick=()=>cerrarModal(modalConfirmarNo);
$("#cancelarNoAsistire").onclick=()=>cerrarModal(modalConfirmarNo);


/* CONFIRMAR NO ASISTENCIA */
$("#confirmarNoAsistire").onclick=async()=>{
    const btn=$("#confirmarNoAsistire");

    btn.disabled=true;
    btn.textContent="REGISTRANDO...";

    const enviado=await enviarRespuesta(
        "Disculpa, no podré asistir",
        0
    );

    btn.disabled=false;
    btn.textContent="SÍ, CONFIRMAR";

    cerrarModal(modalConfirmarNo);

    if(enviado){
        abrirModal($("#modalNoAsistire"));
    }else{
        alert("No se pudo registrar la respuesta.");
    }
};

$("#cerrarNoAsistire").onclick=()=>{
    cerrarModal($("#modalNoAsistire"));
};


/* MENSAJE PRESENCIAL */
function alertMensaje(texto){
    $("#textoExito").textContent=texto;
    abrirModal($("#mensajeExito"));
}


/* CALENDARIO */
$("#btnMostrarCalendario").onclick=()=>{
    const o=$("#opcionesCalendario");
    o.classList.toggle("mostrar");
};


/* REGALOS */
$("#btnDatosRegalo").onclick=()=>{
    abrirModal($("#modalDatosRegalo"));
};

$("#cerrarDatosRegalo").onclick=()=>{
    cerrarModal($("#modalDatosRegalo"));
};

$("#cerrarDatosRegaloBtn").onclick=()=>{
    cerrarModal($("#modalDatosRegalo"));
};

$("#btnDireccionRegalo").onclick=()=>{
    abrirModal($("#modalDireccionRegalo"));
};

$("#cerrarDireccionRegalo").onclick=()=>{
    cerrarModal($("#modalDireccionRegalo"));
};

$("#cerrarDireccionRegaloBtn").onclick=()=>{
    cerrarModal($("#modalDireccionRegalo"));
};


/* MÚSICA */
const musica=$("#musicaBoda"), botonMusica=$("#botonMusica");
let reproduciendo=false;

botonMusica.onclick=async()=>{
    try{
        if(!reproduciendo){
            await musica.play();
            reproduciendo=true;
            botonMusica.textContent="⏸";
            botonMusica.classList.add("reproduciendo");
        }else{
            musica.pause();
            reproduciendo=false;
            botonMusica.textContent="🎵";
            botonMusica.classList.remove("reproduciendo");
        }
    }catch(e){
        console.error(e);
    }
};


/* IMÁGENES */
fotos.forEach(f=>{
    f.addEventListener("dragstart",e=>e.preventDefault());
});

document.addEventListener("dblclick",e=>{
    e.preventDefault();
},{passive:false});
