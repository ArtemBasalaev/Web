document.addEventListener("DOMContentLoaded", function () {
    var todoList = document.getElementById("todo-list");
    var newTodoActivity = document.getElementById("new-todo-activity");
    var newTodoButton = document.getElementById("new-todo-button");

    newTodoButton.addEventListener("click", function (event) {
        var newActivityText = newTodoActivity.value.trim();

        if (newActivityText.length === 0) {
            return;
        }

        event.preventDefault();

        var todoListItem = document.createElement("li");
        todoListItem.classList.add("list-group-item");

        setViewMode();

        todoList.appendChild(todoListItem);

        newTodoActivity.value = "";

        function setViewMode() {
            todoListItem.innerHTML = "<span class='list-item-text'></span><div class='mt-2 mb-2'>\
                                      <button type='button' class='btn btn-success btn-sm edit-button'>Изменить</button>\
                                      <button type='button' class='btn btn-danger btn-sm delete-button'>Удалить</button>\</div>";

            todoListItem.querySelector(".list-item-text").textContent = newActivityText;

            todoListItem.querySelector(".delete-button").addEventListener("click", function () {
                todoListItem.remove();
            });

            todoListItem.querySelector(".edit-button").addEventListener("click", function () {
                setEditMode();
            });
        }

        function setEditMode() {
            todoListItem.innerHTML = "<form class='g-3'><input type='text' class='form-control new-activity-text' required><div class='mt-2 mb-2'>\
                                      <button type='submit' class='btn btn-success btn-sm save-button'>Сохранить</button>\
                                      <button type='button' class='btn btn-danger btn-sm cancel-button'>Отменить</button>\
                                      </div></form>";

            var updateActivityInput = todoListItem.querySelector(".new-activity-text");

            updateActivityInput.value = newActivityText;

            todoListItem.querySelector(".save-button").addEventListener("click", function (event) {
                var updateActivityText = updateActivityInput.value.trim();

                if (updateActivityText.length === 0) {
                    return;
                }

                event.preventDefault();

                newActivityText = updateActivityText;

                setViewMode();
            });

            todoListItem.querySelector(".cancel-button").addEventListener("click", function () {
                setViewMode();
            });
        }
    });
});