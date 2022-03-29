document.addEventListener('DOMContentLoaded',()=>{
    var y=document.getElementById("index_link");
    y.addEventListener("click",openIndex);
});
function openIndex(){
    chrome.tabs.create({active:true,url:"http://the_class"});
}