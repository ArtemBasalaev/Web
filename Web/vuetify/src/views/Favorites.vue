<template>
  <v-container>
    <h1 class="text-center my-4 text-h3 text-sm-h2 text-md-h2 text-lg-h3 white--text font-weight-black">My favorites</h1>

    <v-row class="mx-3" justify="center">
      <film-card v-for="film in favoritesFilms.slice(filmsCountAtPage * (page - 1), filmsCountAtPage * page)"
                 :key="film.id"
                 :film="film"></film-card>
    </v-row>

    <v-row>
      <v-col>
        <v-spacer></v-spacer>
        <v-pagination dark v-model="page" :length="length" :total-visible="15"></v-pagination>
        <v-spacer></v-spacer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FilmCard from "../components/FilmCard";

export default {
  name: "Favorites",

  created() {
    this.$emit("reset-search");
  },

  data() {
    return {
      page: 1,
      filmsCountAtPage: 8
    }
  },

  components: {
    FilmCard
  },

  computed: {
    favoritesFilms() {
      return JSON.parse(localStorage["favoritesFilms"]);
    },

    length() {
      return Math.ceil(JSON.parse(localStorage["favoritesFilms"]).length / this.filmsCountAtPage);
    }
  }
};
</script>