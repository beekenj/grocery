let obj_arr = [
    {'name':'milk','listed':true},
    {'name':'Bread','listed':false},
    {'name':'strawberries','listed':true},
    {'name':'corn','listed':false},
];

let store = {
    'milk':'1',
    'Bread':'15',
    'strawberries':'Pr',
    'corn':'Pr'
}

var search = '';

let content = [
    groceryList,
    searchTab,
    function (tabID) {
        var rootElement = document.createElement('div');
        return rootElement;
    }
];

/*  Tab contains the active grocery list  */
function groceryList (tabID) { return listPrint(obj_arr.filter(a => a.listed), function (idx, item) {
    var listItem = checkPrint(item.name,
        clickFunc = function () {
            item.listed = !item.listed;
            resetContent(tabID);
        },
        menuFunc = function () {
            console.log('menu ' + idx);
        },
        loc = store[item.name]
    );
    return listItem;
})
}


/*  Tab contains all items in DB    */
// function allItems (tabID) { return listPrint(obj_arr, function (idx, item) {
//     var listItem = checkPrint(item.name,
//         clickFunc = function () {
//             item.listed = !item.listed;
//             resetGrocery();
//             // resetContent(tabID);
//         },
//         menuFunc = function () {
//             console.log('menu2 ' + idx);
//         },
//         loc = '',
//         checked=item.listed
//     );
//     return listItem;
// })
// }

/*  Tab contains search results for grocery items   */
function searchTab (tabID) {

    var rootElement = document.createElement('div');

    var tabElement = document.createElement('table');
    tabElement.style.width = '100%';
    // tabElement.style.padding = '10px';

    var tdElement = document.createElement('td');
    tdElement.style.padding = '10px';
    var textElement = document.createElement('input');
    textElement.style.width = '250px';
    textElement.id = 'textElement';
    textElement.setAttribute('class', 'form-control');
    // if (search === '') textElement.setAttribute('placeholder', 'Search');
    // else textElement.setAttribute('placeholder', search);
    textElement.type = 'text';

    tdElement.appendChild(textElement);
    tabElement.appendChild(tdElement);


    var tdElement = document.createElement('td');
    var butElement = document.createElement('button');
    butElement.setAttribute('class', 'btn btn-primary');
    if (search === '') {
        textElement.setAttribute('placeholder', 'Search');
        var butIcon = fafaIcon('fa fa-search');
        // butIcon.id = 'icon';
        butElement.appendChild(butIcon);
        butElement.addEventListener('click', function () {
            search = document.getElementById('textElement').value;
            listItem = searchContent(tabID);

            // clear old content
            var divElement = document.getElementById('search_results');
            divElement.remove();
            listItem.id = 'search_results';
            rootElement.appendChild(listItem);

            if (search != '') {
                butIcon.remove();
                var butnIcon = fafaIcon('fa fa-refresh');
                butElement.appendChild(butnIcon);
            }
            // console.log(search);
            resetContent(tabID);
        });
    }
    else {
        textElement.setAttribute('placeholder', search);
        var butIcon = fafaIcon('fa fa-refresh');
        butElement.appendChild(butIcon);
        butElement.addEventListener('click', function () {
            // search = document.getElementById('textElement').value;
            textElement.setAttribute('placeholder', 'Search');
            search = '';
            listItem = searchContent(tabID);

            // clear old content
            var divElement = document.getElementById('search_results');
            divElement.remove();
            listItem.id = 'search_results';
            rootElement.appendChild(listItem);

            butIcon.remove();
            var butnIcon = fafaIcon('fa fa-search');
            butElement.appendChild(butnIcon);
            resetContent(tabID);
        });
    }

    listItem = searchContent(tabID);

    tdElement.appendChild(butElement);
    tabElement.appendChild(tdElement);


    rootElement.appendChild(tabElement);

    var divElement = document.createElement('div');
    divElement.id = 'search_results';
    divElement.appendChild(listItem);
    rootElement.appendChild(divElement);
    return rootElement;
}


/**
 *
 * @param   {String}    tabID
*/
function resetContent (tabID) {
    newContent = frameTable(changeButton=false);
    oldContent = document.getElementById('root');
    oldContent.remove();
    newContent.id = 'root';
    document.body.appendChild(newContent);
    document.getElementById(tabID+'Button').click();

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (j = 0; j < tabcontent.length; j++) {
        tabcontent[j].style.display = "none";
    }
    document.getElementById(tabID).style.display = "block";
}


