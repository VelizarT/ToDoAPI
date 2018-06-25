var usersLogin = function (user) {
    return $.ajax({
        url: '/users/login',
        type: 'POST',
        data: JSON.stringify(user),
        contentType: 'application/json',
    });
}

$('#login').on('submit', function (e) {
    e.preventDefault();

    var user = {
        email: escapeHtml($('#login-username').val()),
        password: escapeHtml($('#login-password').val())
    }

    usersLogin(user)
        .then(function (response, status, xhr) {
            var token = xhr.getResponseHeader('x-auth');
            localStorage.setItem('x-auth', token);
            window.location.href = '/home';
        })
        .catch(function (err) {
            alert(err.responseText);
        });
});