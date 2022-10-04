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
  created() {
    // fetch doc ID and User data on Firebase
    this.$store.dispatch('user/getData');
  },
  computed: {
    userdata: function () {
      return this.$store.getters['user/getDataSet'];
    },
  },
};
</script>

<style></style>
