//funcion que esconde todos los elementos de filtros
function esconder(){
    document.getElementById("filtroProveedor").style.display = "none";
    document.getElementById("filtroCodigo").style.display = "none";
    document.getElementById("filtroEstado").style.display = "none";
    document.getElementById("filtroRango").style.display = "none";
}

//funcion de carga de los select
function tiposFiltros(){
    esconder();
    if(document.getElementById("TipoFiltro").value == 0){
        poblarOrdenes();
    }
    if(document.getElementById("TipoFiltro").value == 1){
        document.getElementById("filtroProveedor").style.removeProperty("display");
        cargarSelect();
        poblarConProveedor();
    }
    if(document.getElementById("TipoFiltro").value == 2){
        document.getElementById("filtroCodigo").style.removeProperty("display");
        poblarOrdenes();
    }
    if(document.getElementById("TipoFiltro").value == 3){
        document.getElementById("filtroEstado").style.removeProperty("display");
        poblarConEstado();
        
    }
}

//funcion que muestra ordenes en base a proveedor
function poblarConProveedor(){
    fetch('http://TiendaOnlineBikeShop.somee.com/api/Ordenes')
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.json())
    .then(res => {
        if(res.status == null){
            ordenes = res;
			proveedor = document.getElementById("Proveedor").value;
			for(let i = 0; i<ordenes.length; i++){
				if(proveedor == ordenes[i].proveedor){
					script = "";
					script += '<tr class="'+ordenes[i].estado+'" ondblclick = "mostrarDetalle('+ordenes[i].codigo+')">';
					script += '<td>'+ordenes[i].codigo+'</td>';
					script += '<td>'+ordenes[i].proveedor+'</td>';
					script += '<td>'+ordenes[i].descripcion+'</td>';
					script += '<td>'+ordenes[i].fechaPedido+'</td>';
					script += '<td>'+ordenes[i].fechaEntrega+'</td>';
					total = 0;
					for(let u = 0; u<ordenes[i].detalles.length; u++){
						total += (parseInt(ordenes[i].detalles[u].cantida) * parseInt(ordenes[i].detalles[u].precioCompra)); 
					}
					script += '<td>'+total+'</td>';
					script += '<td>';
					if(ordenes[i].estado == "solicitada"){
						script += '<button type="button" class="btn btn-warning" onclick="modificarOrden('+i+','+"'en_transito'"+')">Mov. Transito</button>';
					}
					else{
						if(ordenes[i].estado == "en_transito"){
							script += '<button type="button" class="btn btn-warning" onclick="modificarOrden('+i+','+"'recibido'"+')">Mov. Recibido</button>';
						}
					}
					script += '<br>';
					script += '<br>';
					script += '<button type="button" class="btn btn-danger op" onclick="eliminarOrden('+i+')">Eliminar</button>';
					script += '</td>';
					script += "</tr>";
				}
			}
			document.getElementById("tablaDetalles").innerHTML = script;
			document.getElementById("detalleOrden").innerHTML = "";
        }
        else{
            alert("Ocurrio un error al momento de consultar la api");
            return null;
        }
    })
    
}

//funcion que muestra ordenes en base a codigo
function poblarConCodigo(){
    fetch('http://TiendaOnlineBikeShop.somee.com/api/Ordenes')
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.json())
    .then(res => {
        if(res.status == null){
            ordenes = res;
			codigo = document.getElementById("buscarCodigo").value;
			for(let i = 0; i<ordenes.length; i++){
				if(codigo == ordenes[i].codigo){
					script = "";
					script += '<tr class="'+ordenes[i].estado+'" ondblclick = "mostrarDetalle('+ordenes[i].codigo+')">';
					script += '<td>'+ordenes[i].codigo+'</td>';
					script += '<td>'+ordenes[i].proveedor+'</td>';
					script += '<td>'+ordenes[i].descripcion+'</td>';
					script += '<td>'+ordenes[i].fechaPedido+'</td>';
					script += '<td>'+ordenes[i].fechaEntrega+'</td>';
					total = 0;
					for(let u = 0; u<ordenes[i].detalles.length; u++){
						total += (parseInt(ordenes[i].detalles[u].cantida) * parseInt(ordenes[i].detalles[u].precioCompra)); 
					}
					script += '<td>'+total+'</td>';
					script += '<td>';
					if(ordenes[i].estado == "solicitada"){
						script += '<button type="button" class="btn btn-warning" onclick="modificarOrden('+i+','+"'en_transito'"+')">Mov. Transito</button>';
					}
					else{
						if(ordenes[i].estado == "en_transito"){
							script += '<button type="button" class="btn btn-warning" onclick="modificarOrden('+i+','+"'recibido'"+')">Mov. Recibido</button>';
						}
					}
					script += '<br>';
					script += '<br>';
					script += '<button type="button" class="btn btn-danger op" onclick="eliminarOrden('+i+')">Eliminar</button>';
					script += '</td>';
					script += "</tr>";
				}
			}
			if(script == ""){
				alert("No se encontro ninguna orden con ese codigo");
			}
			else{
				document.getElementById("tablaDetalles").innerHTML = script;
			}
			document.getElementById("buscarCodigo").value = "";
			document.getElementById("detalleOrden").innerHTML = "";
        }
        else{
            alert("Ocurrio un error al momento de consultar la api");
            return null;
        }
    })
    
}

