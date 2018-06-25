// var authorizationToken = localStorage.getItem('x-auth');

// $.ajax({
//     url: '/users/me',
//     type: 'GET',
//     dataType: 'json',
//     contentType: 'application/json',
//     beforeSend: function(request) {
//         request.setRequestHeader("x-auth", authorizationToken);
//       }
// }).then(function (response, status, xhr) {
//     localStorage.setItem('user-email', response.email);
//     $('#navbarDropdownMenuLink').html(response.email);
// }).catch(function (err) {
//     window.location.href = '/login';
// });


// $(document).ready(function() {
//     $(".dropdown-toggle").dropdown();
// });

// $.ajax({
//     url: '/todos',
//     type: 'GET',
//     dataType: 'json',
//     contentType: 'application/json',
//     beforeSend: function(request) {
//         request.setRequestHeader("x-auth", authorizationToken);
//       },
//     success: function(response, status, xhr) {
//         alert(JSON.stringify(response));
//     }
// }); 