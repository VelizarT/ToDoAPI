
$(document).ready(function () {
    $('#current-todos').on('click', '.todo-style', function (e) {
        e.stopPropagation();
        var $this = $(this);
        console.log($this);
        // $this.removeClass('col-xl-4').addClass('col-xl-12');
        // $this.height(600);
    });

    $('#completed-todos').on('click', '.todo-style', function (e) {
        e.stopPropagation();
        var $this = $(this);
        console.log($this);
    });

    $('#current-todos').on('click', '.btn-edit', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this);
        console.log($this);

        var currentTodoTextDiv = $this.parent().parent().siblings('.todo-text');
        currentTodoTextDiv.attr('contenteditable', 'true');
        console.log(currentTodoTextDiv);
    });

    $('#current-todos').on('click', '.btn-save', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this);
        // console.log($this);
        var currentTodoId = $this.parent().parent().siblings('.id-cnt').html();
        // console.log(currentTodoId);
        var currentTodoText = $this.parent().parent().siblings('.todo-text').html();
        // console.log(currentTodoText);
        var completedYes = $this.parent().prev().children('.radio-yes').val();
        var completedNo = $this.parent().prev().children('span')[1];
        console.log(completedYes);

        // patchTodo(currentTodoId, currentTodoText, );
    });
});

