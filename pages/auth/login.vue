<template>
  <div class="bg pt-16 px-10">
    <v-card width="350" class="mx-auto pa-7">
      <h1 id="main-title" class="text-center accent--text">ODEKAKE</h1>
      <p class="text-center">ログイン</p>

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

        <v-btn :disabled="!valid" color="success" block @click="login()"> ログイン </v-btn>
        <div class="text-center mt-5">
          アカウント作成は<nuxt-link to="/auth/signup">こちら</nuxt-link>
        </div>

        <h2><span>OR</span></h2>
        <!-- SOCIAL Account Sign Up-->
        <div class="text-center my-2">
          <div class="mb-3">
            <v-btn @click="socialLogin('twitter')" width="200" dark color="#1DA1F2">
              <v-icon small dark> mdi-twitter </v-icon>
              <span class="pl-1">Twitterでログイン</span>
            </v-btn>
          </div>
          <div>
            <v-btn @click="socialLogin('google')" width="200" dark color="#DD5144">
              <v-icon small dark> mdi-google </v-icon>
              <span class="pl-1">Googleでログイン</span>
            </v-btn>
          </div>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data: () => ({
    valid: true,
    email: '',
    emailRules: [
      (v) => !!v || '必須項目です',
      (v) => /.+@.+\..+/.test(v) || '有効なメールアドレスを入力してください',
    ],
    password: null,
    show: false,
    passwordRules: [
      (v) => !!v || 'パスワードを入力してください',
      (v) => (v && v.length > 8) || '8文字以上で設定してください',
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
    login() {
      this.$store.dispatch('auth/login', {
        email: this.email,
        password: this.password,
      });
    },
    socialLogin(type) {
      this.$store.dispatch('auth/socialLogin', type);
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
  background-image: url('~assets/img/login.jpg');
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
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    background: rgba(255, 255, 255, 0.3);
  }
}

#main-title {
  font-family: 'Lobster', cursive;
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
  content: '';
  background: #000;
}

h2 span {
  position: relative;
  padding: 0 1em;
  background: #fff;
}
</style>
