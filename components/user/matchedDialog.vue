<template>
  <v-container>
    <v-dialog v-model="isMatched" overlay-opacity="0.9" overlay-color="#FFF">
      <h1 id="title" class="secondary--text">MATCHED!!</h1>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  computed: {
    isMatched: {
      get() {
        return this.$store.getters['user/isMatched'];
      },
      set(newValue) {
        this.$store.commit('user/setIsMatched', newValue);
      },
    },
  },
  watch: {},
  created() {
    this.isMatched = false;
  },
};
</script>

<style lang="scss" scoped>
#title {
  font-family: 'Lobster' !important;
  font-size: 3rem;
  text-align: center;
  background-color: transparent;
}
</style>
