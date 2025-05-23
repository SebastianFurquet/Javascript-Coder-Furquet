//Se inicializa variable para cotizacion donde se iran cargando los datos

let cotizacionActual ={
    marca: "",
    modelo: "",
    capital: 0,
    danios: [] // <-- esto sera mi nueva listaDanios
};

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
    cotizacionActual.marca = marcaSeleccionada

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

// guardo el modelo Selccionado en cotizacionActual
const modeloSelect = document.getElementById("modelo")
modeloSelect.addEventListener("change", ()=>{
    const modeloSeleccionado = modeloSelect.value;
    cotizacionActual.modelo = modeloSeleccionado
})

// guardo el capital asegurado cotizacionActual
let capitalGuardado = document.getElementById("capitalAsegurado")
capitalGuardado.addEventListener("change", ()=> {
    const valor = parseFloat(capitalGuardado.value)
    if (!isNaN(valor) && valor > 0){ 
    cotizacionActual.capital = valor
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

// Repuestos
// ---------------------------------------------------------------
// Se genera el consumo de repuestos desde Json o Api.
// se crea api en jsonbin.io y se obtiene el link de la api https://api.jsonbin.io/v3/b/68026beb8a456b79668c515c
// por las dudas tambien se crea el json local (LocalRepuestos.json) para no depender de la api externa.
// ---------------------------------------------------------------

// Carga de repuestos al localstorage desde el Json local o desde la Api jsonbin.io

function cargarRepuestos(){

    return fetch("https://api.jsonbin.io/v3/b/68026beb8a456b79668c515c")
    .then(respuesta => respuesta.json())
    .then(data => {
        const repuestos = data.record.repuestos // valido si consumo el Json de la Api jsonbin.io
        localStorage.setItem("repuestos", JSON.stringify(repuestos))
        cargarRepuestosHTML()
    })
    .catch( ()=> { // por llega a fallar la Api jsonbin.io que es gratuita y tiene un limite de consumo manejo el error con el Catch para tomar los datos del localRepuestos.json
        fetch("localRepuestos.json")
        .then(respuesta => respuesta.json())
        .then(data => {
            const repuestos = data.repuestos
            localStorage.setItem("repuestos", JSON.stringify(repuestos))
            cargarRepuestosHTML();
        })
    })
}

//------------------------
// Lista de repuestos.!!!!
//-----------------------

// Voy a buscar la lista de los repuestos al LocalStorage.

function obtenerRepuestos(){
    let repuestosGuardados = localStorage.getItem("repuestos");
    if(!repuestosGuardados) {
        return [];  
    } 
    let listaDeRepuestos = JSON.parse(repuestosGuardados);
    return listaDeRepuestos;
}

// Cargo los repuestos en el Select del Html.

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

// Habilito los repuestos segun la condicion seleccionada Daño : ROTO Y Magnitud : CAMBIO

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
    cargarRepuestos()
    .then ( ()=> {
        document.getElementById("selectDanio").addEventListener("change", habilitaRepuestos);
        document.getElementById("selectMagnitud").addEventListener("change", habilitaRepuestos);
    
        habilitaRepuestos(); //  por si hay valores ya seleccionados
    })
    .catch(error => {
        console.error("Error al cargar los repuestos: ", error);
        Swal.fire("Error", "No se pudieron cargar los repuestos", "error")
    })
});



// Evento: Agregar daño

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

    cotizacionActual.danios.push(nuevoDanio) // <-- Agrego el nuevo daño a la cotizacion actual
    
    mostrarDanios()

    document.getElementById("selectDanio").value = ""
    document.getElementById("selectMagnitud").value = ""
    document.getElementById("selectRepuesto").innerHTML = '<option selected disabled>Seleccione repuesto</option>'
    document.getElementById("selectRepuesto").disabled = true;

    mostrarAlerta();
})

// Mostrar daños en el DOM

    function mostrarDanios() {
        const divDanios = document.getElementById("listaDanios");
        

        let tarjeta = `
            <div class="card ">
                <div class="card-header border border-black bg-info text-white ">
                    <h3> Daños ingresados:</h3>
                </div>
                <ul class="list-group list-group-flush">
        `;
    
        cotizacionActual.danios.forEach((danio, i) => {
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

        setTimeout(()=>{
            divResultado.textContent = "";
            divResultado.className = "";
        }, 3000);
        return;
    }
    const totalCotizado = cotizacionActual.danios.reduce((suma,danio)=> suma + danio.costo, 0);

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

    const { marca ,modelo, capital} = cotizacionActual; 

    let totalCotizado = cotizacionActual.danios.reduce((suma, danio) => suma + danio.costo, 0);

    // Armamos la lista de daños en HTML
    let daniosHTML = cotizacionActual.danios.map((danio, i) => { 
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

            cotizacionActual.totalCotizado = totalCotizado 
            cotizacionActual.id = Date.now() 
            const historial = JSON.parse(localStorage.getItem("cotizaciones")) || []; 
            historial.push(cotizacionActual);
            localStorage.setItem("cotizaciones", JSON.stringify(historial)); // guardo el historial de cotizaciones en el localstorage

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
                    if(result.isConfirmed){
                        Swal.fire({
                            title: "¡Gracias por usar el simulador!",
                            text: "La cotización fue guardada correctamente.",
                            icon: "success",
                            confirmButtonText: "Aceptar"
                        }).then(() => {
                            reiniciarCotizacion();
                        });
                    } else {
                        reiniciarCotizacion();
                    }
                })
        }
    });
}

function reiniciarCotizacion(){
    // limpiar localstorage

    cotizacionActual = { 
        marca:"", 
        modelo:"", 
        capital:0, 
        danios:[] 
    };

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