const fs = require('fs');

const usuarios = [
    { numeroTarjeta: "12345678", contrasenia: "123" },
    { numeroTarjeta: "87654321", contrasenia: "456" }
];
        




let saldo = 1000;
let usuarioAutenticado = null;
let historialTransacciones = [];

leerHistorialDesdeJson();

function iniciarSesion() {
    let numeroTarjeta = prompt("Ingrese el número de tarjeta: ");
    let contrasenia = prompt("Ingrese su contraseña: ");

    usuarioAutenticado = usuarios.find(usuario =>
        usuario.numeroTarjeta === numeroTarjeta && usuario.contrasenia === contrasenia
    );

    if (usuarioAutenticado) {
        MostrarMenu();
    } else {
        console.log("Número de tarjeta o contraseña incorrectos. Inténtelo de nuevo.");
        iniciarSesion();
    }
}

function MostrarMenu() {
    if (!usuarioAutenticado) {
        console.log("Debes iniciar sesión para ingresar.");
        iniciarSesion();
        return;
    }
   
    let opcion = prompt(
        "Bienvenido al cajero, elija su servicio:\n" +
        "1. Consultar saldo\n" +
        "2. Depositar dinero\n" +
        "3. Retirar dinero\n" +
        "4. Ver historial de transacciones\n" +
        "5. Buscar transacción\n" +
        "6. Eliminar transacción\n" +
        "7. Guardar historial en archivo\n" +
        "8. Salir\n"
    );

    switch (opcion) {
        case '1':
            consultarSaldo();
            break;
        case '2':
            depositarDinero();
            break;
        case '3':
            retirarDinero();
            break;
        case '4':
            verHistorialTransacciones();
            break;
        case '5':
            buscarTransaccion();
            break;
        case '6':
            eliminarTransaccion();
            break;
        case '7':
            guardarHistorialEnJson();
            break;
        case '8':
            console.log("Hasta luego");
            break;
        default:
            console.log("Opción no válida. Intente de nuevo");
            MostrarMenu();
            break;
    }
}

function consultarSaldo() {
    console.log(`Tu saldo actual es de: $${saldo}`);
    MostrarMenu();
}

function depositarDinero() {
    let cantidad = parseFloat(prompt("¿Cuánto dinero va a depositar? "));
    if (isNaN(cantidad) || cantidad <= 0) {
        console.log("Cantidad inválida. Inténtelo de nuevo.");
        depositarDinero();
    } else {
        saldo += cantidad;
        historialTransacciones.push([new Date(), 'depósito', cantidad]);
        console.log(`Has depositado $${cantidad}. Tu nuevo saldo es: $${saldo}`);
        MostrarMenu();
    }
}

function retirarDinero() {
    let cantidad = parseFloat(prompt("¿Cuánto dinero va a retirar? "));
    if (isNaN(cantidad) || cantidad <= 0) {
        console.log("Cantidad inválida. Inténtelo de nuevo.");
        retirarDinero();
    } else if (cantidad > saldo) {
        console.log("No tienes suficiente saldo. Inténtelo de nuevo.");
        retirarDinero();
    } else {
        saldo -= cantidad;
        historialTransacciones.push([new Date(), 'retiro', cantidad]);
        console.log(`Has retirado $${cantidad}. Tu nuevo saldo es: $${saldo}`);
        MostrarMenu();
    }
}

function verHistorialTransacciones() {
    if (historialTransacciones.length === 0) {
        console.log("No hay transacciones en el historial.");
    } else {
        console.log("Historial de transacciones:");
        historialTransacciones.forEach((transaccion, index) => {
            console.log(`${index + 1}. ${transaccion[0].toLocaleString()}: ${transaccion[1]} de $${transaccion[2]}`);
        });
    }
    MostrarMenu();
}

function buscarTransaccion() {
    let tipo = prompt("¿Qué tipo de transacción deseas buscar? (depósito/retiro): ").toLowerCase();
    let transaccionesEncontradas = historialTransacciones.filter(transaccion => transaccion[1] === tipo);

    if (transaccionesEncontradas.length === 0) {
        console.log(`No se encontraron transacciones de tipo "${tipo}".`);
    } else {
        console.log(`Transacciones de tipo "${tipo}":`);
        transaccionesEncontradas.forEach(transaccion => {
            console.log(`${transaccion[0].toLocaleString()}: ${transaccion[1]} de $${transaccion[2]}`);
        });
    }
    MostrarMenu();
}

function eliminarTransaccion() {
    let indice = parseInt(prompt("¿Qué transacción deseas eliminar? Ingrese el número de la transacción a eliminar: "));
    if (indice >= 1 && indice <= historialTransacciones.length) {
        let eliminada = historialTransacciones.splice(indice - 1, 1);
        console.log("Transacción eliminada:", eliminada);
    } else {
        console.log("Índice inválido.");
    }
    MostrarMenu();
}

function guardarHistorialEnJson() {
    const datosJson = JSON.stringify(historialTransacciones, null, 2);
    fs.writeFile('historial_transacciones.json', datosJson, (err) => {
        if (err) {
            console.error('Error al guardar el archivo:', err);
        } else {
            console.log('Historial guardado en historial_transacciones.json');
        }
    });
}

function leerHistorialDesdeJson() {
    fs.readFile('historial_transacciones.json', 'utf8', (err, data) => {
        if (err) {
            console.log('No se encontró el archivo JSON, comenzando con historial vacío.');
        } else {
            historialTransacciones = JSON.parse(data);
            console.log('Historial cargado desde historial_transacciones.json');
        }
    });
}

iniciarSesion();
