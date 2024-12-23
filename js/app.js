   // Configuración de productos con stock y descuentos
   const productos = {
    vaso_degustacion: { 
        nombre: 'Vaso Degustacion', 
        precio: 3500, 
        stock: 15,
        descuento: 0.1  // 10% de descuento
    },
    film_stretch: { 
        nombre: 'Film Stretch', 
        precio: 5500, 
        stock: 5,
        descuento: 0.05  // 5% de descuento
    },
    caja_desayuno: { 
        nombre: 'Caja Desayuno', 
        precio: 7300, 
        stock: 18,
        descuento: 0  // Sin descuento
    },
    film_resinite: { 
        nombre: 'Film Resinite', 
        precio: 3000, 
        stock: 4,
        descuento: 0  // Sin descuento
    }
};

// Constante para el IVA
const IVA = 0.21;  // 21% de IVA

// Inicializar el carrito al cargar la página
document.addEventListener('DOMContentLoaded', cargarCarrito);

function agregarAlCarrito(nombre, precio, productoKey) {
    // Obtener el producto específico
    const producto = productos[productoKey];

    // Validar stock
    if (producto.stock <= 0) {
        alert('¡Producto agotado!');
        return;
    }

    // Obtener el carrito actual del localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Agregar nuevo producto
    carrito.push({ 
        nombre: producto.nombre, 
        precio: producto.precio,
        productoKey: productoKey
    });
    
    // Reducir stock
    producto.stock--;
    document.getElementById(`stock-${productoKey}`).textContent = producto.stock;
    
    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Actualizar vista del carrito
    renderizarCarrito();
}

function renderizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const sidebar = document.getElementById('sidebar');
    const subtotalCarrito = document.getElementById('subtotal-carrito');
    const descuentoCarrito = document.getElementById('descuento-carrito');
    const ivaCarrito = document.getElementById('iva-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length > 0) {
        sidebar.classList.remove('hidden');
    } else {
        sidebar.classList.add('hidden');
    }
    
    // Limpiar lista anterior
    listaCarrito.innerHTML = '';
    
    // Totales iniciales
    let subtotal = 0;
    let descuentoTotal = 0;
    
    // Renderizar cada producto
    carrito.forEach((producto, index) => {
        const productoInfo = productos[producto.productoKey];
        const li = document.createElement('li');
        
        // Calcular descuento individual
        const descuentoProducto = productoInfo.descuento * producto.precio;
        const precioConDescuento = producto.precio - descuentoProducto;
        
        li.innerHTML = `
            ${producto.nombre} - $${producto.precio} 
            ${productoInfo.descuento > 0 ? 
                `<span class="descuento">(Desc. ${(productoInfo.descuento * 100).toFixed(0)}%: 
                -$${descuentoProducto.toFixed(2)})</span>` 
                : ''}
        `;
        
        // Botón para eliminar producto
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.onclick = () => eliminarDelCarrito(index);
        
        li.appendChild(botonEliminar);
        listaCarrito.appendChild(li);
        
        // Sumar al subtotal y descuentos
        subtotal += producto.precio;
        descuentoTotal += descuentoProducto;
    });
    
    // Calcular IVA
    const ivaTotal = (subtotal - descuentoTotal) * IVA;
    const total = subtotal - descuentoTotal + ivaTotal;
    
    // Actualizar totales
    subtotalCarrito.textContent = subtotal.toFixed(2);
    descuentoCarrito.textContent = descuentoTotal.toFixed(2);
    ivaCarrito.textContent = ivaTotal.toFixed(2);
    totalCarrito.textContent = total.toFixed(2);
}

function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Recuperar el producto para devolver stock
    const producto = productos[carrito[index].productoKey];
    producto.stock++;
    document.getElementById(`stock-${carrito[index].productoKey}`).textContent = producto.stock;
    
    // Eliminar producto por índice
    carrito.splice(index, 1);
    
    // Actualizar localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Renderizar de nuevo
    renderizarCarrito();
}

function vaciarCarrito() {
    // Restaurar stock de todos los productos
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.forEach(item => {
        const producto = productos[item.productoKey];
        producto.stock++;
        document.getElementById(`stock-${item.productoKey}`).textContent = producto.stock;
    });
    
    // Limpiar localStorage
    localStorage.removeItem('carrito');
    
    // Renderizar
    renderizarCarrito();
}

function cargarCarrito() {
    // Cargar carrito al iniciar la página
    renderizarCarrito();
}

// Funciones de Checkout
function mostrarCheckout() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Validar que hay productos en el carrito
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    // Mostrar modal de checkout
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'flex';
    
    // Actualizar totales en el modal
    const subtotal = parseFloat(document.getElementById('subtotal-carrito').textContent);
    const descuento = parseFloat(document.getElementById('descuento-carrito').textContent);
    const iva = parseFloat(document.getElementById('iva-carrito').textContent);
    const total = parseFloat(document.getElementById('total-carrito').textContent);
    
    document.getElementById('modal-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('modal-descuento').textContent = descuento.toFixed(2);
    document.getElementById('modal-iva').textContent = iva.toFixed(2);
    document.getElementById('modal-total').textContent = total.toFixed(2);
}

function realizarCompra() {
    // Simular compra
    alert('¡Compra realizada con éxito!');
    
    // Vaciar carrito
    localStorage.removeItem('carrito');
    
    // Cerrar modal
    cerrarCheckout();
    
    // Renderizar carrito vacío
    renderizarCarrito();
}

function cerrarCheckout() {
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'none';
}
