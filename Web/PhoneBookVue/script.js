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
    }
});

Vue.component("modal-dialog", {
    template: "#modal-dialog-template",

    props: {
        isModalDialogDeleteContactMode: {
            type: Boolean,
            require: true
        },

        dialogMessage: {
            type: String,
            require: true
        }
    },

    methods: {
        confirmToDelete: function () {
            if (this.isModalDialogDeleteContactMode) {
                this.$emit("delete-contact-confirm");
                return;
            }

            this.$emit("delete-checked-contacts-confirm");
        }
    }
});

Vue.component("phone-book", {
    template: "#phone-book-template",

    data: function () {
        return {
            contacts: [],
            filteredContacts: [],
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
            isModalDialogDeleteContactMode: false,

            dialogMessage: ""
        };
    },

    watch: {
        isCheckedAllContacts: function (newValue) {
            this.hasContactsToDelete = newValue;
        }
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
            });

            this.newId++;

            if (this.searchInputText.trim().length === 0) {
                this.filteredContacts = this.contacts;
            }

            this.clearForm();
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
            this.setContactsCheckedToDelete(false);

            var searchText = this.searchInputText.trim().toUpperCase();

            if (searchText.length === 0) {
                this.filteredContacts = this.contacts;
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

            this.isModalDialogDeleteContactMode = true;
            this.dialogMessage = "Are you sure you want to delete contact?";
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

        setIsCheckedToDelete: function (contact, value) {
            contact.isCheckedToDelete = value;
            this.isContactsCheckedToDelete();
        },

        setContactsCheckedToDelete: function (isChecked) {
            this.contacts.forEach(function (contact) {
                contact.isCheckedToDelete = isChecked;
            });
        },

        isContactsCheckedToDelete: function () {
            this.hasContactsToDelete = this.contacts.some(function (contact) {
                return contact.isCheckedToDelete === true;
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