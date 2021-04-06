function usuario(usuario,contrasenia){
    this.usuario = usuario;
    this.contrasenia = contrasenia;
}

function verificacion(){
	fetch('http://TiendaOnlineBikeShop.somee.com/api/Usuarios/verificacion')
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
	if(sessionStorage.getItem("usuario") != null){
		var temp = JSON.parse(sessionStorage.getItem("usuario"));
		if(temp.puesto == "Administrador"){
			document.getElementById("pregunta").innerHTML = '¿Quieres registra a alguien?<a id="registrate" href="registro.html" target="_blank">Registrar</a>'
		}
	}
}

function log(tipo){
    var u = document.getElementById("usuario").value;
    var c = document.getElementById("contrasenia").value;
	fetch('http://TiendaOnlineBikeShop.somee.com/api/Usuarios/',{
        method: 'POST',
        body: JSON.stringify({
            Nombre: u,
            Password: c,
			Puesto: "pruebas"
        }),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
	.catch(res => {
		alert("No se encontro el usuario");
		return;
	})
    .then(res => res.json())
    .then(res => {
        if(res.status == null){
			sessionStorage.setItem("usuario",JSON.stringify(res));
            if(res.puesto == 'Operador'){
				if(tipo == 1){
					window.location.href = "pages/mantenimiento_ordenes_compra.html";
					return;
				}
				else{
					window.location.href = "mantenimiento_ordenes_compra.html";
					return;
				}
			}
			else{
				if(res.puesto == 'Administrador'){
					if(tipo == 1){
						window.location.href = "pages/ingreso_productos.html";
						return;
					}
					else{
						window.location.href = "ingreso_productos.html";
						return;
					}
				}
			}
			
        }
        else{
            alert("No se encontro usuario administrativo");
			if(tipo == 1){
				window.location.href = "pages/productos.html?1";
				return;
			}
			else{
				window.location.href = "productos.html?1";
				return;
			}
			return false;
        }
    })
    
}

function VentanaLogin(i){
	fetch('http://TiendaOnlineBikeShop.somee.com/api/Usuarios/verificacion')
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
	
    var ventana = "";
    ventana += '<div id ="oscura" onclick="cerrarEmergentes()">';
    ventana += '</div>';
    ventana += '<div id="emergente">';
    if(i == 1){
        ventana += '<div><img src="images/x.png" alt="x" onclick="cerrarEmergente()"></div>';
    }
    else{
        ventana += '<div><img src="../images/x.png" alt="x" onclick="cerrarEmergente()"></div>';
    }
    ventana += '<div id="formularioIngreso">';
    ventana += '<form action="" id="formulario_log">';
    ventana += '<label id="titulo_log">Bienvenido</label>';
    ventana += '<input type="text" id="usuario" required placeholder="Nombre de Usuario">';
    ventana += '<input type="password" id="contrasenia" required placeholder="Contraseña">';
    ventana += '<label id="lbl_recordar"> <input type="checkbox" id="chk_recordar"> Recordar usuario</label>';
    ventana += '<button type = "button" id="login" onclick="log('+i+')">Login</button>';
    ventana += '</form>';
    ventana += '</div>';
    ventana += '<h3 style="text-align: center; margin-top: 5px; font-size: 18px;">Visitanos</h3>';
    ventana += '<div id="pie_log">';
    if(i == 1){
        ventana += '<img id="fb" src="images/fbLogo.png" alt="fbLogo">';
        ventana += '<img src="images/twLogo.png" alt="twLogo">';
        ventana += '<img id="insta" src="images/instaLogo.png" alt="instaLogo">';
    }
    else{
        ventana += '<img id="fb" src="../images/fbLogo.png" alt="fbLogo">';
        ventana += '<img src="../images/twLogo.png" alt="twLogo">';
        ventana += '<img id="insta" src="../images/instaLogo.png" alt="instaLogo">';
    }
    ventana += '</div>';
    ventana += '</div>';

    return ventana;
}

function cargarLogin(i){
    document.body.style.overflowY = "hidden";
    $('body').prepend(VentanaLogin(i));
    $("#oscura").fadeIn(500);
    $("#emergente").fadeIn(500);
}

function cerrarEmergente(){
    $('#emergente').fadeOut(500);
    $("#oscura").fadeOut(500);
    document.body.style.overflowY = "visible";
}

function cerrarEmergentes(){
    cerrarEmergente();
}