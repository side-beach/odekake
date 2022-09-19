<template>
  <v-stepper v-model="page" flat>
    <v-stepper-header>
      <!-- Snack for validation-->
      <v-snackbar centered :value="!valid" top color="red accesnt-2" elevation="24">
        {{ errMsg }}
      </v-snackbar>
      <v-stepper-step :complete="page > 1" step="1">基本情報</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="page > 2" step="2">どこいく？なにする？</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="3">プロフィール</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <!-- ニックネーム、性別、居住地、生年月日-->
        <v-card class="mb-6 mx-auto" width="500" flat>
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-container>
              <!-- NICK NAME -->
              <v-text-field
                v-model="userInfo.nickName"
                dense
                label="ニックネーム"
                outlined
                hide-details
                required
                :rules="[(v) => !!v || 'required']"
                class="mb-5"
              ></v-text-field>
              <!-- Prefecture -->
              <v-combobox
                v-model="userInfo.pref"
                :items="prefs"
                label="お住まい"
                outlined
                hide-details
                dense
                :rules="[(v) => !!v || 'required']"
                required
              ></v-combobox>
              <v-col cols="12">
                <!-- Gender -->
                <v-radio-group
                  v-model="userInfo.gender"
                  required
                  class="mt-0"
                  dense
                  hide-details
                  :rules="[(v) => !!v || 'required']"
                  row
                >
                  <v-radio label="男" value="male"></v-radio>
                  <v-radio label="女" value="femail"></v-radio>
                  <v-radio label="その他" value="other"></v-radio>
                </v-radio-group>
              </v-col>

              <!-- Birth Day-->
              <v-row>
                <v-col cols="6">
                  <v-select
                    label="西暦"
                    :items="years"
                    v-model="userInfo.birthDay.year"
                    @change="resetDay"
                    filled
                    hide-details
                    dense
                    required
                    :rules="[(v) => !!v || 'required']"
                  ></v-select>
                </v-col>
                <v-col cols="3">
                  <v-select
                    label="月"
                    :items="months"
                    v-model="userInfo.birthDay.month"
                    @change="resetDay"
                    filled
                    dense
                    hide-details
                    required
                    :rules="[(v) => !!v || 'required']"
                  ></v-select>
                </v-col>
                <v-col cols="3">
                  <v-select
                    label="日"
                    :items="days"
                    v-model="userInfo.birthDay.day"
                    filled
                    dense
                    hide-details
                    required
                    :rules="[(v) => !!v || 'required']"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
          <div class="text-center">
            <v-btn block color="primary" x-large @click="validate('step1')"> 次へ進む </v-btn>
          </div>
        </v-card>
      </v-stepper-content>
      <!-- 
        STEP 2 WHERE DO YOU LIKE TO GO ?
      -->
      <v-stepper-content step="2">
        <v-card class="mb-6" flat>
          <v-chip-group column multiple v-model="hobby">
            <v-chip
              v-for="(tag, i) in hobbies"
              :key="i"
              :value="tag.type"
              filter
              outlined
              color="success"
            >
              <v-icon left>
                {{ tag.icon }}
              </v-icon>
              {{ tag.type }}
            </v-chip>
          </v-chip-group>
        </v-card>
        <div class="text-center">
          <v-btn x-large text @click="page = 1"> 前に戻る </v-btn>
          <v-btn x-large color="primary" @click="validate('step2')"> 次へ進む </v-btn>
        </div>
      </v-stepper-content>
      <!-- 
        Profile Input
      -->
      <v-stepper-content step="3">
        <v-card flat>
          <v-text-field
            outlined
            v-model="userInfo.profile"
            label="自己紹介"
            auto-grow
            dense
            hint="例: 一緒にキャンプへ行ってくれる人募集！"
          >
          </v-text-field>
        </v-card>
        <div class="text-center">
          <v-btn x-large text @click="page = 2"> 前に戻る </v-btn>
          <v-btn x-large color="primary" @click="validate('step3')"> 登録する </v-btn>
        </div>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
