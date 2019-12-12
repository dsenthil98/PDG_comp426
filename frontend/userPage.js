$(function() {
    renderUserPage(); 
});

async function renderUserPage() {
    let jwt = localStorage.getItem('jwt');
    let status = await axios({
        method: "get",
        url: "http://localhost:3000/account/status",
        headers: {
            Authorization: "Bearer " + jwt
        }
    });
    let name = status.data.user.data.fullname;
    $('#customizedGreeting').append(`<h1 style = "color: rgb(238, 212, 67)">Thank you for using our collaborative blog ${name}!</h1> </br>
    `)
}
