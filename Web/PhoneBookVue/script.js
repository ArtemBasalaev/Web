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
            isChecked: false
        };
    },

    methods: {
        setContactToDelete: function () {
            this.$emit("set-contact-to-delete", this.contact);
        },

        setContactDeleteStatus: function () {
            this.$emit("set-contact-delete-status", this.contact, this.isChecked);
        }
    },

    watch: {
        isCheckedAll: function (newValue) {
            this.isChecked = newValue;
            this.setContactDeleteStatus();
        }
    },

    template: "#phone-book-row"
});

Vue.component("modal-dialog-contacts-delete", {
    props: {
        hasContactsToDelete: {
            type: Boolean,
            required: true
        }
    },

    methods: {
        confirmToDeleteCheckedContacts: function () {
            this.$emit("delete-checked-contacts-confirm");
        }
    },

    template: "#modal-dialog-contacts-delete-template"
});

Vue.component("modal-dialog-contact-delete", {
    methods: {
        confirmToDeleteContact: function () {
            this.$emit("delete-contact-confirm");
        }
    },

    template: "#modal-dialog-contact-delete-template"
});


Vue.component("phone-book", {
    data: function () {
        return {
            contacts: [],
            filteredContacts: this.contacts,
            contactToDelete: {},

            newId: 1,

            firstNameInputText: "",
            lastNameInputText: "",
            phoneInputText: "",
            searchInputText: "",

            hasContactsToDelete: false,
            isInvalid: false,
            hasContact: false,
            isCheckedAllContacts: false,
        };
    },

    template: "#phone-book-template",

    methods: {
        addContact: function () {
            var firstNameText = this.firstNameInputText.trim();
            var lastNameText = this.lastNameInputText.trim();
            var phoneText = this.phoneInputText.trim();

            if (firstNameText.length === 0 || lastNameText.length === 0 || phoneText.length === 0) {
                this.isInvalid = true;
                return;
            }

            this.hasContact = this.contacts.some(function (contact) {
                return phoneText === contact.phone;
            });

            if (this.hasContact) {
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
        },

        clearForm: function () {
            this.firstNameInputText = "";
            this.lastNameInputText = "";
            this.phoneInputText = "";

            this.isInvalid = false;
            this.hasContact = false;
        },

        searchContacts: function () {
            this.isCheckedAllContacts = false;
            this.hasContactsToDelete = false;
            this.setContactsDeleteStatus(false);

            var searchText = this.searchInputText.trim().toUpperCase();

            if (searchText.length === 0) {
                return;
            }

            this.filteredContacts = this.contacts.filter(function (contact) {
                return contact.firstName.toUpperCase().includes(searchText)
                    || contact.lastName.toUpperCase().includes(searchText)
                    || contact.phone.toUpperCase().includes(searchText);
            });
        },

        clearSearch: function () {
            this.searchInputText = "";
            this.filteredContacts = this.contacts;

            this.isCheckedAllContacts = false;
        },

        setContactToDelete: function (contact) {
            this.contactToDelete = contact;
        },

        deleteContact: function () {
            var self = this;

            this.contacts = this.contacts.filter(function (contact) {
                return contact !== self.contactToDelete;
            });

            this.clearSearch();
        },

        deleteCheckedContacts: function () {
            this.contacts = this.contacts.filter(function (contact) {
                return contact.isCheckedToDelete === false;
            });

            this.clearSearch();
            this.hasContactsToDelete = false;
        },

        setContactDeleteStatus: function (contact, status) {
            contact.isCheckedToDelete = status;
        },

        setContactsDeleteStatus: function (isChecked) {
            this.contacts.forEach(function (contact) {
                contact.isCheckedToDelete = isChecked;
            });
        },

        checkContactsDeleteStatus: function () {
            this.hasContactsToDelete = this.contacts.some(function (contact) {
                return contact.isCheckedToDelete === true;
            })
        }
    }
});

new Vue({
    el: "#app"
});