/**
 *
*/
function resetGrocery () {
    newActive = groceryList('Active');
    oldActive = document.getElementById('Active');
    oldActive.remove();
    newActive.id = 'Active';
    newActive.style.display = 'none';
    newActive.style.border = 'none';
    newActive.setAttribute('class', 'tabcontent');
    outerActive = document.getElementById('ActiveOut');
    outerActive.appendChild(newActive);
}



function fafaIcon (name) {
    var icon = document.createElement('i');
    icon.setAttribute('class', name);
    icon.setAttribute('aria-hidden', 'true');
    return icon;
}


function searchContent (tabID) {
    var condition = new RegExp(search.toLowerCase());
    var results = obj_arr.filter(function (el) {
        return condition.test(el.name.toLowerCase());
    });
    var listItem = listPrint(results, function (idx, item) {
        var listItem = checkPrint(item.name,
            clickFunc = function () {
                item.listed = !item.listed;
                resetGrocery(tabID);
            },
            menuFunc = function () {
                console.log('menu2 ' + idx);
            },
            loc = '',
            checked=item.listed
        );
        return listItem;

    });
    return listItem;
}


/**
 * Creates a DOM object for a checklist item
 * @param   {String}        item            The listed item
 * @param   {Function}      clickFunc       Function to call for checkbox click
 * @param   {Function}      menuFunc        Function to call for menu click
 * @param   {String}        loc             Optional location of item
 * @param   {Boolean}       checked         Set status of checkbox
 * @return  {DOM Object}    rootElement     The root node for the checklist item
*/
function checkPrint (item, clickFunc, menuFunc, loc='', checked=false) {

    // initialize root
    var rootElement = document.createElement('div');

    // create a table and set style
    var tabElement = document.createElement('table');
    tabElement.style.width = '100%'
    rootElement.appendChild(tabElement);

    // add a checkbox element
    var checkElement = document.createElement('input');
    checkElement.setAttribute('class', 'largerCheckbox');
    if (checked) checkElement.setAttribute('checked', '');
    checkElement.type = 'checkbox';
    // checkbox click event
    checkElement.addEventListener('click', function(){
        if (clickFunc && (typeof clickFunc == "function")) {
            clickFunc();
        }
    });

    // create checkbox cell
    var tdElement = document.createElement('td');
    tabElement.appendChild(tdElement);
    tdElement.style.width = '30px';
    tdElement.style.padding = '5px';
    tdElement.appendChild(checkElement);

    // create text cell
    var tdElement = document.createElement('td');
    tdElement.setAttribute('class', 'listItem');
    tdElement.style.width = '50%';
    tdElement.style.paddingLeft = '10px';
    tdElement.align = 'left';
    tdElement.innerHTML = item;
    tabElement.appendChild(tdElement);

    // create location cell
    var tdElement = document.createElement('td');
    tdElement.setAttribute('class', 'listItem');
    tdElement.align = 'right';
    tdElement.innerHTML = loc;
    tabElement.appendChild(tdElement);

    // create menu cell
    var tdElement = document.createElement('td');
    tdElement.style.width = '10%';
    tdElement.align = 'right';
    tabElement.appendChild(tdElement);

    // create menu element
    var menuElement = document.createElement('a');
    menuElement.style.color = 'black';
    menuElement.innerHTML = '<i class="fa fa-ellipsis-v" aria-hidden="true"></i>';
    // menu click event
    menuElement.addEventListener('click', function(){
        menuFunc();
    })
    tdElement.appendChild(menuElement);

    return rootElement;
}



/**
 * Creates a DOM object for a checklist
 * @param   {Array}         items           List of items to be printed
 * @return  {DOM Object}    rootElement     The root node for the checklist
*/
function listPrint (items, callback) {

    var i;

    // initialize root
    var rootElement = document.createElement('div');
    rootElement.setAttribute('class', 'listPrint');

    // This block uses a closure to ensure the proper scoping for the index variable
    for (i=0; i<items.length; i++) (function (i) {
        listItem = callback(i, items[i]);
        rootElement.appendChild(listItem);
    })(i);
    // console.log(typeof(callback()));

    return rootElement;
}



