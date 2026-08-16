const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);

// GALERÍA
const fotos=$$(".galeria-fotos img"),lightbox=$("#lightbox"),imagenGrande=$("#imagenGrande"),cerrar=$(".cerrar"),galeria=$(".galeria-fotos");
let scrollActual=0;

fotos.forEach(f=>f.onclick=()=>{
    imagenGrande.src=f.src;
    scrollActual=scrollY;
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");
    lightbox.classList.add("activo");
});

function cerrarLightbox(){
    lightbox.classList.remove("activo");
    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");
    setTimeout(()=>scrollTo({top:scrollActual,behavior:"instant"}),50);
}

cerrar.onclick=cerrarLightbox;

lightbox.onclick=e=>{
    if(e.target===lightbox)cerrarLightbox();
};

$(".derecha").onclick=()=>galeria.scrollBy({left:300,behavior:"smooth"});
$(".izquierda").onclick=()=>galeria.scrollBy({left:-300,behavior:"smooth"});


// CONTADOR
const fechaBoda=new Date("October 9, 2026 00:00:00").getTime();

function actualizarContador(){
    let d=fechaBoda-Date.now();

    if(d<=0)d=0;

    const dias=Math.floor(d/86400000),
          horas=Math.floor(d%86400000/3600000),
          minutos=Math.floor(d%3600000/60000),
          segundos=Math.floor(d%60000/1000);

    $("#dias").textContent=String(dias).padStart(2,"0");
    $("#horas").textContent=String(horas).padStart(2,"0");
    $("#minutos").textContent=String(minutos).padStart(2,"0");
    $("#segundos").textContent=String(segundos).padStart(2,"0");
}

actualizarContador();
setInterval(actualizarContador,1000);


// CONFIRMACIÓN
const formulario=$("#formAsistencia");

if(formulario){
    formulario.onsubmit=e=>{
        e.preventDefault();

        const datos={
            nombre:$("#nombre").value,
            asistencia:$("#asistencia").value,
            acompanantes:$("#acompanantes").value,
            mensaje:$("#mensaje").value
        };

        fetch("https://script.google.com/macros/s/AKfycbw8N143GfFOnP5w9fbeSimbylMNHmoLMU1fmTLNEvvmZgk76YhqmPzMsgqRxZzWFT6Utg/exec",{
            method:"POST",
            mode:"no-cors",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(datos)
        })
        .then(()=>{
            alert("¡Gracias por confirmar tu asistencia! ❤️");
            formulario.reset();
        })
        .catch(e=>{
            console.error(e);
            alert("No se pudo enviar la confirmación");
        });
    };
}


// CALENDARIO
function mostrarCalendario(){
    $("#opcionesCalendario").classList.toggle("mostrar");
}


// MÚSICA
const musica=$("#musicaBoda"),botonMusica=$("#botonMusica");
let reproduciendo=false;

botonMusica.onclick=()=>{
    if(!reproduciendo){
        musica.play();
        botonMusica.textContent="⏸";
        botonMusica.classList.add("reproduciendo");
    }else{
        musica.pause();
        botonMusica.textContent="🎵";
        botonMusica.classList.remove("reproduciendo");
    }
    reproduciendo=!reproduciendo;
};