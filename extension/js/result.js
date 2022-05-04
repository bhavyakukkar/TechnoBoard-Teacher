var seekRequest = true;
var resultInjected = false;


//Init method
function init() {
    //checkLogin();
    updateCheck();
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

    resultInjected = true;
}

function updateResult() {
    setInterval(function() {
        result();
    }, 500);
}


function result() {
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var parser = new DOMParser();
            var responseDoc = parser.parseFromString(this.responseText, "text/html");

            updateResultTable(responseDoc.getElementById("request"));
        }
    };
    xmlhttp.open("GET", "https://technoboard-extension.000webhostapp.com/ATS/php/teacher/t-ATS-retrieve-request.php?t=john1024&c=csc101", true);
    xmlhttp.send();
}


function updateResultTable(table) {
    var result = document.getElementById("result");



    for (var i = 0, row; row = table.rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {
            result.insertRow("<td>"+(col.innerText)+"</td>");
            alert(col.innerText);
        }
    }
}


//Eject result
function closeResult() {
    document.body.removeChild(document.getElementById("Technoboard-Teacher-ATS-Result"));
}


if (document.readyState !== 'loading') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        init();
    });
}