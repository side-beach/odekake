<template>
  <v-stepper v-model="page" flat>
    <v-stepper-header>
      <v-stepper-step :complete="page > 1" step="1">基本情報</v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="page > 2" step="2"> どこいく？ </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="page > 3" step="3"> </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="page > 4" step="4"> </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step step="5"> 性別 </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <!-- ニックネーム、性別、居住地、生年月日-->
        <v-card class="mb-6" width="500" outlined>
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="8">
                  <!-- NICK NAME -->
                  <v-text-field
                    v-model="userInfo.nickname"
                    dense
                    label="ニックネーム"
                    outlined
                    hide-details
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="4">
                  <!-- Prefecture -->
                  <v-combobox
                    v-model="userInfo.pref"
                    :items="prefs"
                    label="お住まい"
                    outlined
                    hide-details
                    dense
                  ></v-combobox>
                </v-col>
                <v-col cols="12">
                  <!-- Gender -->
                  <v-radio-group v-model="userInfo.gender" class="mt-0" dense hide-details row>
                    <v-radio label="男" value="male"></v-radio>
                    <v-radio label="女" value="femail"></v-radio>
                    <v-radio label="その他" value="other"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>

              <!-- Birth Day-->
              <v-row>
                <v-col cols="6">
                  <v-select
                    label="西暦"
                    :items="years"
                    v-model="userInfo.birthDay.year"
                    @change="resetDay"
                    filled
                    dense
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
                  ></v-select>
                </v-col>
                <v-col cols="3">
                  <v-select
                    label="日"
                    :items="days"
                    v-model="userInfo.birthDay.day"
                    filled
                    dense
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>

        <v-btn color="primary" @click="page = 2"> Continue </v-btn>

        <v-btn text> Cancel </v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

        <v-btn color="primary" @click="page = 3"> Continue </v-btn>

        <v-btn text> Cancel </v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

        <v-btn color="primary" @click="page = 1"> Continue </v-btn>

        <v-btn text> Cancel </v-btn>
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
      },
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
    };
  },
  methods: {
    resetDay() {
      this.day = '';
    },
  },
  computed: {
    years() {
      const years = [];
      for (let year = 1900; year <= new Date().getFullYear(); year++) {
        years.push(year);
      }
      return years;
    },
    months() {
      const months = [...Array(12)].map((ele, i) => i + 1);
      return months;
    },
    days() {
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
