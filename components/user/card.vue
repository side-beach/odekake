<template>
  <v-card>
    <v-card-title>{{ userdata }}</v-card-title>
    <h1>aaaaaaaaaaaa</h1>
  </v-card>
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
      return this.$store.getters['userData'];
    },
  },
};
</script>

<style></style>
