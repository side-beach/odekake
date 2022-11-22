<template>
  <div>
    <!-- Image Change -->
    <v-row>
      <v-col cols="4" v-for="(i, idx) in userData.profImgUrl" :key="idx"
        ><v-img :src="i" @click.stop="delConfirm(i)"
          ><template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-row> </template></v-img
      ></v-col>
      <v-col cols="4">
        <label class="add-image" for="imgupload"
          ><v-icon color="primary" size="96">mdi-plus-circle-outline</v-icon>
        </label>
        <input
          id="imgupload"
          @change="setImg()"
          @click="
            (e) => {
              e.target.value = '';
            }
          "
          type="file"
          accept="image/*"
          ref="img"
          v-show="false"
        />
      </v-col>
    </v-row>
    <MypageDialog ref="dialogCompo" @delImg="delImg()" />
  </div>
</template>

<script>
import {
  getStorage,
  ref,
  deleteObject,
  listAll,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { getFirestore, doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';

export default {
  middleware: 'noDirectAccess',
  data() {
    return {
      dialog: false,
      delImgUrl: null,
    };
  },
  computed: {
    userData: function () {
      return this.$store.getters['user/personalData'];
    },
    myDocID: function () {
      return this.$store.getters['user/docID'];
    },
  },
  methods: {
    delConfirm(url) {
      this.delImgUrl = url;
      // Delete Confirm Dialog
      this.$refs.dialogCompo.toggleDialog();
    },
    async delImg() {
      const imgUrl = this.delImgUrl;
      // Delete from Cloud Storage
      const storage = getStorage();
      const imgRef = ref(storage, imgUrl);
      deleteObject(imgRef).then(() => {});
      // Delete from Cloud Firestore
      const db = getFirestore();
      const userRef = doc(db, 'users', this.myDocID);
      await updateDoc(userRef, {
        profImgUrl: arrayRemove(imgUrl),
      });
      // Reload user data
      const id = this.$store.getters['auth/getUserUid'];
      this.$store.dispatch('user/getPersonalData', id);
      // Hidden dialog
      this.$refs.dialogCompo.toggleDialog();
    },
    async setImg() {
      const db = getFirestore();
      const imgStoreRef = doc(db, 'users', this.myDocID);
      const storage = getStorage();
      const uid = this.$store.getters['auth/getUserUid'];
      let imgStorageRef, newImgName, snapshot, downloadUrl;
      // loop all image inputed data
      for (let i of this.$refs.img.files) {
        // Generate image name
        newImgName = await this.genImgName();
        // Create storage reference
        imgStorageRef = ref(storage, `users/${uid}/${newImgName}`);
        // Image upload and get snapshot
        snapshot = await uploadBytes(imgStorageRef, i);
        // Get image url
        downloadUrl = await getDownloadURL(snapshot.ref);
        // add download URL to Store
        await updateDoc(imgStoreRef, {
          profImgUrl: arrayUnion(downloadUrl),
        });
      }
      // Update user data
      this.$store.dispatch('user/getPersonalData', uid);
    },
    async genImgName() {
      // 生成する文字列の長さ
      var l = 10;
      // 生成する文字列に含める文字セット
      var c = 'abcdefghijklmnopqrstuvwxyz0123456789';
      var cl = c.length;
      var r = '';
      for (var i = 0; i < l; i++) {
        r += c[Math.floor(Math.random() * cl)];
      }
      // 生成したランダム文字列を格納
      let newImgName = `top${r}`;
      // ストレージにすでに同名の画像が存在していないかチェック
      const uid = this.$store.getters['auth/getUserUid'];
      const imgRef = ref(getStorage(), `users/${uid}`);
      await listAll(imgRef).then((res) => {
        res.items.forEach((itemRef) => {
          // 一致してたらもう一度関数を実行して新しい名前を生成
          if (itemRef.name.indexOf(newImgName) > -1) {
            this.genImgName();
          }
        });
      });
      return newImgName;
    },
  },
};
</script>
<style lang="scss" scoped>
.v-image {
  border-radius: 12px;
  height: 400px;
  cursor: pointer;
}
.add-image {
  display: block;
  position: relative;
  cursor: pointer;
  border: 1px solid #333;
  border-radius: 12px;
  height: 400px;
  .v-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }
}
</style>
