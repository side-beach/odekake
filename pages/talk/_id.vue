<template>
  <v-container>
    <v-sheet max-width="500" class="mx-auto pa-5 chat_wrapper">
      <div id="partner-name-bar" class="accent--text">{{ ptnrName }}</div>
      <div
        v-for="(item, idx) in chat"
        :key="idx"
        :class="[item.uid == uid ? 'my_chat' : 'partner_chat']"
      >
        <template v-if="item.uid == uid">
          <div class="my_baloon">
            {{ item.message }}
          </div>
          <v-avatar size="32" right class="mt-10">
            <img :src="myImg" alt="My Image" />
          </v-avatar>
          <div v-if="item.updatedAt" class="my-chat-date">
            {{ getDate(item.updatedAt.toDate().getTime()) }}
          </div>
        </template>
        <template v-else>
          <v-avatar size="32" left class="mt-10">
            <img :src="ptnrImg" alt="Partner Image" />
          </v-avatar>
          <div class="partner_baloon">
            {{ item.message }}
          </div>
          <div v-if="item.updatedAt" class="partner-chat-date">
            {{ getDate(item.updatedAt.toDate().getTime()) }}
          </div>
        </template>
      </div>
    </v-sheet>
    <!-- 入力フォーム -->
    <div id="chat_input">
      <v-row no-gutters>
        <v-col cols="10" align-self="center">
          <v-textarea v-model="input" hide-details outlined rows="1" row-height="15"></v-textarea>
        </v-col>
        <v-col cols="2" align-self="center">
          <v-btn color="accent" @click="doSend" small fab class="ml-10"
            ><v-icon>mdi-send</v-icon></v-btn
          >
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

export default {
  middleware: 'chat',
  data() {
    return {
      uid: '',
      chatRoom: null,
      myImg: null,
      ptnrImg: null,
      ptnrName: null,
      chat: [],
      input: '',
    };
  },
  created() {
    this.initialize();
  },
  mounted() {
    this.scrollBottom();
  },
  methods: {
    async initialize() {
      await this.getChatRoomPath();
      await this.listenServ();
    },
    async getChatRoomPath() {
      const myUid = (this.uid = this.$store.getters['auth/getUserUid']);
      const partnerUid = this.$route.params.id;

      let myData, chatRoomPath;

      // Get Partner's Profile Image and Name
      await this.$store.dispatch('user/getPersonalData', partnerUid).then(() => {
        const ptnr = this.$store.getters['user/personalData'];
        this.ptnrName = ptnr.nickName;
        this.ptnrImg = ptnr.profImgUrl[0];
      });

      await this.$store.dispatch('user/getPersonalData', myUid).then(() => {
        myData = this.$store.getters['user/personalData'];
        chatRoomPath = myData.chatRoom.filter((val) => {
          if (val[partnerUid]) {
            return val;
          }
        });

        chatRoomPath = chatRoomPath[0][partnerUid];
        // console.log(chatRoomPath);
        this.chatRoom = chatRoomPath;
        // Get My Profile Image
        this.myImg = myData.profImgUrl[0];

        return;
      });
    },
    async listenServ() {
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
        console.log('Document written with ID: ', docRef.id);

        this.input = ''; // Empty textarea
        // this.scrollBottom();
      }
    },
    scrollBottom() {
      this.$nextTick(() => {
        window.scrollTo(0, document.body.clientHeight);
      });
    },
    getDate(date) {
      return this.$dayjs(date).format('h:mm A');
    },
  },
};
</script>
<style lang="scss" scoped>
.chat_wrapper {
  position: relative;
  width: 100%;
  min-width: 500px;
  margin-bottom: 120px;
  border: 1px #ddd solid;
  background: white;
  font-size: 16px;
  color: #333;
  line-height: 1.4;
  overflow: hidden;
}

#partner-name-bar {
  padding-top: 50px;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  -webkit-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.8);
  z-index: 9999;
  width: 100%;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}

.my_chat {
  position: relative;
  width: 100%;
  text-align: right;
  .my-chat-date {
    position: absolute;
    bottom: 0;
    right: 55px;
    font-size: 10px;
    font-weight: bold;
  }
}

.partner_chat {
  position: relative;
  width: 100%;
  text-align: left;
  .partner-chat-date {
    position: absolute;
    bottom: 0;
    left: 55px;
    font-size: 10px;
    font-weight: bold;
  }
}

.baloon {
  position: relative;
  display: inline-block;
  max-width: 192px;
  margin: 1px 10px 6px;
  padding: 9px 14px;
  border-radius: 19px;
  overflow-wrap: break-word;
  clear: both;
  box-sizing: content-box;
  &::after {
    position: absolute;
    content: '';
    width: 17px;
    height: 17px;
    bottom: 0;
  }
}

.my_baloon {
  @extend .baloon;
  background: #2793fa;
  color: white;
  &::after {
    right: -6px;
    border-radius: 0px 0 0 17px/ 0px 0 0 13px;
    box-shadow: 14px 2px 0 -3px #2793fa inset;
  }
}

.partner_baloon {
  @extend .baloon;
  background: #e9e9ed;
  &::after {
    left: -6px;
    border-radius: 0px 0 17px 0px/ 0px 0 13px 0;
    box-shadow: -14px 2px 0 -3px #e9e9ed inset;
  }
}

#chat_input {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  -webkit-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  width: 100%;
  max-width: 500px;
}
</style>
