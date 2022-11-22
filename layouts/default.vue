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
      return this.$route.path == '/auth/login' || this.$route.path == '/auth/signup';
    },
  },
};
</script>
<style lang="scss"></style>
