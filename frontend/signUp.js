$(function() {
    $('#sign-up').click(handleCreateAccount);
});

const handleCreateAccount = async function(event) {
    if ($.trim($(`#usernameval`).val()) == "" || $.trim($(`#nameval`).val()) == "" || $.trim($(`#schoolval`).val()) == "" || $.trim($(`#majorval`).val()) == "" || $.trim($(`#passwordval`).val()) == "") {
        $(`#incorrectFieldsWarning`).replaceWith(`<h5 id = "incorrectFieldsWarning" style = "color: red"> ** Must fill out all fields! ** </h5>`); 
    } 
    else {
        event.preventDefault();
        let response = axios.post('http://localhost:3000/account/create', {
            name: "" + $(`#usernameval`).val() + "",
            pass: "" + $(`#passwordval`).val() + "",
            data: {
                fullname: "" + $(`#nameval`).val() + "",
                school: "" + $(`#schoolval`).val() + "",
                major: "" + $(`#majorval`).val() + "",
                account_type: "user"
            }
        });

        response.then(response => {
            if (response.data.status.includes("Successfully made account")) {
                $(`#incorrectFieldsWarning`).replaceWith(`<h5 id = "incorrectFieldsWarning" style = "color:#3dde37"> ** Account successfully created! Log in now. ** </h5>`); 
            }
        }).catch(error => {
            if (error.response.data.msg.toString().includes("already a registered user")) {
                $(`#incorrectFieldsWarning`).replaceWith(`<h5 id = "incorrectFieldsWarning" style = "color: red"> ** Username is already taken! ** </h5>`); 
            } 
        })
        

        //window.location.href = "http://localhost:3001/login.html"
    }
}

