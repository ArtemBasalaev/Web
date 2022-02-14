import Vue from "vue";
import Vuex from "vuex";
import MovieDatabaseService from "../servises/movieDatabaseService";

Vue.use(Vuex);

const movieDatabaseService = new MovieDatabaseService();

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

        errorMessage: ""
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

        setGenres(state, value) {
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
        },

        setErrorMessage(state, value) {
            state.errorMessage = value;
        }
    },

    actions: {
        getPopularFilms({commit}, page) {
            commit("setPopularFilms", []);
            commit("setCurrentPage", page);

            return movieDatabaseService.getPopularFilms(page)
                .then(response => {
                    commit("setPopularFilms", response.data);
                })
                .catch(() => {
                    commit("setErrorMessage", "Popular films load fail");
                });
        },

        getFilmDescription({commit}, filmId) {
            commit("setFilmDescription", {});

            if (!localStorage.getItem("favoritesFilms")) {
                commit("hasFilmInFavorites", false);
            } else {
                commit("hasFilmInFavorites", JSON.parse(localStorage.getItem("favoritesFilms"))
                    .some(filmDescription => filmDescription.id === filmId));
            }

            return movieDatabaseService.getFilmDescription(filmId)
                .then(response => {
                    commit("setFilmDescription", response.data);
                    localStorage.setItem("filmDescription", JSON.stringify(response.data));
                })
                .catch(() => {
                    commit("setErrorMessage", "Film description load fail");
                });
        },

        getGenres({commit}) {
            return movieDatabaseService.getGenres()
                .then(response => {
                    commit("setGenres", response.data);
                })
                .catch(() => {
                    commit("setErrorMessage", "Genres load fail");
                });
        },

        getFilmsWithSameGenre({commit}, genreId) {
            commit("setFilmDescription", {});

            return movieDatabaseService.getFilmsWithSameGenre(genreId)
                .then(response => {
                    commit("setFilmDescription", response.data);
                })
                .catch(() => {
                    commit("setErrorMessage", "Films with same genre load fail");
                });
        },

        getRecommendation({commit}, filmId) {
            commit("setMovieRecommendation", []);

            return movieDatabaseService.getRecommendation(filmId)
                .then(response => {
                    commit("setMovieRecommendation", response.data);
                    localStorage.setItem("movieRecommendation", JSON.stringify(response.data));
                })
                .catch(() => {
                    commit("setErrorMessage", "Recommendation load fail");
                });
        },

        searchFilms({commit}, page) {
            commit("setSearchFilmsResult", []);

            return movieDatabaseService.searchFilms(this.state.searchTerm, page)
                .then(response => {
                    commit("setSearchFilmsResult", response.data);
                    commit("setSearchResultCurrentPage", page);
                })
                .catch(() => {
                    commit("setErrorMessage", "Search result load fail");
                });
        }
    }
});