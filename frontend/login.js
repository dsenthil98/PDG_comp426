$(function() {
    $('#log-in').click(handleLogin);
});

const handleLogin = async function(event) {
    event.preventDefault();
    let response = axios.post('http://localhost:3000/account/login', {
        name: "" + $(`#usernameval`).val() + "",
        pass: "" + $(`#passwordval`).val() + "",
        
    });
 
    response.then(response => {
        localStorage.setItem('jwt', response.data.jwt); 
        window.location.href = "http://localhost:3001/loggedin.html"
    }).catch(error => {
        if (error.response.data.msg.includes("Bad username or password.")) {
            $(`#incorrectFieldsWarning`).replaceWith(`<h5 id = "incorrectFieldsWarning" style = "color: red"> ** Invalid username/password combination. ** </h5>`); 
        } 
        if (error.response.data.msg.includes("not a registered user.")) {
            $(`#incorrectFieldsWarning`).replaceWith(`<h5 id = "incorrectFieldsWarning" style = "color: red"> ** Username does not exist. Sign up for an account first. ** </h5>`); 
        }
        
    })
    
}
