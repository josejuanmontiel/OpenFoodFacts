// Función para borrar IndexedDB
function clearDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase("miBaseDeDatos");
        
        request.onsuccess = () => {
            console.log("Base de datos borrada exitosamente");
            resolve();
        };

        request.onerror = (event) => {
            console.error("Error al borrar la base de datos: ", event.target.error);
            reject(event.target.error);
        };
    });
}

// Event listener para el botón de borrar base de datos
document.getElementById("clear-db-btn").addEventListener("click", async () => {
    try {
        await clearDatabase();
        console.log("Base de datos borrada con éxito.");
    } catch (error) {
        console.error("Error al intentar borrar la base de datos: ", error);
    }
});

// Función para inicializar IndexedDB
// Repetida en index.js
function initDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("miBaseDeDatos", 1);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const objectStore = db.createObjectStore("datosCSV", { keyPath: "id" });
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject("Error al abrir la base de datos: " + event.target.errorCode);
        };
    });
}

// Función para consultar un valor por clave (code)
async function queryByCode(code) {
    const db = await initDatabase();  // Inicializa la base de datos
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("datosCSV", "readonly");
        const objectStore = transaction.objectStore("datosCSV");
        const request = objectStore.get(code);  // Obtener el objeto por la clave

        request.onsuccess = (event) => {
            resolve(event.target.result);  // Devuelve el resultado
        };

        request.onerror = (event) => {
            reject("Error al consultar la base de datos: " + event.target.error);
        };
    });
}

// Event listener para el botón de consulta
document.getElementById("query-btn").addEventListener("click", async () => {
    const code = document.getElementById("code-input").value;  // Obtener el código del input
    try {
        const result = await queryByCode(code);
        if (result) {
            const debugJson = document.getElementById("json");
            debugJson.textContent = JSON.stringify(result, null, 2);
            // var arrayDeObjetos = Array.from(JSON.parse(json));
            
            const valores = localStorage.getItem("filters");
            
            const regex = new RegExp(`(${valores})`, 'gi');

            const resultSearch = result.ingredients_text.match(regex);
            const resultContainer = document.getElementById("result");
            if (resultSearch!=null) {
                resultContainer.innerHTML += "<pre id=º\"json\">Encontrado:" + resultSearch + 
                                               " en " + result.ingredients_text.replace(regex, '<mark>$1</mark>') + "</pre>";
            } else {
                resultContainer.textContent += "No se encontro en los ingredientes, nada de la lista.";
            }

        } else {
            resultContainer.textContent = "No se encontró ningún resultado para el código: " + code;
        }

    } catch (error) {
        console.error("Error al consultar: ", error);
    }
});

// Event listener para el botón
function goToScan() {
    window.location.href = "/scan.html";
}
document.getElementById("scan-btn").addEventListener("click", goToScan);

// Obtener los parámetros de la URL
const parametros = new URLSearchParams(window.location.search);
// Leer un parámetro específico, por ejemplo "nombre"
const codeFromUrl = parametros.get('code');
if (codeFromUrl!=null && codeFromUrl.length>0) {
    document.getElementById("code-input").value = codeFromUrl;
    document.getElementById("query-btn").click();
}