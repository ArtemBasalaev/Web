<template>
    <div class="modal fade" id="delete-contacts-confirmation" data-bs-backdrop="static" data-bs-keyboard="false"
         tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm delete</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete checked contacts?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button @click="confirmToDeleteCheckedContacts" type="button" class="btn btn-danger" data-bs-dismiss="modal">Delete</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { eventBus } from "./script.js"

export default {
  name: "DeleteContactsConfirmation",

  methods: {
    confirmToDeleteCheckedContacts() {
      eventBus.$emit("delete-checked-contacts-confirm");
    }
  },
}
</script>