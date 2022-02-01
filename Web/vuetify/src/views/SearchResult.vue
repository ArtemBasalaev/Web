<template>
  <v-container>
    <h1 class="text-center my-4 text-h3 text-sm-h2 text-md-h2 text-lg-h3 white--text font-weight-black">Search films</h1>

    <v-row class="mx-3" justify="center">
      <film-card v-for="film in searchFilmsResult.results"
                 :key="film.id"
                 :film="film"></film-card>
    </v-row>

    <v-row>
      <v-col>
        <v-spacer></v-spacer>
        <v-pagination dark v-model="page" :length="pagesCount" :total-visible="15"
        ></v-pagination>
        <v-spacer></v-spacer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FilmCard from "../components/FilmCard";

export default {
  name: "SearchResult",

  components: {
    FilmCard
  },

  data() {
    return {
      page: 1
    }
  },

  watch: {
    page(newValue) {
      this.$store.dispatch("searchFilms", newValue);
    },

    searchFilmsResult() {
      this.page = this.$store.state.searchResultCurrentPage;
    }
  },

  computed: {
    searchFilmsResult() {
      return this.$store.state.searchFilmsResult;
    },

    pagesCount() {
      return this.searchFilmsResult.total_pages
    }
  }
};
</script>