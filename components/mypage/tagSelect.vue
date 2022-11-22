<template>
  <v-chip-group v-model="hobbies" column multiple @change="updtHoby">
    <v-chip filter v-for="(hobby, idx) in hobbyList" :key="idx" :value="hobby">
      {{ hobby }}
    </v-chip>
  </v-chip-group>
</template>
<script>
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
export default {
  data() {
    return {
      hobbies: [],
      hobbyList: [
        '登山',
        '天体観測',
        'サウナ',
        'キャンプ',
        '飲み歩き',
        'サバイバルゲーム',
        '海水浴',
        '釣り',
        'サイクリング',
        'スキー',
        'スノーボード',
        'サーフィン',
        'ドローン',
        'ツーリング',
      ],
    };
  },
  created() {
    let myHobbies = this.$store.getters['user/personalData'];
    for (let i of myHobbies.hobby) {
      this.hobbies.push(i);
    }
  },
  methods: {
    async updtHoby() {
      const db = getFirestore();
      const docID = this.$store.getters['user/docID'];
      const hobbyRef = doc(db, 'users', docID);
      await updateDoc(hobbyRef, {
        hobby: this.hobbies,
      });
    },
  },
};
</script>
<style lang="scss"></style>
