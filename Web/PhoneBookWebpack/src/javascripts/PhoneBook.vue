<template>
  <div v-cloak id="app">
    <phone-book-form></phone-book-form>
  </div>
</template>

<script>
import PhoneBookForm from "./PhoneBookForm.vue";

export default {
  components: {
    PhoneBookForm,
  }
};
</script>