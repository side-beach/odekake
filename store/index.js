import {
  getFirestore,
  collection,
  doc,
  addDoc, // ランダムなDocIDを作成して追加
  setDoc, // DocIDを指定して追加
  updateDoc,
  query,
  where,
  getDoc,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';

export const state = () => ({
  docID:null
});

export const mutations = {
  setDocID: (state, docID) => {
    state.docID = docID;
  },
};

export const actions = {
  async getDocID({commit, getters}) {
    // Search User Info by uid
    const uid = getters['auth/getUserUid'];
    const db = getFirestore();
    const q = query(collection(db, 'users'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
      commit('setDocID',doc.id);
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
      createdAt: serverTimestamp()
    });
    this.$router.push("/entry");
    // console.log('Document written with ID: ', docRef.id);
  },
  // Update user info when user signs up for first time.
  async updateUserInfo({ getters,dispatch }, payload) {
    // Add user info by uid
    const userInfo = { ...payload };
    userInfo.isNew = false;
    let docID;
    await dispatch('getDocID').then(res=>{
      docID = getters.docID
    })
    const db = getFirestore();
    const userRef = doc(db, 'users', docID);
    await updateDoc(userRef, userInfo);
  },
  async checkNewUser({commit},payload){
    const db = getFirestore()
    const docID = payload;
    const docRef = doc(db,"users",docID)
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()){
      const data = docSnap.data()
      if(data.isNew){
        this.$router.push("/entry");
      }else{
        this.$router.replace("/");
      }
    }else{
      console.log("Check New User: No such document!")
    }
  }
};

export const getters = {
  docID: (state) => state.docID,
};
