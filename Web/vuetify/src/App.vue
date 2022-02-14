<template>
  <v-app id="inspire">
    <v-app-bar app height="75" class="red darken-4" shaped dark elevation="24">
      <v-app-bar-title>
        <router-link :to="{name: 'Home'}" class="text-decoration-none white--text">
          <v-icon title="Redirect to start page" @click="redirectToStartPage" large>mdi-domain</v-icon>
        </router-link>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-app-bar-title>
        <router-link :to="{name: 'Favorites'}" class="text-decoration-none white--text">
          <v-icon class="py-2" title="Favorites" large>mdi-heart</v-icon>
        </router-link>
      </v-app-bar-title>

      <v-text-field
          v-model="searchText"
          hide-details
          placeholder="Search"
          rounded
          height="40"
          class="shrink mx-4 grey darken-4">
      </v-text-field>

      <router-link :to="{name: 'SearchResult'}" class="text-decoration-none">
        <v-btn icon @click="searchFilms">
          <v-icon title="Search films">mdi-magnify</v-icon>
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

    <v-dialog v-model="dialog" width="500" @click:outside="resetError">
      <v-card dark class="rounded-xl">
        <v-card-title class="red darken-4 text-h5">ERROR</v-card-title>
        <v-card-text class="text-h5 ps-5 pt-5 pb-0" v-text="errorMessage"></v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn text color="error" @click="resetError">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  created() {
    const pageFromUrl = Number(this.$route.params.page);

    if (!pageFromUrl) {
      this.$router.push({name: "Home", params: {page: "1"}});
    }
  },

  data() {
    return {
      searchText: "",
      dialog: false
    };
  },

  computed: {
    errorMessage() {
      return this.$store.state.errorMessage;
    }
  },

  watch: {
    errorMessage(newValue) {
      this.dialog = newValue;
    }
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

    resetError() {
      this.$store.commit("setErrorMessage", "");
    },

    redirectToStartPage() {
      this.$store.dispatch("getPopularFilms", 1);
      this.$router.push({name: "Home", params: {page: '1'}});
    }
  }
};
</script>