<template>
  <div class="bg pt-16 px-10">
    <v-card width="350" class="mx-auto pa-7">
      <h1 id="main-title" class="text-center">ODEKAKE</h1>
      <p class="text-center">アカウント登録</p>

      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          dense
          outlined
          v-model="email"
          :rules="emailRules"
          label="メールアドレス"
          required
        ></v-text-field>

        <v-text-field
          dense
          outlined
          v-model="password"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="passwordRules"
          :type="show ? 'text' : 'password'"
          name="input-10-1"
          label="パスワード"
          counter
          @click:append="show = !show"
          required
        ></v-text-field>

        <v-btn :disabled="!valid" color="success" block @click="signup()">
          アカウント作成
        </v-btn>
      </v-form>
      <div class="text-center mt-5">既にアカウントをお持ちですか？</div>
      <div class="text-center">
        <nuxt-link to="/auth/login">ログイン</nuxt-link>
      </div>
    </v-card>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
export default {
  name: "LoginPage",
  data: () => ({
    valid: true,
    email: "",
    emailRules: [
      (v) => !!v || "必須項目です",
      (v) => /.+@.+\..+/.test(v) || "有効なメールアドレスを入力してください",
    ],
    password: null,
    show: false,
    passwordRules: [
      (v) => !!v || "パスワードを入力してください",
      (v) => (v && v.length > 8) || "8文字以上で設定してください",
    ],
  }),

  methods: {
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    signup() {
      this.$store.dispatch("auth/signup", {
        email: this.email,
        password: this.password,
      });
    },
  },
};
</script>

<style lang="scss">
.bg {
  z-index: 1;
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url("~assets/img/login.jpg");
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  background-color: #464646;

  &::after {
    z-index: -1;
    position: absolute;
    left: 0;
    top: 0;
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    background: rgba(255, 255, 255, 0.3);
  }
}

#main-title {
  font-family: "Rampart One", cursive;
  font-size: 3rem;
}

h2 {
  margin-top: 20px;
  position: relative;
  padding: 0 65px;
  text-align: center;
}

h2:before {
  position: absolute;
  top: calc(50% - 1px);
  left: 0;
  width: 100%;
  height: 2px;
  content: "";
  background: #000;
}

h2 span {
  position: relative;
  padding: 0 1em;
  background: #fff;
}
</style>
