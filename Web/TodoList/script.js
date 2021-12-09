document.addEventListener("DOMContentLoaded", function () {
    var todoList = document.getElementById("todo-list");
    var newTodoActivity = document.getElementById("new-todo-activity");
    var newTodoButton = document.getElementById("new-todo-button");
    var newTodoError = document.getElementById("new-todo-error");

    newTodoButton.addEventListener("click", function () {
        var newActivityText = newTodoActivity.value.trim();

        newTodoError.style.display = "none";

        if (newActivityText.length === 0) {
            newTodoError.style.display = "block";
            return;
        }

        var todoListItem = document.createElement("li");
        todoListItem.classList.add("list-group-item");

        setViewMode();

        todoList.appendChild(todoListItem);

        newTodoActivity.value = "";

        function setViewMode() {
            todoListItem.innerHTML = "<span class='list-item-text'></span>\
                                      <div class='mt-2 mb-2'><button type='button' class='btn btn-success btn-sm edit-button'>Изменить</button>\
                                      <button type='button' class='btn btn-danger btn-sm delete-button'>Удалить</button></div>";

            todoListItem.querySelector(".list-item-text").textContent = newActivityText;

            todoListItem.querySelector(".delete-button").addEventListener("click", function () {
                todoListItem.remove();
            });

            todoListItem.querySelector(".edit-button").addEventListener("click", function () {
                setEditMode();
            });
        }

        function setEditMode() {
            todoListItem.innerHTML = "<input class='form-control new-activity-text'>\
                                      <div class='mt-2 mb-2'><button type='button' class='btn btn-success btn-sm save-button'>Сохранить</button>\
                                      <button type='button' class='btn btn-danger btn-sm cancel-button'>Отменить</button></div>";

            var updateActivityInput = todoListItem.querySelector(".new-activity-text");

            updateActivityInput.onblur = function () {
                if (newActivityText === updateActivityInput.value) {
                    setViewMode();
                    return;
                }

                alert("Сохраните введенные данные: " + updateActivityInput.value);
            }

            updateActivityInput.value = newActivityText;

            todoListItem.querySelector(".save-button").addEventListener("click", function () {
                var updateActivityText = updateActivityInput.value.trim();

                if (updateActivityText.length === 0) {
                    return;
                }

                newActivityText = updateActivityText;

                setViewMode();
            });

            todoListItem.querySelector(".cancel-button").addEventListener("click", function () {
                setViewMode();
            });
        }
    });
});