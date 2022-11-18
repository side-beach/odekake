<template>
  <section>
    <!-- BACK TO HOME BUTTON-->
    <v-btn id="bk2homebtn" fab color="primary" small nuxt to="/">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <v-card class="mx-auto my-10" max-width="300" v-if="userData">
      <v-carousel height="300" :hide-delimiters="true" cycle>
        <v-carousel-item
          v-for="(i, idx) in userData.profImgUrl"
          :key="idx"
          :src="i"
        ></v-carousel-item>
      </v-carousel>
      <div class="pa-5">
        <!-- NICK NAME -->
        <div id="nickname">{{ userData.nickName }}</div>
        <!-- BASE PROFILE -->
        <div id="detail">
          <span>{{ age }}歳</span>
          <span>{{ userData.pref }}</span>
          <span v-if="userData.gender == 'male'">男性</span>
          <span v-else-if="userData.gender == 'female'">女性</span>
          <span v-else>🐯</span>
          <v-chip-group column>
            <v-chip color="secondary" v-for="i in userData.hobby" :key="i" outlined>{{ i }}</v-chip>
          </v-chip-group>
        </div>
        <!-- SELF INTRODUCE-->
        <div id="self-introduce">
          <div>自己紹介文</div>
          <v-card class="pa-2" outlined>
            {{ userData.profile }}
          </v-card>
        </div>
        <!-- profile edit button -->
        <v-btn color="accent" block rounded class="mt-3" to="/mypage/edit">
          プロフィールを編集する
        </v-btn>
      </div>
    </v-card>
  </section>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    const id = this.$store.getters['auth/getUserUid'];
    this.$store.dispatch('user/getPersonalData', id);
    this.$store.dispatch('user/getDocID', id);
  },
  computed: {
    userData: function () {
      return this.$store.getters['user/personalData'];
    },
    age: function () {
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
  methods: {},
};
</script>

<style lang="scss">
.title {
  font-size: 0.8rem;
  font-weight: 700;
}

#bk2homebtn {
  position: fixed;
  top: 50px;
  left: 20px;
}

#nickname {
  font-size: 1.5rem;
  font-weight: 700;
  font-style: italic;
}

#detail {
  margin-top: -7px;
  font-size: 0.8rem;
  font-weight: 700;
  span {
    margin-right: 5px;
  }
}

#hobby {
  margin-top: 10px;
  div:first-child {
    @extend .title;
  }
}

#self-introduce {
  margin-top: 10px;
  div:first-child {
    @extend .title;
  }
}
</style>
