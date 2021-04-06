class Proveedor{
    codigo;
    nombre;
    telefono;
    email;
    direccion;

    constructor(nom,tel,ema,dir){
        this.nombre = nom;
        this.telefono = tel;
        this.email = ema;
        this.direccion = dir;
    }
}

var proveedores = [];

function cargarProveedores(){
    /*if(localStorage.getItem("proveedores")){
        proveedores = JSON.parse(localStorage.getItem("proveedores"));
    }*/
    fetch('http://TiendaOnlineBikeShop.somee.com/api/Proveedores')
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.json())
    .then(res => {
        if(res.status == null){
            proveedores = res;
        }
        else{
            alert("Ocurrio un error al momento de consultar la api");
        }
    })
    return;
}

function validarCamposProveedor(){
    /*if(document.getElementById("CodigoProveedor").value == ""){
        alert("Codigo de proveedor no puede estar en blanco");
        return false;
    }*/
    if(document.getElementById("NombreProveedor").value == ""){
        alert("Nombre de proveedor no puede estar en blanco");
        return false;
    }
    if(document.getElementById("Telefono").value == ""){
        alert("Telefono de proveedor no puede estar en blanco");
        return false;
    }
    if(document.getElementById("Telefono").value == ""){
        alert("Telefono de proveedor no puede estar en blanco");
        return false;
    }
    if(document.getElementById("Email").value == ""){
        alert("Direccion de proveedor no puede estar en blanco");
        return false;
    }
	return true;
}

function existeProveedor(){
    cargarProveedores();
    for(let i = 0; i<proveedores.length; i++){
        if(proveedores[i].codigo == document.getElementById("CodigoProveedor").value){
            alert("ya existe un proveedor con ese codigo");
            return true;
        }
    }
    return false;
}

function guardarProveedor(prov){
	console.log('pruebas')
    fetch('http://TiendaOnlineBikeShop.somee.com/api/Proveedores',{
        method: 'POST',
        body: JSON.stringify(prov),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.json())
    .then(res => {
        if(res.status == null){
            alert("Proveedor Agregado correctamente")
			poblarListadoProveedores();
			limpiarProv();
        }
        else{
            alert("Ocurrio un error al momento de consultar la api");
        }
    })
}

function agregarProveedor(){
    if(!validarCamposProveedor()){
        return;
    }
    let prov = new Proveedor(
        document.getElementById("NombreProveedor").value,
        document.getElementById("Telefono").value,
        document.getElementById("Email").value,
        document.getElementById("Direccion").value,
    );
	console.log('hola')
    /*proveedores.push(prov);
    localStorage.setItem("proveedores",JSON.stringify(proveedores));*/
    guardarProveedor(prov);
}

function poblarListadoProveedores(){
    fetch('http://TiendaOnlineBikeShop.somee.com/api/Proveedores')
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.json())
    .then(res => {
        if(res.status == null){
			proveedores = res;
            let script = "";
			for(let i = 0;i<proveedores.length;i++){
				script += "<tr>";
				script += '<td>'+proveedores[i].codigo+'</td>';
				script += '<td>'+proveedores[i].nombre+'</td>';
				script += '<td>'+proveedores[i].telefono+'</td>';
				script += '<td>'+proveedores[i].email+'</td>';
				script += '<td>'+proveedores[i].direccion+'</td>';
				script += '<td>';
				script += '<button type="button" class="btn btn-warning" onclick="modificarProveedor('+proveedores[i].codigo+')">Modificar</button>';
				script += '<br>';
				script += '<br>';
				script += '<button type="button" class="btn btn-danger" onclick="eliminarProveedor('+proveedores[i].codigo+')">Eliminar</button>';
				script += '</td>';
				script += "</tr>";
			}
			document.getElementById("ListaProv").innerHTML = script;
        }
        else{
            alert("Ocurrio un error al momento de consultar la api");
        }
    })
    
}

