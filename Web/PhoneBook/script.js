$(function () {
    var firstNameInput = $("#first-name");
    var lastNameInput = $("#last-name");
    var phoneInput = $("#phone");

    var addNewContactForm = $("#new-contact-form");
    var addNewContactButton = $("#new-contact-button");
    var resetFormButton = $("#reset-form-button");

    var contactsList = $("#contacts-list");

    var duplicateContactMessage = $("#collapse-message");

    var searchButton = $("#search-button");
    var searchInput = $("#search-contact");
    var resetSearchButton = $("#reset-search-button");

    var contactsCheckBox = $("#contacts-checkbox");

    var deleteCheckedContactsButton = $("#delete-checked-contacts-button");

    var modalDeleteButton = $("#modal-delete-button");
    var modalDialogElement = $("#delete-confirmation");
    var modalDialog = new bootstrap.Modal(modalDialogElement);
    var modalBody = $("#confirmation-text");

    var contacts = [];
    var contactsToDelete = [];
    var id = 1;

    addNewContactButton.click(function () {
        addNewContactForm.addClass("was-validated");
        duplicateContactMessage.removeClass("show");

        var firstNameText = firstNameInput.val().trim();
        var lastNameText = lastNameInput.val().trim();
        var phoneText = phoneInput.val().trim();

        if (firstNameText.length === 0 || lastNameText.length === 0 || phoneText.length === 0) {
            return;
        }

        var isContactPresent = contacts.some(function (contact) {
            return phoneText === contact.phone;
        });

        if (isContactPresent) {
            duplicateContactMessage.addClass("show");
            addNewContactForm.removeClass("was-validated");
            return;
        }

        contacts.push({
            id: id,
            firstName: firstNameText,
            lastName: lastNameText,
            phone: phoneText
        });

        id++;

        addNewContactForm.removeClass("was-validated");

        clearForm();

        contactsCheckBox.prop("checked", false);

        showPhoneBook(contacts);
    });

    resetFormButton.click(function () {
        clearForm();
        addNewContactForm.removeClass("was-validated");
        duplicateContactMessage.removeClass("show");
    });

    searchButton.click(function () {
        var searchText = $("#search-contact").val().trim().toUpperCase();

        contactsCheckBox.prop("checked", false);
        contactsToDelete = [];

        if (searchText.length === 0) {
            showPhoneBook(contacts);
            return;
        }

        var searchResult = contacts.filter(function (contact) {
            return contact.firstName.toUpperCase().includes(searchText)
                || contact.lastName.toUpperCase().includes(searchText)
                || contact.phone.toUpperCase().includes(searchText);
        });

        showPhoneBook(searchResult);
    });

    resetSearchButton.click(function () {
        searchInput.val("");
        showPhoneBook(contacts);
    });

    contactsCheckBox.click(function () {
        contactsToDelete = [];

        var contactCheckBoxes = $(".contact-checkbox");
        contactCheckBoxes.prop("checked", false);

        if (this.checked) {
            contactCheckBoxes.click();
        }
    });

    deleteCheckedContactsButton.click(function () {
        modalBody.empty();
        modalBody.html("<span>Are you sure you want to delete checked contacts?</span>");

        modalDeleteButton.click(function () {
            modalDialog.hide();

            if (searchInput.val().trim().length !== 0) {
                searchInput.val("");
            }

            if (contactsToDelete.length === 0) {
                showPhoneBook(contacts);
                return;
            }

            contactsCheckBox.prop("checked", false);

            deleteContacts(contactsToDelete);

            contactsToDelete = [];

            showPhoneBook(contacts);
        });
    });

    modalDialogElement.on("hidden.bs.modal", function () {
        modalDeleteButton.off();
    })

    function clearForm() {
        firstNameInput.val("");
        lastNameInput.val("");
        phoneInput.val("");
    }

    function showPhoneBook(phoneBookContacts) {
        contactsList.find("tr").remove();

        if (phoneBookContacts.length === 0) {
            return;
        }

        phoneBookContacts.forEach(function (contact, index) {
            var newRow = $("<tr>");

            var checkBox = $("<input>")
                .attr("type", "checkbox")
                .addClass("contact-checkbox");

            checkBox.change(function () {
                if (this.checked) {
                    contactsToDelete.push(contact);
                    return;
                }

                contactsToDelete = _.without(contactsToDelete, contact);

                contactsCheckBox.prop("checked", false);
            });

            $("<td>")
                .append(checkBox)
                .appendTo(newRow);

            $("<td>")
                .text(index + 1)
                .appendTo(newRow);

            $("<td>")
                .text(contact.firstName)
                .appendTo(newRow);

            $("<td>")
                .text(contact.lastName)
                .appendTo(newRow);

            $("<td>")
                .text(contact.phone)
                .appendTo(newRow);

            $("<td>")
                .html("<button type='button' class='btn btn-danger delete-contact-button'\
                        data-bs-toggle='modal' data-bs-target='#delete-confirmation'>Delete</button>")
                .appendTo(newRow);

            newRow.find(".delete-contact-button").click(function () {
                modalBody.empty();
                modalBody.html("<span>Are you sure you want to delete this contact?</span>");

                $(".contact-checkbox").prop("checked", false);
                contactsCheckBox.prop("checked", false);
                contactsToDelete = [];

                searchInput.val("");

                modalDeleteButton.click(function () {
                    deleteContact(contact);
                    modalDialog.hide();

                    showPhoneBook(contacts);
                });
            });

            newRow.appendTo(contactsList);
        });
    }

    function deleteContacts(contactsToDelete) {
        contacts = _.difference(contacts, contactsToDelete);
    }

    function deleteContact(contact) {
        contacts = _.without(contacts, contact);
    }
});