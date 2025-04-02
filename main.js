// Lista de Modelos por Marca

const modelosPorMarca = {
    "Ford": ["Fiesta", "Focus", "Mustang", "Ranger", "EcoSport"],
    "Chevrolet": ["Onix", "Cruze", "Tracker", "S10", "Spin"],
    "Volkswagen": ["Gol", "Polo", "T-Cross", "Amarok", "Suran"],
    "Peugeot": ["208", "2008", "3008", "Partner", "Boxer"],
    "Renault": ["Kwid", "Sandero", "Duster", "Kangoo", "Master"],
    "Toyota": ["Etios", "Corolla", "SW4", "Hilux", "Rav4"],
    "Fiat": ["Mobi", "Cronos", "Toro", "Ducato", "Fiorino"],
}

// Cargar modelos segun la marca seleccionada
function cargarModelos() {
    const marcaSeleccionada = document.getElementById("marca").value;
    localStorage.setItem("marca", marcaSeleccionada);

    const modeloSelect = document.getElementById("modelo");
    modeloSelect.innerHTML = '<option value="">Seleccione un modelo...</option>'; 

    if ( marcaSeleccionada in modelosPorMarca ) {
        modelosPorMarca[marcaSeleccionada].forEach( (modelo) => { 
            let opcion = document.createElement("option");
            opcion.value = modelo;
            opcion.textContent = modelo;
            modeloSelect.appendChild(opcion);            
        });
    }
}

// guardo los Modelos en LocalStorage
const modeloSelect = document.getElementById("modelo")
modeloSelect.addEventListener("change", ()=>{
    const modeloSeleccionado = modeloSelect.value;
    localStorage.setItem("modelo", modeloSeleccionado);
})

// guardo el capital asegurado en LocalStorage
let capitalGuardado = document.getElementById("capitalAsegurado")
capitalGuardado.addEventListener("change", ()=> {
    const valor = parseFloat(capitalGuardado.value)
    if (!isNaN(valor) && valor > 0){
        localStorage.setItem("CapitalAsegurado", valor)
    }
})

// Variables

const tiposDanio = [
    { tipo: "rayado", costo: 5000 },
    { tipo: "abollado", costo: 10000 },
    { tipo: "roto", costo: 15000 },
]

const magnitudesDanio = [
    { magnitud: "leve", incremento: 1.1 },
    { magnitud: "medio", incremento: 1.3 },
    { magnitud: "grave", incremento: 1.5 },
    { magnitud: "cambio", incremento: 1 }
]

const baseRepuestos = [
    { descripcion: "paragolpes", precio: 20000 },
    { descripcion: "guardabarros", precio: 15000 },
    { descripcion: "optica", precio: 18000 },
    { descripcion: "capot", precio: 30000 },
    { descripcion: "puerta Der", precio: 40000 }
]

// Repuestos

//Me fijo si tengo repuestos guardados.
if (obtenerRepuestos().length === 0) { 
    baseRepuestos.forEach(repuesto => guardarRepuesto(repuesto));
}

//Guardo repuestos como Json en localStorage
function guardarRepuesto(repuesto){
    let repuestosGuardados = localStorage.getItem("repuestos");
    let listaDeRepuestos = repuestosGuardados ? JSON.parse(repuestosGuardados) : []; // operador ternario

    listaDeRepuestos.push(repuesto) 
    let listaComoTexto = JSON.stringify(listaDeRepuestos)
    localStorage.setItem("repuestos", listaComoTexto)
}

//------------------------
// Lista de repuestos.!!!!
//-----------------------

function obtenerRepuestos(){
    let repuestosGuardados = localStorage.getItem("repuestos");
    if(!repuestosGuardados) {
        return [];  
    } 

    let listaDeRepuestos = JSON.parse(repuestosGuardados);
    return listaDeRepuestos;
}

function cargarRepuestosHTML(){
    const repuestos = obtenerRepuestos()
    const select = document.getElementById("selectRepuesto");

    select.innerHTML = '<option selected disabled>Seleccione repuesto</option>';

    repuestos.forEach ((x)=>{
        const opcion = document.createElement("option");
        opcion.value = x.descripcion;
        opcion.textContent = ` ${x.descripcion} ` /* -$ ${x.precio} */
        select.appendChild(opcion);
    })
}
cargarRepuestosHTML()

