import "bootstrap/dist/js/bootstrap.bundle";
import Vue from "vue";

import "bootstrap/dist/css/bootstrap.css";
import "../stylesheets/style.scss";

import PhoneBook from "./PhoneBook.vue";

export const eventBus = new Vue();

new Vue({
    render(h) {
        return h(PhoneBook);
    },
}).$mount("#app")