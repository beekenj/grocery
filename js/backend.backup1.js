// This is what our customer data looks like.
// const customerData = [
//   { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
//   { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
// ];

function testDB (dbName, dbVersion, tableName, callback) {
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
                callback(names);

                // console.log("No more entries!");
            }
        };
    };
    // This event is only implemented in recent browsers
    request.onupgradeneeded = event => {
        console.log('upgrade success');
        // Save the IDBDatabase interface
        db = event.target.result;

        // Create an objectStore for this database
        var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });

        objectStore.createIndex("name", "name", { unique: false });
        objectStore.createIndex("email", "email", { unique: true });

        objectStore.transaction.oncomplete = event => {
            var customerObjectStore = db.transaction("customers",
                "readwrite").objectStore("customers");
            customerData.forEach(function(customer) {
                customerObjectStore.add(customer);
            });
        };
    };
    // console.log('ttt ' + typeof test);
    // return test;
}

// function modDB (key, newname) {
//     var db;
//     var request = window.indexedDB.open('MyTestDatabase',2);
//     // var test;
//     // var ret = [];
//     request.onerror = event => {
//         // Generic error handler for all errors targeted at this database's
//         // requests!
//         console.error("Database error: " + event.target.errorCode);
//     };
//     request.onsuccess = event => {

//         // console.log('success');
//         db = event.target.result;

//         const objectStore = db.transaction("customers","readwrite").objectStore("customers");

//         const req = objectStore.get(key);

//         req.onsuccess = () => {
//             const customer = req.result;

//             customer.name = newname;

//             const updateRequest = objectStore.put(customer);

//             updateRequest.onsuccess = () => {
//                 // console.log('updated');
//             }
//         }

//     };
//     // This event is only implemented in recent browsers
//     request.onupgradeneeded = event => {
//         console.log('new success');
//         // Save the IDBDatabase interface
//         db = event.target.result;

//         // Create an objectStore for this database
//         var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });

//         objectStore.createIndex("name", "name", { unique: false });
//         objectStore.createIndex("email", "email", { unique: true });

//         objectStore.transaction.oncomplete = event => {
//             var customerObjectStore = db.transaction("customers",
//                 "readwrite").objectStore("customers");
//             customerData.forEach(function(customer) {
//                 customerObjectStore.add(customer);
//             });
//         };
//     };
// }

function populateDB (obj_arr, tablename) {
    var db;
    var openRequest = window.indexedDB.open('GrAppDB2', 2);
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

function toggleListed (key) {
    var db;
    var request = window.indexedDB.open('GrAppDB2', 2);
    // console.log(obj_arr);

    request.onerror = event => {
        console.error("Database error: " + event.target.errorCode);
    };
    request.onsuccess = event => {

        // console.log('success');
        db = event.target.result;

        const objectStore = db.transaction("groceries2","readwrite").objectStore("groceries2");

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

function run_app(newID, tabID) {
    // rNames = ['Gus','Bob','Bill','Jenny','Kristen','Adrienne','Jack'];
    elm = document.createElement('div');
    oldelm = document.getElementById(newID);
    // console.log(typeof parent);
    if (oldelm != null) oldelm.remove();
    elm.id = newID;
    parent = document.getElementById(tabID);
    // console.log(parent);
    parent.appendChild(elm);
    // console.log(newID);
    testDB('GrAppDB2', 2, 'groceries2', function(ret){
        // elm = document.createElement('div');
        // elm.innerHTML = ret;
        var elm = listPrint(ret, function (idx, item) {
            var listItem = checkPrint(item.name,
                clickFunc = function () {
                    // console.log('hi');
                    // item.listed = !item.listed;
                    // resetContent(newID);
                    // var i = Math.floor(Math.random() * rNames.length);
                    // modDB(item.ssn,rNames[i]);

                    // console.log(item.id);

                    toggleListed(item.id);
                    // run_app(newID, tabID);
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
        outerElm.appendChild(elm);
        bumper = document.createElement('div');
        bumper.style.height = '80px';
        outerElm.appendChild(bumper);
        // console.log('inside ' + typeof elm);
        // document.body.appendChild(elm);
    });
}

function grocery_app (newID, tabID) {
    elm = document.createElement('div');
    oldelm = document.getElementById(newID);
    // console.log(typeof parent);
    if (oldelm != null) oldelm.remove();
    elm.id = newID;
    parent = document.getElementById(tabID);
    // console.log(parent);
    parent.appendChild(elm);
    // console.log(newID);
    testDB('GrAppDB2', 2, 'groceries2', function(ret){
        // elm = document.createElement('div');
        // elm.innerHTML = ret;
        var elm = listPrint(ret.filter(a => a.listed == 1), function (idx, item) {
            var listItem = checkPrint(item.name,
                clickFunc = function () {
                    // console.log('hi');
                    // item.listed = !item.listed;
                    // resetContent(newID);
                    // var i = Math.floor(Math.random() * rNames.length);
                    // modDB(item.ssn,rNames[i]);
                    // run_app(newID, tabID);

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
        outerElm.appendChild(elm);
        bumper = document.createElement('div');
        bumper.style.height = '80px';
        outerElm.appendChild(bumper);
        // console.log('inside ' + typeof elm);
        // document.body.appendChild(elm);
    });
}
