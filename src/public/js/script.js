// script.js

// Función para inicializar IndexedDB
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

// Función para guardar los datos en IndexedDB
function saveToDatabase(db, data) {
    const transaction = db.transaction("datosCSV", "readwrite");
    const objectStore = transaction.objectStore("datosCSV");

    data.forEach((item, index) => {
        objectStore.put({ id: item['code'], ...item });
    });

    transaction.oncomplete = () => {
        console.log("Datos guardados exitosamente en IndexedDB");
    };

    transaction.onerror = (event) => {
        console.error("Error al guardar los datos: ", event.target.error);
    };
}

// Función para descargar y cargar el CSV
async function downloadAndLoadCSV() {
    try {
        const response = await fetch('/spain_products.csv.zz'); // Cambia esto por la URL del archivo GZ
        const blob = await response.blob();
        
        // Leer el archivo como un ArrayBuffer
        const arrayBuffer = await blob.arrayBuffer();
        
        // Descomprimir el archivo GZ usando Pako
        const decompressed = pako.inflate(new Uint8Array(arrayBuffer), { to: 'string' });

        // Convertir el contenido del CSV a un array de objetos
        const csvData = parseCSV(decompressed);
        
        // Inicializar IndexedDB y guardar los datos
        const db = await initDatabase();
        saveToDatabase(db, csvData);
    } catch (error) {
        console.error("Error en la descarga o carga del CSV: ", error);
    }
}

// Función para parsear el CSV
function parseCSV(data) {
    const lines = data.split("\n");
    const result = [];

    const headers = lines[0].split(",").map(header => header.trim());

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split(",");

        headers.forEach((header, index) => {
            obj[header] = currentLine[index] ? currentLine[index].trim() : null;
        });

        result.push(obj);
    }

    return result;
}

// Event listener para el botón
document.getElementById("download-btn").addEventListener("click", downloadAndLoadCSV);

// Event listener para el botón de borrar base de datos
document.getElementById("clear-db-btn").addEventListener("click", async () => {
    try {
        await clearDatabase();
        console.log("Base de datos borrada con éxito.");
    } catch (error) {
        console.error("Error al intentar borrar la base de datos: ", error);
    }
});

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
        const resultContainer = document.getElementById("result");
        if (result) {
            resultContainer.textContent = JSON.stringify(result, null, 2);  // Mostrar el resultado en formato JSON
        } else {
            resultContainer.textContent = "No se encontró ningún resultado para el código: " + code;
        }
    } catch (error) {
        console.error("Error al consultar: ", error);
    }
});
