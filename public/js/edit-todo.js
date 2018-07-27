
$(document).ready(function () {

    $('#current-todos, #completed-todos').on('click', '.btn-edit', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this);

        


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
        var currentTodoText = $this.parent().parent().siblings('.text-title-cnt').children('.todo-text').html();
        var isCompleted = ($this.parent().prev().children('input[type=checkbox]:checked').val()) === 'Yes';

        patchTodo(currentTodoId, currentTodoText, isCompleted).then(function (response) {
            location.reload();
        });
    });
});

