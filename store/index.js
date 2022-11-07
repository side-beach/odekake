import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  getDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';

export const state = () => ({
  docID: null,
  userData:{},
  lastLgoin:null
});

export const mutations = {
  setDocID: (state, data) => {
    state.docID = data.docID;
    state.userData = data.data;
  },
  setLastLoginTime:(state, data)=>{
    state.lastLgoin = data;
  }
};

export const actions = {
  async getDocID({ commit, getters }) {
    // Search User Info by uid
    const uid = getters['auth/getUserUid'];
    const db = getFirestore();
    const q = query(collection(db, 'users'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, '=>', doc.data());
      commit('setDocID', {docID:doc.id,data:doc.data()});
    });
  },
  // first sign up
  async addUser2DB({ commit }, payload) {
    const db = getFirestore();
    // console.log(payload)
    const docRef = await addDoc(collection(db, 'users'), {
      uid: payload.uid,
      email: payload.email,
      isNew: true,
      liked:[],
      beLiked:[],
      matched:[],
      chatRoom:[],
      createdAt: serverTimestamp(),
    });
    this.$router.push('/entry');
    // console.log('Document written with ID: ', docRef.id);
  },
  // Update user info when user signs up for first time.
  async updateUserInfo({ getters, dispatch }, payload) {
    // Add user info by uid
    const userInfo = { ...payload };
    
    userInfo.isNew = false;
    let docID;
    await dispatch('getDocID').then((res) => {
      docID = getters.docID;
    });
    const db = getFirestore();
    const userRef = doc(db, 'users', docID);
    await updateDoc(userRef, userInfo);
  },
  async checkNewUser({ commit }, payload) {
    const db = getFirestore();
    const docID = payload ?? 'null';
    // console.log(payload);
    const docRef = doc(db, 'users', docID);

    const docSnap = await getDoc(docRef);
    // console.log(docSnap);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.isNew) {
        this.$router.replace('/entry');
        // !! use $nuxt.$route.path instead of this.$route.path on Nuxt !!
      } else if ($nuxt.$route.path !== '/') {
        this.$router.replace('/');
      }
    } else {
      this.$router.replace('/entry');
      console.log('Check New User: No such document!');
    }
  },
  async addLastLoginTimeStamp ({commit, dispatch, getters}){
    let docID; 
    await dispatch('getDocID').then(()=>{
      docID = getters["docID"];
    })
    const db = getFirestore();
    const docRef = doc(db,"users",docID)

    await updateDoc(docRef,{
      lastLgoin: serverTimestamp()
    })

    var date = new Date();
    commit("setLastLoginTime", date.toLocaleString())
  }
};

export const getters = {
  docID: (state) => state.docID,
  userData: (state) => state.userData,
};
