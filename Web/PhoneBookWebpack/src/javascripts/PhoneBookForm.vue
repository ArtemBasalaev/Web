<template>
  <div id="phone-book-form">
    <h2 class="display-8 mt-5 mb-3">Add new contact</h2>
    <div class="row mb-3">
      <div class="col-md-4">
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
          <div class="collapse" id="collapse-message" :class="{ 'show': isContactPresent }">
            <div class="card card-body text-danger fw-bold">Phone number already exist!</div>
          </div>
        </form>
      </div>
    </div>

    <h2 class="display-8 mt-3 mb-3">Search</h2>
    <form id="search-form" class="row g-2" novalidate>
      <div class="col-auto">
        <input v-model="search" type="text" class="form-control" id="search-contact">
      </div>
      <div class="col-auto">
        <button @click="searchContacts" type="button" class="btn btn-primary">Search</button>
        <button @click="clearSearch" type="button" class="btn btn-secondary">Clear</button>
      </div>
    </form>

    <div class="container">
      <h2 class="display-8 mt-5 mb-3">Contact list</h2>
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
          <table-row @change-delete-status="changeContactDeleteStatus"
                     @save-deleted-contact="saveDeletedContact"
                     v-for="(contact, index) in contacts" :key="contact.id"
                     :isCheckedAll="isCheckedAllContacts"
                     :index="index"
                     :contact="contact"></table-row>
          </tbody>
        </table>
      </div>

      <div class="d-flex flex-row-reverse">
        <button @delete-checked-contact-confirm="deleteCheckedContacts" type="button" class="btn btn-danger mt-3"
                data-bs-toggle="modal" data-bs-target="#delete-contacts-confirmation">
          Delete checked
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import { eventBus } from "./script.js"
import TableRow from "./PhoneBookTableRow.vue"

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
  name: "phone-book-form",

  components: {
    TableRow
  },

  data() {
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

  created() {
    eventBus.$on("delete-checked-contacts-confirm", this.deleteCheckedContacts);
    eventBus.$on("delete-contact-confirm", this.deleteContact);
    this.loadContacts();
  },

  methods: {
    loadContacts() {
      get("/api/getContacts", {term: this.term})
          .done(contacts => {
            this.contacts = contacts.map(contact => {
              return {
                id: contact.id,
                firstName: contact.firstName,
                lastName: contact.lastName,
                phone: contact.phone,
                isCheckedToDelete: false
              };
            });

            this.clearForm();
            this.isCheckedAllContacts = false;
          })
          .fail(() => alert("Error load contacts"));
    },

    deleteContact() {
      post("/api/deleteContact", {id: this.contactToDelete.id})
          .done(response => {
            if (!response.success) {
              alert(response.message);
              return;
            }

            this.search = "";
            this.term = "";
            this.loadContacts();
          })
          .fail(() => alert("Error delete contact"));
    },

    saveDeletedContact(contact) {
      this.contactToDelete = contact;
    },

    changeContactDeleteStatus(contact, status) {
      contact.isCheckedToDelete = status;
    },

    deleteCheckedContacts() {
      let contactsIdToDelete = this.contacts
          .filter(contact => contact.isCheckedToDelete === true)
          .map(contact => contact.id);

      post("/api/deleteContacts", contactsIdToDelete)
          .done(response => {
            if (!response.success) {
              alert(response.message);
              return;
            }

            this.search = "";
            this.term = "";
            this.loadContacts();
          })
          .fail(() => alert("Error delete contacts"));

      this.clearSearch();
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

      post("/api/createContact", request)
          .done(response => {
            if (!response.success) {
              this.isInvalid = false;
              this.isContactPresent = true;
              return;
            }

            this.search = "";
            this.term = "";
            this.loadContacts();
          })
          .fail(() => alert("Error create contact"));
    },

    clearForm() {
      this.firstNameInputText = "";
      this.lastNameInputText = "";
      this.phoneInputText = "";

      this.isInvalid = false;
      this.isContactPresent = false;
    },

    searchContacts() {
      this.term = this.search.trim();
      this.loadContacts();
    },

    clearSearch() {
      this.search = "";
      this.term = "";
      this.loadContacts();
    },
  }
}
</script>