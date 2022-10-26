<template>
  <v-container>
    <v-sheet max-width="500" class="mx-auto pa-5 chat_wrapper">
      <div v-for="(item, idx) in chat" :key="idx">
        <div :class="[item.uid == uid ? 'my_baloon' : 'partner_baloon']">{{ item.message }}</div>
      </div>
      <!-- 入力フォーム -->
      <v-row>
        <v-col cols="8">
          <v-textarea v-model="input" auto-grow outlined rows="1" row-height="15"></v-textarea>
        </v-col>
        <v-col cols="4">
          <v-btn color="accent" @click="doSend" x-large>Send</v-btn>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<script>
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

export default {
  middleware: 'chat',
  data() {
    return {
      uid: '',
      chatRoom: null,
      chat: [],
      input: '',
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      await this.getChatRoomPath();
      await this.getChat();
    },
    async getChatRoomPath() {
      const myUid = (this.uid = this.$store.getters['auth/getUserUid']);
      const partnerUid = this.$route.params.id;
      let myData, chatRoomPath;
      await this.$store.dispatch('user/getPersonalData', myUid).then(() => {
        myData = this.$store.getters['user/personalData'];
        chatRoomPath = myData.chatRoom.filter((val) => {
          if (val[partnerUid]) {
            return val;
          }
        });
        chatRoomPath = chatRoomPath[0][partnerUid];
        console.log(chatRoomPath);
        this.chatRoom = chatRoomPath;
        return;
      });
    },
    async getChat() {
      const db = getFirestore();
      // const chatRoomRef = doc(db, `${this.chatRoom}/chat`);
      const q = query(collection(db, `${this.chatRoom}/chat`), orderBy('updatedAt', 'asc'));
      // const q = query(chatRoomRef, orderBy('atUpdated', 'desc'));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log('this from getChat method', doc.data());
      });

      this.listenServ();

      return;
    },
    listenServ() {
      const db = getFirestore();
      const q = query(collection(db, `${this.chatRoom}/chat`), orderBy('updatedAt', 'asc'));
      const unsub = onSnapshot(q, (querySnapshot) => {
        // Reset Chat Array
        this.chat.splice(0, this.chat.length);
        querySnapshot.forEach((doc) => {
          this.chat.push(doc.data());
        });
      });
    },
    async doSend() {
      if (this.input.length) {
        const db = getFirestore();
        const docRef = await addDoc(collection(db, `${this.chatRoom}/chat`), {
          message: this.input,
          uid: this.uid,
          updatedAt: serverTimestamp(),
        });
        // Empty textarea
        this.input = '';
        console.log('Document written with ID: ', docRef.id);
        this.scrollBottom();
      }
    },
    scrollBottom() {
      this.$nextTick(() => {
        window.scrollTo(0, document.body.clientHeight);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.chat_wrapper {
  position: relative;
}
.my_baloon {
  color: red;
}

.partner_baloon {
  color: blue;
}
</style>
