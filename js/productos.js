var productos = [];
cargarCatalogo();


class producto{
    codigo;
    nombre;
    descripcion;
    precio;
    existencia;
    imagen;
    marca;

    constructor(nombre,descripcion,precio,existencia,img,marca){
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.existencia = existencia;
        this.imagen = img;
        this.marca = marca;
    }

}

function setFiltro(tipo){
    if(tipo != ""){
        localStorage.setItem('filtro',tipo);
    }
}

function cargarCatalogo(){
    /*if(localStorage.getItem("productosCatalogo")){
        productos = JSON.parse(localStorage.getItem("productosCatalogo"));
    }*/
    fetch('http://TiendaOnlineBikeShop.somee.com/api/Productos')
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.json())
    .then(res => {
        productos = res;
    })
}

//pobla el catalogo en la vista de adm
function poblarCatalogo(){
    fetch('http://TiendaOnlineBikeShop.somee.com/api/Productos')
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.json())
    .then(res => {
        productos = res;
        llenarCatalogo();
    })
}

function llenarCatalogo(){
    console.log('pruebas');
    var tBody = "";
    for(let i = 0; i<productos.length; i++){
        tBody += "<tr>";
        tBody += "<td>" + productos[i].codigo + "</td>";
        tBody += "<td>" + productos[i].nombre + "</td>";
        tBody += "<td>" + productos[i].descripcion + "</td>";
        tBody += "<td>" + "$ "+ productos[i].precio + "</td>";
        tBody += "<td>" + productos[i].existencia + "</td>";
        tBody += '<td> <img src ="'+productos[i].imagen+'" alt="imagen"/></td>';
        tBody += '<td>';
        tBody += '<button type="button" class="btn btn-warning" onclick="modificarProducto('+productos[i].codigo+')">Modificar</button>';
        tBody += '<br>';
        tBody += '<br>';
        tBody += '<button type="button" class="btn btn-danger op" onclick="eliminarProducto('+productos[i].codigo+')">Eliminar</button>';
        tBody += '</td>';
        tBody +="</tr>";
        
    }
    document.getElementById("table_body").innerHTML = tBody;
    return;
}

function productoExiste(id){
    cargarCatalogo();
    for(var i = 0 ; i<productos.length; i++){
        if(productos[i].codigo == id){
            return true;
        }
    }
    return false;
}

function guardarProducto(produc){
    fetch('http://TiendaOnlineBikeShop.somee.com/api/Productos',{
        method: 'POST',
        body: JSON.stringify(produc),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.json())
    .then(res => {
        if(res.codigo != null){
            alert("Producto Agregado correctamente")
			poblarCatalogo();
        }
        else{
            alert("Ocurrio un error al momento de consultar la api");
        }
    })
}

function agregarProductoCatalogo(){
    /* verifica si el producto ya existe 
    if(productoExiste(document.getElementById("codigoProducto").value) == true){
        alert("Ya existe un producto con el codigo ingresado");
        return false;
    }*/
    //esto agrega un producto
    var prod = new producto(
       // document.getElementById("codigoProducto").value,
        document.getElementById("nombreProducto").value,
        document.getElementById("descripcionProducto").value,
        document.getElementById("precioProducto").value,
        document.getElementById("cantidadProducto").value,
        document.getElementById("previa").src,
        document.getElementById("marca").value
    );
    //productos.push(prod);
    //localStorage.setItem("productosCatalogo",JSON.stringify(productos));
    guardarProducto(prod);
    LimpiarIngresar();
    return true;
}

function buscarProducto(codigo){
    //cargarCatalogo();
    /*for(let i = 0; i<productos.length; i++){
        if(productos[i].codigo == codigo){
            return productos[i];
        }
    }
    return null;
    */
    fetch('http://TiendaOnlineBikeShop.somee.com/api/Productos/'+codigo)
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.json())
    .then(res => {
        if(res.status == null){
            return res;
        }
        else{
            alert("Ocurrio un error al momento de consultar la api");
            return null;
        }
    })
}

function LimpiarIngresar(){
    document.getElementById("codigoProducto").value = "";
    document.getElementById("nombreProducto").value = "";
    document.getElementById("descripcionProducto").value ="";
    document.getElementById("precioProducto").value = "";
    document.getElementById("cantidadProducto").value = "";
    document.getElementById("marca").value = "";
    document.getElementById("previa").src = "";
}

