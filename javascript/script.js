// Declaración de variables globales
let modeloBurger;
let precioBurger;
let cantidad;
let descuento;
let totalFactura;
let stockDisponible = {
    'Cangreburger': 50,
    'Bigmac': 30,
    'Cancha': 40,
    'Afroamerican': 25
};
let registroVentas = [];

// Saludo personalizado
let nombreUsuario;

for (; !nombreUsuario;) {
    nombreUsuario = prompt("¡Bienvenido a Hamburguesas Krusty! Ingresa tu nombre");
}

confirm(
    `Hola ${nombreUsuario}, vamos a registrar una venta. Para continuar, presiona Aceptar.`
);

// Función para pedir datos
function entradaDatos() {
    modeloBurger = prompt(`Ingresa el modelo de lámpara (Cangreburger, Bigmac, Cancha, Afroamerican). Stock disponible:
    Cangreburger: ${stockDisponible['Cangreburger']} unidades
    Bigmac: ${stockDisponible['Bigmac']} unidades
    Cancha: ${stockDisponible['Cancha']} unidades
    Afroamerican: ${stockDisponible['Afroamerican']} unidades`);

  // Validar modelo ingresado
    while (!['Cangreburger', 'Bigmac', 'Cancha', 'Afroamerican'].includes(modeloBurger)) {
    modeloBurger = prompt("Modelo no válido. Ingresa Cangreburger, Bigmac, Cancha o Afroamerican");
}

    cantidad = parseInt(prompt("Ingresa la cantidad de Hamburguesas a comprar"));

  // Validar que haya suficiente stock
    while (cantidad > stockDisponible[modeloBurger]) {
    cantidad = parseInt(prompt(`No hay suficiente stock. Solo quedan ${stockDisponible[modeloBurger]} unidades. Ingresa una cantidad menor`));
}

  // Asignar precios según modelo
    switch(modeloBurger) {
    case 'Cangreburger':
        precioBurger = 12000;
    break;
    case 'Bigmac':
        precioBurger = 15000;
    break;
    case 'Cancha':
        precioBurger = 18000;
    break;
    case 'Afroamerican':
        precioBurger = 20000;
    break;
}
}

// Función para calcular descuento y total
function procesarVenta() {
// Aplicar descuento según cantidad
    if (cantidad >= 10) {
        descuento = 0.15; // 15% de descuento
} 
    else if (cantidad >= 5) {
        descuento = 0.10; // 10% de descuento

} 
    else {
        descuento = 0;
}

    totalFactura = (precioBurger * cantidad) * (1 - descuento);
}

// Función para mostrar resultados
function mostrarResultados() {
    let mensaje = `Detalle de la venta:
    Modelo: ${modeloBurger}
    Cantidad: ${cantidad}
    Precio unitario: ${precioBurger}
    Descuento: ${descuento * 100}%
    Total a pagar: ${totalFactura}`; 

    alert(mensaje);

  // Actualizar stock
    stockDisponible[modeloBurger] -= cantidad;
    console.log(`Stock actualizado - ${modeloBurger}: ${stockDisponible[modeloBurger]} unidades`);
}

// Bucle principal para registrar múltiples ventas
let continuar = true;

while (continuar) {
    entradaDatos();
    procesarVenta();
    mostrarResultados();

  // Guardar registro
    registroVentas.push({
    modelo: modeloBurger,
    cantidad: cantidad,
    precioUnitario: precioBurger,
    descuento: `${descuento * 100}%`,
    total: totalFactura,
});

    continuar = confirm("¿Deseas registrar otra venta?");
}

// Mostrar historial en consola
console.log("Historial de ventas:", registroVentas);
console.log("Stock final:", stockDisponible);


