Vue.component("todo-list-item", {
    props: {
        item: {
            type: Object,
            required: true
        },
    },

    data: function () {
        return {
            editingText: "",
            isEditing: false,
            isInvalid: false
        };
    },

    template: "#todo-list-item-template",

    methods: {
        editItem: function () {
            this.isEditing = true;
            this.editingText = this.item.text;
        },

        saveItem: function () {
            this.isInvalid = false;

            var newText = this.editingText;

            if (newText.trim().length === 0) {
                this.isInvalid = true;
                return;
            }

            this.$emit("save-item", this.item, this.editingText)
            this.isEditing = false;
        },

        deleteItem: function () {
            this.$emit("delete-item", this.item);
        }
    },

    watch: {
        editingText: function (newValue) {
            if (newValue.length > 0) {
                this.isInvalid = false;
            }
        }
    }
});

Vue.component("todo-list", {
    data: function () {
        return {
            items: [],
            newTodoText: "",
            isNewTodoTextInvalid: false,
            newId: 1
        };
    },

    template: "#todo-list-template",

    methods: {
        addNewTodoItem: function () {
            var text = this.newTodoText;

            if (text.trim().length === 0) {
                this.isNewTodoTextInvalid = true;
                return;
            }

            this.items.push({
                id: this.newId,
                text: text,
            });

            this.newTodoText = "";
            this.newId++;
        },

        deleteItem: function (item) {
            this.items = this.items.filter(function (e) {
                return e !== item;
            });
        },

        saveItem: function (item, newText) {
            item.text = newText;
        }
    },

    watch: {
        newTodoText: function (newValue) {
            if (newValue.length > 0) {
                this.isNewTodoTextInvalid = false;
            }
        }
    }
});

new Vue({
    el: "#app"
});