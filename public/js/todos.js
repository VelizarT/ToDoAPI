$('body').removeClass('notes-background').addClass('wood-background');

var token = localStorage.getItem('x-auth');

var displayTodos = function (todos) {
    todoEditMode(todos[todos.length-1]);

    var todosContainer = $('#todos-cnt');

    var titleCurrent = $('<h3></h3>').html('Current Todos').addClass('h3');
    var titleCompleted = $('<h3></h3>').html('Completed Todos').addClass('h3');

    var currentTodosTempCnt = $('<div></div>').addClass('list-group clearfix');
    var completedTodosTempCnt = $('<div></div>').addClass('list-group clearfix');

    todos.forEach(function (todo) {
        var todoCnt = $('<a></a>').addClass('list-group-item pointer');
        var titleCnt = $('<div></div>').addClass('todo-title');
        titleCnt.html(todo.title);

        
        var idCnt = $('<p></p>').addClass('id-cnt hidden');

        if (todo.completed) {
            var completedText = $('<span></span>').html('Completed:  ');
            var calendar = $('<span></span>').addClass('far fa-calendar-alt');
            var clock = $('<span></span>').addClass('far fa-clock');
            var completedAtDateTime = new Date(todo.completedAt);
            var completedAtDate = ' ' + completedAtDateTime.getDate() + '/' + (completedAtDateTime.getMonth() + 1) + '/' + completedAtDateTime.getFullYear();
            var completedAtTime = ' ' + (+completedAtDateTime.getHours() < 10 ? '0' : '') + completedAtDateTime.getHours() + ':' + (+completedAtDateTime.getMinutes() < 10 ? '0' : '') + completedAtDateTime.getMinutes();
            var completedDateTimeCnt = $('<div></div>').addClass('date-time-completed');
            
            idCnt.html(todo._id);

            calendar.text(completedAtDate);
            clock.text(completedAtTime);
            completedDateTimeCnt.append(completedText).append(calendar).append(' '). append(clock);
            todoCnt.append(titleCnt).append(idCnt).append(completedDateTimeCnt);
            attachEditEvent(todoCnt, todo._id);
            completedTodosTempCnt.append(todoCnt);

        } else {
            idCnt.html(todo._id);

            todoCnt.append(titleCnt).append(idCnt);
            attachEditEvent(todoCnt, todo._id);
            currentTodosTempCnt.append(todoCnt);
        }
    });

    todosContainer.append(titleCurrent);
    todosContainer.append(currentTodosTempCnt);
    todosContainer.append(titleCompleted);
    todosContainer.append(completedTodosTempCnt);
};

var attachEditEvent = function(el, id) {
    $(el).on('click', function() {
        $('.edit-cnt').remove();
        window.scrollTo(0, 0);
        getTodoById(id).then((response, status, xhr) => {
            todoEditMode(response.todo);
        }).catch((err) => {
            console.log(err);
        });
    });
}

var getTodos = function () {
    return $.ajax({
        url: '/todos',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        beforeSend: function (request) {
            request.setRequestHeader('x-auth', token)
        }
    });
}
