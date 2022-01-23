function get(url, data) {
    return $.get({
        url: url,
        data: data
    });
}

function post(url, data) {
    return $.post({
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json"
    });
}

Vue.component("table-row", {
    template: "#phone-book-row",

    props: {
        contact: {
            type: Object,
            required: true
        },

        index: {
            type: Number,
            required: true
        },

        isCheckedAll: {
            type: Boolean,
            required: true
        }
    },

    data: function () {
        return {
            isChecked: false
        };
    },

    methods: {
        setContactToDelete: function () {
            this.$emit("set-contact-to-delete", this.contact);
        },

        setContactCheckedToDelete: function () {
            this.$emit("set-contact-checked-to-delete", this.contact, this.isChecked);
        }
    },

    watch: {
        isCheckedAll: function (newValue) {
            this.isChecked = newValue;
            this.setContactCheckedToDelete();
        }
    },
});

Vue.component("modal-dialog", {
    template: "#modal-dialog-template",

    props: {
        dialogMessage: {
            type: String,
            required: true
        }
    },

    methods: {
        confirmToDelete: function () {
            this.$emit("delete-confirm");
        }
    }
});

Vue.component("phone-book", {
    template: "#phone-book-template",

    data: function () {
        return {
            contacts: [],
            contactToDelete: {},

            firstNameInputText: "",
            lastNameInputText: "",
            phoneInputText: "",

            searchInputText: "",
            therm: "",

            hasContactsToDelete: false,
            isInvalid: false,
            hasContact: false,
            isCheckedAllContacts: false,
            isModalDialogDeleteContactMode: false,

            dialogMessage: ""
        };
    },

    created() {
        this.loadContacts();
    },

    watch: {
        isCheckedAllContacts: function (newValue) {
            this.setContactsCheckedToDelete(newValue);
            this.isContactsCheckedToDelete();
        }
    },

    methods: {
        loadContacts: function () {
            this.contacts = [];
            this.isCheckedAllContacts = false;
            this.hasContactsToDelete = false;

            var self = this;

            get("/api/getContacts", {term: this.term})
                .done(function (contacts) {
                    self.contacts = contacts.map(function (contact) {
                        return {
                            id: contact.id,
                            firstName: contact.firstName,
                            lastName: contact.lastName,
                            phone: contact.phone,
                            isChecked: false
                        };
                    });
                })
                .fail(function () {
                    alert("Error load contacts");
                });
        },

        createContact: function () {
            var firstNameText = this.firstNameInputText.trim();
            var lastNameText = this.lastNameInputText.trim();
            var phoneText = this.phoneInputText.trim();

            if (firstNameText.length === 0 || lastNameText.length === 0 || phoneText.length === 0) {
                this.isInvalid = true;
                return;
            }

            var request = {
                firstName: firstNameText,
                lastName: lastNameText,
                phone: phoneText
            };

            var self = this;

            post("/api/createContact", request)
                .done(function (response) {
                    if (!response.success) {
                        self.isInvalid = false;
                        self.hasContact = true;
                        return;
                    }

                    self.clearForm();
                    self.loadContacts();
                })
                .fail(function () {
                    alert("Error create contact");
                });
        },

        clearForm: function () {
            this.firstNameInputText = "";
            this.lastNameInputText = "";
            this.phoneInputText = "";

            this.isInvalid = false;
            this.hasContact = false;
        },

        searchContacts: function () {
            this.term = this.searchInputText.trim();
            this.loadContacts();
        },

        clearSearch: function () {
            this.searchInputText = "";
            this.term = "";

            this.loadContacts();
        },

        setContactToDelete: function (contact) {
            this.contactToDelete = contact;

            this.isModalDialogDeleteContactMode = true;
            this.dialogMessage = "Are you sure you want to delete contact?";
        },

        deleteWithConfirmation: function () {
            if (this.isModalDialogDeleteContactMode) {
                this.deleteContact();
                return;
            }

            this.deleteCheckedContacts();
        },

        deleteContact: function () {
            var self = this;

            post("/api/deleteContact", {id: self.contactToDelete.id})
                .done(function (response) {
                    if (!response.success) {
                        alert(response.message);
                        return;
                    }

                    self.clearSearch();
                })
                .fail(function () {
                    alert("Error delete contact");
                });
        },

        deleteCheckedContacts: function () {
            var contactsIdToDelete = this.contacts.filter(function (contact) {
                return contact.isChecked === true;
            }).map(function (contact) {
                return contact.id;
            });

            var self = this;

            post("/api/deleteContacts", contactsIdToDelete)
                .done(function (response) {
                    if (!response.success) {
                        alert(response.message);
                        return;
                    }

                    self.clearSearch();
                })
                .fail(function () {
                    alert("Error delete contacts")
                });
        },

        setIsCheckedToDelete: function (contact, value) {
            contact.isChecked = value;
            this.isContactsCheckedToDelete();
        },

        isContactsCheckedToDelete: function () {
            this.hasContactsToDelete = this.contacts.some(function (contact) {
                return contact.isChecked === true;
            });
        },

        setContactsCheckedToDelete: function (isChecked) {
            this.contacts.forEach(function (contact) {
                contact.isChecked = isChecked;
            });
        },

        setModalDialogDeleteContactsMode: function () {
            this.isModalDialogDeleteContactMode = false;
            this.dialogMessage = "Are you sure you want to delete checked contacts?";
        }
    }
});

new Vue({
    el: "#app"
});