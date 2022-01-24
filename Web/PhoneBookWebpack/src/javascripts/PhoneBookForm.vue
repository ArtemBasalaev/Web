<template>
  <div class="container" id="phone-book-form">
    <div class="row px-0 mb-3 d-flex align-items-start">
      <div class="col-md-4">
        <h2 class="display-8 my-3">Add contact</h2>
        <form novalidate :class="{ 'was-validated': isInvalid }">
          <label for="first-name" class="form-label mt-2">First name:</label>
          <input v-model="firstNameInputText" type="text" class="form-control" id="first-name" required>
          <div class="invalid-feedback">*field is empty</div>

          <label for="last-name" class="form-label mt-2">Last name:</label>
          <input v-model="lastNameInputText" type="text" class="form-control" id="last-name" required>
          <div class="invalid-feedback">*field is empty</div>

          <label for="phone" class="form-label mt-2">Phone:</label>
          <input v-model="phoneInputText" type="text" class="form-control" id="phone" required>
          <div class="invalid-feedback">*field is empty</div>

          <button type="button" class="btn btn-primary my-3" @click="createContact">Add contact</button>
          <button type="button" class="btn btn-secondary my-3" @click="clearForm">Clear</button>
          <div class="text-danger fw-bold" v-show="hasContact">Phone number already exist!</div>
        </form>
      </div>

      <div class="col-md-4">
        <h2 class="display-8 my-3">Search contact</h2>
        <form id="search-form" novalidate>
          <label for="search-contact" class="form-label mt-2">Type search request:</label>
          <input v-model="searchInputText" type="text" class="form-control" id="search-contact">
          <button @click="searchContacts" type="button" class="btn btn-primary my-3">Search</button>
          <button @click="clearSearch" type="button" class="btn btn-secondary my-3">Clear</button>
        </form>
      </div>
    </div>

    <div class="row px-0">
      <h2 class="display-8 mt-1">Contacts list</h2>
      <div class="table-responsive">
        <table class="table align-middle" id="phone-book">
          <thead class="table-light">
          <tr>
            <th class="col-1" scope="col">
              <input type="checkbox" :value="true" v-model="isCheckedAllContacts">
            </th>
            <th class="col-1" scope="col">№</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Phone</th>
            <th class="col-1" scope="col">Delete</th>
          </tr>
          </thead>
          <tbody>
          <table-row @set-contact-checked-to-delete="setIsCheckedToDelete"
                     @set-contact-to-delete="setContactToDelete"
                     v-for="(contact, index) in contacts" :key="contact.id"
                     :is-checked-all="isCheckedAllContacts"
                     :index="index"
                     :contact="contact"></table-row>
          </tbody>
        </table>
      </div>

      <div class="d-flex flex-row-reverse pe-3">
        <button type="button" class="btn btn-danger my-3" data-bs-toggle="modal" data-bs-target="#delete-confirmation"
                @click="setModalDialogDeleteContactsMode" :disabled="!hasContactsToDelete">
          Delete checked
        </button>
      </div>

      <modal-dialog :dialog-message="dialogMessage" @delete-confirm="deleteWithConfirmation"></modal-dialog>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import TableRow from "./PhoneBookTableRow.vue";
import ModalDialog from "./ModalDialog.vue";

function get(url, data) {
  return $.get({
    url,
    data
  });
}

function post(url, data) {
  return $.post({
    url,
    data: JSON.stringify(data),
    contentType: "application/json"
  });
}

export default {
  components: {
    TableRow,
    ModalDialog
  },

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
}
</script>