function limpiarProv(){
    document.getElementById("NombreProveedor").value = "";
    document.getElementById("Telefono").value = "";
    document.getElementById("Email").value = "";
    document.getElementById("Direccion").value = "";
}

function modificarProveedor(index){
    fetch('http://TiendaOnlineBikeShop.somee.com/api/Proveedores/'+index)
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.json())
    .then(res => {
        if(res.status == null){
            document.getElementById("NombreProveedor").value = res.nombre;
            document.getElementById("Telefono").value = res.telefono;
            document.getElementById("Email").value = res.email;
            document.getElementById("Direccion").value = res.direccion;
            document.getElementById("agregar").innerHTML = '<button type="button" class="btn btn-primary" onclick="GuardarMod('+index+')">Guardar</button>';
            document.getElementById("agregar").innerHTML += '<button type="button" class="btn btn-danger" onclick="CancelarMod()">Cancelar</button>';
        }
        else{
            alert("Ocurrio un error al momento de consultar la api");
        }
    })
    /*document.getElementById("NombreProducto").value = proveedores[index].nombre;
    document.getElementById("Telefono").value = proveedores[index].telefono;
    document.getElementById("Email").value = proveedores[index].email;
    document.getElementById("Direccion").value = proveedores[index].direccion;
    document.getElementById("agregar").innerHTML = '<button type="button" class="btn btn-primary" onclick="GuardarMod('+index+')">Guardar</button>';
    document.getElementById("agregar").innerHTML += '<button type="button" class="btn btn-danger" onclick="CancelarMod()">Cancelar</button>';*/
}

function GuardarMod(index){

    fetch('http://TiendaOnlineBikeShop.somee.com/api/Proveedores/'+index,{
        method: 'PUT',
        body: JSON.stringify({
            Codigo: parseInt(index),
            Nombre: document.getElementById("NombreProveedor").value,
            Telefono: parseInt(document.getElementById("Telefono").value),
            Email: document.getElementById("Email").value,
            Direccion: document.getElementById("Direccion").value
        }),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.json())
    .then(res => {
        if(res.status == null){
            alert("Producto Modificado correctamente")
			document.getElementById("agregar").innerHTML = '<button type="button" class="btn btn-primary" onclick="agregarProveedor()">Agregar</button>';
			limpiarProv();
			poblarListadoProveedores();
        }
        else{
            alert("Ocurrio un error al momento de consultar la api");
        }
    })

    /*proveedores[index].codigo = document.getElementById("CodigoProveedor").value;
    proveedores[index].nombre = document.getElementById("NombreProducto").value;
    proveedores[index].telefono = document.getElementById("Telefono").value;
    proveedores[index].email = document.getElementById("Email").value;
    proveedores[index].direccion = document.getElementById("Direccion").value;
    localStorage.setItem("proveedores",JSON.stringify(proveedores));
    document.getElementById("agregar").innerHTML = '<button type="button" class="btn btn-primary" onclick="agregarProveedor()">Agregar</button>';*/

}

function CancelarMod(){
    if(confirm("Estas seguro de cancelar la modificacion")){
        document.getElementById("agregar").innerHTML = '<button type="button" class="btn btn-primary" onclick="agregarProveedor()">Agregar</button>';
        limpiarProv();
    }
}


function eliminarProveedor(index){
    if(confirm("Estas seguro de eliminar el proveedor")){
        /*proveedores.splice(index,1);
        localStorage.setItem("proveedores",JSON.stringify(proveedores));*/
        fetch('http://TiendaOnlineBikeShop.somee.com/api/Proveedores/'+index,{
            method: 'DELETE',
            headers: {
                "Content-type": "application/json"
            }
        })
        .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
        .then(res => {
			console.log(res)
            if(res = 1){
                alert("Proveedor Eliminado correctamente")
            }
            else{
                alert("Ocurrio un error al momento de consultar la api");
            }
			poblarListadoProveedores();
        })
    }
}