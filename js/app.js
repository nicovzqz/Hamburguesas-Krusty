let productos = [];
let carrito = [];

// Cargar productos desde JSON
async function cargarProductos() {
    const res = await fetch('data/productos.json');
    productos = await res.json();
    renderizarProductos(productos);
}

// Renderizar productos
function renderizarProductos(lista) {
    const contenedor = document.getElementById('lista-productos');
    contenedor.innerHTML = '';
    lista.forEach(prod => {
        contenedor.innerHTML += `
            <div class="producto-card">
                <img src="${prod.imagen}" alt="${prod.nombre}">
                <h3>${prod.nombre}</h3>
                <p>${prod.descripcion}</p>
                <div class="precio">$${prod.precio.toFixed(2)}</div>
                <div style="margin-bottom:10px;">
                    <label for="cantidad-${prod.id}">Cantidad:</label>
                    <input type="number" id="cantidad-${prod.id}" min="1" value="1" style="width:60px; margin-left:5px;">
                </div>
                <button class="btn-agregar-carrito" data-id="${prod.id}">Agregar al carrito</button>
            </div>
        `;
    });
}

// Filtrar productos
document.getElementById('filtrar').addEventListener('click', () => {
    const categoria = document.getElementById('categoria').value;
    const tipo = document.getElementById('tipo').value;
    let filtrados = productos;

    if (categoria !== 'todos') {
        filtrados = filtrados.filter(p => p.categoria === categoria);
    }
    if (tipo !== 'todos') {
        filtrados = filtrados.filter(p => p.nombre === tipo);
    }
    renderizarProductos(filtrados);
});

// Agregar al carrito
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-agregar-carrito')) {
        const idProducto = parseInt(e.target.dataset.id);
        const inputCantidad = document.getElementById(`cantidad-${idProducto}`);
        const cantidad = inputCantidad ? parseInt(inputCantidad.value) : 1;
        agregarAlCarrito(idProducto, cantidad);
    }
    if (e.target.classList.contains('btn-eliminar-item')) {
        const idProducto = parseInt(e.target.dataset.id);
        eliminarDelCarrito(idProducto);
    }
});

// Lógica de carrito
function agregarAlCarrito(id, cantidad) {
    const item = carrito.find(i => i.id === id);
    if (item) {
        item.cantidad += cantidad;
    } else {
        carrito.push({ id, cantidad });
    }
    renderizarCarrito();
    mostrarPopupAgregado();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(i => i.id !== id);
    renderizarCarrito();
}

// Renderizar carrito y matemáticas del descuento
function renderizarCarrito() {
    const lista = document.getElementById('lista-carrito');
    const totalDiv = document.getElementById('total-carrito');
    lista.innerHTML = '';
    let total = 0;
    let hamburguesas = carrito.filter(item => {
        const prod = productos.find(p => p.id === item.id);
        return prod && prod.categoria === 'hamburguesas';
    });
    let cantHamburguesas = hamburguesas.reduce((acc, item) => acc + item.cantidad, 0);
    let subtotalHamburguesas = hamburguesas.reduce((acc, item) => {
        const prod = productos.find(p => p.id === item.id);
        return acc + prod.precio * item.cantidad;
    }, 0);

    carrito.forEach(item => {
        const prod = productos.find(p => p.id === item.id);
        lista.innerHTML += `
            <div class="carrito-item">
                <img src="${prod.imagen}" alt="${prod.nombre}">
                <span>${prod.nombre} x${item.cantidad}</span>
                <span class="carrito-precio">$${(prod.precio * item.cantidad).toFixed(2)}</span>
                <button class="btn-eliminar-item" data-id="${item.id}">Eliminar</button>
            </div>
        `;
        total += prod.precio * item.cantidad;
    });

    let descuento = 0;
    let detalleDescuento = '';
    if (cantHamburguesas > 2) {
        descuento = subtotalHamburguesas * 0.20;
        detalleDescuento = `
            <div style="color:#e65100; font-weight:bold; margin-bottom:8px;">
                Subtotal hamburguesas: $${subtotalHamburguesas.toFixed(2)}<br>
                Descuento 20%: -$${descuento.toFixed(2)}<br>
                <span style="color:#388e3c;">Subtotal con descuento: $${(subtotalHamburguesas - descuento).toFixed(2)}</span>
            </div>
        `;
        total -= descuento;
    }

    totalDiv.innerHTML = `
        ${detalleDescuento}
        Total: <span style="color:#388e3c;">$${total.toFixed(2)}</span>
    `;
}

