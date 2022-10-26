<template>
  <v-footer fixed>
    <v-row no-gutter>
      <v-col
        v-for="(menu, objkey, idx) in menus"
        :key="idx"
        class="footer-btn"
        @click="go2(menu.path)"
      >
        <v-icon color="primary">{{ menu.icon }}</v-icon>
        <div class="primary--text">{{ menu.title }}</div>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      menus: {
        search: {
          path: '/',
          icon: 'mdi-account-search-outline',
          title: 'さがす',
        },
        likes: {
          path: '/like',
          icon: 'mdi-thumb-up-outline',
          title: 'いいね',
        },
        talk: {
          path: '/talk',
          icon: 'mdi-chat-processing-outline',
          title: 'トーク',
        },
        odekake: {
          path: '/odekake',
          icon: 'mdi-plus-circle-outline',
          title: 'おでかけ作成',
        },
        mypage: {
          path: '/mypage',
          icon: 'mdi-account-circle-outline',
          title: 'マイページ',
        },
      },
    };
  },
  methods: {
    go2(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style lang="scss">
.footer-btn {
  cursor: pointer;
  text-align: center;
  > div:nth-last-child(1) {
    font-size: 10px;
  }
}
</style>
