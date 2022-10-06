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
  data: null,
  personalData: null
});

export const mutations = {
  setData: (state, data) => {
    state.data = data;
  },
  setPersonalData: (state, data) => {
    state.personalData = data;
  }
};

export const actions = {
  
  async getData({ commit }) {
    // Get all user data from firestore
    const db = getFirestore();
    const usersRef = collection(db,'users')
    const q = query(usersRef, where('isNew',"==", false));
    const querySnapshot = await getDocs(q);
    let dataSets = [];
    querySnapshot.forEach((doc)=>{
      // console.log(doc.id, " ==========> ", doc.data());
      dataSets.push(doc.data());
    })

    commit('setData', dataSets)
  },
  async getPersonalData({commit}, payload){
    // Get all user data from firestore
    const db = getFirestore();
    const usersRef = collection(db,'users')
    const uid = payload;
    const q = query(usersRef, where('uid',"==", uid));
    const querySnapshot = await getDocs(q);
    let data;
    querySnapshot.forEach((doc)=>{
      // console.log(doc.id, " ==========> ", doc.data());
      data = doc.data()
      console.log(data)
    })

    commit('setPersonalData', data)
  }
};

export const getters = {
  getDataSet: (state) => state.data,
  personalData: (state) => state.personalData
}
