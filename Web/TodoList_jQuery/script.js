$(function () {
    var todoList = $("#todo-list");
    var newTodoActivity = $("#new-todo-activity");
    var newTodoButton = $("#new-todo-button");
    var newTodoForm = $("#todo-form");

    newTodoActivity.click(function () {
        newTodoForm.removeClass("was-validated");
    });

    newTodoButton.click(function () {
        var newActivityText = newTodoActivity.val().trim();

        if (newActivityText.length === 0) {
            newTodoActivity.val("")
            newTodoForm.addClass("was-validated");
            return;
        }

        var todoListItem = $("<li>");
        todoListItem.addClass("list-group-item ps-0");

        setViewMode();

        todoList.append(todoListItem);

        newTodoActivity.val("");

        function setViewMode() {
            todoListItem.html("<span class='list-item-text'></span><div class='my-2'>\
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
            todoListItem.html("<form class='g-3 needs-validation' novalidate>\
                               <input type='text' class='form-control new-activity-text' required>\
                               <div class='invalid-feedback'>*заполните поле</div><div class='my-2'>\
                               <button type='button' class='btn btn-success btn-sm save-button'>Сохранить</button>\
                               <button type='button' class='btn btn-danger btn-sm cancel-button'>Отменить</button></form>");

            var updateActivityInput = todoListItem.find(".new-activity-text");
            var listItemForm = todoListItem.find(".needs-validation");

            updateActivityInput.val(newActivityText);

            todoListItem.find(".save-button").click(function () {
                var updateActivityText = updateActivityInput.val().trim();

                if (updateActivityText.length === 0) {
                    updateActivityInput.val("");
                    listItemForm.addClass("was-validated");
                    return;
                }

                newActivityText = updateActivityText;

                setViewMode();
            });

            todoListItem.find(".cancel-button").click(function () {
                setViewMode();
            });

            updateActivityInput.click(function () {
                listItemForm.removeClass("was-validated");
            });
        }
    });
});