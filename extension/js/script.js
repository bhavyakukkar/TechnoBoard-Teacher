//Init method

function init() {
    addListenerToButton();
}

//Add Listener to new-request Button
function addListenerToButton() {
    var button = document.getElementById("new-request");
    button.addEventListener('click', function() {
        newRequest();
        loadingWindow();
        /*setTimeout(function() {
            closePopup();
        }, 10000);*/
        //injectResult();
    })
}

//Creates new attention-track request
function newRequest() {
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "http://technoboard-extension.000webhostapp.com/ATS/php/teacher/t-ATS-new-request.php?id=john1024&c=csc101&s=22042022", true);
    xmlhttp.send();
}

//Hide New-Request popup content
function loadingWindow() {
    document.body.style.padding = "0px";
    document.body.style.width = "24px";
    document.body.style.height = "24px";
    document.body.innerHTML = "<img src='../res/gifs/loading.gif' alt='busy' style='width:24px; height:24px;'>";
}

//Closes New-Request popup after request is made
function closePopup() {
    window.close();
}

function injectResult() {
    fetch(chrome.runtime.getURL('../html/result.html')).then(r => r.text()).then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
    });
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

function inject(source) {

    fetch(chrome.runtime.getURL(source)).then(r => r.text()).then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
    });
}

if (document.readyState !== 'loading') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        init();
    });
}