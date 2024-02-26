// Fonction pour ajouter une tâche à la base de données IndexedDB
 export function ajouterTacheDansIndexedDB(tasks) {
    let request = indexedDB.open('tachesDB', 1);

    request.onerror = function(event) {
        console.error("Erreur lors de l'ouverture de la base de données", event.target.errorCode);
    };
    request.onsuccess = function(event) {
        let db = event.target.result;
        let transaction = db.transaction(['taches'], 'readwrite');
        let objectStore = transaction.objectStore('taches');
        let requestAdd = objectStore.add(tasks);
        requestAdd.onsuccess = function(event) {
            console.log("Tâche ajoutée à la base de données");
        };
    };
}

// Fonction pour récupérer les tâches depuis la base de données IndexedDB
export function recupererTachesDeIndexedDB() {
    let request = indexedDB.open('tachesDB', 1);

    request.onerror = function(event) {
        console.error("Erreur lors de l'ouverture de la base de données", event.target.errorCode);
    };
    request.onsuccess = function(event) {
        let db = event.target.result;
        let transaction = db.transaction(['taches'], 'readonly');
        let objectStore = transaction.objectStore('taches');
        let getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = function(event) {
            let tasks = event.target.result;
            // Mettre à jour votre interface utilisateur pour afficher les tâches récupérées
            afficherTaches(tasks);
        };
    };
}

// Fonction pour afficher les tâches dans l'interface utilisateur


// Appel de la fonction pour récupérer les tâches depuis IndexedDB lors du chargement de la page

// Exemple de fonction pour ajouter une tâche dans le tableau de tâches

