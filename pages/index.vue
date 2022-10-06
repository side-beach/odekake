<template>
  <div>
    <AppBar />
    <MainPage />
    <AppFooter />
  </div>
</template>

<script>
import AppBar from '~/components/appBar.vue';
import AppFooter from '~/components/appFooter.vue';
import MainPage from '~/components/mainPage.vue';

export default {
  name: 'IndexPage',
  components: { AppBar, AppFooter, MainPage },
};
</script>
<style lang="scss">
html,
body {
  font-family: 'Zen Kaku Gothic New', sans-serif;
  font-weight: 400;
}
</style>
