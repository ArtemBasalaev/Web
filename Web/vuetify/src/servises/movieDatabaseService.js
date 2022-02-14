import axios from "axios";

export default class MovieDatabaseService {
    requestConfig = {
        headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZWRhODU5M2Q3ZDE3ZGVjM2ZhNGZjMGE1ZWM0YjJiYyIsInN1YiI6IjYxZTdmN2MxZWEzN2UwMDA5ZTdiYzFlMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3ugc81I6vj-nkCOqDlWi22Z-ZM1J6go2NUETiLLEk7o",
            "Content-Type": "application/json;charset=utf-8"
        }
    }

    get(url) {
        return axios.get(url, this.requestConfig);
    }

    getPopularFilms(page) {
        const url = `https://api.themoviedb.org/3/movie/popular/?page=${page}`;
        return this.get(url);
    }

    getFilmDescription(filmId) {
        const url = `https://api.themoviedb.org/3/movie/${filmId}`;
        return this.get(url);
    }

    getGenres() {
        const url = `https://api.themoviedb.org/3/genre/movie/list`;
        return this.get(url);
    }

    getFilmsWithSameGenre(genreId) {
        const url = `https://api.themoviedb.org/3/${genreId}/movie/list`;
        return this.get(url);
    }

    getRecommendation(filmId) {
        const url = `https://api.themoviedb.org/3/movie/${filmId}/recommendations`;
        return this.get(url);
    }

    searchFilms(searchTerm, page) {
        const url = `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&page=${page}`;
        return this.get(url);
    }
}