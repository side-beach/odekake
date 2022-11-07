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
      <v-btn text @click="logout()" class="my-auto">ログアウト</v-btn>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <!-- ニックネーム、性別、居住地、生年月日-->
        <v-card class="mb-6 mx-auto" width="500" flat>
          <v-form ref="form">
            <v-container>
              <!-- NICK NAME -->
              <v-text-field
                v-model="userInfo.nickName"
                dense
                label="ニックネーム"
                outlined
                hide-details
                required
                class="mb-5"
                :error="errors.step1.nickName"
              ></v-text-field>
              <!-- Prefecture -->
              <v-combobox
                v-model="userInfo.pref"
                :items="prefs"
                label="お住まい"
                outlined
                hide-details
                dense
                :error="errors.step1.pref"
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
                  :error="errors.step1.gender"
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
                    :error="errors.step1.birthDay.year"
                    required
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
                    :error="errors.step1.birthDay.month"
                    required
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
                    :error="errors.step1.birthDay.day"
                    required
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
          <v-chip-group column multiple v-model="userInfo.hobby">
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
        <v-card flat width="350" class="mx-auto">
          <!--
            Image Upload
          -->
          <v-row>
            <v-col cols="12">
              <label id="upload-label" for="imgupload"
                ><v-icon large color="primary">mdi-image</v-icon>
                趣味画像を追加
              </label>
              <input
                id="imgupload"
                @change="setImage()"
                @click="
                  (e) => {
                    e.target.value = '';
                  }
                "
                type="file"
                accept="image/*"
                ref="img"
              />
            </v-col>
            <v-col cols="6" v-for="(url, idx) in imgURL" :key="idx">
              <v-img
                :src="url"
                max-height="300"
                contain
                @click.stop="openRemoveImg(idx)"
                style="cursor: pointer"
              ></v-img>
              <v-dialog v-model="dialog[idx]" width="350">
                <v-card>
                  <v-card-title class="text-h5"> この画像を削除しますか？</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" text @click="dialog.splice(idx, 1, false)">
                      キャンセル
                    </v-btn>
                    <v-btn color="warning" text @click="removeImg(idx)"> 削除 </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>

          <v-textarea
            class="mt-5"
            outlined
            v-model="userInfo.profile"
            label="自己紹介を入力してください"
            auto-grow
            dense
            solo
            hint="例: 一緒にキャンプへ行ってくれる人募集！"
          >
          </v-textarea>

          <v-row>
            <v-col><v-btn x-large text @click="page = 2"> 前に戻る </v-btn></v-col>
            <v-spacer></v-spacer>
            <v-col>
              <v-btn x-large color="primary" @click="regist()">登録する</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
        profImgUrl: [],
        hobby: [],
      },
      images: [],
      imgURL: [],
      dialog: [],
      valid: true,
      errors: {
        step1: {
          nickName: false,
          gender: false,
          pref: false,
          birthDay: { year: false, month: false, day: false },
        },
        step2: {
          hobby: false,
        },
        step3: {
          profile: false,
        },
      },
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
    };
  },
  methods: {
    resetDay() {
      this.day = '';
    },
    validate(step) {
      this.valid = true;
      this.errMsg = null;
      if (step === 'step1') {
        let isValid = true;
        for (let key in this.errors.step1) {
          if (this.userInfo[key] === null) {
            this.errors.step1[key] = true;
            isValid = false;
          } else if (key === 'birthDay') {
            for (let key in this.errors.step1.birthDay) {
              if (this.userInfo.birthDay[key] == null) {
                this.errors.step1.birthDay[key] = true;
                isValid = false;
              }
            }
          }
        }

        if (!isValid) {
          this.valid = false;
          this.errMsg = '未入力の項目があります';
          return;
        }
      } else if (step === 'step2') {
        if (this.userInfo.hobby.length === 0) {
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
    async regist() {
      // Upload the image to Cloud Firestore
      // To process synchronously
      const promise = new Promise((resolve, reject) => {
        const uid = this.$store.getters['auth/getUserUid'];
        const storage = getStorage();
        // Profile画像を設定していた場合としてない場合
        // 設定していない場合は用意したデフォの画像を設定
        if (this.images.length === 0) {
          // 性別によってデフォ画像を切替
          let defoImgUrl;
          if (this.userInfo.gender === 'male') {
            defoImgUrl =
              'https://firebasestorage.googleapis.com/v0/b/odekake-54c4a.appspot.com/o/users%2Fdefault%2Fmen.png?alt=media&token=f2f84ea3-5ed1-475f-89a6-81b7b7d9c09c';
          } else if (this.userInfo.gender === 'female') {
            defoImgUrl =
              'https://firebasestorage.googleapis.com/v0/b/odekake-54c4a.appspot.com/o/users%2Fdefault%2Fwomen.png?alt=media&token=76e1bc19-1c48-4874-97fa-dab0a8da4ba8';
          } else if (this.userInfo.gender === 'other') {
            defoImgUrl =
              'https://firebasestorage.googleapis.com/v0/b/odekake-54c4a.appspot.com/o/users%2Fdefault%2Ftora.png?alt=media&token=156c4632-66f7-4085-a83b-fb37a7ba14b4';
          }
          this.userInfo.profImgUrl.push(defoImgUrl);
          resolve();
        } else {
          let imageRef;
          for (let i = 0; i < this.images.length; i++) {
            imageRef = ref(storage, `users/${uid}/top${i}`);
            uploadBytes(imageRef, this.images[i]).then((snapshot) => {
              // console.log('upload image file');
              // add IMG URL to user info
              getDownloadURL(snapshot.ref).then((downloadURL) => {
                // console.log(downloadURL);
                this.userInfo.profImgUrl.push(downloadURL);
                if (this.userInfo.profImgUrl.length == this.images.length) {
                  resolve();
                }
              });
            });
          }
        }
      });
      // Once the previous process is complete
      promise.then((res) => {
        this.$store.dispatch('updateUserInfo', this.userInfo).then((res) => {
          this.$router.push('/');
        });
      });
    },
    logout() {
      this.$store.dispatch('auth/logout');
    },
    setImage() {
      for (let i of this.$refs.img.files) {
        this.images.push(i);
        this.imgURL.push(URL.createObjectURL(i));
        this.dialog.push(false);
      }
    },
    openRemoveImg(idx) {
      this.dialog.splice(idx, 1, true);
      console.log(this.dialog);
    },
    removeImg(idx) {
      this.images.splice(idx, 1);
      this.imgURL.splice(idx, 1);
      this.dialog.splice(idx, 1);
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

<style lang="scss">
#upload-label {
  display: block;
  box-shadow: 0px 0px 0px 2px rgba(0, 0, 0, 0.5), 0px 2px 4px rgba(0, 0, 0, 0.1),
    0px 4px 8px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  // border: 2px solid #ccc;
  border-radius: 5px;
  margin: 10px auto;
  padding: 10px 5px;
  cursor: pointer;
  &:active {
    box-shadow: none;
    border: 1px solid #333;
  }
}

#imgupload {
  display: none;
}
</style>