function Limpiar(){
    for(let i = 0; i<productos.length; i++){
        document.getElementById("cantidad"+productos[i].codigo).value = "";
    }
}
//
function llenarCatalogoCliente(){
    var tipo = localStorage.getItem("filtro"); 

    var u = JSON.parse(sessionStorage.getItem("usuario"));
    if(u != null && (u == "Administrador")){
        var btn = '<a href = "ingreso_productos.html"><button class="btn btn-primary">Agregar Al Catalogo</button></a>';
        document.getElementById("AgregarProductos").innerHTML = btn;
    }

    var tBody = "";
    for(let i = 0; i<productos.length; i++){
        var poblar = false;
        if(tipo == 1){
            poblar = true;
        }
        else if(tipo == 2 && productos[i].marca == "Giant"){
            poblar = true;
        }
        else if(tipo == 3 && productos[i].marca == "Specialized"){
            poblar = true;
        }
        if(poblar){
            tBody += "<div>";
            tBody += '<td> <img src ="'+productos[i].imagen +'" alt="imagen" class="img_prod"/>';
            tBody += "<p>" + productos[i].codigo + "</p>";
            tBody += "<p>" + productos[i].nombre + "</p>";
            tBody += "<p>" + "$ "+ productos[i].precio + "</p>";
            tBody += "<p>" + "Existencia:"+ productos[i].existencia + "</p>";
            tBody += '<form action="">';
            tBody += '<input type="number" id="cantidad'+ productos[i].codigo +'" class="form-control cantidad" placeholder="Cantidad">';
            tBody += '<button type="button" class="btn btn-primary" onclick = "agregarCarrito('+ productos[i].codigo +')">Agregar</button>';
            tBody += "</form>"
            tBody +="</div>";
        }
    }
	console.log(tBody)
    document.getElementById("bicicletas").innerHTML = tBody;
}
//pobla el cataologo en la vista de cliente
function poblarProductos(){
	fetch('http://TiendaOnlineBikeShop.somee.com/api/Productos')
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.json())
    .then(res => {
		if(res.status == null){
			productos = res;
			llenarCatalogoCliente();
		}
		else{
			alert("Ocurrio un error al conectar con la API")
		}
    })
	
    
}

/*se convierte la imagen cargada en el input */
function previewFile() {
    const previa = document.getElementById('previa');
    const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();
  
    reader.addEventListener("load", function () {
      // convierte la imagen a una cadena64
      previa.src = reader.result;
    }, false);
  
    if (file) {
      reader.readAsDataURL(file);
    }
  }


/* funcion para modificar el producto del catalogo */
function modificarProducto(id){
    /*for(var i = 0;i<productos.length;i++){
        if(productos[i].codigo == id){
            document.getElementById("codigoProducto").value = productos[i].codigo;
            document.getElementById("nombreProducto").value = productos[i].nombre;
            document.getElementById("descripcionProducto").value = productos[i].descripcion;
            document.getElementById("precioProducto").value = productos[i].precio;
            document.getElementById("cantidadProducto").value = productos[i].existencia;
            document.getElementById("marca").value = productos[i].marca;
            document.getElementById("previa").src = productos[i].imagen;
            document.getElementById("guardar").innerHTML = '<button type="button" class="btn btn-primary" onclick="modificar('+i+')">Guardar Modificacion</button>';
        }
    }*/

    fetch('http://TiendaOnlineBikeShop.somee.com/api/Productos/'+id)
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.json())
    .then(res => {
        if(res.status == null){
            document.getElementById("nombreProducto").value = res.nombre;
            document.getElementById("descripcionProducto").value = res.descripcion;
            document.getElementById("precioProducto").value = res.precio;
            document.getElementById("cantidadProducto").value = res.existencia;
            document.getElementById("marca").value = res.marca;
            document.getElementById("previa").src = res.imagen;
            document.getElementById("guardar").innerHTML = '<button type="button" class="btn btn-primary" onclick="modificar('+res.codigo+')">Guardar Modificacion</button>';
        }
        else{
            alert("Ocurrio un error al momento de consultar la api");
        }
    })
}  

//funcion que confirma la modificacion
function modificar(index){
   /* if((productoExiste(document.getElementById("codigoProducto").value) == true) && (productos[index].codigo != document.getElementById("codigoProducto").value)){
        alert("Ya existe un producto con este codigo");
    }
    else{
        productos[index].codigo = document.getElementById("codigoProducto").value;
        productos[index].nombre = document.getElementById("nombreProducto").value;
        productos[index].descripcion = document.getElementById("descripcionProducto").value;
        productos[index].precio = document.getElementById("precioProducto").value;
        productos[index].existencia = document.getElementById("cantidadProducto").value;
        productos[index].marca = document.getElementById("marca").value;
        productos[index].imagen = document.getElementById("previa").src;
        document.getElementById("guardar").innerHTML = '<button type="button" class="btn btn-primary" onclick="agregarProductoCatalogo()">Guardar</button>';
    }
    localStorage.setItem("productosCatalogo",JSON.stringify(productos));*/

    fetch('http://TiendaOnlineBikeShop.somee.com/api/Productos/'+index,{
        method: 'PUT',
        body: JSON.stringify({
            Codigo: parseInt(index),
            Nombre: document.getElementById("nombreProducto").value,
            Descripcion: document.getElementById("descripcionProducto").value,
            Precio: parseFloat(document.getElementById("precioProducto").value),
            Existencia: parseInt(document.getElementById("cantidadProducto").value),
            Marca: document.getElementById("marca").value,
            Imagen: document.getElementById("previa").src
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
			poblarCatalogo();
        }
        else{
            alert("Ocurrio un error al momento de consultar la api");
        }
		LimpiarIngresar();
    })

}

/* funcion para eliminar el producto del catalogo */
function eliminarProducto(index){
    if(confirm("Estas seguro de eliminar el elemento")){
        /*productos.splice(index,1);
        localStorage.setItem("productosCatalogo",JSON.stringify(productos));*/
        fetch('http://TiendaOnlineBikeShop.somee.com/api/Productos/'+index,{
            method: 'DELETE'
        })
        .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
        .then(res => {
			console.log(res);
            if(res = 1){
                alert("Producto Eliminado correctamente")
            }
            else{
                alert("Ocurrio un error al momento de consultar la api");
            }
			poblarCatalogo();
        })
    }
}