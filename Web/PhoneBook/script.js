$(function () {
    var firstNameInput = $("#first-name");
    var lastNameInput = $("#last-name");
    var phoneInput = $("#phone");

    var addNewContactForm = $("#new-contact-form");
    var addNewContactButton = $("#new-contact-button");
    var resetFormButton = $("#reset-form-button");

    var phoneBookTable = $("#phone-book");

    var duplicateContactMessage = $("#collapse-message");

    var searchButton = $("#search-button");
    var searchInput = $("#search-contact");
    var resetSearchButton = $("#reset-search-button");

    var contactsCheckBox = $("#contacts-checkbox");

    var deleteCheckedContactsButton = $("#delete-checked-contacts-button");

    var phoneBook = [];
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

        var isContactPresent = phoneBook.some(function (contact) {
            return phoneText === contact.phone;
        })

        if (isContactPresent) {
            duplicateContactMessage.addClass("show");
            addNewContactForm.removeClass("was-validated");
            return;
        }

        phoneBook.push({
            id: id,
            firstName: firstNameText,
            lastName: lastNameText,
            phone: phoneText
        })

        id++;

        addNewContactForm.removeClass("was-validated");

        clearForm();

        contactsCheckBox.prop("checked", false);

        showPhoneBook(phoneBook);
    });

    resetFormButton.click(function () {
        clearForm();
        addNewContactForm.removeClass("was-validated");
        duplicateContactMessage.removeClass("show");
    });

    searchButton.click(function () {
        var searchText = $("#search-contact").val().trim().toUpperCase();

        if (searchText.length === 0) {
            return;
        }

        var searchResult = phoneBook.filter(function (contact) {
            return contact.firstName.toUpperCase().includes(searchText)
                || contact.lastName.toUpperCase().includes(searchText)
                || contact.phone.toUpperCase().includes(searchText);
        });

        showPhoneBook(searchResult);

        contactsCheckBox.prop("checked", false);
    });

    resetSearchButton.click(function () {
        searchInput.val("");
        showPhoneBook(phoneBook);
    });

    contactsCheckBox.click(function () {
        contactsToDelete = [];

        var contactCheckBoxes = $(".contact-checkbox");

        if (this.checked) {
            contactCheckBoxes
                .prop("checked", false)
                .click();

            return;
        }

        contactCheckBoxes.prop("checked", false);
    });

    deleteCheckedContactsButton.click(function () {
        $("#modal-delete-contacts-button").click(function () {
            if (contactsToDelete.length === 0) {
                return;
            }

            contactsCheckBox.prop("checked", false);

            deleteContacts(contactsToDelete);

            contactsToDelete = [];

            if (searchInput.val().trim().length !== 0) {
                searchInput.val("")
            }

            showPhoneBook(phoneBook);
        });
    });

    function clearForm() {
        firstNameInput.val("");
        lastNameInput.val("");
        phoneInput.val("");
    }

    function showPhoneBook(contacts) {
        phoneBookTable.find("tbody").remove();

        if (contacts.length === 0) {
            return;
        }

        $("<tbody>").appendTo(phoneBookTable);

        contacts.forEach(function (contact, index) {
            var newRow = $("<tr>")
                .attr("scope", "row");

            var checkBox = $("<input>")
                .attr("type", "checkbox")
                .addClass("contact-checkbox")

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
                .appendTo(newRow)

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
                        data-bs-toggle='modal' data-bs-target='#delete-contact-confirmation'>delete</button>")
                .appendTo(newRow);

            newRow.find(".delete-contact-button").click(function () {
                $("#modal-delete-contact-button").click(function () {
                    deleteContact(contact);
                    contactsToDelete = [];

                    showPhoneBook(phoneBook);
                    contactsCheckBox.prop("checked", false);
                    searchInput.val("");
                });
            });

            newRow.appendTo($("tbody"));
        });
    }

    function deleteContacts(contacts) {
        phoneBook = _.difference(phoneBook, contacts);
    }

    function deleteContact(contact) {
        phoneBook = _.without(phoneBook, contact);
    }
});