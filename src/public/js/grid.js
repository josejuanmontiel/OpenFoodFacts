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
        const resultContainer = document.getElementById("result");
        if (result) {
            const fuseOptions = {
                // isCaseSensitive: false,
                // includeScore: false,
                // shouldSort: true,
                // includeMatches: false,
                // findAllMatches: false,
                // minMatchCharLength: 1,
                // location: 0,
                // threshold: 0.6,
                // distance: 100,
                // useExtendedSearch: false,
                // ignoreLocation: false,
                // ignoreFieldNorm: false,
                // fieldNormWeight: 1,
                keys: [
                    "ingredients_text"
                ]
            };
            
            var json = JSON.stringify(result, null, 2);

            var data = [ 
                { 
                "answer_content": "2322323", 
                "user_id": 49, 
                "ingredients_text": "nicht" 
                }, 
                { 
                "answer_content": "22222", 
                "user_id": 50, 
                "ingredients_text": "soemthing" 
                } 
                ];
                
                var mapped = data.map(function(obj) {
                  return {
                    "answer_content": obj.answer_content,
                         "author": {
                           "user_id": obj.user_id,
                         },
                         "ingredients_text": obj.ingredients_text};
                  
                });

            const fuse = new Fuse(mapped, fuseOptions);
            
            // Change the pattern
            const searchPattern = localStorage.getItem("filters");
            
            var resultSearch =  fuse.search(searchPattern)
    
            resultContainer.textContent += "Coincide con algun ingrediente" + resultSearch;
        } else {
            resultContainer.textContent = "No se encontró ningún resultado para el código: " + code;
        }

    } catch (error) {
        console.error("Error al consultar: ", error);
    }
});
