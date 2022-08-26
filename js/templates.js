var shell = '';

let obj_arr = [
    {'name':'milk','listed':true},
    {'name':'Bread','listed':false},
    {'name':'strawberries','listed':true},
    {'name':'corn','listed':false},
];

var section = ["Home Filter","Cabinet","Freezer","Pantry","Containers","Spices","Snacks","Bathroom","Refridgerator","Cleaning","Misc"];
var meal = ["Meal Filter", "Pasta", "Salmon", "Tacos"];


let store = {
    'milk':'1',
    'Bread':'15',
    'strawberries':'Pr',
    'corn':'Pr'
}

var search = null;

var homeActive = false;
var mealActive = false;
var searchActive = false;



function fafaIcon (name) {
    var icon = document.createElement('i');
    icon.setAttribute('class', 'fa fa-' + name);
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
 * Creates a DOM object for one checklist item
 * @param   {String}        item            The listed item
 * @param   {Function}      clickFunc       Function to call for checkbox click
 * @param   {Function}      menuFunc        Function to call for menu click
 * @param   {String}        loc             Optional location of item
 * @param   {Boolean}       checked         Set status of checkbox
 * @return  {DOM Object}    rootElement     The root node for the checklist item
*/
function checkPrint (item, clickFunc, menuFunc, loc='', checked=false) {
    // console.log('checkPrint');

    // initialize root
    var rootElement = document.createElement('div');

    // create a table and set style
    var tabElement = document.createElement('table');
    tabElement.style.width = '100%'
    rootElement.appendChild(tabElement);

    // add a checkbox element
    var checkElement = document.createElement('input');
    checkElement.setAttribute('class', 'largerCheckbox');
    if (checked == 1) checkElement.setAttribute('checked', '');
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
    tdElement.style.width = '70%';
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
    // menuElement.innerHTML = fafaIcon('ellipsis-v');
    // menu click event
    menuElement.addEventListener('click', function(){
        menuFunc();
    })
    tdElement.appendChild(menuElement);

    // console.log(typeof rootElement);

    return rootElement;
}



/**
 * Creates a DOM object for a checklist
 * @param   {Array}         items           List of items to be printed
 * @param   {Function}      callback        
 * @return  {DOM Object}    rootElement     The root node for the checklist
*/
function listPrint (items, callback) {

    var i;

    // initialize root
    var rootElement = document.createElement('div');
    rootElement.setAttribute('class', 'listPrint');

    // This block uses a closure to ensure the proper scoping for the index variable
    for (i=0; i<items.length; i++) (function (i) {
        // console.log(items[i]);
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
 * @param   {Boolean}       changeButton    Toggles whether active button reset on load
 * @param   {Array}         tabButtons      An array of fa fa icon tags
 * @return  {DOM Object}    divElement      The root element of the tab menu
*/
function tabBar (tabID, changeButton=true, tabButtons) {
    var i;
    var divElement = document.createElement('div');
    divElement.setAttribute('class', 'tab');
    // console.log(tabButtons);
    // trBotElement.appendChild(divElement);
    for (i=0; i<tabID.length; i++) (function (i) {
        var butElement = document.createElement('button');
        var butContent = document.createElement('i');
        butElement.setAttribute('class', 'tablinks');
        // if (i==0) butElement.setAttribute('id', 'defaultOpen');
        butElement.setAttribute('id', tabID[i]+'Button');


        /**
         * I'm trying to set the buttons to the fafa icons...
         */ 

        // butContent = fafaIcon(tabButtons[i]);

        // butElement.appendChild(butContent);




        // console.log(butElement.id);
        // butElement.innerHTML = tabID[i];
        butElement.innerHTML = '<i class="fa fa-' + tabButtons[i] + '" aria-hidden="true"></i>';
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

function openTop(evt, topID) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("topcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("toplinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(topID).style.display = "block";
  evt.currentTarget.className += " active";
}


function closeTop() {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("topcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("toplinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
}



/**
 * Creates a DOM object to fill each tab
 * @param   {Array}         tabID           An array of IDs for the tab content views
 * @param   {Array}         content         An array of functions returning the tab elements
 * @return  {DOM Object}    rootElement     The root element of the content frame
*/
function tabContent (tabID) {
    var rootElement = document.createElement('div');
    var i;

    for (i=0; i<tabID.length; i++) (function (i) {
        var outerListElement = document.createElement('div');
        outerListElement.setAttribute('id', tabID[i]+'Out');
        var listElement = document.createElement('div');
        listElement.style.border = 'none';
        listElement.setAttribute('class', 'tabcontent');
        listElement.setAttribute('id', tabID[i]);
        if (i==0) listElement.style.display = 'block';
        outerListElement.appendChild(listElement);
        rootElement.appendChild(outerListElement);
    })(i);

    return rootElement;
}


function topBar () {
    var divElement = document.createElement('div');
    divElement.setAttribute('class','top');
    divElement.style.backgroundColor = '#2f2e5c';

    var topTab = document.createElement('table');
    topTab.style.width = '100%';

    // menu button
    var butElement = document.createElement('button');
    butElement.innerHTML = '<i class="fa fa-bars" aria-hidden="true"></i>';
    var inDiv = document.createElement('div');
    inDiv.setAttribute('class','top');
    inDiv.appendChild(butElement)
    var tdElement = document.createElement('td');
    tdElement.appendChild(inDiv);
    topTab.appendChild(tdElement);

    // filter button
    var butElement = document.createElement('button');
    butElement.setAttribute('class', 'toplinks');
    butElement.innerHTML = '<i class="fa fa-filter" aria-hidden="true"></i>';
    butElement.addEventListener('click', function () {
        // var filter;
        // console.log('home');
        if (!homeActive) {
            openTop(event, 'homeDiv');
            homeActive = true;
            mealActive = false;
            searchActive = false;
        }
        else {
            closeTop();
            homeActive = false;
            // filter = null;
            run_app('home1','Search',null);
            var selectElement = document.getElementById('home_section_select');
            selectElement.value = 'Home Filter';

        }
    });
    var inDiv = document.createElement('div');
    inDiv.setAttribute('class','top');
    inDiv.appendChild(butElement)
    var tdElement = document.createElement('td');
    tdElement.appendChild(inDiv);
    topTab.appendChild(tdElement);

    // meal button
    var butElement = document.createElement('button');
    butElement.setAttribute('class', 'toplinks');
    butElement.innerHTML = '<i class="fa fa-cutlery" aria-hidden="true"></i>';
    butElement.addEventListener('click', function () {
        // console.log('meal');
        

        if (!mealActive) {
            openTop(event, 'mealDiv');
            mealActive = true;
            homeActive = false;
            searchActive = false;
        }
        else {
            closeTop();
            mealActive = false;
        }
    });
    var inDiv = document.createElement('div');
    inDiv.setAttribute('class','top');
    inDiv.appendChild(butElement)
    var tdElement = document.createElement('td');
    tdElement.appendChild(inDiv);
    topTab.appendChild(tdElement);

    // search button
    var butElement = document.createElement('button');
    butElement.innerHTML = '<i class="fa fa-search" aria-hidden="true"></i>';
    butElement.addEventListener('click', function () {
        // console.log('search');
        

        if (!searchActive) {
            openTop(event, 'searchDiv');
            searchActive = true;
            homeActive = false;
            mealActive = false;
        }
        else {
            closeTop();
            run_app('home1','Search',null,null);
            textElement = document.getElementById('searchElement');
            textElement.value = '';
            searchActive = false;
        }
    });
    var inDiv = document.createElement('div');
    inDiv.setAttribute('class','top');
    inDiv.appendChild(butElement)
    var tdElement = document.createElement('td');
    tdElement.appendChild(inDiv);
    topTab.appendChild(tdElement);


    // content area
    // var tdElement = document.createElement('td');
    // topTab.appendChild(tdElement);

    var tdElement = document.createElement('td');
    tdElement.style.width = '100%';
    // tdElement.style.textAlign = 'right';

    var homeDiv = document.createElement('div');
    homeDiv.setAttribute('class','topcontent');
    homeDiv.id = 'homeDiv';
    // homeDiv.style.position = 'relative';
    // homeDiv.style.right = '0';
    // homeDiv.style.float = 'right';
    var selectElement = document.createElement('select');
    selectElement.setAttribute('class','custom-select');
    selectElement.id = 'home_section_select';
    var i;
    for (i=0; i<section.length; i++){
        var option = document.createElement('option');
        selectElement.value = section[i];
        option.innerHTML = section[i];
        selectElement.appendChild(option);
        // filter = 'Cabinet';
    }
    selectElement.addEventListener('change', function () {
        // console.log(selectElement.value);
        var filter;
        var selection = document.getElementById('home_section_select').value;
        if (selection === 'Home Filter') {
            filter = null;
        }
        else {
            filter = selection;
        }
        run_app('home1', 'Search', filter);
    })
    homeDiv.appendChild(selectElement);
    tdElement.appendChild(homeDiv);

    var mealDiv = document.createElement('div');
    mealDiv.setAttribute('class','topcontent');
    mealDiv.id = 'mealDiv';
    var selectElement = document.createElement('select');
    selectElement.setAttribute('class','custom-select');
    var i;
    for (i=0; i<meal.length; i++){
        var option = document.createElement('option');
        option.innerHTML = meal[i];
        selectElement.appendChild(option);
    }
    mealDiv.appendChild(selectElement);
    tdElement.appendChild(mealDiv);


    var searchDiv = document.createElement('div');
    searchDiv.setAttribute('class','topcontent');
    // searchDiv.style.margin = '0px, 8px';
    searchDiv.id = 'searchDiv';
    searchDiv.style.position = 'fixed';
    searchDiv.style.right = '0';
    var textElement = document.createElement('input');
    tdElement.setAttribute('class', 'search');
    textElement.style.width = '120px';
    textElement.id = 'searchElement';
    // textElement.setAttribute('class', 'form-control');
    // if (search === null) textElement.setAttribute('placeholder', 'Search');
    textElement.setAttribute('placeholder', 'Search');
    // else textElement.setAttribute('placeholder', search);
    textElement.type = 'text';
    searchDiv.appendChild(textElement);

    var searchBut = document.createElement('button');
    butElement.setAttribute('class', 'toplinks');
    searchBut.setAttribute('class', 'search');
    searchBut.innerHTML = '<i class="fa fa-search" aria-hidden="true"></i>';
    searchBut.addEventListener('click', function () {
        search_val = document.getElementById('searchElement').value;
        // console.log(search_val);
        query = new RegExp(search_val.toLowerCase());
        run_app('home1','Search',null,query);
    });
    searchDiv.appendChild(searchBut);

    tdElement.appendChild(searchDiv);


    topTab.appendChild(tdElement);


    

    divElement.appendChild(topTab);

    return divElement;
}



/**
 * Creates a three-way partition
 * @param   {Boolean}       changeButton    Toggles whether active button reset on load
 * @param   {Boolean}       fadeTab         Toggles tab fade effect
 * @param   {String}        topFrame        Pixel value of height of top element
 * @param   {String}        midFrame        Percent value of height of middle element -depricated
 * @param   {String}        botFrame        Pixel value of height of bottom element
 * @return  {DOM Object}    tabElement      The root node for the table
*/
function frameTable (changeButton=true, fadeTab=true, topFrame='48px', midFrame='88.5%', botFrame='58px') {
    var tabIDs = ['Active','Search','New','Setup'];
    var tabButtons = ['shopping-cart', 'home', 'plus','cog'];

    var tabElement = document.createElement('table');
    tabElement.style.height = '100%';
    tabElement.style.width = '100%';


    // top
    var trTopElement = document.createElement('th');
    trTopElement.style.height = topFrame;
    trTopElement.style.top = '0';
    trTopElement.style.position = 'fixed';
    trTopElement.style.opacity = '1';
    trTopElement.style.width = '100%';

    var divElement = document.createElement('div');
    divElement = topBar();
    trTopElement.appendChild(divElement);


    // mid
    var trMidElement = document.createElement('tr');
    // trMidElement.style.height = midFrame;
    trMidElement.style.top = '40';
    trMidElement.style.position = 'relative';
    trMidElement.style.width = '100%';
    trMidElement.id = 'midFrame';
    tabElement.appendChild(trMidElement);

    var tabContentElement = tabContent(tabIDs);
    trMidElement.appendChild(tabContentElement);
    tabElement.appendChild(trTopElement);


    // bottom
    var trBotElement = document.createElement('tr');
    trBotElement.style.height = botFrame;
    trBotElement.style.bottom = '0';
    trBotElement.style.position = 'fixed';
    trBotElement.style.width = '100%';
    tabElement.appendChild(trBotElement);

    var butElement = tabBar(tabIDs, changeButton, tabButtons);
    trBotElement.appendChild(butElement);

    return tabElement;
}
