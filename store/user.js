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
  serverTimestamp,
} from 'firebase/firestore';

export const state = () => ({
  data: {},
});

export const mutations = {
  setData: (state, data) => {
    state.data = data;
  },
};

export const actions = {
  async getData({ commit }, getters) {
    const uid = getters['auth/currentUserUid'];
    console.log(uid);
  },
};
