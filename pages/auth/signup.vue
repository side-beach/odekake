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

        <h2><span>OR</span></h2>
        <!-- SOCIAL Account Sign Up-->
        <div class="text-center my-2">
          <v-btn class="mx-4" fab dark color="#1DA1F2">
            <v-icon dark> mdi-twitter </v-icon>
          </v-btn>
          <v-btn class="mx-4" fab dark color="black">
            <v-icon dark> mdi-apple </v-icon>
          </v-btn>
          <v-btn class="mx-4" fab dark color="#DD5144">
            <v-icon dark> mdi-google </v-icon>
          </v-btn>
        </div>
      </v-form>
      <p class="text-center mt-5">
        既にアカウントをお持ちですか？<nuxt-link to="/auth/login"
          >ログイン</nuxt-link
        >
      </p>
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
      const auth = getAuth(this.$firebase);
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          console.log(userCredential.user);
          console.log("User Regist Completed");
        })
        .catch((e) => {
          alert(e.message);
          console.error("error.", e);
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
