<template>
  <v-card class="mx-auto" max-width="200">
    <v-img class="white--text align-end" :src="userData.profImgUrl[0]">
      <v-card-title
        ><span class="mr-3">{{ userData.nickName }}</span> <span>{{ age }}</span></v-card-title
      >
    </v-img>
  </v-card>
</template>

<script>
export default {
  props: {
    userData: Object,
  },
  data() {
    return {};
  },
  computed: {
    age() {
      const today = new Date();
      //今年の誕生日
      var thisYearsBirthday = new Date(
        today.getFullYear(),
        this.userData.birthDay.month - 1,
        this.userData.birthDay.day
      );
      //年齢
      var age = today.getFullYear() - this.userData.birthDay.year;
      if (today < thisYearsBirthday) {
        //今年まだ誕生日が来ていない
        age--;
      }
      return age;
    },
  },
};
</script>

<style></style>
