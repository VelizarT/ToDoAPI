$('#home-link').on('click', function() {
    if(localStorage.getItem('x-auth')) {
        window.location.href = '/home';
    } else {
        window.location.href = '/';
    }
});

$('#your-todos-link').on('click', function() {
    if(localStorage.getItem('x-auth')) {
        window.location.href = '/todos/me';
    } else {
        window.location.href = '/login';
    }
});

$('#new-todo-link').on('click', function() {
    if(localStorage.getItem('x-auth')) {
        window.location.href = '/new';
    } else {
        window.location.href = '/login';
    }
});