<template>
  <v-footer fixed>
    <v-row no-gutter>
      <v-col
        v-for="(menu, objkey, idx) in menus"
        :key="idx"
        class="footer-btn"
        @click="go2(menu.path)"
      >
        <v-badge :content="menu.badge" :value="menu.badge" color="red" overlap>
          <v-icon color="primary">{{ menu.icon }}</v-icon>
        </v-badge>
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
          badge: 0,
        },
        likes: {
          path: '/beLiked',
          icon: 'mdi-thumb-up-outline',
          title: 'いいね',
          badge: 0,
        },
        talk: {
          path: '/talk',
          icon: 'mdi-chat-processing-outline',
          title: 'トーク',
          badge: 0,
        },
        mypage: {
          path: '/mypage',
          icon: 'mdi-account-circle-outline',
          title: 'マイページ',
          badge: 0,
        },
      },
    };
  },
  mounted() {
    // UIDの取得を確認してからライク数を反映
    this.$store.subscribe((mutation, state) => {
      // console.log(mutation.type);
      if (mutation.type == 'auth/setUserUid') {
        // console.log(state.auth.userUid);
        const uid = state.auth.userUid;
        this.$store.dispatch('user/getPersonalData', uid).then(() => {
          const userData = this.$store.getters['user/personalData'];
          let likedCount = 0;
          for (let i of userData.beLiked) {
            if (!userData.matched.includes(i)) {
              likedCount++;
            }
          }
          this.menus.likes.badge = likedCount;
        });
      }
    });
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