//funcion que muestra ordenes en base a estado
function poblarConEstado(){
    fetch('http://TiendaOnlineBikeShop.somee.com/api/Ordenes')
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.json())
    .then(res => {
        if(res.status == null){
            ordenes = res;
			estado = document.getElementById("estado").value;
			//debugger;
			for(let i = 0; i<ordenes.length; i++){
				if((estado == 1 && ordenes[i].estado == "solicitada") || (estado == 2 && ordenes[i].estado == "en_transito") || (estado == 3 && ordenes[i].estado == "recibido") ){
					script = "";
					script += '<tr class="'+ordenes[i].estado+'" ondblclick = "mostrarDetalle('+ordenes[i].codigo+')">';
					script += '<td>'+ordenes[i].codigo+'</td>';
					script += '<td>'+ordenes[i].proveedor+'</td>';
					script += '<td>'+ordenes[i].descripcion+'</td>';
					script += '<td>'+ordenes[i].fechaPedido+'</td>';
					script += '<td>'+ordenes[i].fechaEntrega+'</td>';
					total = 0;
					for(let u = 0; u<ordenes[i].detalles.length; u++){
						total += (parseInt(ordenes[i].detalles[u].cantida) * parseInt(ordenes[i].detalles[u].precioCompra)); 
					}
					script += '<td>'+total+'</td>';
					script += '<td>';
					if(ordenes[i].estado == "solicitada"){
						script += '<button type="button" class="btn btn-warning" onclick="modificarOrden('+i+','+"'en_transito'"+')">Mov. Transito</button>';
					}
					else{
						if(ordenes[i].estado == "en_transito"){
							script += '<button type="button" class="btn btn-warning" onclick="modificarOrden('+i+','+"'recibido'"+')">Mov. Recibido</button>';
						}
					}
					script += '<br>';
					script += '<br>';
					script += '<button type="button" class="btn btn-danger op" onclick="eliminarOrden('+i+')">Eliminar</button>';
					script += '</td>';
					script += "</tr>";
				}
			}
			document.getElementById("tablaDetalles").innerHTML = script;
			document.getElementById("detalleOrden").innerHTML = "";
			document.getElementById("buscarCodigo").value = "";
        }
        else{
            alert("Ocurrio un error al momento de consultar la api");
            return null;
        }
    })
    
}

