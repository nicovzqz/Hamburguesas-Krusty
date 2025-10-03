function calcularTotal(carrito) {
    return carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
}

function aplicarDescuento(total, cantidadHamburguesas) {
    if (cantidadHamburguesas > 3) {
        return total * 0.8; // Aplica un 20% de descuento
    }
    return total;
}

function filtrarProductos(productos, categoria) {
    if (categoria === "todos") {
        return productos;
    }
    return productos.filter(producto => producto.categoria === categoria);
}

function buscarProductoPorNombre(productos, nombre) {
    return productos.find(producto => producto.nombre.toLowerCase() === nombre.toLowerCase());
}

function actualizarCantidadCarrito(carrito) {
    return carrito.reduce((total, producto) => total + producto.cantidad, 0);
}