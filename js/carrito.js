class detalleCarrito{
    producto;
    cantidad;
    subTotal;

    constructor(prod,can){
        this.producto = prod;
        this.cantidad = can;
        this.subTotal = this.producto.precio * can;
    }
}

var Carrito = []
cargarCarrito();

function cargarCarrito(){
    if(localStorage.getItem("Carrito")){
        Carrito = JSON.parse(localStorage.getItem("Carrito"));
    }
}

function validacion(id){
    if(document.getElementById("cantidad"+id).value <= 0){
        alert("Para agregar un item la cantidad debe ser mayor a 0");
        return false;
    }
    if(parseInt(document.getElementById("cantidad"+id).value) > parseInt(buscarProducto(id).existencia)){
        alert("No se puede agregar una cantidad mayor a la existencia")
        return false;
    }
    return true;
}

function buscarDetalle(id){
    for(var i = 0; i<Carrito.length; i++){
        if(Carrito[i].producto.codigo == id){
            return i;
        }
    }
    return null;
}

function agregarCarrito(id){
    cargarCarrito();
    if(validacion(id) == false){
        return false;
    }

    var temp = buscarDetalle(id);

    if(temp == null){
        var detalle = new detalleCarrito(
            buscarProducto(id),
            document.getElementById("cantidad"+id).value
        );

        Carrito.push(detalle);
    }
    else{

        Carrito[temp].cantidad = (parseInt(document.getElementById("cantidad"+id).value) + parseInt(Carrito[temp].cantidad));
        Carrito[temp].subTotal =  parseInt(Carrito[temp].cantidad) * parseInt(Carrito[temp].producto.precio);
    }
    localStorage.setItem("Carrito",JSON.stringify(Carrito));
    Limpiar();
    return true;
}


function poblarMiPedido(tipo){
    var script = "";
    var total = 0;
    for(let i = 0; i<Carrito.length; i++){
        script += '<div class="item">';
        script += '<div class="imagen">';
        script += '<img src="'+ Carrito[i].producto.imagen + '" alt="Bici">';
        script += '</div>';
        script += '<div class="descripcion">'
        script += '<p>Codigo: '+ Carrito[i].producto.codigo + '</p>';
        script += '<p>Nombre: '+ Carrito[i].producto.nombre + '</p>';
        script += '<p>Precio Unidad: $' + Carrito[i].producto.precio + '</p>';
        if(tipo == 0){
            script += '<p>Cantidad</p>';
            script += '<img src="../images/menos.png" alt="menos" class="img_menos"  onclick="restar('+Carrito[i].producto.codigo+')">';
            script += '<p class="c_actual" id ="cantidad'+Carrito[i].producto.codigo+'">'+Carrito[i].cantidad+'</p>';
            script += '<img src="../images/mas.png" alt="mas" class="img_mas" onclick="sumar('+Carrito[i].producto.codigo+')">';
            script += '<img src="../images/eliminar.png" alt="eliminar" class="img_eliminar"  onclick="eliminar('+Carrito[i].producto.codigo+')">';
        }
        else{
            script += '<p>Cantidad: '+ Carrito[i].cantidad +'</p>'
        }
        script += '<p class ="lblSubTotal"> SubTotal: $ <b class="SubTotal" id ="sub'+Carrito[i].producto.codigo+'">'+ Carrito[i].subTotal + '</b></p>';
        script += '</div>';
        script += "</div>";
        total += parseInt(Carrito[i].subTotal);
    }

    if(Carrito.length > 0){
        script += '<hr>';
        script += '<div>';
        if(tipo == 0)
        {
            script += '<button type="submit" class="btn btn-primary" id="btnConfirmar" onclick="confirmarCompra()">Confirmar Compra</button> </a>';
        }
        script += '<h3 id="total">Total: $ '+total+'</h3>';
        script += '</div>';
    }
    else{
        script += '<img id ="carritoVacio" src="../images/carritoVacio.png" alt="carrito">';
    }
    document.getElementById("pedido").innerHTML = script;
}

function actualizarTotal(){
    var total = 0;
    for(var i = 0; i<Carrito.length; i++){
        total += parseInt(Carrito[i].subTotal);
    }
    document.getElementById("total").innerHTML =('$ '+ total);
}

function restar(id){
    var i = buscarDetalle(id);
    if(Carrito[i].cantidad == 1){
        var opcion = confirm("Si disminuya a 0 la cantidad se eliminara el item");
        if(opcion == true){
            eliminar(id);
        }
        else{
            return;
        }
    }
    else{
        Carrito[i].cantidad--;
        Carrito[i].subTotal = (parseInt(Carrito[i].cantidad) * parseInt(Carrito[i].producto.precio));
        document.getElementById("sub"+id).innerHTML = Carrito[i].subTotal;
        document.getElementById("cantidad"+id).innerHTML = Carrito[i].cantidad;
        localStorage.setItem("Carrito",JSON.stringify(Carrito));
        actualizarTotal();
    }
}

function sumar(id){
    var i = buscarDetalle(id);
    temp = Carrito[i].cantidad;
    temp++;
    if(temp > buscarProducto(id).existencia){
        alert("No se puede agregar una cantidad mayor a la existencia")
        return false;
    }
    Carrito[i].cantidad++;
    Carrito[i].subTotal = (parseInt(Carrito[i].cantidad) * parseInt(Carrito[i].producto.precio));
    document.getElementById("sub"+id).innerHTML = Carrito[i].subTotal;
    document.getElementById("cantidad"+id).innerHTML = Carrito[i].cantidad;
    localStorage.setItem("Carrito",JSON.stringify(Carrito));
    actualizarTotal();
}

function eliminar(id){
    var opc = confirm("El item se eliminara del carrito de compra");

    if(opc == true){
        var i = buscarDetalle(id);
        Carrito.splice(i,1);
        localStorage.setItem("Carrito",JSON.stringify(Carrito));
        poblarMiPedido(0);
    }
    
}

function confirmarCompra(){
    error = false;
    for(let i =0; i<Carrito.length;i++){
        if(parseInt(Carrito[i].cantidad) > parseInt(buscarProducto(Carrito[i].producto.codigo).existencia)){
            Carrito[i].cantidad = buscarProducto(Carrito[i].producto.codigo).existencia;
            error = true;
        }
    }
    if(error){
        localStorage.setItem("Carrito",JSON.stringify(Carrito));
        poblarMiPedido(0);
        alert("Las cantidades de los productos han sido ajustadas a la existencia confirme de nuevo la compra");
        return;
    }
    window.location="confirmacion_pedido.html";
}

function pago(){
    if(document.getElementById("nombre").value == ""){
        alert("Falta el nombre");
        return false;
    }
    if(document.getElementById("telefono").value == ""){
        alert("Falta el telefono");
        return false;
    }
    if(document.getElementById("direccion").value == ""){
        alert("Falta la direccion");
        return false;
    }
    for(let i =0; i<Carrito.length;i++){
        for(let u =0; u<productos.length; u++){
            if(Carrito[i].producto.codigo == productos[u].codigo){
                productos[u].existencia = parseInt(productos[u].existencia) - parseInt(Carrito[u].cantidad);
            }
        }
    }
    localStorage.setItem("productosCatalogo",JSON.stringify(productos));
    localStorage.removeItem("Carrito");
    alert("Compra realizada con exito");
    window.location = "productos.html";
}
