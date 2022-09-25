<template>
  <v-card>
    <v-card-title :user-info="{ name: 'aaa' }">aaaa</v-card-title>
  </v-card>
</template>

<script>
export default {
  props: {
    userInfo: Object,
  },
  data() {
    return {};
  },
};
</script>

<style></style>
