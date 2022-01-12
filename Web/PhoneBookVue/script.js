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
            newId: 1,

            firstNameInputText: "",
            lastNameInputText: "",
            phoneInputText: "",

            search: "",
            isSearching: false,
            searchResult: [],

            isInvalid: false,
            isContactPresent: false,
            isCheckedAllContacts: false,
        };
    },

    template: "#phone-book-template",

    created() {
        eventBus.$on("delete-checked-contacts-confirm", this.deleteCheckedContacts);
        eventBus.$on("delete-contact-confirm", this.deleteContact);
    },

    methods: {
        addContact: function () {
            var firstNameText = this.firstNameInputText.trim();
            var lastNameText = this.lastNameInputText.trim();
            var phoneText = this.phoneInputText.trim();

            if (firstNameText.length === 0 || lastNameText.length === 0 || phoneText.length === 0) {
                this.isInvalid = true;
                return;
            }

            this.isContactPresent = this.contacts.some(function (contact) {
                return phoneText === contact.phone;
            });

            if (this.isContactPresent) {
                return;
            }

            this.contacts.push({
                id: this.newId,
                firstName: firstNameText,
                lastName: lastNameText,
                phone: phoneText,
                isCheckedToDelete: false
            })

            this.newId++;

            this.clearForm();
            this.clearSearch();
            this.isCheckedAllContacts = false;
        },

        clearForm: function () {
            this.firstNameInputText = "";
            this.lastNameInputText = "";
            this.phoneInputText = "";

            this.isInvalid = false;
            this.isContactPresent = false;
        },

        searchContacts: function () {
            this.isCheckedAllContacts = false;
            this.changeContactsDeleteStatus(this.contacts, false);

            var searchText = this.search.trim().toUpperCase();

            if (searchText.length === 0) {
                this.isSearching = false;
                return;
            }

            this.searchResult = this.contacts.filter(function (contact) {
                return contact.firstName.toUpperCase().includes(searchText)
                    || contact.lastName.toUpperCase().includes(searchText)
                    || contact.phone.toUpperCase().includes(searchText);
            });

            this.isSearching = true;
        },

        clearSearch: function () {
            this.search = "";
            this.isSearching = false;
            this.searchResult = [];

            this.isCheckedAllContacts = false;
        },

        saveDeletedContact: function (contact) {
            this.contactToDelete = contact;
        },

        deleteContact: function () {
            this.contacts = _.without(this.contacts, this.contactToDelete);
            this.clearSearch();
        },

        deleteCheckedContacts: function () {
            this.contacts = this.contacts.filter(function (contact) {
                return contact.isCheckedToDelete === false;
            });

            this.clearSearch();
        },

        changeContactDeleteStatus: function (contact, status) {
            contact.isCheckedToDelete = status;
        },

        changeContactsDeleteStatus: function (contacts, isChecked) {
            contacts.forEach(function (contact) {
                contact.isCheckedToDelete = isChecked;
            });
        }
    }
});

new Vue({
    el: "#app"
});