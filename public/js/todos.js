$('body').removeClass('notes-background').addClass('wood-background');

var token = localStorage.getItem('x-auth');

if(!token) {
    window.location.href = '/login';
}

var displayTodos = function (todos) {

    if(todos.length > 0) {
        todoEditMode(todos[todos.length-1]);
    } else {
        var noTodosMessages = $('<h3></h3>').addClass('h3').html('No todos to display');
        $('#todos-cnt').append(noTodosMessages);
        return;
    }

    var todosContainer = $('#todos-cnt');

    var titleCurrent = $('<h3></h3>').html('Current Todos').addClass('h3');
    var titleCompleted = $('<h3></h3>').html('Completed Todos').addClass('h3');

    var currentTodosTempCnt = $('<div></div>').addClass('list-group clearfix');
    var completedTodosTempCnt = $('<div></div>').addClass('list-group clearfix');

    todos.forEach(function (todo) {
        var todoCnt = $('<a></a>').addClass('list-group-item pointer');
        var titleCnt = $('<div></div>').addClass('todo-title');
        titleCnt.html(todo.title);

        addDeleteBtn(todoCnt);

        var idCnt = $('<p></p>').addClass('id-cnt hidden');

        if (todo.completed) {
            idCnt.html(todo._id);

            todoCnt.append(titleCnt).append(idCnt);
            createCompletedCnt(todoCnt, todo);
            attachEditEvent(todoCnt, todo._id);
            completedTodosTempCnt.append(todoCnt);

        } else {
            idCnt.html(todo._id);

            todoCnt.append(titleCnt).append(idCnt);
            attachEditEvent(todoCnt, todo._id);
            currentTodosTempCnt.append(todoCnt);
        }
    });


    var checkIfCompleted = todos.map(todo => todo.completed);

    if(checkIfCompleted.indexOf(false) < 0) {
        var noTodosMessages = $('<h3></h3>').addClass('h3').html('No current todos');
        todosContainer.append(noTodosMessages);
    } else {
        todosContainer.append(titleCurrent).append(currentTodosTempCnt);
    }

    if(checkIfCompleted.indexOf(true) >= 0) {
        todosContainer.append(titleCompleted).append(completedTodosTempCnt);
    } 
};

var createCompletedCnt = function(el, todo) {
    var completedText = $('<span></span>').html('Completed:  ');
    var calendar = $('<span></span>').addClass('far fa-calendar-alt');
    var clock = $('<span></span>').addClass('far fa-clock');
    var completedAtDateTime = new Date(todo.completedAt);
    var completedAtDate = ' ' + completedAtDateTime.getDate() + '/' + (completedAtDateTime.getMonth() + 1) + '/' + completedAtDateTime.getFullYear();
    var completedAtTime = ' ' + (+completedAtDateTime.getHours() < 10 ? '0' : '') + completedAtDateTime.getHours() + ':' + (+completedAtDateTime.getMinutes() < 10 ? '0' : '') + completedAtDateTime.getMinutes();
    var completedDateTimeCnt = $('<div></div>').addClass('date-time-completed');
    calendar.text(completedAtDate);
    clock.text(completedAtTime);
    completedDateTimeCnt.append(completedText).append(calendar).append(' ').append(clock).append('<br>');

    el.append(completedDateTimeCnt);
}

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

var addDeleteBtn = function(el) {
    var deleteBtn = $('<i></i>').addClass('fas fa-times delete-btn');
    el.append(deleteBtn);
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