function habilitaRepuestos() {
    const tiposDanio = document.getElementById("selectDanio").value;
    const magnitud = document.getElementById("selectMagnitud").value;
    const selectRepuesto = document.getElementById("selectRepuesto");

    if(tiposDanio === "roto" && magnitud === "cambio"){
        selectRepuesto.disabled = false;
        cargarRepuestosHTML();
    } else {
        selectRepuesto.disabled = true;
        selectRepuesto.innerHTML = '<option selected disabled>Seleccione repuesto</option>';
    }
}

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("selectDanio").addEventListener("change", habilitaRepuestos);
    document.getElementById("selectMagnitud").addEventListener("change", habilitaRepuestos);

    habilitaRepuestos(); //  por si hay valores ya seleccionados
});


// Evento: Agregar daño

let listaDanios = []

const agregarDanio = document.getElementById("agregarDanio")
agregarDanio.addEventListener("click", ()=> {

    const tipoSeleccionado = document.getElementById("selectDanio").value;
    const magnitudSeleccionada = document.getElementById("selectMagnitud").value;

    const tipoEncontrado = tiposDanio.find((danio)=> danio.tipo === tipoSeleccionado);
    const magnitudEncontrada = magnitudesDanio.find((mag)=> mag.magnitud === magnitudSeleccionada);

    const costoParcial = tipoEncontrado.costo * magnitudEncontrada.incremento;
//-------
    let repuestoSeleccionado = null;
    let costoRepuesto = 0;

    const selectRepuesto = document.getElementById("selectRepuesto");
        if(!selectRepuesto.disabled){ 
        const repuestosDesc = selectRepuesto.value;

        const listaRepuestos = obtenerRepuestos();
        const repuesto = listaRepuestos.find((rep)=> rep.descripcion === repuestosDesc)

        if (repuesto){
            repuestoSeleccionado = repuesto.descripcion;
            costoRepuesto = repuesto.precio
        }
    }

    const nuevoDanio = {
        tipo: tipoEncontrado.tipo,
        magnitud: magnitudEncontrada.magnitud,
        costo: costoParcial + costoRepuesto,
        repuesto: repuestoSeleccionado
    }

    listaDanios.push(nuevoDanio)
    localStorage.setItem("danios", JSON.stringify(listaDanios))
    
    mostrarDanios()

    document.getElementById("selectDanio").value = ""
    document.getElementById("selectMagnitud").value = ""
    document.getElementById("selectRepuesto").innerHTML = '<option selected disabled>Seleccione repuesto</option>'
    document.getElementById("selectRepuesto").disabled = true;

    mostrarAlerta();
})

// Mostrar daños en el DOM

/* function mostrarDanios() {
    const divDanios = document.getElementById("listaDanios")
    divDanios.innerHTML = "<h3> Daños ingresados:</h3>"
    listaDanios.forEach((danio,i)=>{
        divDanios.innerHTML += `<p> Daño ${i + 1}: ${danio.tipo} (${danio.magnitud}) ${danio.repuesto ? ' con repuesto: ' + danio.repuesto : ''} - $${danio.costo} </p>`
    })
} */

    function mostrarDanios() {
        const divDanios = document.getElementById("listaDanios");
        

        let tarjeta = `
            <div class="card">
                <div class="card-header border border-black bg-info text-white">
                    <h3> Daños ingresados:</h3>
                </div>
                <ul class="list-group list-group-flush">
        `;
    
        listaDanios.forEach((danio, i) => {
            tarjeta += `
                <li class="list-group-item">
                    <strong>Daño ${i + 1}:</strong> ${danio.tipo} (${danio.magnitud})
                    ${danio.repuesto ? `<br><em>Repuesto:</em> ${danio.repuesto}` : ""}
                    <br><strong>Costo:</strong> $${danio.costo}
                </li>
            `;
        });
    
        tarjeta += `
                </ul>
            </div>
        `;
    
        divDanios.innerHTML = tarjeta
    }


// Función para mostrar alerta con SweetAlert
function mostrarAlerta(){
    Swal.fire({
        icon: "success",
        title: "¡Daño agregado con éxito!",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
    })
}

/* function mostrarAlerta(mensaje, tipo = "success") {
    const divAlerta = document.getElementById("alertaDanio");

    divAlerta.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show "" role="alert">
            ${mensaje}
        </div>
    `;

    setTimeout(() => {
        divAlerta.innerHTML = "";
    }, 2000); // 2 segundos
    
} */

