import "bootstrap/dist/js/bootstrap.bundle";
import Vue from "vue";

import "bootstrap/dist/css/bootstrap.css";
import "../stylesheets/style.scss";

import PhoneBook from "./PhoneBook.vue";

new Vue({
    render: h => h(PhoneBook)
}).$mount("#app");