export default {
  name: 'EntryPage',
  data() {
    return {
      page: 1,
      userInfo: {
        nickName: null,
        gender: null,
        pref: null,
        birthDay: { year: null, month: null, day: null },
        hiddenBD: false,
        profile: null,
      },
      valid: true,
      errMsg: '',
      prefs: [
        '北海道',
        '青森県',
        '岩手県',
        '宮城県',
        '秋田県',
        '山形県',
        '福島県',
        '茨城県',
        '栃木県',
        '群馬県',
        '埼玉県',
        '千葉県',
        '東京都',
        '神奈川県',
        '新潟県',
        '富山県',
        '石川県',
        '福井県',
        '山梨県',
        '長野県',
        '岐阜県',
        '静岡県',
        '愛知県',
        '三重県',
        '滋賀県',
        '京都府',
        '大阪府',
        '兵庫県',
        '奈良県',
        '和歌山県',
        '鳥取県',
        '島根県',
        '岡山県',
        '広島県',
        '山口県',
        '徳島県',
        '香川県',
        '愛媛県',
        '高知県',
        '福岡県',
        '佐賀県',
        '長崎県',
        '熊本県',
        '大分県',
        '宮崎県',
        '鹿児島県',
        '沖縄県',
      ],
      hobbies: [
        { type: '登山', icon: 'mdi-hiking' },
        { type: '天体観測', icon: 'mdi-weather-night' },
        { type: 'サウナ', icon: 'mdi-account-cowboy-hat-outline' },
        { type: 'キャンプ', icon: 'mdi-campfire' },
        { type: '飲み歩き', icon: 'mdi-beer-outline' },
        { type: 'サバイバルゲーム', icon: 'mdi-pistol' },
        { type: '海水浴', icon: 'mdi-beach' },
        { type: '釣り', icon: 'mdi-fish' },
        { type: 'サイクリング', icon: 'mdi-bike' },
        { type: 'スキー', icon: 'mdi-ski' },
        { type: 'スノーボード', icon: 'mdi-snowboard' },
        { type: 'サーフィン', icon: 'mdi-surfing' },
        { type: 'ドローン', icon: 'mdi-drone' },
        { type: 'ツーリング', icon: 'mdi-motorbike' },
      ],
      hobby: [],
    };
  },
  methods: {
    resetDay() {
      this.day = '';
    },
    validate(step) {
      if (step === 'step1') {
        if (!this.$refs.form.validate()) {
          this.errMsg = '未入力の項目があります';
          // return;
        }
      } else if (step === 'step2') {
        if (this.hobby.length === 0) {
          this.errMsg = '趣味をどれか1つ以上選択してください';
          this.valid = false;
          return;
        }
      } else if (step === 'step3') {
        // console.log(this.userInfo.profile);
        // nullだったら
        if (!this.userInfo.profile) {
          this.errMsg = '何かプロフィールに入力してください';
          this.valid = false;
          return;
        }
        this.regist();
      }

      this.page += 1;
    },
    regist() {
      // console.log(this.userInfo);
      this.$store.dispatch('updateUserInfo', this.userInfo);
    },
  },
  computed: {
    years() {
      const years = [];
      for (let year = new Date().getFullYear(); year >= 1900; year--) {
        years.push(year);
      }
      return years;
    },
    months() {
      const months = [...Array(12)].map((ele, i) => i + 1);
      return months;
    },
    days() {
      // うるうどしの計算
      let days = [];
      if (
        (this.userInfo.birthDay.month === 2 &&
          this.userInfo.birthDay.year % 4 === 0 &&
          this.userInfo.birthDay.year % 100 !== 0) ||
        (this.userInfo.birthDay.month === 2 && this.userInfo.birthDay.year % 400 === 0)
      ) {
        days = [...Array(29)].map((ele, i) => i + 1);
      } else if (this.userInfo.birthDay.month === 2) {
        days = [...Array(28)].map((ele, i) => i + 1);
      } else if (
        this.userInfo.birthDay.month === 4 ||
        this.userInfo.birthDay.month === 6 ||
        this.userInfo.birthDay.month === 9 ||
        this.userInfo.birthDay.month === 11
      ) {
        days = [...Array(30)].map((ele, i) => i + 1);
      } else {
        days = [...Array(31)].map((ele, i) => i + 1);
      }
      return days;
    },
  },
};
</script>
