var ordenes = [];
var detallesOrden = [];

//clase de orden de compra
class orden{
    proveedor;
    fechaPedido;
    fechaEntrega;
    estado;
    descripcion;
    constructor(prov,fecp,fece,est,des){
        this.proveedor = prov;
        this.fechaPedido = fecp;
        this.fechaEntrega = fece;
        this.estado = est;
        this.descripcion = des;
    }
}

class detalle{
    correlativo;
	Id_Orden;
    codigoProducto;
    descripcion;
    cantida;
    precioCompra;

    constructor(cor,cod,des,cant,pre){
        this.correlativo = cor;
        this.codigoProducto = cod;
        this.descripcion = des;
        this.cantida = cant;
        this.precioCompra = pre;
    }
}



function cargarSelect(){
    fetch('http://TiendaOnlineBikeShop.somee.com/api/Proveedores')
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.json())
    .then(res => {
        if(res.status == null){
            proveedores = res;
			let script = "";
			for(i = 0; i<proveedores.length;i++){
				script += '<option value='+proveedores[i].codigo+'>'+proveedores[i].codigo +" ---- "+ proveedores[i].nombre+'</option>';
			}
			document.getElementById("Proveedor").innerHTML = script;
        }
        else{
            alert("Ocurrio un error al momento de consultar la api");
        }
    })
    
}

function tipoDetalle(){
	fetch('http://TiendaOnlineBikeShop.somee.com/api/Productos')
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.json())
    .then(res => {
        productos = res;
		let script = "";
		script += '<div class="form-group input-group">';
		script += '<label for="CodigoProd" class="col-lg-2">Producto</label>';
		script += '<div class="col-lg-10">';
		script += '<select name="slcCodigos" id="CodigoProd" class="selectpicker show-menu-arrow form-control" onchange = "selectCodigo()">'
		for(let i = 0; i<productos.length; i++){
			script += '<option value="'+productos[i].codigo+'">'+productos[i].codigo+" -- "+productos[i].nombre+'</option>';
		}
		script += '</select>';
		script += '</div>';
		script += '</div>';
		
		script += '<div class="form-group input-group">';
		script += '<label for="Descripcion" class="col-lg-2">Descripcion</label>';
		script += '<div class="col-lg-10">';
		script += '<input type="text" name="txtDescripcion" id="Descripcion" class="form-control">';
		script += '</div>';
		script += '</div>';
		script += '<div class="form-group input-group">';
		script += '<label for="Cantidad" class="col-lg-2">Cantidad</label>';
		script += '<div class="col-lg-10">';
		script += '<input type="text" name="txtCantidad" id="Cantidad" class="form-control">';
		script += '</div>';
		script += '</div>';
		script += '<div class="form-group input-group">';
		script += '<label for="Precio" class="col-lg-2">Precio</label>';
		script += '<div class="col-lg-10">';
		script += '<input type="number" step = "0.01" name="txtPrecio" id="Precio" class="form-control">';
		script += '</div>';
		script += '</div>';
		script += '<div class="form-group input-group">';
		script += '<button type="button" class="btn btn-primary" onclick="agregarDetalle()">Agregar Detalle</button>';
		script += '</div>';
		document.getElementById("FormularioDetalle").innerHTML = script;
		selectCodigo();
    })
    
}


//comportamiento del formulario

function selectCodigo(){
	let temp;
	fetch('http://TiendaOnlineBikeShop.somee.com/api/Productos/'+document.getElementById("CodigoProd").value)
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.json())
    .then(res => {
        if(res.status == null){
            temp = res;
			document.getElementById("Descripcion").value = temp.nombre +" -- "+ temp.descripcion;
        }
        else{
            alert("Ocurrio un error al momento de consultar la api");
            return null;
        }
    })
}

//valida los campos del detalle de la compra
function validarCamposDetalle(){
    if(document.getElementById("Cantidad").value == ""){
        alert("falta la cantidad");
        return false;
    }
    if(document.getElementById("Precio").value == ""){
        alert("falta el precio");
        return false;
    }
    return true;
}

