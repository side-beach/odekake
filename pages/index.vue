<template>
  <div>
    <AppBar />
    <nuxt-child />
    <app-footer />
  </div>
</template>

<script>
import AppBar from '~/components/appBar.vue';
import AppFooter from '~/components/appFooter.vue';
export default {
  name: 'IndexPage',
  components: { AppBar, AppFooter },
};
</script>
