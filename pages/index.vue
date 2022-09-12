<template>
  <div>
    <AppBar />
    <nuxt-child />
  </div>
</template>

<script>
import AppBar from "~/components/appBar.vue";
export default {
  name: "IndexPage",
  components: { AppBar },
};
</script>
