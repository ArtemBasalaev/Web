import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        popularFilms: [],
        currentPage: 1,

        filmDescription: null,
        moviesRecommendation: null,
        hasFilmInFavorites: false,

        genres: [],

        searchTerm: "",
        searchFilmsResult: {},
        searchResultCurrentPage: 1,

        requestConfig: {
            headers:
                {
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZWRhODU5M2Q3ZDE3ZGVjM2ZhNGZjMGE1ZWM0YjJiYyIsInN1YiI6IjYxZTdmN2MxZWEzN2UwMDA5ZTdiYzFlMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3ugc81I6vj-nkCOqDlWi22Z-ZM1J6go2NUETiLLEk7o",
                    "Content-Type": "application/json;charset=utf-8"
                }
        }
    },

    mutations: {
        setPopularFilms(state, value) {
            state.popularFilms = value;
        },

        setFilmDescription(state, value) {
            state.filmDescription = value;
        },

        hasFilmInFavorites(state, value) {
            state.hasFilmInFavorites = value;
        },

        setMovieRecommendation(state, value) {
            state.moviesRecommendation = value;
        },

        setCurrentPage(state, value) {
            state.currentPage = value;
        },

        setGeneres(state, value) {
            state.genres = value.genres;
        },

        setSearchFilmsResult(state, value) {
            state.searchFilmsResult = value;
        },

        setSearchResultCurrentPage(state, value) {
            state.searchResultCurrentPage = value;
        },

        setSearchTerm(state, value) {
            state.searchTerm = value;
        }
    },

    actions: {
        getPopularFilms(context, page) {
            context.commit("setPopularFilms", []);
            context.commit("setCurrentPage", page);

            const url = `https://api.themoviedb.org/3/movie/popular/?page=${page}`

            return axios.get(url, context.state.requestConfig)
                .then(response => {
                    context.commit("setPopularFilms", response.data);
                })
                .catch(() => {
                    alert("Popular films load fail");
                });
        },

        getFilmDescription(context, id) {
            context.commit("setFilmDescription", {});

            if (!localStorage["favoritesFilms"]) {
                context.commit("hasFilmInFavorites", false);
            } else {
                context.commit("hasFilmInFavorites", JSON.parse(localStorage["favoritesFilms"])
                    .some(filmDescription => filmDescription.id === id));
            }

            const url = `https://api.themoviedb.org/3/movie/${id}`;

            return axios.get(url, context.state.requestConfig)
                .then(response => {
                    context.commit("setFilmDescription", response.data);

                    localStorage["filmDescription"] = JSON.stringify(response.data);
                })
                .catch(() => {
                    alert("Film description load fail");
                });
        },

        getGenres(context) {
            const url = `https://api.themoviedb.org/3/genre/movie/list`;

            return axios.get(url, context.state.requestConfig)
                .then(response => {
                    context.commit("setGeneres", response.data);
                })
                .catch(() => {
                    alert("Genres load fail");
                });
        },

        getFilmsWithSameGenre(context, genreId) {
            context.commit("setFilmDescription", {});

            const url = `https://api.themoviedb.org/3/${genreId}/movie/list`;

            return axios.get(url, context.state.requestConfig)
                .then(response => {
                    context.commit("setFilmDescription", response.data);
                })
                .catch(() => {
                    alert("Films with same genre load fail");
                });
        },

        getRecommendation(context, filmId) {
            context.commit("setMovieRecommendation", []);

            const url = `https://api.themoviedb.org/3/movie/${filmId}/recommendations`;

            return axios.get(url, context.state.requestConfig)
                .then(response => {
                    context.commit("setMovieRecommendation", response.data);
                    localStorage["movieRecommendation"] = JSON.stringify(response.data);
                })
                .catch(() => {
                    alert("Recommendation load fail");
                });
        },

        searchFilms(context, page) {
            context.commit("setSearchFilmsResult", []);

            const url = `https://api.themoviedb.org/3/search/movie?query=${context.state.searchTerm}&page=${page}`;

            return axios.get(url, context.state.requestConfig)
                .then(response => {
                    context.commit("setSearchFilmsResult", response.data);
                    context.commit("setSearchResultCurrentPage", page);
                })
                .catch(() => {
                    alert("Search result load fail");
                });
        }
    }
});