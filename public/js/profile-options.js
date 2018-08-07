var authorizationToken = localStorage.getItem('x-auth');

if(!authorizationToken) {
    window.location.href = '/login';
}

$.ajax({
    url: '/users/me',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    beforeSend: function(request) {
        request.setRequestHeader("x-auth", authorizationToken);
      }
}).then(function (response, status, xhr) {
    localStorage.setItem('user-email', response.email);
    $('#navbarDropdownMenuLink').html(response.email);
}).catch(function (err) {
    window.location.href = '/login';
});


$(document).ready(function() {
    $(".dropdown-toggle").dropdown();
});

$('#option-one-dropdown-btn').on('click', function() {
    logout(authorizationToken).then(function () {
        localStorage.clear();
        window.location.href = '/';
    });
});

$('#option-two-dropdown-btn').on('click', function() {
    window.location.href = '/profile';
});