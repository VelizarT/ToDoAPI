var token = localStorage.getItem('x-auth');

var displayTodos = function (todos) {
    var currentTodosContainer = $('#current-todos');
    var completedTodosContainer = $('#completed-todos');
    var currentTodosTempCnt = $('<div></div>').addClass('row');
    var completedTodosTempCnt = $('<div></div>').addClass('row');

    todos.forEach(function (todo) {
        var todoCnt = $('<form></form>').addClass('todo-style col-xl-4');
        var textCnt = $('<div></div>').addClass('todo-text');

        var idCnt = $('<p></p>').addClass('id-cnt hidden');

        var editButton = $('<button>Edit</button>').addClass('btn btn-edit');
        var saveButton = $('<button>Save</button>').addClass('btn btn-save');
        var buttonsCnt = $('<div class="form-group"></div>').append(editButton).append(saveButton);

        textCnt.html(todo.text);

        if(todo.completed) {
            var completedAtCnt = $('<p></p>').html(todo.completedAt);    
            idCnt.html(todo._id);    
            var label = $('<label>Completed:</label>');
            var radioBtnYes = $('<span class="radio-yes"> Yes </span>').append($('<input type="radio" name="isCompleted" value="Yes"/>').prop('checked', true));
            var radioBtnNo = $('<span class="radio-no"> No </span>').append($('<input type="radio" name="isCompleted" value="No"/>'));
            var radioBtnCnt = $('<div class="form-group radio-btn"></div>').append(label).append('<br>').append(radioBtnYes).append(radioBtnNo);
    
            var todoSideBar = $('<div></div>').addClass('sideBar');
            todoSideBar.append(radioBtnCnt).append(buttonsCnt);

            todoCnt
                .append(textCnt)
                .append(idCnt)
                .append(completedAtCnt)
                .append(todoSideBar);

            completedTodosTempCnt.append(todoCnt);

        } else {
            var completedAtCnt = $('<p></p>').html(todo.completedAt);   
            idCnt.html(todo._id);         
            var label = $('<label>Completed:</label>');
            var radioBtnYes = $('<span> Yes </span>').append($('<input type="radio" name="isCompleted" value="Yes"/>'));
            var radioBtnNo = $('<span> No </span>').append($('<input type="radio" name="isCompleted" value="No"/>').prop('checked', true));
            var radioBtnCnt = $('<div class="form-group"></div>').append(label).append('<br>').append(radioBtnYes).append(radioBtnNo);
            
            var todoSideBar = $('<div></div>').addClass('sideBar');
            todoSideBar.append(radioBtnCnt).append(buttonsCnt);

            todoCnt
                .append(textCnt)
                .append(idCnt)
                .append(todoSideBar);

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