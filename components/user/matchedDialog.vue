<template>
  <v-container>
    <!-- <v-dialog v-model="isMatched"> -->

    <v-dialog v-model="isMatched" overlay-opacity="0.9" overlay-color="#FFF">
      <h1 v-if="isVisible" id="title">MATCHED!!</h1>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return { isVisible: true };
  },
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
    this.isVisible = true;
  },
};
</script>

<style lang="scss" scoped>
#title {
  font-family: 'Carter One';
  text-align: center;
  background-color: transparent;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
