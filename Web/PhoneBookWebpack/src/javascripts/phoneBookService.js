import $ from "jquery";

export default class PhoneBookService {
    get(url, data) {
        return $.get({
            url,
            data
        });
    }

    post(url, data) {
        return $.post({
            url,
            data: JSON.stringify(data),
            contentType: "application/json"
        });
    }

    getContacts(term) {
        return this.get("/api/getContacts", term);
    }

    createContact(contact) {
        return this.post("/api/createContact", contact);
    }

    deleteContact(contactId) {
        return this.post("/api/deleteContact", contactId);
    }

    deleteContacts(contactsIds) {
        return this.post("/api/deleteContacts", contactsIds);
    }
};