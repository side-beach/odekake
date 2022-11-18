<template>
  <v-container>
    <v-list subheader>
      <v-subheader>トーク一覧</v-subheader>

      <v-list-item
        v-for="(user, idx) in userList"
        :key="idx"
        class="talk-item"
        @click="go2chat(user.uid)"
      >
        <v-list-item-avatar>
          <v-img :src="user.profImgUrl[0]"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ user.nickName }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
export default {
  middleware: 'noDirectAccess',
  name: 'IndexPage',
  created() {
    this.$store.dispatch('user/matchedUsers');
  },
  computed: {
    userList: function () {
      return this.$store.getters['user/matchedUsers'];
    },
  },
  methods: {
    go2chat(id) {
      this.$router.push('/talk/' + id);
    },
  },
};
</script>
<style lang="scss">
.talk-item {
  cursor: pointer;
}
</style>
