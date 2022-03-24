fetch("../../student-list.json")
.then(Response=>{
    return Response.json();
})
.then(jsondata=>console.log(jsondata))