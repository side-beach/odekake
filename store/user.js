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
  
  async getData({ commit }) {
    console.log('GET DATA')
    const db = getFirestore();
    const usersRef = collection(db,'users')
    const q = query(usersRef, where('isNew',"==", false));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc)=>{
      console.log(doc.id, " ==========> ", doc.data());
    })
  },
};
