<template>
  <v-col sm="10" md="6" lg="3" xl="2">
    <router-link :to="{name: 'Film'}" class="text-decoration-none">
      <v-card dark class="grey darken-4" @click="getFilmDescription" flat>
        <v-img alt="no picture" class="rounded-xl mb-3" :src="posterPath"></v-img>
        <h3 class="ml-2 mb-3 text-h3 text-md-h4 text-lg-h5 white--text font-weight-black">{{ film.title }}</h3>
      </v-card>
    </router-link>

    <v-chip-group dark active-class="grey darken-4 primary--text" column>
      <v-chip disabled v-for="genre in genres" :key="genre">{{ genre }}</v-chip>
    </v-chip-group>

    <v-btn icon dark v-if="!inFavorites" @click="addToFavorites">
      <v-icon title="Add to favorites" large>mdi-heart</v-icon>
    </v-btn>

    <v-btn icon color="red" dark v-else @click="removeFromFavorites">
      <v-icon title="Remove from favorites" large>mdi-heart</v-icon>
    </v-btn>
  </v-col>
</template>

<script>
export default {
  name: "FilmCard",

  props: {
    film: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      inFavorites: this.hasFilmInFavorites()
    };
  },

  computed: {
    genres() {
      if (this.film.genres) {
        return this.film.genres.map(genre => genre.name);
      }

      return this.$store.state.genres.filter(genre => this.film.genre_ids.some(id => genre.id === id))
          .map(genre => genre.name);
    },

    posterPath() {
      return this.film.poster_path === null ? require("../images/no_poster.jpg")
          : "https://image.tmdb.org/t/p/w500" + this.film.poster_path;
    }
  },

  methods: {
    getFilmDescription() {
      this.$store.dispatch("getFilmDescription", this.film.id);
      this.$store.dispatch("getRecommendation", this.film.id);
    },

    addToFavorites() {
      if (!localStorage.getItem("favoritesFilms")) {
        localStorage.setItem("favoritesFilms", "[]");
      }

      let favoritesFilms = JSON.parse(localStorage.getItem("favoritesFilms"));
      favoritesFilms.push(this.film);
      localStorage.setItem("favoritesFilms", JSON.stringify(favoritesFilms));

      this.inFavorites = true;
    },

    removeFromFavorites() {
      if (!localStorage.getItem("favoritesFilms")) {
        return;
      }

      let favoritesFilms = JSON.parse(localStorage.getItem("favoritesFilms"));
      favoritesFilms = favoritesFilms.filter(filmDescription => filmDescription.id !== this.film.id);
      localStorage.setItem("favoritesFilms", JSON.stringify(favoritesFilms));

      this.inFavorites = false;
    },

    hasFilmInFavorites() {
      if (!localStorage.getItem("favoritesFilms")) {
        return false;
      }

      return JSON.parse(localStorage.getItem("favoritesFilms"))
          .some(filmDescription => filmDescription.id === this.film.id);
    }
  }
};
</script>