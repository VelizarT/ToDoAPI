var token = localStorage.getItem('x-auth');

var deleteTodo = function (todoId) {
    // var todo = {
    //     _id: todoId,
    //     text: escapeHtml(todoText),
    //     completed: todoCompleted
    // }
    var todoUrl = '/todos/' + todoId;
    return $.ajax({
        url: todoUrl,
        type: 'DELETE',
        contentType: 'application/json',
        // data: JSON.stringify(todo),
        beforeSend: function (request) {
            request.setRequestHeader('x-auth', token);
        }
    });
}