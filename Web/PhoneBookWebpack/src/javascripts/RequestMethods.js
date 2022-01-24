import $ from "jquery";

export default class RequestMethods {
    constructor(apiUrls) {
        this.apiUrls = apiUrls;
    }

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
        return this.get(this.apiUrls.getContactsUrl, term);
    }

    createContact(contact) {
        return this.post(this.apiUrls.createContactUrl, contact);
    }

    deleteContact(contactId) {
        return this.post(this.apiUrls.deleteContactUrl, contactId);
    }

    deleteContacts(contactsId) {
        return this.post(this.apiUrls.deleteContactsUrl, contactsId);
    }
};