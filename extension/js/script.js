//Init method
function init() {

    addListenerToButton();
}

//Add Listener to new-request Button
function addListenerToButton() {
    var button = document.getElementById("new-request");
    button.addEventListener('click', function() {
        newRequest();
        /*injectResult();*/
    })
}

//Creates new attention-track request
function newRequest() {
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "http://technoboard-extension.000webhostapp.com/ATS/php/teacher/t-ATS-new-request.php?id=john1024&c=csc101&s=22042022", true);
    xmlhttp.send();
}

function injectResult() {
    fetch(chrome.runtime.getURL('../html/result.html')).then(r => r.text()).then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
    });
    setTimeout(function() {
        document.getElementById("index_link").addEventListener("click", sign);
    }, 500);
}

function result() {
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var parser = new DOMParser();
            var responseDoc = parser.parseFromString(this.responseText, "text/html");

            if(responseDoc.getElementById("publish").innerHTML == "True") {
                if(seekRequest) {
                    suspendUpdate();
                    inject_sign();
                }
            }
        }
    };
    xmlhttp.open("GET", "https://technoboard-extension.000webhostapp.com/ATS/php/student/s-ATS-search-request.php?t=roseline&c=csc101", true);
    xmlhttp.send();
}

//Suspends update() for 10 seconds
function suspendResult() {
    
    seekRequest = false;
    setTimeout(function() {
        seekRequest = true;
    }, 300000);
}

//calls to loop update() at an interval of 2 seconds
function updateLoop() {
    setInterval(function() {
        update();
    }, 2000);
}

init();
/*chrome.action.onClicked.addListener(function () {
    init();
});*/
