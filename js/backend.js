/**
 * 
 */
function interfaceDB (dbName, dbVersion, tableName, filter, search, callback) {
    // console.log(filter);
    var db;
    var request = window.indexedDB.open(dbName,dbVersion);
    // var test;
    // var ret = [];
    request.onerror = event => {
        // Generic error handler for all errors targeted at this database's
        // requests!
        console.error("Database error: " + event.target.errorCode);
    };
    request.onsuccess = event => {

        // console.log('success');
        db = event.target.result;
        // console.log(db);
    //     db.transaction("customers").objectStore("customers").get("444-44-4444").onsuccess = event => {
    //    ret = event.target.result.name;
    //    callback(ret);
    // };
        var objectStore = db.transaction(tableName).objectStore(tableName);
        // console.log(objectStore);
        var ret = [];

        objectStore.openCursor().onsuccess = event => {
            var cursor = event.target.result;
            if (cursor) {                
                if (filter != null) {
                    if (cursor.value.home_section === filter) {
                        ret.push(cursor.value);
                    }
                    // console.log('filter');
                }
                else if (search != null) {
                    if (search.test(cursor.value.name.toLowerCase())) {
                        ret.push(cursor.value);
                    }
                }
                else {
                    ret.push(cursor.value);
                    // console.log(filter);
                }
                cursor.continue();
            }
            else {
                // console.log(names);
                callback(ret);

                // console.log("No more entries!");
            }
        };
    };
    // This event is only implemented in recent browsers
    request.onupgradeneeded = event => {
        console.log('upgrade success');
        // // Save the IDBDatabase interface
        // db = event.target.result;

        // // Create an objectStore for this database
        // // var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });

        // // objectStore.createIndex("name", "name", { unique: false });
        // // objectStore.createIndex("email", "email", { unique: true });

        // objectStore.transaction.oncomplete = event => {
        //     var customerObjectStore = db.transaction("customers",
        //         "readwrite").objectStore("customers");
        //     customerData.forEach(function(customer) {
        //         customerObjectStore.add(customer);
        //     });
        // };
    };
    // console.log('ttt ' + typeof test);
    // return test;
}


/**
 * 
 */
function populateDB (obj_arr, tablename) {
    var db;
    var openRequest = window.indexedDB.open('GrAppDB3', 5);
    // console.log(obj_arr);

    openRequest.onerror = event => {
        console.error("Database error: " + event.target.errorCode);
    }
    openRequest.onsuccess = event => {
        db = event.target.result;
        var objectStore = db.transaction(tablename).objectStore(tablename);
        var names = [];

        objectStore.openCursor().onsuccess = event => {
            var cursor = event.target.result;
            if (cursor) {
                // console.log("Name for SSN " + cursor.key + " is " + cursor.value.name);
                names.push(cursor.value);
                cursor.continue();
            }
            else {
                // console.log(names);
                // callback(names);

                // console.log("No more entries!");
            }
        };
    }
    openRequest.onupgradeneeded = event => {
        console.log('upgrade success');
        // Save the IDBDatabase interface
        db = event.target.result;

        // Create an objectStore for this database
        var objectStore = db.createObjectStore(tablename, { keyPath : 'id', autoIncrement : true });

        objectStore.createIndex("name", "name", { unique: false });
        objectStore.createIndex("last_checked", "last_checked", { unique: false });
        // objectStore.createIndex("listed", "listed", { unique: false });
        // objectStore.createIndex("home_section", "home_section", { unique: false });

        objectStore.transaction.oncomplete = event => {
            var itemObjectStore = db.transaction(tablename,
                "readwrite").objectStore(tablename);
            obj_arr.forEach(function(item) {
                console.log(item);
                itemObjectStore.add(item);
            });
        };
    }

}


/**
 * 
 */
function toggleListed (key) {
    var db;
    var request = window.indexedDB.open('GrAppDB3', 5);
    // console.log(obj_arr);

    request.onerror = event => {
        console.error("Database error: " + event.target.errorCode);
    };
    request.onsuccess = event => {

        // console.log('success');
        db = event.target.result;

        const objectStore = db.transaction("groceries5","readwrite").objectStore("groceries5");

        const req = objectStore.get(key);

        req.onsuccess = () => {
            const item = req.result;

            if (item.listed == 0) item.listed = 1;
            else item.listed = 0;

            const updateRequest = objectStore.put(item);

            updateRequest.onsuccess = () => {
                // console.log('updated');
            }
        }

    };
}


/**
 * 
 */
function run_app(newID, tabID, filter=null, search=null) {
    elm = document.createElement('div');
    oldelm = document.getElementById(newID);
    if (oldelm != null) oldelm.remove();
    elm.id = newID;
    parent = document.getElementById(tabID);
    parent.appendChild(elm);
    interfaceDB('GrAppDB3', 5, 'groceries5', filter, search, function(ret){
        var elm = listPrint(ret, function (idx, item) {
            var listItem = checkPrint(item.name,
                clickFunc = function () {
                    toggleListed(item.id);
                    grocery_app('grocery1', 'Active');
                },
                menuFunc = function () {
                    console.log('menu ' + idx);
                },
                loc = '',
                checked = item.listed
                );
            return listItem;
        });
        outerElm = document.getElementById(newID);
        bumper = document.createElement('div');
        bumper.style.height = '10px';
        outerElm.appendChild(bumper);
        outerElm.appendChild(elm);
        bumper = document.createElement('div');
        bumper.style.height = '80px';
        outerElm.appendChild(bumper);
    });
}


/**
 * 
 */
function grocery_app (newID, tabID) {
    elm = document.createElement('div');
    oldelm = document.getElementById(newID);
    if (oldelm != null) oldelm.remove();
    elm.id = newID;
    parent = document.getElementById(tabID);
    parent.appendChild(elm);
    interfaceDB('GrAppDB3', 5, 'groceries5', null, null, function(ret){
        var elm = listPrint(ret.filter(a => a.listed == 1), function (idx, item) {
            var listItem = checkPrint(item.name,
                clickFunc = function () {
                    toggleListed(item.id);
                    run_app('home1','Search');
                    grocery_app(newID, tabID);
                },
                menuFunc = function () {
                    console.log('menu ' + idx);
                });
            return listItem;
        });
        outerElm = document.getElementById(newID);
        bumper = document.createElement('div');
        bumper.style.height = '10px';
        outerElm.appendChild(bumper);
        outerElm.appendChild(elm);
        bumper = document.createElement('div');
        bumper.style.height = '80px';
        outerElm.appendChild(bumper);
    });
}
