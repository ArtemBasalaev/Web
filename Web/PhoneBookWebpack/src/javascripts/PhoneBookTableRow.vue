<template>
  <tr>
    <td>
      <input type="checkbox" :value="true" v-model="isChecked" @change="setContactCheckedToDelete">
    </td>
    <td v-text="index + 1"></td>
    <td v-text="contact.firstName"></td>
    <td v-text="contact.lastName"></td>
    <td v-text="contact.phone"></td>
    <td>
      <button @click="setContactToDelete" type="button" class="btn btn-danger" data-bs-toggle="modal"
              data-bs-target="#delete-confirmation">
        Delete
      </button>
    </td>
  </tr>
</template>

<script>
export default {
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
  },
}
</script>