// Comprar
document.getElementById('comprar').addEventListener('click', async () => {
  // Verifica si el carrito está vacío
  if (!carrito || carrito.length === 0) {
    // Muestra el popup de carrito vacío
    Swal.fire({
      icon: 'warning',
      title: 'El carrito está vacío',
      text: 'Agrega productos antes de finalizar la compra',
      confirmButtonColor: "#ff9800",
      background: "#fff8e1",
      color: "#e65100"
    });
    return;
  }

  // Oculta la imagen fixeada antes de mostrar el popup
  document.querySelector('.krusty-img-fixed').style.display = 'none';

  // Popup para dirección y teléfono
  const { value: formValues } = await Swal.fire({
    title: "Datos para el envío",
    html: `
      <img src="assets/fotos/kb.png" alt="Krusty" class="krusty-popup-img">
      <input id="swal-input1" class="swal2-input" placeholder="Dirección">
      <input id="swal-input2" class="swal2-input" placeholder="Teléfono de contacto">
    `,
    confirmButtonText: "Finalizar compra",
    focusConfirm: false,
    width: 600,
    padding: "3em",
    color: "#e65100",
    background: "#fff8e1",
    backdrop: `
      rgba(255,152,0,0.3)
      url("assets/fotos/krusty.png")
      left top
      no-repeat
    `,
    confirmButtonColor: "#ff9800",
    customClass: {
      popup: 'swal2-krusty'
    },
    preConfirm: () => {
      const direccion = document.getElementById("swal-input1").value.trim();
      const telefono = document.getElementById("swal-input2").value.trim();
      if (!direccion || !telefono) {
        Swal.showValidationMessage('Por favor completa ambos campos');
        return false;
      }
      return [direccion, telefono];
    }
  });

  // Vuelve a mostrar la imagen fixeada después del popup
  document.querySelector('.krusty-img-fixed').style.display = '';

  if (formValues) {
    Swal.fire({
      title: "¡Muchas gracias!",
      text: "Estamos preparando tu pedido",
      color: "#e65100",
      background: "#fff8e1",
      confirmButtonColor: "#ff9800"
    });
    carrito = [];
    renderizarCarrito();
  }
});

// Modal de compra
function mostrarModalCompra() {
    const modal = document.getElementById('modal-compra');
    modal.style.display = 'flex';
}
document.getElementById('cerrar-modal').onclick = function() {
    document.getElementById('modal-compra').style.display = 'none';
};
window.onclick = function(event) {
    const modalCarrito = document.getElementById('modal-carrito');
    if (event.target === modalCarrito) {
        modalCarrito.style.display = 'none';
    }
    const modalCompra = document.getElementById('modal-compra');
    if (event.target === modalCompra) {
        modalCompra.style.display = 'none';
    }
};

// Mostrar modal del carrito
document.getElementById('abrir-carrito').onclick = function() {
    document.getElementById('modal-carrito').style.display = 'flex';
    renderizarCarrito();
};
// Cerrar modal del carrito
document.getElementById('cerrar-carrito').onclick = function() {
    document.getElementById('modal-carrito').style.display = 'none';
};

// Mostrar popup de agregado
function mostrarPopupAgregado() {
    const popup = document.getElementById('popup-agregado');
    popup.classList.add('mostrar');
    setTimeout(() => {
        popup.classList.remove('mostrar');
    }, 1800);
}

function mostrarPopupVacio() {
    const popup = document.getElementById('popup-vacio');
    popup.classList.add('mostrar');
    setTimeout(() => {
        popup.classList.remove('mostrar');
    }, 1800);
}



// Inicializar
cargarProductos();
