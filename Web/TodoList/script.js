document.addEventListener("DOMContentLoaded", function () {
    var todoList = document.getElementById("todo-list");
    var newTodoActivity = document.getElementById("new-todo-activity");
    var newTodoButton = document.getElementById("new-todo-button");
    var newTodoForm = document.getElementById("todo-form");

    newTodoActivity.addEventListener("click", (function () {
        newTodoForm.classList.remove("was-validated");
    }));

    newTodoButton.addEventListener("click", function () {
        var newActivityText = newTodoActivity.value.trim();

        if (newActivityText.length === 0) {
            newTodoActivity.value = "";
            newTodoForm.classList.add("was-validated");
            return;
        }

        var todoListItem = document.createElement("li");
        todoListItem.classList.add("list-group-item", "ps-0");

        setViewMode();

        todoList.appendChild(todoListItem);

        newTodoActivity.value = "";

        function setViewMode() {
            todoListItem.innerHTML = "<span class='list-item-text'></span><div class='my-2'>\
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
            todoListItem.innerHTML = "<form class='g-3 needs-validation' novalidate>\
                                      <input type='text' class='form-control new-activity-text' required>\
                                      <div class='invalid-feedback'>*заполните поле</div><div class='my-2'>\
                                      <button type='button' class='btn btn-success btn-sm save-button'>Сохранить</button>\
                                      <button type='button' class='btn btn-danger btn-sm cancel-button'>Отменить</button></form>";

            var updateActivityInput = todoListItem.querySelector(".new-activity-text");
            var listItemForm = todoListItem.querySelector(".needs-validation");

            updateActivityInput.value = newActivityText;

            todoListItem.querySelector(".save-button").addEventListener("click", function () {
                var updateActivityText = updateActivityInput.value.trim();

                if (updateActivityText.length === 0) {
                    updateActivityInput.value = "";
                    listItemForm.classList.add("was-validated");
                    return;
                }

                newActivityText = updateActivityText;

                setViewMode();
            });

            todoListItem.querySelector(".cancel-button").addEventListener("click", function () {
                setViewMode();
            });

            updateActivityInput.addEventListener("click", (function () {
                listItemForm.classList.remove("was-validated");
            }));
        }
    });
});