var deleteAccount = function (token) {
    return $.ajax({
        url: '/users/me',
        type: 'DELETE',
        beforeSend: function (request) {
            request.setRequestHeader("x-auth", token);
        }
    });
}