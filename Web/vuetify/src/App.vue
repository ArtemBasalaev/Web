<template>
  <v-app id="inspire">
    <v-app-bar app height="75" class="red darken-4" shaped dark elevation="24">
      <v-app-bar-title>
        <router-link :to="{name: 'Home'}" class="text-decoration-none white--text">
          <v-icon @click="resetStartPage" large>mdi-domain</v-icon>
        </router-link>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-app-bar-title>
        <router-link :to="{name: 'Favorites'}" class="text-decoration-none white--text">
          <v-icon large>mdi-heart</v-icon>
        </router-link>
      </v-app-bar-title>

      <v-text-field
          v-model="searchText"
          ref="searchText"
          hide-details
          placeholder="Search"
          rounded
          height="40"
          class="shrink mx-4 grey darken-4">
      </v-text-field>

      <router-link :to="{name: 'SearchResult'}" class="text-decoration-none">
        <v-btn icon @click="searchFilms">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </router-link>
    </v-app-bar>

    <v-main class="grey darken-4">
      <router-view @reset-search="resetInput"></router-view>
    </v-main>

    <v-footer dark padless>
      <v-card class="flex" flat tile>
        <v-card-title class="teal">
          <strong class="subheading">WORK WITH TMDB API</strong>
          <v-spacer></v-spacer>
        </v-card-title>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      searchText: ""
    };
  },

  methods: {
    searchFilms() {
      if (this.searchText.trim().length === 0) {
        this.$store.commit("setSearchFilmsResult", []);
        return;
      }

      this.$store.commit("setSearchTerm", this.searchText.trim());
      this.$store.dispatch("searchFilms", 1);
    },

    resetInput() {
      this.$store.commit("setSearchTerm", "");
      this.searchText = "";
    },

    resetStartPage(){
      this.$store.dispatch("loadPopularFilms", 1);
    }
  }
}
</script>