// Evento Calcular total y mostrar resultado final.

const calcularTotal = document.getElementById("calcularTotal")
    calcularTotal.addEventListener("click", ()=>{
    
    const capitalAseg = parseFloat(document.getElementById("capitalAsegurado").value);
    const divResultado = document.getElementById("resultadoFinal");

    if (isNaN(capitalAseg) || capitalAseg <= 0){
        Swal.fire({
            title: "Capital asegurado no valido",
            text: "Ingresa un valor por favor",
            icon: "error"
        });
/*         divResultado.className = "alert alert-danger"
        divResultado.textContent = "Capital asegurado no valido. Ingrese un valor"; */

        setTimeout(()=>{
            divResultado.textContent = "";
            divResultado.className = "";
        }, 3000);
        return;
    }
    const totalCotizado = listaDanios.reduce((suma,danio)=> suma + danio.costo, 0);

    let mensaje

    if(totalCotizado > capitalAseg * 0.8){
        mensaje = "El auto es destruccion total.";
    } else if (totalCotizado > capitalAseg * 0.5){
        mensaje = "Repararlo sera costoso y llevara tiempo";
    } else {
        mensaje = "El arreglo es leve. En dos dias esta listo.";
    }
    

mostrarResultadoFinal(mensaje)

})

// Funcion para mostrar el resultado Final.

function mostrarResultadoFinal(mensaje, tipo = "info") {
    const marca = localStorage.getItem("marca") || "No seleccionada";
    const modelo = localStorage.getItem("modelo") || "No seleccionado";
    const capital = localStorage.getItem("CapitalAsegurado") || "No ingresado";

    let totalCotizado = listaDanios.reduce((suma, danio) => suma + danio.costo, 0);

    // Armamos la lista de daños en HTML
    let daniosHTML = listaDanios.map((danio, i) => { 
        return `
            <li>
                <strong>Daño ${i + 1}:</strong> ${danio.tipo} (${danio.magnitud})
                ${danio.repuesto ? `<br><em>Repuesto:</em> ${danio.repuesto}` : ""}
                <br><strong>Costo:</strong> $${danio.costo}
            </li><br>`;
    }).join("");

    Swal.fire({
        title: "¿Desea finalizar la cotización?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, mostrar resumen",
        cancelButtonText: "Volver",
        confirmButtonColor: "green",
        cancelButtonColor: "red",
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Resumen de Cotización",
                html: `
                    <div style="text-align:left">
                        <p><strong>Marca:</strong> ${marca}</p>
                        <p><strong>Modelo:</strong> ${modelo}</p>
                        <p><strong>Capital Asegurado:</strong> $${capital}</p>
                        <hr>
                        <h5>Daños:</h5>
                        <ul style="padding-left: 18px">${daniosHTML}</ul>
                        <hr>
                        <p><strong>Total cotizado:</strong> $${totalCotizado}</p>
                        <p><strong>Conclusión:</strong> ${mensaje}</p>
                    </div>
                `,
                icon: tipo,
                width: 600,
                showCancelButton: true,
                confirmButtonText: "Finalizar",
                cancelButtonText: "Nueva Cotizacion",
                confirmButtonColor:"green",
                cancelButtonColor:"violet",
                }).then((result) =>{
                    if(!result.isConfirmed){
                        reiniciarCotizacion()
                    }
                })
        }
    });
}

function reiniciarCotizacion(){
    // limpiar localstorage

    localStorage.removeItem("marca");
    localStorage.removeItem("modelo");
    localStorage.removeItem("CapitalAsegurado");
    localStorage.removeItem("danios");

    // Limpiar variables
    listaDanios = [];

    // Limpiar campos del DOM
    document.getElementById("marca").value = "";
    document.getElementById("modelo").innerHTML = '<option value="">Seleccione un modelo...</option>';
    document.getElementById("capitalAsegurado").value = "";
    document.getElementById("selectDanio").value = "";
    document.getElementById("selectMagnitud").value = "";
    document.getElementById("selectRepuesto").innerHTML = '<option selected disabled>Seleccione repuesto</option>';
    document.getElementById("selectRepuesto").disabled = true;
    document.getElementById("listaDanios").innerHTML = "";

    Swal.fire({
        icon: "success",
        title: "Formulario reiniciado",
        showConfirmButton: false,
        timer: 1500,
    });
}