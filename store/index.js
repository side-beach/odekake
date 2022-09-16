import { getFirestore, collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';

export const state = () => ({
});

export const mutations = {

};

export const actions = {
  async getUserData({commit},payload){
    console.log(payload)
    /*
    const db = getFirestore();
    const q = query(collection(db,'users',where('uid','==',payload.uid)))
    */
  },
  async addUser2DB({commit},payload){
    const db = getFirestore();
    const docRef = addDoc(collection(db,'users'),{
      uid:payload.uid,
      email:payload.email
    })
    console.log('Document written with ID: ', docRef.id)
  }
};

export const getters = {
  test: () => 'THISISGETTTER'
};