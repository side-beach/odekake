<template>
  <v-container>
    <v-row>
      <v-col v-for="(item, idx) in userdata" :key="idx">
        <UserCard :user-data="item" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    // fetch doc ID and User data on Firebase
    this.$store.dispatch('user/getData');
  },
  computed: {
    userdata: function () {
      // Creating a list of users excluding myself.
      const uid = this.$store.getters['auth/getUserUid'];
      let userList = this.$store.getters['user/getDataSet'] ?? [];
      // console.log({ userList });
      userList = userList.filter((val) => {
        return val.uid !== uid;
      });
      return userList;
    },
  },
};
</script>

<style></style>
