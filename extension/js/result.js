var seekRequest = true;
var seekResult = true;
var resultInjected = false;


//Init method
function init() {
    checkLogin();
    updateCheck();

    //chrome.storage.sync.clear();
}

//IMPORTANT: Where document.getElementById('') is to be used, use getFromInjectedScope('') instead
//
//Shifts scope to extension-injected node only,
//so that non-extension elements of similar IDs are not selected
function getFromInjectedScope(id) {
    var injectedScope = document.getElementById("Technoboard-Student-ATS");

    var allInjectedElements = injectedScope.getElementsByTagName("*");
    for (var i = 0; i < allInjectedElements.length; i++) {
        if (allInjectedElements[i].id === id) {
            requestedElement = allInjectedElements[i];
            break;
        }
    }
    return requestedElement;
}

//calls to loop check() at an interval of 2 seconds
function updateCheck() {
    setInterval(function() {
        check();
    }, 2000);
}


//Checks whether new attention-track request from teacher has arrived
function check() {
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var parser = new DOMParser();
            var responseDoc = parser.parseFromString(this.responseText, "text/html");

            if(responseDoc.getElementById("publish").innerHTML == "True") {
                if(seekRequest) {
                    suspendCheck();
                    injectResult();
                    updateResult();
                    /*injectSign();
                    setTimeout(function() {
                        ejectSign(false);
                    }, 180000);
                    setTimeout(function() {
                        ejectSign(false);
                    }, 30000);*/
                }
            }
        }
    };
    xmlhttp.open("GET", "https://technoboard-extension.000webhostapp.com/ATS/php/student/s-ATS-search-request.php?t=john1024&c=csc101", true);
    xmlhttp.send();
}


//Suspends check() for 3 minutes
function suspendCheck() {
    
    seekRequest = false;
    setTimeout(function() {
        seekRequest = true;
    }, 180000);
}


//Abstract inject function
function inject(source) {

    fetch(chrome.runtime.getURL(source)).then(r => r.text()).then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
    });
}


function injectResult() {
    
    if(!resultInjected)
        inject('../html/result.html');
    
    setTimeout(function() {
        document.getElementById("close-button").addEventListener("click", closeResult);
    }, 500);
/*
    setTimeout(function() {
        document.getElementById("downloader").addEventListener("click",toDownload);
    }, 500);
*/
    resultInjected = true;
}

function updateResult() {
    setInterval(function() {
        result();
    }, 700);
}


function result() {
    
    if(seekResult) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var parser = new DOMParser();
                var responseDoc = parser.parseFromString(this.responseText, "text/html");
                
                updateResultTable(responseDoc.getElementById("result"));
            }
        };
        xmlhttp.open("GET", "https://technoboard-extension.000webhostapp.com/ATS/php/teacher/t-ATS-retrieve-request.php?t=john1024&c=csc101", true);
        xmlhttp.send();
    }
}
/*
document.getElementById("downloader").addEventListener("click",function(){
    console.log("Hello World!");
});
document.getElementById("downloader").onclick=function(){
    alert("hello")
}*/

function suspendResult() {
    seekResult = false;
}


function updateResultTable(result) {

    var tableOut = document.getElementById('result');
    var tableOutBody = document.createElement('tbody');
    
    var resultArray = [];

    for (var i = 0, row; row = result.rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {
            resultArray.push(col.innerText);
        }
    }

    resultArray.forEach(function(data) {
        var row = document.createElement('tr');
        var cell = document.createElement('td');
        
        cell.appendChild(document.createTextNode(data));
        row.appendChild(cell);
        tableOutBody.appendChild(row);
    });

    if(tableOut) {
        while (tableOut.firstChild) {
            tableOut.removeChild(tableOut.firstChild);
        }
        tableOut.appendChild(tableOutBody);
    }
}


//Eject result
function closeResult() {
    suspendResult();
    document.getElementById("TechnoBoard-Teacher-ATS-Result").remove();
}

function toDownload() {
    chrome.downloads.download({url:"https://technoboard-extension.000webhostapp.com/ATS/database/t-d438fa290bab4058b750ee76cc7ad407/c-csc101/s-22042022/r-1651677077.json"});
}


function injectLogin() {
    inject("../html/login.html");
    setTimeout(function() {

            var button = getFromInjectedScope("login")
            button.addEventListener("click", function() {
                addLogin();
            });            
    }, 1000);
}

function checkLogin() {
    var username;
    chrome.storage.sync.get('Technoboard-Teacher-ATS-username', function(data) {
        username = data['Technoboard-Teacher-ATS-username'];
        if(!username)
            injectLogin();
    });
}

function addLogin() {
    
    var userdata = getFromInjectedScope("username").value;

    var key = "Technoboard-Teacher-ATS-username",
        value = userdata;
    
    var usernameJson = {};
    usernameJson[key] = value;
    chrome.storage.sync.set(usernameJson, function() {
        //login added
    });
}


if (document.readyState !== 'loading') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        init();
    });
}