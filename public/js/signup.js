var userSignup = function (user) {
    return $.ajax({
        url: '/users',
        type: 'POST',
        data: JSON.stringify(user),
        contentType: 'application/json',
    });
}

$('#signup').on('submit', function (e) {
    e.preventDefault();

    var user = {
        email: escapeHtml($('#signup-username').val()),
        password: escapeHtml($('#signup-password').val())
    }

    userSignup(user)
        .then(function (response, status, xhr) {
            var token = xhr.getResponseHeader('x-auth');
            localStorage.setItem('x-auth', token);
            window.location.href = '/home';
        })
        .catch(function (err) {
            var shortPasswordError = err.responseJSON;
            if(shortPasswordError) {
                alert('Passord is shorter than 6 characters!');
            } else {
                alert(err.responseText);
            }
        });
});