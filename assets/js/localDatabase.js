export class LocalDatabase {
    dbName;
    tables;
    dbVersion;
    
    constructor(dbName, tables, dbVersion = 1) {
        this.dbName = dbName;
        this.tables = tables;
        this.dbVersion = dbVersion;
    }

    async initDataBase() {
        return new Promise((resolve, reject) => {
            let request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                let db = event.target.result;
                this.tables.forEach(table => {
                    if (!db.objectStoreNames.contains(table)) {
                        db.createObjectStore(table, { keyPath: '_id', autoIncrement: false });
                    }
                });
                resolve(db);
            };

            request.onsuccess = (event) => {
                let db = event.target.result;
                resolve(db);
            };

            request.onerror = (event) => {
                console.error('Erreur lors de l\'ouverture de la base de données : ', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async addData(data, objectName) {
        let db = await this.initDataBase();
        if (db) {
            let transaction = db.transaction(objectName, 'readwrite');
            let dataStore = transaction.objectStore(objectName);
            // delete data._id;
            let request = dataStore.add({ ...data });

            request.onsuccess = function (event) {
                let todo = event.target.result;
                console.log('Todo : ', todo);
            };
            request.onerror = function (event) {
                console.log('Error : Sauvegarde échouée');
            };
        }
    }

    async getData(_id, objectName) {
        let db = await this.initDataBase();
        if (db) {
            let transaction = db.transaction(objectName, 'readwrite');
            let dataStore = transaction.objectStore(objectName);

            let request = dataStore.get(_id);

            request.onsuccess = function (event) {
                let Data = event.target.result;
                console.log('Data : ', Data);
            };
            request.onerror = function (event) {
                console.log('Error : Récupération échouée');
            };
        }
    }
    async getAllData(objectName) {
        let db = await this.initDataBase();
        if (db) {
            let transaction = db.transaction(objectName, "readonly");
            let objectStore = transaction.objectStore(objectName);
            let request = objectStore.getAll();
    
            request.onsuccess = function (event) {
                let data = event.target.result;
                console.log("Data: ", data);
            };
    
            request.onerror = function (event) {
                console.log("Error: Récupération échouée");
            };
        }
    }
    async updateData(data, objectName) {
        let db = await this.initDataBase();
        if (db) {
            let transaction = db.transaction(objectName, 'readwrite');
            let dataStore = transaction.objectStore(objectName);

            let request = dataStore.put({ ...data });

            request.onsuccess = function (event) {
                let data = event.target.result;
                console.log('Data : ', data);
            };
            request.onerror = function (event) {
                console.log('Error : Mise à jour échouée');
            };
        }
    }

    async deleteData(_id, objectName) {
        let db = await this.initDataBase();
        if (db) {
            let transaction = db.transaction(objectName, 'readwrite');
            let dataStore = transaction.objectStore(objectName);

            let request = dataStore.delete(_id);

            request.onsuccess = function (event) {
                let data = event.target.result;
                console.log('Data : ', data);
            };
            request.onerror = function (event) {
                console.log('Error : Suppression échouée');
            };
        }
    }
}
