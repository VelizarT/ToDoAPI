
$(document).ready(function () {
    $('#current-todos').on('click', '.todo-text', function (e) {
        e.stopPropagation();
        var $this = $(this);
        // console.log($this);
        // $this.removeClass('col-xl-4').addClass('col-xl-12');
        // $this.height(600);
        // var currentTodoEditMode = $this.parent();
        // currentTodoEditMode.removeClass('col-xl-4').addClass('.center');
        // currentTodoEditMode.height(700);    
        // $('#edit-mode-cnt').append(currentTodoEditMode);
        
    });

    $('#completed-todos').on('click', '.todo-text', function (e) {
        e.stopPropagation();
        var $this = $(this);
        // console.log($this);
    });

    $('#current-todos, #completed-todos').on('click', '.btn-edit', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this);
        // console.log($this);

        var currentTodoTextDiv = $this.parent().parent().siblings('.todo-text');
        currentTodoTextDiv.attr('contenteditable', 'true');
        // console.log(currentTodoTextDiv);
    });

    $('#current-todos, #completed-todos').on('click', '.btn-save', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this);
        // console.log($this);
        var currentTodoId = $this.parent().parent().siblings('.id-cnt').html();
        var currentTodoText = $this.parent().parent().siblings('.todo-text').html();
        var isCompleted = ($this.parent().prev().children('input[type=checkbox]:checked').val()) === 'Yes';

        alert(isCompleted);
        patchTodo(currentTodoId, currentTodoText, isCompleted).then(function (response) {
            alert(JSON.stringify(response));
            location.reload();
        });
    });
});

