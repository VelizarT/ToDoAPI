var token = localStorage.getItem('x-auth');

var createTodo = function (todo) {
    return $.ajax({
        url: '/todos',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(todo),
        beforeSend: function (request) {
            request.setRequestHeader('x-auth', token)
        }
    });
};

$('#new-todo-form').on('submit', function (e) {
    e.preventDefault();

    var todo = {
        title: escapeHtml($('#new-todo-title').val()),
        text: escapeHtml($('#new-todo-textarea').val()) 
    }

    createTodo(todo).then(function (response, status, xhr) {
        window.location.href = '/todos/me';
    }).catch(function (err) {
        alert('Please, fill all required fields!');
    });

});