//funcion que carga los detalles de las ordenes
function cargarDetalles(){
    if(sessionStorage.getItem("DetallesOrden",detallesOrden)){
        detallesOrden = JSON.parse(sessionStorage.getItem("DetallesOrden",detallesOrden));
    }
    return;
}

//funcion que guarda los detalles
function guardarDetalles(){
    if(detallesOrden.length > 0){
        sessionStorage.setItem("DetallesOrden",JSON.stringify(detallesOrden));
    }
    return;
}

//funcion que agrega el detalle a la orden de compra
function agregarDetalle(){
    if(!validarCamposDetalle()){
        return;
    }
    cargarDetalles();
    let temp;
    let correlativo = detallesOrden.length;
    if(existeEnOrden(document.getElementById("CodigoProd").value,document.getElementById("Cantidad").value, document.getElementById("Precio").value,2)){
        guardarDetalles();
        poblarDetalle();
        limpiarDetalles();
        return;
    }
    temp = new detalle(
        correlativo+1,
        document.getElementById("CodigoProd").value,
        document.getElementById("Descripcion").value,
        document.getElementById("Cantidad").value,
        document.getElementById("Precio").value
    );
    
    detallesOrden.push(temp);
    guardarDetalles();
    poblarDetalle();
    limpiarDetalles();
}

function existeEnOrden(clave,cantidad,precio,tipo){
    if(tipo == 1){
        for(let i = 0; i<detallesOrden.length; i++){
            if(clave == detallesOrden[i].descripcion){
                detallesOrden[i].cantida = parseInt(detallesOrden[i].cantida) + parseInt(cantidad);
                if(precio != detallesOrden[i].precioCompra){
                    alert("El precio es diferente al ingresado anteriormente, la cantidad se sumara al detalle ingresado primero");
                }
                return true;
            }
        }
        return false;
    }
    else{
        for(let i = 0; i<detallesOrden.length; i++){
            if(clave == detallesOrden[i].codigoProducto){
                detallesOrden[i].cantida = parseInt(detallesOrden[i].cantida) + parseInt(cantidad);
                if(precio != detallesOrden[i].precioCompra){
                    alert("El precio es diferente al ingresado anteriormente, la cantidad se sumara al detalle ingresado primero");
                }
                return true;
            }
        }
        return false;
    }
}

function poblarDetalle(){
    script = "";
    cargarDetalles();
    for(let i = 0; i<detallesOrden.length;i++){
        if(detallesOrden[i].codigoProducto == -1){
            script += '<tr class = "productoNuevo">';
        }
        else{
            script += '<tr class = "productoExistente">';
        }
        detallesOrden[i].correlativo = i+1;
        script += '<tr class = "productoExistente">';
        script += '<td> '+detallesOrden[i].correlativo+'</td>';
        script += '<td> '+detallesOrden[i].descripcion+'</td>';
        script += '<td> '+detallesOrden[i].cantida+'</td>';
        script += '<td> '+detallesOrden[i].precioCompra+'</td>';
        script += '<td> '+detallesOrden[i].cantida*detallesOrden[i].precioCompra+'</td>';
        script += '<td>';
        script += '<button type="button" class="btn btn-danger" onclick="eliminarDetalle('+i+')">Eliminar</button>';
        script += '</td>';
        script += '</tr>';
    }
    document.getElementById("tablaDetalles").innerHTML = script;
    totalOrden();
}

//funcion que limpia los campos
function limpiarDetalles(){
    document.getElementById("Cantidad").value = "";
    document.getElementById("Precio").value = "";
}

//funcion que elimina un detalle
function eliminarDetalle(index){
    if(detallesOrden.length == 1){
        sessionStorage.removeItem("DetallesOrden");
        document.getElementById("tablaDetalles").innerHTML = "";
        return;
    }
    detallesOrden.splice(index,1);
    guardarDetalles();
    poblarDetalle();
}

