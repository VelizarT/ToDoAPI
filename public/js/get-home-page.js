var getHomePage = function (response, status, xhr) {
    var token = xhr.getResponseHeader('x-auth');
    localStorage.setItem('x-auth', token);

    return $.ajax({
        url: '/home',
        type: 'GET',
        beforeSend: function (request) {
            request.setRequestHeader("x-auth", token);
        }
    });
}