import Vue from "vue";
import VueRouter from "vue-router";

import StartPage from "../views/StartPage.vue";
import Film from "../views/Film.vue";
import SearchResult from "../views/SearchResult";
import Favorites from "../views/Favorites";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: StartPage,
    },
    {
        path: "/film",
        name: 'Film',
        component: Film
    },
    {
        path: "/search",
        name: "SearchResult",
        component: SearchResult
    },
    {
        path: "/favorites",
        name: "Favorites",
        component: Favorites,
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;