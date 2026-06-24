document.addEventListener('DOMContentLoaded', function() {
    const socket = io();
    

    const formulario = document.getElementById("formulario");
    
    
    const btnSubmit = document.getElementById("btnSubmit");
    const statusBoton = document.getElementById("statusBoton");

    const btnCargar = document.getElementById("btnCargar");
    const ultimoRegistro = document.getElementById("ultimoRegistro");


    const lista = document.getElementById("listaComentarios");



    const nombre = document.getElementById("nombre");
    const statusnombre = document.getElementById("statusNombre");

    const correo = document.getElementById("correo");
    const statuscorreo = document.getElementById("statusCorreo");

    const comentario = document.getElementById("comentario");
    const statuscomentario = document.getElementById("statusComentario");




    const validationRules = {
            username: /^.{3,}$/,
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            comentario: /^.{10,}$/,
        };

    socket.on("nuevoComentario", datos=>{
        const div = document.createElement("div");

        div.textContent = `${datos.nombre} (${datos.correo}) : ${datos.comentario}`;
        lista.appendChild(div);
    });



    // FUNCIONES PARA VALIDAR LOS CAMPOS DEL FORMULARIO ==================================================
    function validateUsername() {
        const value = nombre.value;
        if (validationRules.username.test(value)) {
            nombre.classList.add('valid'); nombre.classList.remove('invalid');
        } else {
            nombre.classList.add('invalid'); nombre.classList.remove('valid');
            statusnombre.classList.add('error-message'); statusnombre.classList.remove('success-message');
            statusnombre.textContent = 'El nombre de usuario debe tener al menos 3 caracteres.';
            
        }
        checkFormValidity();
    }

    function validateEmail() {
        const value = correo.value;
        if (validationRules.email.test(value)) {
            correo.classList.add('valid'); correo.classList.remove('invalid');
        } else {
            correo.classList.add('invalid'); correo.classList.remove('valid');
            statuscorreo.classList.add('error-message'); statuscorreo.classList.remove('success-message');
            statuscorreo.textContent = 'La dirección de correo electrónico no es válida.';
        }
        checkFormValidity();
    }

    function validateComentario() {
        const value = comentario.value;
        if (validationRules.comentario.test(value)) {
            comentario.classList.add('valid'); comentario.classList.remove('invalid');
            statuscomentario.classList.add('success-message'); statuscomentario.classList.remove('error-message');
            statuscomentario.textContent = 'Comentario válido ✓';
        } else {
            comentario.classList.add('invalid'); comentario.classList.remove('valid');
            
            statuscomentario.classList.add('error-message'); statuscomentario.classList.remove('success-message');
            statuscomentario.textContent = 'El comentario debe tener al menos 10 caracteres.';
        }
        checkFormValidity();
    }
    // ===================================================================================================


    // FUNCIONES PARA VERIFICAR DISPONIBILIDAD DE NOMBRE Y CORREO =================================
    function checkAvailability(value, type) {
        fetch('http://localhost:3000/check-availability', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type, value })
        })

        .then(response => response.json())
        .then(data => {

            if (type === 'username') {

                statusnombre.textContent = data.available ? 'Nombre de usuario disponible.' : 'Nombre de usuario no disponible.';
                if (data.available) {
                    nombre.classList.add('valid'); nombre.classList.remove('invalid');

                    statusnombre.classList.add('success-message'); statusnombre.classList.remove('error-message');
                } else {
                    nombre.classList.add('invalid'); nombre.classList.remove('valid');

                    statusnombre.classList.add('error-message'); statusnombre.classList.remove('success-message');
                }
            } else if (type === 'email') {

                statuscorreo.textContent = data.available ? 'Correo electrónico disponible.' : 'Correo electrónico no disponible.';
                if (data.available) {
                    correo.classList.add('valid'); correo.classList.remove('invalid');

                    statuscorreo.classList.add('success-message'); statuscorreo.classList.remove('error-message');
                    
                } else {
                    correo.classList.add('invalid'); correo.classList.remove('valid');

                    statuscorreo.classList.add('error-message'); statuscorreo.classList.remove('success-message');
                }
            }
            checkFormValidity();
        })
        .catch(error => console.error('Error:', error));
    }

    function checkFormValidity() {
        const isFormValid = nombre.classList.contains('valid') &&
                            correo.classList.contains('valid') &&
                            comentario.classList.contains('valid');
        btnSubmit.disabled = !isFormValid;
    }
    // ===================================================================================================






    // EVENT LISTENERS PARA VALIDAR LOS CAMPOS EN TIEMPO REAL ==========================================
    nombre.addEventListener('input', validateUsername);
    // Agregamos blur para verificar la disponibilidad del nombre cuando el usuario deje el campo
    nombre.addEventListener('blur', () => {
        if (nombre.classList.contains('valid')) {
            checkAvailability(nombre.value, 'username'); 
        }
    });

    correo.addEventListener('input', validateEmail);
    correo.addEventListener('blur', () => {
        if (correo.classList.contains('valid')) {
            checkAvailability(correo.value, 'email');
        }
    });
    comentario.addEventListener('input', validateComentario);
    // ======================================================================================================





    // EVENT LISTENER PARA EL ENVÍO DEL FORMULARIO =======================================================
    formulario.addEventListener("submit", async e =>{
        e.preventDefault(); // Evita que el formulario se envíe de la manera tradicional
        // Validar los campos antes de enviar
        validateUsername();
        validateEmail();
        validateComentario();

        if (btnSubmit.disabled === false) {
            const respuesta = await fetch("/guardar",{
                method:"POST",
                headers:{ "Content-Type": "application/json" },
                body:JSON.stringify({
                    nombre: nombre.value,
                    correo: correo.value,
                    comentario: comentario.value
                })
            });

            const dato = await respuesta.json(); // Respuesta del servidor

            alert(dato.mensaje); // Mostramos el mensaje como alerta
            
            if (dato.mensaje === "Guardado correctamente") {

                formulario.reset(); // Limpiamos los campos

                [nombre, correo, comentario].forEach(input => {
                    input.classList.remove('valid', 'invalid');
                });
                [statusnombre, statuscorreo, statuscomentario, ultimoRegistro].forEach(status => {
                    status.textContent = '';
                    status.classList.remove('error-message', 'success-message');
                });

                btnSubmit.disabled = true;
            }
        }
    });


    // EVENT LISTENER PARA CARGAR EL ÚLTIMO REGISTRO ==================================================
    btnCargar.addEventListener("click", async () => {
        const respuesta = await fetch("/ultimo");
        const dato = await respuesta.json();

        while( ultimoRegistro.firstChild){
            ultimoRegistro.removeChild(ultimoRegistro.firstChild);
        }

        const p = document.createElement("p");
        
        if (!dato || dato.vacio) {
            p.textContent = "No hay registros disponibles.";
            p.classList.add('error-message'); p.classList.remove('success-message');
        } else {
            p.textContent = `Ultimo registro cargado`;
            p.classList.add('success-message'); p.classList.remove('error-message');
            nombre.value = dato.nombre;
            correo.value = dato.correo;
            comentario.value = dato.comentario;
        }
        ultimoRegistro.appendChild(p);
    });
    // ===================================================================================================
});