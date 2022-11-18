<template>
  <v-container>
    <v-row justify="start" style="height: 600px">
      <v-col xs="6" v-for="(item, idx) in userdata" :key="idx">
        <UserCard :user-data="item" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  middleware: 'noDirectAccess',
  created() {
    // fetch doc ID and User data on Firebase
    this.$store.dispatch('user/getData');
  },
  computed: {
    userdata: function () {
      // Creating a list of users excluding myself.
      const uid = this.$store.getters['auth/getUserUid'];
      let userList = this.$store.getters['user/getDataSet'] ?? [];
      // 相手のいいねしたリストに自分がいて、かつ未だマッチングしていないユーザー
      userList = userList.filter((val) => {
        return val.liked.some((val) => val == uid) && !val.matched.some((val) => val == uid);
      });

      return userList;
    },
  },
};
</script>

<style></style>
