var token = localStorage.getItem('x-auth');

var displayTodos = function (todos) {
    var currentTodosContainer = $('#current-todos');
    var completedTodosContainer = $('#completed-todos');
    var currentTodosTempCnt = $('<div></div>').addClass('row row-style');
    var completedTodosTempCnt = $('<div></div>').addClass('row row-style');

    todos.forEach(function (todo) {
        var todoCnt = $('<div></div>').addClass('col-xl-4 col-md-6');
        var todoForm = $('<form></form>').addClass('todo-style');
        
        var textCnt = $('<div></div>').addClass('todo-text');
        var titleCnt = $('<div></div>').addClass('todo-title');
        titleCnt.text(todo.title);
        textCnt.append(titleCnt);
        // textCnt.text(todo.text);

        console.log(titleCnt);

        var idCnt = $('<p></p>').addClass('id-cnt hidden');

        var editButton = $('<button>Edit</button>').addClass('btn-edit');
        var saveButton = $('<button>Save</button>').addClass('btn-save');
        var buttonsCnt = $('<div class="form-group"></div>').append(editButton).append(saveButton);

        if (todo.completed) {
            var completedAtDateTime = new Date(todo.completedAt);
            var completedAtCnt = $('<p></p>').html(completedAtDateTime.getDate() + '/' + (completedAtDateTime.getMonth() + 1) + '/' + completedAtDateTime.getFullYear()
                + ' ' + completedAtDateTime.getHours() + ':'+ completedAtDateTime.getMinutes() + ':' + completedAtDateTime.getSeconds()).addClass('date-time-cnt');
            idCnt.html(todo._id);
            var label = $('<label>Completed:</label>');
            var radioBtnYes = $('<label class="radio-yes"> Yes </label>').append($('<input type="radio" name="isCompleted" value="true"/>').prop('checked', true));
            var radioBtnNo = $('<label class="radio-no"> No </label>').append($('<input type="radio" name="isCompleted" value="false"/>'));
            var radioBtnCnt = $('<div class="form-group radio-btn"></div>').append(label).append(radioBtnYes).append(radioBtnNo);

            var todoSideBar = $('<div></div>').addClass('sideBar');
            todoSideBar.append(radioBtnCnt).append(buttonsCnt).append(completedAtCnt);

            todoForm
                .append(textCnt)
                .append(idCnt)
                .append(todoSideBar);

            todoCnt.append(todoForm);
            completedTodosTempCnt.append(todoCnt);

        } else {
            idCnt.html(todo._id);
            var label = $('<label>Completed:</label>');
            var radioBtnYes = $('<input type="radio" name="isCompleted" value="true"/>');
            var radioBtnNo = $('<input type="radio" name="isCompleted" value="false"/>').prop('checked', true);
            
            var radioBtnCnt = $('<div class="form-group"></div>')
                .append(label)
                //.append('<br>')
                .append($('<label> Yes </label>'))
                .append(radioBtnYes)
                .append($('<label> No </label>'))
                .append(radioBtnNo);

            var todoSideBar = $('<div></div>').addClass('sideBar');
            todoSideBar.append(radioBtnCnt).append(buttonsCnt);

            todoForm
                .append(textCnt)
                .append(idCnt)
                .append(todoSideBar);

            todoCnt.append(todoForm);
            currentTodosTempCnt.append(todoCnt);
        }
    });
    currentTodosContainer.append(currentTodosTempCnt);
    completedTodosContainer.append(completedTodosTempCnt);
};

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

getTodos().then(function (response, status, xhr) {
    // alert(JSON.stringify(response.todos));
    displayTodos(response.todos);
}).catch(function (err) {
    alert(JSON.stringify(err));
});