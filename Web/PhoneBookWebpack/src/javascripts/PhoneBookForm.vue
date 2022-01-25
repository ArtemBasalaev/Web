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
        <button type="button" class="btn btn-danger my-3" data-bs-toggle="modal" data-bs-target="#modal-dialog"
                @click="setModalDialogDeleteContactsMode" :disabled="!hasContactsToDelete">
          Delete checked
        </button>
      </div>

      <modal-dialog :dialog-message="dialogMessage" @confirm="deleteWithConfirmation"></modal-dialog>
    </div>
  </div>
</template>

<script>
import TableRow from "./PhoneBookTableRow.vue";
import ModalDialog from "./ModalDialog.vue";
import PhoneBookService from "./phoneBookService";

export default {
  components: {
    TableRow,
    ModalDialog
  },

  data() {
    return {
      phoneBookService: new PhoneBookService(),

      contacts: [],
      contactToDelete: {},

      firstNameInputText: "",
      lastNameInputText: "",
      phoneInputText: "",

      searchInputText: "",
      term: "",

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
    isCheckedAllContacts(newValue) {
      this.setContactsCheckedToDelete(newValue);
      this.isContactsCheckedToDelete();
    }
  },

  methods: {
    loadContacts() {
      this.contacts = [];
      this.isCheckedAllContacts = false;
      this.hasContactsToDelete = false;

      this.phoneBookService.getContacts({term: this.term})
          .done(contacts => {
            this.contacts = contacts.map(contact => {
              return {
                id: contact.id,
                firstName: contact.firstName,
                lastName: contact.lastName,
                phone: contact.phone,
                isChecked: false
              };
            });
          })
          .fail(() => alert("Error load contacts"));
    },

    createContact() {
      let firstNameText = this.firstNameInputText.trim();
      let lastNameText = this.lastNameInputText.trim();
      let phoneText = this.phoneInputText.trim();

      if (firstNameText.length === 0 || lastNameText.length === 0 || phoneText.length === 0) {
        this.isInvalid = true;
        return;
      }

      let request = {
        firstName: firstNameText,
        lastName: lastNameText,
        phone: phoneText
      };

      this.phoneBookService.createContact(request)
          .done(response => {
            if (!response.success) {
              this.isInvalid = false;
              this.hasContact = true;
              return;
            }

            this.clearForm();
            this.loadContacts();
          })
          .fail(() => alert("Error create contact"));
    },

    clearForm() {
      this.firstNameInputText = "";
      this.lastNameInputText = "";
      this.phoneInputText = "";

      this.isInvalid = false;
      this.hasContact = false;
    },

    searchContacts() {
      this.term = this.searchInputText.trim();
      this.loadContacts();
    },

    clearSearch() {
      this.searchInputText = "";
      this.term = "";

      this.loadContacts();
    },

    setContactToDelete(contact) {
      this.contactToDelete = contact;

      this.isModalDialogDeleteContactMode = true;
      this.dialogMessage = "Are you sure you want to delete contact?";
    },

    deleteWithConfirmation() {
      if (this.isModalDialogDeleteContactMode) {
        this.deleteContact();
        return;
      }

      this.deleteCheckedContacts();
    },

    deleteContact() {
      this.phoneBookService.deleteContact({id: this.contactToDelete.id})
          .done(response => {
            if (!response.success) {
              alert(response.message);
              return;
            }

            this.clearSearch();
          })
          .fail(() => alert("Error delete contact"));
    },

    deleteCheckedContacts() {
      let contactsIdsToDelete = this.contacts.filter(contact => {
        return contact.isChecked === true;
      }).map(contact => {
        return contact.id;
      });

      this.phoneBookService.deleteContacts(contactsIdsToDelete)
          .done(response => {
            if (!response.success) {
              alert(response.message);
              return;
            }

            this.clearSearch();
          })
          .fail(() => alert("Error delete contacts"));
    },

    setIsCheckedToDelete(contact, value) {
      contact.isChecked = value;
      this.isContactsCheckedToDelete();
    },

    isContactsCheckedToDelete() {
      this.hasContactsToDelete = this.contacts.some(contact => contact.isChecked === true);
    },

    setContactsCheckedToDelete(isChecked) {
      this.contacts.forEach(contact => contact.isChecked = isChecked);
    },

    setModalDialogDeleteContactsMode() {
      this.isModalDialogDeleteContactMode = false;
      this.dialogMessage = "Are you sure you want to delete checked contacts?";
    }
  }
};
</script>