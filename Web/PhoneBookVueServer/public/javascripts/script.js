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

var eventBus = new Vue();

Vue.component("table-row", {
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
            isCheckedToDelete: false
        };
    },

    methods: {
        saveDeleteContact: function () {
            this.$emit("save-deleted-contact", this.contact);
        },

        changeContactDeleteStatus: function () {
            this.$emit("change-delete-status", this.contact, this.isCheckedToDelete);
        }
    },

    watch: {
        isCheckedAll: function (newValue) {
            this.isCheckedToDelete = newValue;
            this.changeContactDeleteStatus();
        }
    },

    template: "#phone-book-row"
});

Vue.component("modal-dialog-contacts-delete", {
    methods: {
        confirmToDeleteCheckedContacts: function () {
            eventBus.$emit("delete-checked-contacts-confirm");
        }
    },

    template: "#modal-dialog-contacts-delete-template"
});

Vue.component("modal-dialog-contact-delete", {
    methods: {
        confirmToDeleteContact: function () {
            eventBus.$emit("delete-contact-confirm");
        }
    },

    template: "#modal-dialog-contact-delete-template"
});


Vue.component("phone-book", {
    data: function () {
        return {
            contacts: [],
            contactToDelete: {},

            firstNameInputText: "",
            lastNameInputText: "",
            phoneInputText: "",

            search: "",
            therm: "",

            isInvalid: false,
            isContactPresent: false,
            isCheckedAllContacts: false,
        };
    },

    template: "#phone-book-template",

    created() {
        eventBus.$on("delete-checked-contacts-confirm", this.deleteCheckedContacts);
        eventBus.$on("delete-contact-confirm", this.deleteContact);
        this.loadContacts();
    },

    methods: {
        loadContacts: function () {
            var self = this;

            get("/api/getContacts", {term: this.term})
                .done(function (contacts) {
                    self.contacts = contacts.map(function (contact) {
                        return {
                            id: contact.id,
                            firstName: contact.firstName,
                            lastName: contact.lastName,
                            phone: contact.phone,
                            isCheckedToDelete: false
                        };
                    });

                    self.clearForm();
                    self.isCheckedAllContacts = false;
                })
                .fail(function () {
                    alert("Error load contacts");
                });
        },

        deleteContact: function () {
            var self = this;

            post("/api/deleteContact", {id: self.contactToDelete.id})
                .done(function (response) {
                    if (!response.success) {
                        alert(response.message);
                        return;
                    }

                    self.search = "";
                    self.term = "";
                    self.loadContacts();
                })
                .fail(function () {
                    alert("Error delete contact");
                });
        },

        saveDeletedContact: function (contact) {
            this.contactToDelete = contact;
        },

        changeContactDeleteStatus: function (contact, status) {
            contact.isCheckedToDelete = status;
        },

        deleteCheckedContacts: function () {
            var contactsIdToDelete = this.contacts.filter(function (contact) {
                return contact.isCheckedToDelete === true;
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

                    self.search = "";
                    self.term = "";
                    self.loadContacts();
                })
                .fail(function () {
                    alert("Error delete contacts")
                });

            this.clearSearch();
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
                        self.isContactPresent = true;
                        return;
                    }

                    self.search = "";
                    self.term = "";
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
            this.isContactPresent = false;
        },

        searchContacts: function () {
            this.term = this.search.trim();
            this.loadContacts();
        },

        clearSearch: function () {
            this.search = "";
            this.term = "";
            this.loadContacts();
        }
    }
});

new Vue({
    el: "#app"
});