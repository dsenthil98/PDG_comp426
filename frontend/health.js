let id = parseInt(localStorage.id)

$(function() {
    $('#healthSubmitPost').click(handleSubmit);
    $('#healthCancelPost').click(resetPostBox);
    renderHealth(); 
    //deleteTest(); 
});

const handleSubmit = async function(event) {
    event.preventDefault();
    if ($.trim($(`#postContent`).val()) == "" || $.trim($(`#postTitle`).val()) == "") {
        if (!document.getElementById("fillAllFieldsWarning")) {
        $(`#healthPostForm`).append(`<p id = "fillAllFieldsWarning" style = "color: red"> **Must fill out all fields!** </p>`); 
        }
    } else {
    let jwt = localStorage.getItem('jwt');
    
    let status = await axios({
        method: "get",
        url: "http://localhost:3000/account/status",
        headers: {
            Authorization: "Bearer " + jwt
        }
    });
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
    let username = status.data.user.name; 
    let content = $(`#postContent`).val(); 
    let title = $(`#postTitle`).val(); 
    let date = new Date(); 
    dateString = monthNames[date.getMonth()] + " " + date.getDate().toString() + ", " + date.getFullYear().toString(); 
    time = date.toLocaleTimeString('en-US'); 
   
    let result = axios.post('http://localhost:3000/private/health/' + id, {
        data: {
            id: id,
            author: username,
            body: content,
            title: title,
            date: dateString + " at " + time
        }}, 
        {headers: {Authorization: "Bearer " + jwt}},);
    
    result.then(response => {
        }).catch(error => {
        });

    id = id + 1; 
    localStorage.setItem('id', id);

    resetPostBox(); 
    renderHealth(); 
    }
}

function resetPostBox() {
    $(`#healthPostForm`).replaceWith(`<div class="form-group" id = "healthPostForm">
    <textarea class="form-control" id = "postTitle" rows="1" placeholder = "Post title"></textarea>
    <textarea class="form-control" id = "postContent" rows="3" placeholder = "Post content"></textarea>
  </div>`)
}

async function renderHealth() {
    let jwt = localStorage.getItem('jwt'); 
    let status = await axios({
        method: "get",
        url: "http://localhost:3000/account/status",
        headers: {
            Authorization: "Bearer " + jwt
        }
    });
    let username = status.data.user.name; 
    const result = await axios({
        method: 'get',
        url: 'http://localhost:3000/private/health',
        headers: {
            Authorization: "Bearer " + jwt
        },
      });
    objectArray = Object.values(result.data.result)
    let posts = `<div id = "healthpostcontainer">`;
    for (let i = objectArray.length - 1; i >=0 ; i--) {
        let post = objectArray[i]; 
        posts += `<div class="card mb-4" class = "postIndiv" id = "${post.id}">
                    <div class="card-body" id = "${post.id}Body">
                        <h3 class="card-title"> ${post.title} </h3>
                        <p class="card-text" class = "postBody">${post.body}</p>
                    </div>
                    <div class="card-footer text-muted">
                        Posted on ${post.date} by
                        <a>${post.author}</a> </br> </br>`
                    
        if (username == `${post.author}`) {
            posts  +=  `<button type="button" class = "deleteButton" >Delete</button>
                        <button type="button" class = "editButton" >Edit</button>`

        }
        
        posts += `</div> </div>`; 
    }
    posts += `</div>`;
    $('#healthpostcontainer').replaceWith(posts);
    $('.deleteButton').click(handleDelete);
    $('.editButton').click(handleEdit);

}


const handleDelete = async function(event) {
    let jwt = localStorage.getItem('jwt'); 
    let id = $(event.target).parent().parent()[0].id; 
    const result = await axios({
        method: 'delete',
        url: 'http://localhost:3000/private/health/' + id,
        headers: {
            Authorization: "Bearer " + jwt
        },
      });
      renderHealth(); 
}

const handleEdit = async function(event) {
    let jwt = localStorage.getItem('jwt'); 
    let id = $(event.target).parent().parent()[0].id; 
    const result = await axios({
        method: 'get',
        url: 'http://localhost:3000/private/health/' + id,
        headers: {
            Authorization: "Bearer " + jwt
        },
      });

    $(event.target).parent().prev().replaceWith(`<div class="form-group" id = "editPostForm">
    <textarea class="form-control" id = "editPostTitle" rows="1"> ${result.data.result.title} </textarea>
    <textarea class="form-control" id = "editPostContent" rows="3"> ${result.data.result.body}</textarea>
    </div>`)
    $(event.target).replaceWith(`<button type="button" class = "updateButton" >Update</button>
    <button type="button" class = "cancelButton" >Cancel</button>`)
    $('.cancelButton').click(handleCancel);
    $('.updateButton').click(handleUpdate);

}

const handleCancel = async function(event) {
    renderHealth(); 
}

const handleUpdate = async function(event) {
    let jwt = localStorage.getItem('jwt'); 
    let id = $(event.target).parent().parent()[0].id;
    const result = await axios({
        method: 'get',
        url: 'http://localhost:3000/private/health/' + id,
        headers: {
            Authorization: "Bearer " + jwt
        },
    }); 
    let result2 = axios.post('http://localhost:3000/private/health/' + id, {
        data: {
            title: $(`#editPostTitle`).val(),
            body: $(`#editPostContent`).val(),
            author: result.data.result.author,
            date: result.data.result.date, 
            id: result.data.result.id
        }}, 
        {headers: {Authorization: "Bearer " + jwt}},);
        renderHealth();
}

async function deleteTest() {
    let jwt = localStorage.getItem('jwt'); 
    const result = await axios({
        method: 'delete',
        url: 'http://localhost:3000/private/health',
        headers: {
            Authorization: "Bearer " + jwt
        },
      });
}

