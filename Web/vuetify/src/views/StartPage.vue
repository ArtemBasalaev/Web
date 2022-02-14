<template>
  <v-container>
    <h1 class="text-center my-4 text-h3 text-sm-h2 text-md-h2 text-lg-h3 white--text font-weight-black">Top rated films</h1>

    <v-row class="mx-3" justify="center">
      <film-card v-for="film in popularFilms"
                 :key="film.id"
                 :film="film"></film-card>
    </v-row>

    <v-row>
      <v-col>
        <v-spacer></v-spacer>
        <v-pagination dark v-model="page" :length="500" :total-visible="15"></v-pagination>
        <v-spacer></v-spacer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FilmCard from "../components/FilmCard";

export default {
  name: "StartPage",

  components: {
    FilmCard
  },

  created() {
    const pageFromUrl = Number(this.$route.params.page);

    if (pageFromUrl) {
      this.$store.dispatch("getPopularFilms", pageFromUrl);
      this.page = pageFromUrl;
    } else {
      this.$router.push({name: "Home", params: {page: "1"}});
      this.$store.dispatch("getPopularFilms", this.$store.state.currentPage);
    }

    if (this.$store.state.genres.length === 0) {
      this.$store.dispatch("getGenres");
    }

    this.$emit("reset-search");
  },

  data() {
    return {
      page: this.$store.state.currentPage
    };
  },

  watch: {
    page(newValue) {
      this.$store.dispatch("getPopularFilms", newValue);
      this.$router.push({name: "Home", params: {page: newValue}});
    },

    popularFilms() {
      this.page = this.$store.state.currentPage;
    }
  },

  computed: {
    popularFilms() {
      return this.$store.state.popularFilms.results;
    }
  }
};
</script>