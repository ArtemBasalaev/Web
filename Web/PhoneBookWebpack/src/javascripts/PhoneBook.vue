<template>
  <div v-cloak id="app">
    <phone-book-form></phone-book-form>
    <contact-delete-modal-dialog></contact-delete-modal-dialog>
    <contacts-delete-modal-dialog></contacts-delete-modal-dialog>
  </div>
</template>

<script>
import PhoneBookForm from "./PhoneBookForm.vue";
import ContactDeleteModalDialog from "./ContactDeleteModalDialog.vue";
import ContactsDeleteModalDialog from "./ContactsDeleteModalDialog.vue";

export default {
  name: "app",

  components: {
    PhoneBookForm,
    ContactDeleteModalDialog,
    ContactsDeleteModalDialog
  }
}
</script>