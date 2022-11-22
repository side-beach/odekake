<template>
  <v-textarea v-model="data" @blur="updateProfile()" outlined> </v-textarea>
</template>
<script>
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
export default {
  data() {
    return {
      data: null,
    };
  },
  created() {
    let data = this.$store.getters['user/personalData'];
    this.data = data.profile;
  },
  methods: {
    async updateProfile() {
      const db = getFirestore();
      const docID = this.$store.getters['user/docID'];
      const hobbyRef = doc(db, 'users', docID);
      await updateDoc(hobbyRef, {
        profile: this.data,
      });
    },
  },
};
</script>
<style lang="scss"></style>
