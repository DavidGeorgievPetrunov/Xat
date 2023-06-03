function getListaPaises() {
    let http = new XMLHttpRequest();
    
    http.open("GET","http://localhost:3333/XatLLM/Register",true);
    http.send();

    http.onreadystatechange=function(){
        if(this.readyState==4 && this.status==200){
            
            var json = JSON.parse(http.responseText)
            window.confirm(json);
            añadirOpcionesSelect("JsonSelect", json);

        }
    }
}

function añadirOpcionesSelect(select, json) {
    var select = document.getElementsByName(select)[0];

    if (select.length > 0){
        for (let i=select.option.length; 0 >= select.length; i--){
            select.remove(i);
        }    
    }

    for(let i=0; i < json.length; i++){ 
        let option = document.createElement("option"); 
        option.value = json[i].code;
        option.textContent = json[i].name; 
        select.appendChild(option); 
    }
}

function Register(){
    let http = new XMLHttpRequest();

    let user = document.getElementById("user").value;
    let pass = document.getElementById("password").value;
    let mail = document.getElementById("email").value
    let codeCountry = document.getElementById("JsonSelect").value

    http.open("POST","http://localhost:3333/XatLLM/Register",true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded")
    http.send("user="+user+"&mail="+mail+"&pass="+pass+"&codeCountry="+codeCountry)

    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (http.responseText == "false") {
                window.confirm("El usuario ya existe o algun dato esta vacio");
            } else {
                window.confirm("Se ha creado el usuario con exito");
            }
        }
    };  
}

function loginPagina() {
    location.href = "Login.html";
}

function enviarMensaje() {
    
}