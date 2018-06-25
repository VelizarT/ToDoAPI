var authorizationToken = localStorage.getItem('x-auth');

var userEmail = localStorage.getItem('user-email');
$('#navbarDropdownMenuLink').html(userEmail);

$('#delete-account').on('click', function () {
    deleteAccount(authorizationToken).then(function () {
        localStorage.clear();
        window.location.href = '/';
    });
});