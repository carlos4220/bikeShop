
function Add(tipo){
    var u = document.getElementById("nombre").value;
    var c = document.getElementById("contrasenia").value;
	var p = document.getElementById("puesto").value;
	fetch('http://TiendaOnlineBikeShop.somee.com/api/Usuarios/Add',{
        method: 'POST',
        body: JSON.stringify({
            Nombre: u,
            Password: c,
			Puesto: p
        }),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
	.catch(res => {
		alert("No se pudo registrar el usuario");
		return;
	})
    .then(res => res.json())
    .then(res => {
        if(res.status == null){
			
			alert("Se agrego correctamente el usuario");
			document.getElementById("nombre").value = "";
			document.getElementById("contrasenia").value = "";
			window.location.href = "../index.html";
			return;
        }
        else{
            alert("No se pudo registrar el usuario");
        }
    })
    
}
