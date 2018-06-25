var token = localStorage.getItem('x-auth');

var patchTodo = function (todoId, todoText, todoCompleted) {
    var todo = {
        text: todoText,
        completed: todoCompleted
    }
    var todoUrl = '/todos/' + todoId;
    return $.ajax({
        url: todoUrl,
        type: 'PATCH',
        contentType: 'application/json',
        data: todo,
        beforeSend: function (request) {
            request.setRequestHeader('x-auth', token);
        }
    });
}