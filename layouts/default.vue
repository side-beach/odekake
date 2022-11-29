<template>
  <v-app>
    <AppBar v-if="!isSignInPage" />
    <v-main>
      <Nuxt />
    </v-main>
    <AppFooter v-if="!isSignInPage" />
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  computed: {
    isSignInPage() {
      return this.$route.path.match(/\/auth\//);
    },
  },
};
</script>
<style lang="scss"></style>
