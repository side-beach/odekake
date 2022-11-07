<template>
  <div>
    <v-app-bar dense dark color="primary" style="z-index: 99999">
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ pageTitle }}</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group v-model="group" active-class="deep-purple--text text--accent-4">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item @click="logout()">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>ログアウト</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      group: 0,
      pageTitle: 'Home',
    };
  },
  computed: {},
  watch: {
    $route: function (to, from) {
      console.log(to.name);

      switch (to.name) {
        case 'index':
          this.pageTitle = 'ホーム';
          break;
        case 'beLiked':
          this.pageTitle = 'いいね一覧';
          break;
        case 'talk':
          this.pageTitle = 'トーク一覧';
          break;
        case 'odekake':
          this.pageTitle = 'ODEKAKE';
          break;
        case 'mypage':
          this.pageTitle = 'マイページ';
          break;
      }
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
    },
  },
};
</script>

<style></style>
