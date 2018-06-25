var logout = function (token) {
    return $.ajax({
        url: '/users/me/token',
        type: 'DELETE',
        beforeSend: function (request) {
            request.setRequestHeader("x-auth", token);
        }
    });
}
