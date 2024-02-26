

let request = indexedDB.open('project', 24)
let db

request.onupgradeneeded = (event) => {
    db = event.target.result;
    if (!db.objectStoreNames.contains('users')) {
        let userObject = db.createObjectStore('users', { keyPath: '_id', autoIncrement: true })
    }
    if (!db.objectStoreNames.contains('todos')) {
        let todoObject = db.createObjectStore('todos', { keyPath: '_id', autoIncrement: true })
        todoObject.createIndex("by_name", 'name', { unique: true })
    }
    if (!db.objectStoreNames.contains('products')) {
        let productObject = db.createObjectStore('products', { keyPath: '_id', autoIncrement: true })
    }
}
request.onsuccess = (event) => {
    db = event.target.result
    console.log(db)
}
request.onerror = (event) => {
    console.error('Erreur lors de l\'ouverture de la base de données : ', event.target.error)
}

const addData = (data, objectName) => {
    if (db) {
        let transaction = db.transaction(objectName, 'readwrite')
        let dataStore = transaction.objectStore(objectName)

        let request = dataStore.add({ ...data })

        request.onsuccess = function (event) {
            let todo = event.target.result;
            console.log('Todo : ', todo);
        };
        request.onerror = function (event) {
            // let todo = event.target.result;
            console.log('Error : Sauvegarde echouée');
        };
    }
}
const getData = (_id, objectName) => {
    if (db) {
        let transaction = db.transaction(objectName, 'readwrite')
        let dataStore = transaction.objectStore(objectName)

        let request = dataStore.get(_id)

        request.onsuccess = function (event) {
            let Data = event.target.result;
            console.log('Data : ', Data);
        };
        request.onerror = function (event) {
            // let todo = event.target.result;
            console.log('Error : Sauvegarde echouée');
        };
    }
}
const updateData = (data, objectName) => {
    if (db) {
        let transaction = db.transaction(objectName, 'readwrite')
        let dataStore = transaction.objectStore(objectName)

        let request = dataStore.put({...data})

        request.onsuccess = function (event) {
            let data = event.target.result;
            console.log('Data : ', data);
        };
        request.onerror = function (event) {
            // let todo = event.target.result;
            console.log('Error : Mise à jour echouée');
        };
    }
}
const deleteData = (_id, objectName) => {
    if (db) {
        let transaction = db.transaction(objectName, 'readwrite')
        let dataStore = transaction.objectStore(objectName)

        let request = dataStore.delete(_id)

        request.onsuccess = function (event) {
            let data = event.target.result;
            console.log('Data : ', data);
        };
        request.onerror = function (event) {
            // let todo = event.target.result;
            console.log('Error : Suppression echouée');
        };
    }
}