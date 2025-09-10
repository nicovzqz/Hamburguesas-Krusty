const hamburguesas = [
      { nombre: "Cangreburger", precio: 13000 },
      { nombre: "BigMac", precio: 15500 },
      { nombre: "Cancha", precio: 12000 },
      { nombre: "Afroamerican", precio: 20000 }
    ];

    let carrito = [];

    function mostrarMenu() {
      const tbody = document.getElementById('menu-body');
      tbody.innerHTML = '';
      hamburguesas.forEach((burger, idx) => {
        let desc = '';
        if (burger.nombre === "Cangreburger") {
          desc = '<div class="desc">Solo disponible comprando 3 o más unidades</div>';
        }
        tbody.innerHTML += `
          <tr>
            <td>${burger.nombre} ${desc}</td>
            <td>$${burger.precio.toLocaleString()}</td>
            <td>
              <input type="number" id="qty${idx}" value="1" min="1" style="width:50px">
            </td>
            <td>
              <button onclick="agregar('${burger.nombre}', ${burger.precio}, 'qty${idx}')">Agregar</button>
            </td>
          </tr>
        `;
      });
    }

    function agregar(nombre, precio, qtyId) {
      let cantidad = parseInt(document.getElementById(qtyId).value);
      if (isNaN(cantidad) || cantidad < 1) return;

      // Cangreburger solo se puede comprar si son 3 o más
      if (nombre === "Cangreburger" && cantidad < 3) {
        alert("La Cangreburger solo está disponible comprando 3 o más unidades.");
        return;
      }

      // Si ya está en el carrito, sumamos
      const idx = carrito.findIndex(item => item.nombre === nombre);
      if (idx > -1) {
        carrito[idx].cantidad += cantidad;
      } else {
        carrito.push({ nombre, precio, cantidad });
      }
      actualizarCarrito();
    }

    function actualizarCarrito() {
      const lista = document.getElementById('cart-list');
      lista.innerHTML = '';
      let total = 0;
      carrito.forEach(item => {
        let subtotal = item.precio * item.cantidad;
        let descuento = 0;
        if (item.cantidad >= 3) {
          descuento = subtotal * 0.05;
          subtotal -= descuento;
        }
        total += subtotal;
        const li = document.createElement('li');
        li.innerHTML = `${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()}`
          + (descuento > 0 ? ` <span class="desc">(-5% desc: -$${descuento.toLocaleString()})</span>` : '')
          + ` <button onclick="eliminar('${item.nombre}')">Eliminar</button>`;
        lista.appendChild(li);
      });
      document.getElementById('total').textContent = `Total: $${total.toLocaleString()}`;
    }

    function eliminar(nombre) {
      carrito = carrito.filter(item => item.nombre !== nombre);
      actualizarCarrito();
    }

    // Inicializar menú
    mostrarMenu();
