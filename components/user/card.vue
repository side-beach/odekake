<template>
  <v-card
    id="user-card"
    class="mx-auto"
    max-width="300"
    v-bind="attrs"
    @mouseover="attrs.elevation = 1"
    @mouseleave="attrs.elevation = 5"
    @click="go2UsersPage"
  >
    <v-img class="white--text align-end" :src="userData.profImgUrl[0]">
      <v-card-title>
        <span class="mr-3 font-weight-black">
          {{ userData.nickName }}
        </span>
        <span>{{ age }}</span>
      </v-card-title>
    </v-img>
    <v-card-text class="text--primary">
      <v-chip-group column>
        <v-chip
          v-for="hobby in userData.hobby"
          :key="hobby"
          color="secondary"
          outlined
          :ripple="false"
          class="font-weight-bold"
        >
          {{ hobby }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    userData: Object,
  },
  data() {
    return {
      attrs: {
        elevation: '10',
      },
    };
  },
  methods: {
    go2UsersPage() {
      this.$router.push(`user/${this.userData.uid}`);
    },
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

<style lang="scss">
#user-card {
  cursor: pointer;
}
</style>
