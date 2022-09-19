import {
  getFirestore,
  collection,
  doc,
  getDoc,
  addDoc, // ランダムなDocIDを作成して追加
  setDoc, // DocIDを指定して追加
  updateDoc,
  query,
  where,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';

export const state = () => ({});

export const mutations = {};

export const actions = {
  async getUserData({ commit }, payload) {
    console.log(payload);
    /*
    const db = getFirestore();
    const q = query(collection(db,'users',where('uid','==',payload.uid)))
    */
  },
  async addUser2DB({ commit }, payload) {
    const db = getFirestore();
    const docRef = addDoc(collection(db, 'users'), {
      uid: payload.uid,
      email: payload.email,
    });
    console.log('Document written with ID: ', docRef.id);
  },
  // Update user info when user signs up for first time.
  async updateUserInfo({ getters }, payload) {
    // Search User Info by uid
    const uid = getters['auth/getUserUid'];
    let docID = null;
    const db = getFirestore();
    const q = query(collection(db, 'users'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
      docID = doc.id;
    });

    // Add user info by uid
    const userInfo = { ...payload };
    userInfo.uid = uid;
    userInfo.email = getters['auth/getEmail'];
    const userRef = doc(db, 'users', docID);
    setDoc(userRef, userInfo);
  },
};

export const getters = {
  test: () => 'THIS_IS_GETTTER',
};
