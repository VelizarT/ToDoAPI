var token = localStorage.getItem('x-auth');

var displayTodos = function (todos) {
    var currentTodosContainer = $('#current-todos');
    var completedTodosContainer = $('#completed-todos');
    var currentTodosTempCnt = $('<div></div>').addClass('row row-style');
    var completedTodosTempCnt = $('<div></div>').addClass('row row-style');

    todos.forEach(function (todo) {
        console.log(JSON.stringify(todo));
        var todoCnt = $('<div></div>').addClass('col-xl-4 col-md-6');
        var todoForm = $('<form></form>').addClass('todo-style');
        
        var titleAndTextCnt = $('<div></div>').addClass('text-title-cnt');
        var titleCnt = $('<div></div>').addClass('todo-title');
        var textCnt = $('<div></div>').addClass('todo-text');
        textCnt.html(todo.text);
        titleCnt.html(todo.title);
        titleAndTextCnt.append(titleCnt)
                       .append(textCnt);
        
        var idCnt = $('<p></p>').addClass('id-cnt hidden');

        var editButton = $('<button>Edit</button>').addClass('btn btn-edit');
        var saveButton = $('<button>Save</button>').addClass('btn btn-save');
        var buttonsCnt = $('<div class="btn-cnt"></div>').append(editButton).append(saveButton);

        if (todo.completed) {
            var completedAtDateTime = new Date(todo.completedAt);
            var completedAtCnt = $('<div></div>').html('Completed: ' + completedAtDateTime.getDate() + '/' + (completedAtDateTime.getMonth() + 1) + '/' + completedAtDateTime.getFullYear()
                + ' at ' + completedAtDateTime.getHours() + ':'+ completedAtDateTime.getMinutes() + ':' + completedAtDateTime.getSeconds()).addClass('date-time-cnt');
            idCnt.html(todo._id);

            var todoSideBar = $('<div></div>').addClass('side-bar');
            todoSideBar.append(completedAtCnt).append(buttonsCnt);

            todoForm
                .append(titleAndTextCnt)
                .append(idCnt)
                .append(todoSideBar);

            todoCnt.append(todoForm);
            completedTodosTempCnt.append(todoCnt);

        } else {
            idCnt.html(todo._id);
            var label = $('<label class="form-check-label">Check to complete:</label>');
            var checkbox = $('<input class="form-check-input" type="checkbox" name="isCompleted" value="Yes"/>').prop('checked', false);
            var checkboxCnt = $('<div class="form-check-inline checkbox-cnt"></div>').append(label).append(checkbox);
            
            // var radioBtnCnt = $('<div class="radio-btn"></div>')
            //     .append(label)
            //     .append(radioBtnYes);

            var todoSideBar = $('<div></div>').addClass('side-bar');
            todoSideBar.append(checkboxCnt).append(buttonsCnt);

            todoForm
                .append(titleAndTextCnt)
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
    alert('Please, log in!');
});