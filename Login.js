function Login() {
    let http = new XMLHttpRequest();

    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;

    http.open("GET","http://localhost:3333/XatLLM/Login?mail="+email+"&pass="+pass,true);
    http.send();

    http.onreadystatechange=function(){
        if(this.readyState==4 && this.status==200){
            if (http.responseText == "false") {
                window.confirm("Ha habido un error en los datos insertados");
            } else {
                sessionStorage.setItem("session",http.responseText);
                sessionStorage.setItem("mail",email);
                location.href = "Xat.html";
            }
        }
    }
}

function registerPagina() {
    location.href = "Register.html";
}