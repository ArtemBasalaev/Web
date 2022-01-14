<template>
  <tr id="table-row">
    <td>
      <input type="checkbox" :value="true" v-model="isCheckedToDelete" @change="changeContactDeleteStatus">
    </td>
    <td v-text="index + 1"></td>
    <td v-text="contact.firstName"></td>
    <td v-text="contact.lastName"></td>
    <td v-text="contact.phone"></td>
    <td>
      <button @click="saveDeleteContact" type="button" class="btn btn-danger" data-bs-toggle="modal"
              data-bs-target="#delete-contact-confirmation">
        Delete
      </button>
    </td>
  </tr>
</template>

<script>
export default {
  name: "table-row",

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

  data() {
    return {
      isCheckedToDelete: false
    };
  },

  methods: {
    saveDeleteContact() {
      this.$emit("save-deleted-contact", this.contact);
    },

    changeContactDeleteStatus() {
      this.$emit("change-delete-status", this.contact, this.isCheckedToDelete);
    }
  },

  watch: {
    isCheckedAll(newValue) {
      this.isCheckedToDelete = newValue;
      this.changeContactDeleteStatus();
    }
  },
}
</script>