/**
 * Creates a DOM object for a tab menu
 * @param   {Array}         tabID           An array of IDs for the tab content views
 * @param   {Array}         content
 * @param   {Array}         ...             An array of fa fa icon tags
 * @param   {Boolean}       changeButton    Toggles whether active button reset on load
 * @return  {DOM Object}    divElement      The root element of the tab menu
*/
function tabBar (tabID, content, clickFunc, changeButton=true) {
    var i;
    var divElement = document.createElement('div');
    divElement.setAttribute('class', 'tab');
    // trBotElement.appendChild(divElement);
    for (i=0; i<tabID.length; i++) (function (i) {
        var butElement = document.createElement('button');
        butElement.setAttribute('class', 'tablinks');
        // if (i==0) butElement.setAttribute('id', 'defaultOpen');
        butElement.setAttribute('id', tabID[i]+'Button')
        // console.log(butElement.id);
        butElement.innerHTML = tabID[i];
        butElement.addEventListener('click', function(){

            // Declare all variables
            var j, tabcontent, tablinks;

            // Get all elements with class="tabcontent" and hide them
            tabcontent = document.getElementsByClassName("tabcontent");
            for (j = 0; j < tabcontent.length; j++) {
                tabcontent[j].style.display = "none";
            }
            document.getElementById(tabID[i]).style.display = "block";

            if (changeButton) {
                // Get all elements with class="tablinks" and remove the class "active"
                tablinks = document.getElementsByClassName("tablinks");
                // console.log(tablinks);
                for (j = 0; j < tablinks.length; j++) {
                    tablinks[j].className = tablinks[j].className.replace(" active", "");
                }
                // console.log(tabID[i])

                // Show the current tab, and add an "active" class to the button that opened the tab
                tablinks[i].className += " active";
                // console.log(i);
                // evt.currentTarget.className += " active";
            }
    });
        divElement.appendChild(butElement);
    })(i);
    return divElement;
}



/**
 * Creates a DOM object to fill each tab
 * @param   {Array}         tabID           An array of IDs for the tab content views
 * @param   {Array}         content         An array of functions returning the tab elements
 * @return  {DOM Object}    rootElement     The root element of the content frame
*/
function tabContent (tabID, content) {
    var rootElement = document.createElement('div');
    var i;

    for (i=0; i<tabID.length; i++) (function (i) {
        var outerListElement = document.createElement('div');
        outerListElement.setAttribute('id', tabID[i]+'Out');
        var listElement = content[i](tabID[i]);
        listElement.style.border = 'none';
        listElement.setAttribute('class', 'tabcontent');
        listElement.setAttribute('id', tabID[i]);
        if (i==0) listElement.style.display = 'block';
        outerListElement.appendChild(listElement);
        rootElement.appendChild(outerListElement);
    })(i);

    return rootElement;
}



/**
 * Creates a three-way partition
 * @param   {Boolean}       changeButton    Toggles whether active button reset on load
 * @param   {Boolean}       fadeTab         Toggles tab fade effect
 * @param   {String}        topFrame        Percent value of height of top element
 * @param   {String}        midFrame        Percent value of height of middle element
 * @param   {String}        botFrame        Percent value of height of bottom element
 * @return  {DOM Object}    tabElement      The root node for the table
*/
function frameTable (changeButton=true, fadeTab=true, topFrame='4%', midFrame='90%', botFrame='6%') {
    var tabIDs = ['Active','Search','Next'];

    var tabElement = document.createElement('table');
    tabElement.style.height = '100%';
    tabElement.style.width = '100%';


    // top
    var trTopElement = document.createElement('tr');
    trTopElement.style.height = topFrame;
    var divElement = document.createElement('div');
    divElement.style.backgroundColor = 'lightgray';
    divElement.style.height = '100%';
    trTopElement.appendChild(divElement);
    tabElement.appendChild(trTopElement);

    // mid
    var trMidElement = document.createElement('tr');
    trMidElement.style.height = midFrame;
    trMidElement.id = 'midFrame';
    tabElement.appendChild(trMidElement);

    var tabContentElement = tabContent(tabIDs, content);
    trMidElement.appendChild(tabContentElement);

    // bottom
    var trBotElement = document.createElement('tr');
    trBotElement.style.height = botFrame;
    tabElement.appendChild(trBotElement);

    var butElement = tabBar(tabIDs, content, changeButton);
    trBotElement.appendChild(butElement);

    return tabElement;
}
