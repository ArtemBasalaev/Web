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
        }
    },

    methods: {
        saveDeleteContact: function () {
            this.$emit("save-deleted-contact", this.contact);
        },

        addContactToDelete: function () {
            if (this.contact.isCheckedToDelete) {
                this.$emit("add-contact-to-delete-list", this.contact);
                return;
            }

            this.$emit("remove-contact-from-delete-list", this.contact);
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
            contactsToDelete: [],
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
        },

        clearForm: function () {
            this.firstNameInputText = "";
            this.lastNameInputText = "";
            this.phoneInputText = "";

            this.isInvalid = false;
            this.isContactPresent = false;
        },

        searchContacts: function () {
            this.contactsToDelete = [];

            this.changeContactsDeleteStatus(false);
            this.isCheckedAllContacts = false;

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
            this.changeContactsDeleteStatus(false);
        },

        saveDeletedContact: function (contact) {
            this.contactToDelete = contact;
        },

        deleteContact: function () {
            this.contacts = _.without(this.contacts, this.contactToDelete);

            this.contactsToDelete = [];
            this.clearSearch();
        },

        deleteCheckedContacts: function () {
            if (this.isCheckedAllContacts) {
                this.contactsToDelete = this.contacts.filter(function (contact) {
                    return contact.isCheckedToDelete === true;
                });
            }

            if (this.contactsToDelete.length === 0 || this.contacts.length === 0) {
                this.clearSearch();
                return;
            }

            this.contacts = _.difference(this.contacts, this.contactsToDelete);
            this.contactsToDelete = [];

            this.clearSearch();
        },

        addContactToDeleteList: function (contact) {
            this.contactsToDelete.push(contact);
        },

        removeContactFromDeleteList: function (contact) {
            this.contactsToDelete = _.without(this.contactsToDelete, contact);
        },

        changeTableHeadCheckBox: function () {
            if (this.isSearching) {
                if (this.isCheckedAllContacts) {
                    this.changeSearchedContactsDeleteStatus(true);
                    return;
                }

                this.changeSearchedContactsDeleteStatus(false);
                return;
            }

            if (this.isCheckedAllContacts) {
                this.changeContactsDeleteStatus(true);
                return;
            }

            this.changeContactsDeleteStatus(false);
        },

        changeContactsDeleteStatus: function (isChecked) {
            this.contacts.forEach(function (contact) {
                contact.isCheckedToDelete = isChecked;
            });
        },

        changeSearchedContactsDeleteStatus: function (isChecked) {
            this.searchResult.forEach(function (contact) {
                contact.isCheckedToDelete = isChecked;
            });
        }
    }
});

new Vue({
    el: "#app"
});