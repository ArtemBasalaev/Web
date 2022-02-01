<template>
  <v-col sm="10" md="6" lg="3" xl="2">
    <router-link :to="{name: 'Film'}" class="text-decoration-none">
      <v-card dark class="grey darken-4" @click="getFilmDescription" flat>
        <v-img alt="no picture" class="rounded-xl mb-3" :src="posterPath"></v-img>
        <h3 class="ml-2 mb-3 text-h3 text-md-h4 text-lg-h5 white--text font-weight-black">{{ film.title }}</h3>
        <v-chip-group active-class="primary--text" column>
          <v-chip v-for="genre in film.genres" :key="genre.id">{{ genre.name }}</v-chip>
        </v-chip-group>
      </v-card>
    </router-link>
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

  computed: {
    posterPath() {
      return this.film.poster_path === null ? "https://loghorizont.ru/wp-content/uploads/2021/06/cover.jpg"
          : ("https://image.tmdb.org/t/p/w500" + this.film.poster_path);
    }
  },

  methods: {
    getFilmDescription() {
      this.$store.dispatch("loadFilmDescription", this.film.id);
      this.$store.dispatch("getRecommendation", this.film.id);
    }
  }
};
</script>