<template>
  <v-container>
    <v-row class="my-6 justify-center">
      <v-col sm="10" md="5" lg="5" xl="4" class="justify-center">
        <v-card elevation="22" class="rounded-xl" dark>
          <v-img :src="posterPath"></v-img>
        </v-card>
      </v-col>

      <v-col sm="10" md="6" lg="6" xl="4" class="my-1">
        <h3 class="ml-2 mb-3 text-h3 text-md-h4 text-lg-h4 white--text font-weight-black">
          {{ filmDescription.title }}
        </h3>

        <v-simple-table dark class="grey darken-4">
          <template v-slot:default>
            <tbody>
            <tr>
              <td class="font-weight-black">Release date</td>
              <td>{{ filmDescription.release_date }}</td>
            </tr>
            <tr>
              <td class="font-weight-black">Vote average</td>
              <td>
                <v-rating
                    color="red"
                    half-increments
                    hover
                    length="10"
                    readonly
                    size="15"
                    :value="filmDescription.vote_average"
                ></v-rating>
              </td>
            </tr>
            <tr>
              <td class="font-weight-black">Vote count</td>
              <td>{{ filmDescription.vote_count }}</td>
            </tr>
            <tr>
              <td class="font-weight-black">Overview</td>
              <td>{{ filmDescription.overview }}</td>
            </tr>
            <tr>
              <td class="font-weight-black">Status</td>
              <td>{{ filmDescription.status }}</td>
            </tr>
            <tr>
              <td class="font-weight-black">Production companies</td>
              <td>
                <div v-for="(company, index) in filmDescription.production_companies" :key="index"
                     v-text="company.name"></div>
              </td>
            </tr>
            <tr>
              <td class="font-weight-black">Country</td>
              <td>
                <div v-for="(country, index) in filmDescription.production_countries" :key="index"
                     v-text="country.name"></div>
              </td>
            </tr>
            <tr>
              <td class="font-weight-black">Languages</td>
              <td>
                <div v-for="(spokenLanguage, index) in filmDescription.spoken_languages" :key="index"
                     v-text="spokenLanguage.name"></div>
              </td>
            </tr>
            <tr>
              <td class="font-weight-black">Home page</td>
              <td><a :href="filmDescription.homepage">{{ filmDescription.homepage }}</a></td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>

        <h3 class="ml-2 mt-10 text-h4 white--text font-weight-black">
          Favorites:

          <v-btn icon dark v-if="!inFavorites" @click="addToFavorites">
            <v-icon large>mdi-heart</v-icon>
          </v-btn>

          <v-btn icon color="red" dark v-else @click="removeFromFavorites">
            <v-icon large>mdi-heart</v-icon>
          </v-btn>
        </h3>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <h3 class="text-center text-h3 text-md-h4 text-lg-h4 white--text font-weight-black">Recommendation:</h3>
      </v-col>
    </v-row>

    <v-row class="justify-center">
      <v-slide-group dark class="pa-4 " active-class="success" show-arrows>
        <v-slide-item v-for="film in moviesRecommendationList" :key="film.id">
          <router-link :to="{name: 'Film'}" class="text-decoration-none">
            <v-card dark class="grey darken-4 ma-2" width="200" flat @click="getFilmDescription(film.id)">
              <v-img class="rounded-xl" :src="'https://image.tmdb.org/t/p/w500' + film.poster_path"></v-img>
              <h3 class="ml-2 mb-4 subtitle-1 font-weight-bold white--text">{{ film.title }}</h3>
            </v-card>
          </router-link>
        </v-slide-item>
      </v-slide-group>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Film",

  created() {
    this.$emit("reset-search");
  },

  data() {
    return {
      inFavorites: this.$store.state.hasFilmInFavorites
    };
  },

  watch: {
    filmDescription() {
      this.inFavorites = this.$store.state.hasFilmInFavorites;
    }
  },

  computed: {
    filmDescription() {
      if (this.$store.state.filmDescription === null) {
        this.$store.commit("setFilmDescription", JSON.parse(localStorage["filmDescription"]));
      }

      return this.$store.state.filmDescription;
    },

    moviesRecommendationList() {
      if (this.$store.state.moviesRecommendation === null) {
        this.$store.commit("setMovieRecommendation", JSON.parse(localStorage["movieRecommendation"]));
      }

      return this.$store.state.moviesRecommendation.results;
    },

    posterPath() {
      return this.filmDescription.poster_path === null ? require("../images/no_poster.jpg")
          : "https://image.tmdb.org/t/p/w500" + this.filmDescription.poster_path;
    }
  },

  methods: {
    getFilmDescription(id) {
      this.$store.dispatch("getFilmDescription", id);
      this.$store.dispatch("getRecommendation", id);
    },

    addToFavorites() {
      if (!localStorage["favoritesFilms"]) {
        localStorage["favoritesFilms"] = "[]";
      }

      let favoritesFilms = JSON.parse(localStorage["favoritesFilms"]);
      favoritesFilms.push(this.filmDescription);
      localStorage["favoritesFilms"] = JSON.stringify(favoritesFilms);

      this.inFavorites = true;
    },

    removeFromFavorites() {
      if (!localStorage["favoritesFilms"]) {
        return;
      }

      let favoritesFilms = JSON.parse(localStorage["favoritesFilms"]);
      favoritesFilms = favoritesFilms.filter(filmDescription => filmDescription.id !== this.filmDescription.id);
      localStorage["favoritesFilms"] = JSON.stringify(favoritesFilms);

      this.inFavorites = false;
    }
  }
};
</script>