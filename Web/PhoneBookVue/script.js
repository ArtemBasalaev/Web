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

            this.changeContactsDeleteStatus(this.contacts, false);
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
            this.changeContactsDeleteStatus(this.contacts, false);
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
            this.changeContactsDeleteStatus(this.contacts, false);
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

        addContactToDeleteList: function (contact) {
            contact.isCheckedToDelete = true;
        },

        removeContactFromDeleteList: function (contact) {
            contact.isCheckedToDelete = false;

            if (this.isSomeContactChecked(this.contacts)) {
                this.isCheckedAllContacts = false;
            }
        },

        changeTableHeadCheckBox: function () {
            if (this.isSearching) {
                if (this.isSomeContactChecked(this.searchResult)) {
                    return;
                }

                if (this.isCheckedAllContacts) {
                    this.changeContactsDeleteStatus(this.searchResult, true);
                    return;
                }

                this.changeContactsDeleteStatus(this.searchResult, false);
                return;
            }

            if (this.isCheckedAllContacts) {
                this.changeContactsDeleteStatus(this.contacts, true);
                return;
            }

            this.changeContactsDeleteStatus(this.contacts, false);
        },

        changeContactsDeleteStatus: function (contacts, isChecked) {
            contacts.forEach(function (contact) {
                contact.isCheckedToDelete = isChecked;
            });
        },

        isSomeContactChecked: function (contacts) {
            return contacts.some(function (contact) {
                return contact.isCheckedToDelete === true;
            });
        }
    }
});

new Vue({
    el: "#app"
});