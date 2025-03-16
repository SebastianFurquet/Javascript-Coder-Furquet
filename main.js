function cotizarDanio(){

/*-------------------------------------------------------------------------------------------------*/
// Array de objetos con Variables del tipo de daño
const tiposDanio = [
    { tipo: "rayado", costo: 500 },
    { tipo: "abollado", costo: 1000 },
    { tipo: "roto", costo: 1500 },
]

// Array de objetos con Variables de la magnitud del daño. (Ponderacion del daño)
const magnitudesDanio = [
    { magnitud: "leve", incremento: 1.1 },
    { magnitud: "medio", incremento: 1.3 },
    { magnitud: "grave", incremento: 1.5 },
]
/*-------------------------------------------------------------------------------------------------*/

let capitalAsegurado = parseFloat(prompt("Ingrese el capital asegurado del vehículo")) // Le solicito al usuario que ingrese el capital asegurado del vehiculo y lo valido.

if (isNaN(capitalAsegurado) || capitalAsegurado <= 0) { // Valido el ingreso, si el capital asegurado no es un numero o es menor o igual a 0, le aviso al usuario que no es valido y que comience nuevamente
    alert("El capital asegurado no es válido. Intente nuevamente.")
    return
}

/*-------------------------------------------------------------------------------------------------*/

let total = 0 // Inicializo las variables (estas variables van a guardar los datos que se recopilen con el while)
let continuar = true // Variable con la que inicializo el while.

/*-------------------------------------------------------------------------------------------------*/
while(continuar){ // Con el while recopilo los datos.

let tipoInput = prompt("Ingrese el tipo de daño (rayado, abollado, roto):").toLowerCase() // Le solicito al usuario que me indique el tipo de daño.
let tipoEncontrado = tiposDanio.find( (danio) => danio.tipo === tipoInput) // con esto busco el tipo de daño en el array de objetos

if (!tipoEncontrado){ // Valido el ingreso, si no encuentro el tipo de daño, le aviso al usuario que no es valido y que comience nuevamente
    alert("Tipo de daño no valido. Comenza nuevamente")
    return
}

let magnitudInput = prompt("Ingrese la magnitud del daño (leve, medio, grave):").toLowerCase() // Le solicito al usuario que me indique la magnitud de los daños.
let magnitudEncontrada = magnitudesDanio.find( (mag) => mag.magnitud === magnitudInput) // con esto busco la magnitud del daño en el array de objetos

if(!magnitudEncontrada){ // Valido el ingreso, si no encuentro la magnitud de daño, le aviso al usuario que no es valido y que comience nuevamente
    alert("Magnitud de daño no valida. Comenza nuevamente")
    return
}

/*-------------------------------------------------------------------------------------------------*/
// Validacion de datos y calculos

let costoParcial = calcularCosto(tipoEncontrado, magnitudEncontrada)
total += costoParcial
alert(`El costo estimado para este daño es : $${costoParcial}`)

function calcularCosto(tipoEncontrado, magnitudEncontrada){
    return tipoEncontrado.costo * magnitudEncontrada.incremento
}

continuar = confirm("¿Desea agregar otro daño?") // con esto cambio el estado true/false de la variable continuar que es lo que me hablita o deshabilita el while

} // hasta aca va le while

/*-------------------------------------------------------------------------------------------------*/
// Muestro el costo total estimado de reparacion

alert(`El costo total estimado de reparacion es: $ ${total}`)

/*-------------------------------------------------------------------------------------------------*/

// Se contrastan los daños estimados con el capital asegurado.

if (total > capitalAsegurado *0.8){
    alert("El auto es destruccion total. No sirve mas")
} else if(total > capitalAsegurado * 0.5){
    alert("Repararlo va a ser costoso y va a llevar tiempo")
} else{
    alert("El arreglo sale en dos dias, no te preocupes")
}

}
/*-------------------------------------------------------------------------------------------------*/

cotizarDanio()

