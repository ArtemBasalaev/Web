$(function () {
    var todoList = $("#todo-list");
    var newTodoActivity = $("#new-todo-activity");
    var newTodoButton = $("#new-todo-button");

    newTodoButton.click(function (event) {
        var newActivityText = newTodoActivity.val().trim();

        if (newActivityText.length === 0) {
            return;
        }

        event.preventDefault();

        var todoListItem = $("<li>");
        todoListItem.addClass("list-group-item");

        setViewMode();

        todoList.append(todoListItem);

        newTodoActivity.val("");

        function setViewMode() {
            todoListItem.html("<span class='list-item-text'></span><div class='mt-2 mb-2'>\
                               <button type='button' class='btn btn-success btn-sm edit-button'>Изменить</button>\
                               <button type='button' class='btn btn-danger btn-sm delete-button'>Удалить</button>\</div>");

            todoListItem.find(".list-item-text").text(newActivityText);

            todoListItem.find(".delete-button").click(function () {
                todoListItem.remove();
            });

            todoListItem.find(".edit-button").click(function () {
                setEditMode();
            });
        }

        function setEditMode() {
            todoListItem.html("<form class='g-3'><input type='text' class='form-control new-activity-text' required><div class='mt-2 mb-2'>\
                               <button type='submit' class='btn btn-success btn-sm save-button'>Сохранить</button>\
                               <button type='button' class='btn btn-danger btn-sm cancel-button'>Отменить</button>\
                               </div></form>");

            var updateActivityInput = todoListItem.find(".new-activity-text");

            updateActivityInput.val(newActivityText);

            todoListItem.find(".save-button").click(function (event) {
                var updateActivityText = updateActivityInput.val().trim();

                if (updateActivityText.length === 0) {
                    return;
                }

                event.preventDefault();

                newActivityText = updateActivityText;

                setViewMode();
            });

            todoListItem.find(".cancel-button").click(function () {
                setViewMode();
            });
        }
    });
});