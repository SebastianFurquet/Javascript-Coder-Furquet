function cotizarDanio(){
    // Declaro mis variables. (Mas adelante las tengo que simplificar con POO)
// Variables del tipo de daño
let rayado = 500
let abollado = 1000
let roto = 1500

// Variables de la magnitud del daño. (Ponderacion del daño)
let leve = 1.1
let medio = 1.3
let grave = 1.5

// Le solicito al usuario que ingrese el capital asegurado del vehiculo.
let capitalAsegurado = parseFloat(prompt("Ingrese el capital asegurado"))

// Inicializo las variables (estas variables van a guardar los datos que se recopilen con el while)
let costoBase = 0
let incremento = 0
let total = 0

// Variable con la que inicializo el while.
let continuar = true

// Con el while recopilo los datos.
while(continuar){

// Le solicito al usuario que me indique el tipo de daño.
let tipoDanio = prompt("Ingrese el tipo de daño (rayado, abollado, roto):").toLowerCase()
    if (tipoDanio === "rayado"){
        costoBase = rayado
    } else if(tipoDanio === "abollado"){
        costoBase = abollado
    } else if(tipoDanio ==="roto"){
        costoBase = roto
    } else if (tipoDanio ==""){
        alert("No ingresaste datos, tenes que comenzar nuevamente")
        continuar = false
    }

// Le solicito al usuario que me indique la magnitud de los daños.
let magnitudDanio = prompt("Ingrese la magnitud del daño (leve, medio, grave):").toLowerCase()
    if (magnitudDanio === "leve"){
        incremento = leve
    } else if(magnitudDanio === "medio"){
        incremento = medio
    } else if(magnitudDanio ==="grave"){
        incremento = grave
    } else if(magnitudDanio ==""){
        alert("no ingresaste datos, tenes que comenzar nuevamente")
        continuar = false
    }

// Validacion de datos y calculos

if(tipoDanio && incremento){
    let costoParcial = costoBase * incremento
    total += costoParcial
    alert(`El costo estimado para este daño es : $${costoParcial}`)
} else{
    alert("Entrada invalida. Intente nuevamente")
}

continuar = confirm("¿Desea agregar otro daño?") // con esto cambio el estado true/false de la variable continuar que es lo que me hablita o deshabilita el while

} // hasta aca va le while

alert(`El costo total estimado de reparacion es: $ ${total}`)

// Se contrastan los daños estimados con el capital asegurado.

if(isNaN(total) || isNaN(capitalAsegurado) ){
    alert("Te faltan datos por completar, comenza nuevamente")
}
else if (total > capitalAsegurado *0.8){
    alert("El auto es destruccion total. No sirve mas")
} else if(total > capitalAsegurado * 0.5){
    alert("Repararlo va a ser costoso y va a llevar tiempo")
} else{
    alert("El arreglo sale en dos dias, no te preocupes")
}

}

cotizarDanio()

