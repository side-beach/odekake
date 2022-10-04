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
    // Get user data from firestore
    const db = getFirestore();
    const usersRef = collection(db,'users')
    const q = query(usersRef, where('isNew',"==", false));
    const querySnapshot = await getDocs(q);
    let dataSets = [], data = {};
    querySnapshot.forEach((doc)=>{
      // console.log(doc.id, " ==========> ", doc.data());
      dataSets.push(doc.data());
    })

    commit('setData', dataSets)
  },
  
};

export const getters = {
  getDataSet: (state) => state.data
}
