function logout() {
    sessionStorage.removeItem("mail");
    sessionStorage.removeItem("session");
    location.href = "Login.html";
}

function AfegirAmic(){
    let http = new XMLHttpRequest();

    let mail = sessionStorage.getItem("mail");
    let session = sessionStorage.getItem("session");
    let friend = document.getElementById("email").value

    http.open("POST","http://localhost:3333/XatLLM/Friend",true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded")
    http.send("mail="+mail+"&session="+session+"&friend="+friend)

    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (http.responseText == 0) {
                window.confirm("El servidor no responde")
            } else if (http.responseText == 1) {
                window.confirm("Amigo añadido")
            } else if (http.responseText == 2) {
                window.confirm("Amigo no encontrado")
            } else if (http.responseText == 3) {
                window.confirm("Codigo de session ha expirado, vuelve a logearte")
            } else {
                window.confirm("Aqui ha pasado algo raro")
            }
        }
    };  
}

function StateChanger() {
    if (document.getElementById("AddUser").style.display == 'none') {
    show();
    } else {
        hide();
    }
}

function hide() {
    document.getElementById("AddUser").style.display = 'none';
    document.getElementById("msg").style.display = 'block';
    document.getElementById("State").innerHTML = "AÑADIR AMIGO";
}


function show() {
    document.getElementById("msg").style.display = 'none';
    document.getElementById("AddUser").style.display = 'block';
    document.getElementById("State").innerHTML = "ENVIAR MENSAJE";
}

function LlistaAmics() {
    let http = new XMLHttpRequest();
    
    let email = sessionStorage.getItem("mail");
    let session = sessionStorage.getItem("session");
    
    http.open("GET","http://localhost:3333/XatLLM/Friend?mail="+email+"&session="+session,true);
    http.send();
    
    http.onreadystatechange=function(){
    if(this.readyState==4 && this.status==200){
        var json = JSON.parse(http.responseText);
        añadirOpcionesSelect("Amigos", json);        
        }
    };
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
        option.value = json[i];
        option.textContent = json[i]; 
        select.appendChild(option); 
    }
}


function enviarMensaje() {
    let http = new XMLHttpRequest();

    let email = sessionStorage.getItem("mail");
    let session = sessionStorage.getItem("session");
    let receptor = document.getElementById("Amigos").value;
    let sms = document.getElementById("mensaje").value;


    http.open("POST","http://localhost:3333/XatLLM/Xat",true);
    http.setRequestHeader("Content-type","application/x-www-form-urlencoded")
    http.send("mail="+email+"&session="+session+"&receptor="+receptor+"&sms="+sms)
    
    let p2 = document.createElement("p");
    let br2 = document.createElement("br");
    p2.innerHTML = email + ": " + sms;
    p2.style.color = 'white';

    document.getElementById(receptor).append(p2);
    document.getElementById(receptor).append(br2);

    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("mensaje").value = "";
        }
    };  
}

// TODO LO DE RECIBIR LOS MENSAJES
function recibirMensaje() {
    let http = new XMLHttpRequest();
    let mail = sessionStorage.getItem("mail");
    let session = sessionStorage.getItem("session");

    http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        let data = JSON.parse(http.responseText);
        console.log(data.text);
        if (data.emisor in con.conversaciones) {
        let p = document.createElement("p");
        let br = document.createElement("br");
        p.innerHTML = data.emisor + ": " + data.text;

        document.getElementById(data.emisor).append(p);
        document.getElementById(data.emisor).append(br);
        }
        else{
        con.crearChat(data.emisor)
        document.getElementById(data.emisor).style.display = 'none';
        let p = document.createElement("p");
        let br = document.createElement("br");
        p.innerHTML = data.emisor + ": " + data.text;

        document.getElementById(data.emisor).append(p);
        document.getElementById(data.emisor).append(br);
        }

        recibirMensaje();
    }
};

    let url = "mail=" + mail + "&session=" + session;
    console.log(url);

    http.open(
    "GET",
    "http://localhost:3333/XatLLM/Xat?" + url,
    true
    );
    http.send();
}


class Conversation {
    constructor() {
    this.conversaciones = {};
    this.bandejaEntrada;
    this.target;
    this.targetReference;
    }

    crearChat(mailFriend) {
    if (!(mailFriend in this.conversaciones)) {
        this.conversaciones[mailFriend] = [];
        this.bandejaEntrada = document.createElement("div");
        this.bandejaEntrada.id = mailFriend;
        document.getElementById("msg").append(this.bandejaEntrada);
    }
    }
}

// Inicializar conversation....
var con = new Conversation();


function modificarTarget() {
    console.log("cambio target tRef:" + con.targetReference + "tar:" + con.target);

    con.target = document.getElementById("Amigos").value;
    mostrarConversation(con.target);
    if ( con.target in con.conversaciones ) { 
    document.getElementById("startConv").style.display = 'none';
    } else {
    document.getElementById("startConv").style.display = '';
    document.getElementById("startConv").innerHTML = "click aqui para crear la nueva conversacion y que no salgan mensajes de la otra conversacion";
    document.getElementById("startConv").style.fontSize = '1em';
    document.getElementById("startConv").style.height = '3em';
    }
}

function mostrarConversation() {
    if (con.target in con.conversaciones) {
    document.getElementById(con.target).style.display = 'block';
    ocultarConversation();
    
    }
}
function ocultarConversation() {
    console.log(con.targetReference + " " + con.target);
    if (con.targetReference != con.target) {
    document.getElementById(con.targetReference).style.display = 'none';
    con.targetReference = con.target;
    }
}

function iniciarConversacion() {

    document.getElementById("startConv").style.display = 'none';
    con.target = document.getElementById("Amigos").value;
    con.crearChat(con.target);
    if (con.targetReference == null) con.targetReference = con.target;
    mostrarConversation(con.target);
    recibirMensaje();

}

