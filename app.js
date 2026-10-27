const URLAPI = "https://fakestoreapi.com/";
const URLAPIalt = "https://dummyjson.com/"
const regExpMetodo = /\b(GET|POST|PUT|PATCH|DELETE)\b/i;
const regExpRecurso = /(products|cart|users)/i;
const regExpIdentificador = /\/[0-9]{1,2}/;

//extraigo los argumentos restantes luego de los 2 primeros
const [, , ...argumentos] = process.argv;
const stringArgumentos = argumentos.join("-");

//evaluo en el string resultante qué metodo se ingreso, y qué recurso, y si existe un id
const ArrMetodo = regExpMetodo.exec(stringArgumentos);
const ArrRecurso = regExpRecurso.exec(stringArgumentos);
const ArrId = regExpIdentificador.exec(stringArgumentos);

const metodo = ArrMetodo ? ArrMetodo[0] : null;
const recurso = ArrRecurso ? ArrRecurso[0] : null;
const idItem = ArrId ? ArrId[0] : null;

if (!metodo) {
    process.exitCode = 0;
    console.log("debe especificar un método HTTP para la ejecución(GET, POST, PUT, PATCH, DELETE) como argumento.");
    process.exit();
};

if (!recurso) {
    process.exitCode = 0;
    console.log("no se especificó recurso de la API para realizar la petición(products, cart, users) como argumento.");
    process.exit();
};

let url = `${URLAPIalt}${recurso}`;
if (metodo.toLowerCase() === "post") {
    url = `${url}/add`;
}
if (idItem) {
    url += idItem;
    console.log(url);
};

//evaluo el métoto (si existió uno correcto) y segun el tipo, realizo la acción
switch (metodo.toUpperCase()) {

    case "GET":
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(respjson => {
                console.log(respjson)
                console.log("fetch finalizado;")
            });
        break;

    case "POST":
        const [, , titulo, precio, categoria] = argumentos;
        const nuevoItem = {
            title: titulo,
            price: parseFloat(precio),
            category: categoria
        };
        const OPCIONES = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoItem)
        };

        fetch(url, OPCIONES)
            .then(respuesta => {
                if (!respuesta.ok) throw new Error(`HTTP codigo de error: ${respuesta.status}`);
                console.log("Codigo de la respuesta de la API: ", respuesta.status);
                return respuesta.json();
            })
            .then(datos => {
                console.log(`respuesta del servidor API:\n`, datos);
            });
        break;

    case "PUT":
        console.log("La modificación de productos no está implementada.")
        break;
    case "DELETE":
        fetch(url, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(e => console.log(e.message))
        break;
    default:
        console.log("Petición inválida. Verifique los datos ingresados.");
        break;
};

//prueba de configuración de ssh