//funcion de mantenimiento de ordenes
function poblarOrdenes(){
    fetch('http://TiendaOnlineBikeShop.somee.com/api/Ordenes')
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.json())
    .then(res => {
        if(res.status == null){
            ordenes = res;
			//debugger;
			for(let i = 0; i<ordenes.length; i++){
				fetch('http://TiendaOnlineBikeShop.somee.com/api/Detalles/'+ordenes[i].codigo)
				.then(resp => resp.ok ? Promise.resolve(resp) : Promise.reject(resp))
				.then(resp => resp.json())
				.then(resp => {
					if(res.status == null){
						script = "";
						ordenes[i].detalles = resp;
						script += '<tr class="'+ordenes[i].estado+'" ondblclick = "mostrarDetalle('+ordenes[i].codigo+')">';
						script += '<td>'+ordenes[i].codigo+'</td>';
						script += '<td>'+ordenes[i].proveedor+'</td>';
						script += '<td>'+ordenes[i].descripcion+'</td>';
						script += '<td>'+ordenes[i].fechaPedido+'</td>';
						script += '<td>'+ordenes[i].fechaEntrega+'</td>';
						total = 0;
						for(let u = 0; u<ordenes[i].detalles.length; u++){
							total += (parseInt(ordenes[i].detalles[u].cantida) * parseInt(ordenes[i].detalles[u].precioCompra)); 
						}
						script += '<td>'+total+'</td>';
						script += '<td>';
						if(ordenes[i].estado == "solicitada"){
							script += '<button type="button" class="btn btn-warning" onclick="modificarOrden('+i+','+"'en_transito'"+')">Mov. Transito</button>';
						}
						else{
							if(ordenes[i].estado == "en_transito"){
								script += '<button type="button" class="btn btn-warning" onclick="modificarOrden('+i+','+"'recibido'"+')">Mov. Recibido</button>';
							}
						}
						script += '<br>';
						script += '<br>';
						script += '<button type="button" class="btn btn-danger op" onclick="eliminarOrden('+"'"+i+"'"+')">Eliminar</button>';
						script += '</td>';
						script += "</tr>";
						document.getElementById("tablaDetalles").innerHTML += script;
					}
					else{
						alert("Ocurrio un error al momento de consultar la api");
						return null;
					}
				})
				
			}
			document.getElementById("detalleOrden").innerHTML = "";
        }
        else{
            alert("Ocurrio un error al momento de consultar la api");
            return null;
        }
    })
    
}

//funcion para actualizar el estatus de la orden de compra
function modificarOrden(index,estado){
    ordenes[index].estado = estado;
    guardarOrdenes();
    tiposFiltros();
    //actualizacion a en transito
    if(estado == "recibido"){
        cargarOrdenStock(index);
    }
}

//funcion que carga las ordenes recibidas al stock disponibles
function cargarOrdenStock(index){
    cargarCatalogo();
    for(let i =0; i<ordenes[index].detalles.length; i++){
        for(let u = 0; u<productos.length; u++){
            if(productos[u].codigo == ordenes[index].detalles[i].codigoProducto){
                productos[u].existencia = parseInt(productos[u].existencia) + parseInt(ordenes[index].detalles[i].cantida);
            }
        }
    }
    localStorage.setItem("productosCatalogo",JSON.stringify(productos));
}

//funcion que elimina el orden
function eliminarOrden(index){
    if(confirm("Estas seguro de querer eliminar esta Orden")){
        ordenes.splice(index,1);
        if(ordenes.length > 0){
            guardarOrdenes();
        }
        else{
            localStorage.removeItem("Ordenes");
        }
        tiposFiltros();
    }
}

//funcion para mostrar el detalle de una orden
function mostrarDetalle(codigo){
    script = "";
    for(let i = 0; i< ordenes.length; i++){
        if(ordenes[i].codigo == codigo){
            script += '<table class="table table-bordered table-striped">'; 
            script += '<thead class="thead-dark">'; 
            script += '<tr>'; 
            script += '<th>Id</th>'; 
            script += '<th>Descripcion</th>'; 
            script += '<th>Unidades</th>'; 
            script += '<th>Precio Uni.</th>'; 
            script += '<th>SubTotal</th>'; 
            script += '</tr>'; 
            script += '</thead>'; 
            script += '<tbody">'; 
            for(let u = 0; u<ordenes[i].detalles.length;u++){
                script += '<tr>';
                script += '<td> '+ordenes[i].detalles[u].correlativo+'</td>';
                script += '<td> '+ordenes[i].detalles[u].descripcion+'</td>';
                script += '<td> '+ordenes[i].detalles[u].cantida+'</td>';
                script += '<td> '+ordenes[i].detalles[u].precioCompra+'</td>';
                script += '<td> '+ordenes[i].detalles[u].cantida*ordenes[i].detalles[u].precioCompra+'</td>';
                script += '</tr>';
            }
            script += '</tbody>'; 
        }
    }
    document.getElementById("detalleOrden").innerHTML = script;
}

function cargaSelectTipo(){
    document.getElementById("TipoFiltro").value = 0;
}