//valida los datos de la orden de compra
function validarCamposOrden(){
    /*if(document.getElementById("codigoOrden").value == ""){
        alert("Falta el codigo de la orden de compra");
        return false;
    }*/
    if(document.getElementById("Proveedor").value == null){
        alert("Falta el proveedor")
        return false;
    }
    if(document.getElementById("FechaPedido").value == ""){
        alert("Falta le fecha de pedido");
        return false;
    }
    if(document.getElementById("FechaEntrega").value == ""){
        alert("Falta la fecha de entrega");
        return false;
    }
    return true;
}

//funcion para guardar las ordenes
function guardarOrdenes(){
    localStorage.setItem("Ordenes", JSON.stringify(ordenes));
    return;
}
//funcion para cargar las ordenes al array
function cargarOrdenes(){
    if(localStorage.getItem("Ordenes")){
        ordenes = JSON.parse(localStorage.getItem("Ordenes"));
    }
    return;
}
//funcion que limpiar la orden
function limpiarOrden(){
    document.getElementById("codigoOrden").value = "";
    document.getElementById("FechaPedido").value = "";
    document.getElementById("FechaEntrega").value = "";
    document.getElementById("DescripcionOrden").value = "";
}

//funcion que determina si la orden ya sta ingresada
function codigoOrdenExiste(){
    cargarOrdenes();
    for(let i = 0; i<ordenes.length; i++){
        if(ordenes[i].codigo == document.getElementById("codigoOrden").value){
            alert("ya existe una orden con ese codigo");
            return true;
        }
    }
    return false;
}

//funcion que agrega una orden al listado de ordenes
function agregarOrden(){
    if(!validarCamposOrden()){
        return;
    }

    /*if(codigoOrdenExiste()){
        return;
    }*/
    if(detallesOrden.length == 0){
        alert("No se ha ingresado ningun detale de compra");
        return;
    }
	
    var tempOrden = new orden(
        document.getElementById("Proveedor").value,
        document.getElementById("FechaPedido").value,
        document.getElementById("FechaEntrega").value,
        //detallesOrden,
        "solicitada",
        document.getElementById("DescripcionOrden").value
    );

    //cargarOrdenes();
    //ordenes.push(tempOrden);
    //guardarOrdenes();
	
	fetch('http://TiendaOnlineBikeShop.somee.com/api/Ordenes',{
        method: 'POST',
        body: JSON.stringify(tempOrden),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.json())
    .then(res => {
        if(res.status == null){
			for(let i =0; i<detallesOrden.length ; i++){
				detallesOrden[i].Id_Orden = res.codigo;
			}
			fetch('http://TiendaOnlineBikeShop.somee.com/api/Detalles',{
				method: 'POST',
				body: JSON.stringify(detallesOrden),
				headers: {
					"Content-type": "application/json"
				}
			})
			.then(resp => resp.ok ? Promise.resolve(resp) : Promise.reject(resp))
			.then(resp => resp.json())
			.then(resp => {
				if(resp.status == null){
					alert("Orden de compra agregarda satisfacoriamente");
					sessionStorage.removeItem("DetallesOrden");
					detallesOrden = [];
					limpiarDetalles();
					poblarDetalle();
					limpiarOrden();
				}
				else{
					alert("Ocurrio un error al momento de agregar los detalles");
				}
			})
        }
        else{
            alert("Ocurrio un error al momento de consultar la api");
        }
    })
    
}

function totalOrden(){
    script = "";
    total = 0;
    for(let i = 0; i<detallesOrden.length ; i++){
        total = parseInt(total) + (parseInt(detallesOrden[i].cantida) * parseInt(detallesOrden[i].precioCompra));
    }
    script += '<h2>Total de compra: $ '+total+'</h2>';
    document.getElementById('totalOrden').innerHTML = script;
}
