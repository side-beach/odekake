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
  arrayUnion,
} from 'firebase/firestore';


export const state = () => ({
  data: null,
  personalData: null,
  docID: null,
  isLiked: false,
  isMatched: false,
  matchedUsers: null,
  hobbies:[
        { type: '登山', icon: 'mdi-hiking' },
        { type: '天体観測', icon: 'mdi-weather-night' },
        { type: 'サウナ', icon: 'mdi-account-cowboy-hat-outline' },
        { type: 'キャンプ', icon: 'mdi-campfire' },
        { type: '飲み歩き', icon: 'mdi-beer-outline' },
        { type: 'サバイバルゲーム', icon: 'mdi-pistol' },
        { type: '海水浴', icon: 'mdi-beach' },
        { type: '釣り', icon: 'mdi-fish' },
        { type: 'サイクリング', icon: 'mdi-bike' },
        { type: 'スキー', icon: 'mdi-ski' },
        { type: 'スノーボード', icon: 'mdi-snowboard' },
        { type: 'サーフィン', icon: 'mdi-surfing' },
        { type: 'ドローン', icon: 'mdi-drone' },
        { type: 'ツーリング', icon: 'mdi-motorbike' },
      ],
});

export const mutations = {
  setData: (state, data) => {
    state.data = data;
  },
  setPersonalData: (state, data) => {
    state.personalData = data;
  },
  setDocID: (state, data)=>{
    state.docID = data;
  },
  setIsLiked: (state, data) => {
    state.isLiked = data;
  },
  setIsMatched: (state, data) => {
    state.isMatched = data;
  },
  setMatchedUserData: (state, data) => {
    state.matchedUsers = data;
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
    // Get Personal user data from firestore
    const uid = payload;
    const db = getFirestore();
    const usersRef = collection(db,'users')
    
    const q = query(usersRef, where('uid',"==", uid));
    const querySnapshot = await getDocs(q);
    let data;
    querySnapshot.forEach((doc)=>{
      // console.log(doc.id, " ==========> ", doc.data());
      data = doc.data()
      console.log(data)
    })
    commit('setPersonalData', data);
  },
  async addLike({commit, rootGetters, getters, dispatch}, payload){
    const partnerUid = payload;
    const myUid = rootGetters["auth/getUserUid"];
    let partnerDocID, myDocID;
    const db = getFirestore();
    // add my UID to partner beLiked list.
    dispatch("getDocID",partnerUid)
    .then( async () => {
      partnerDocID = getters["docID"]
      const userRef = doc(db, 'users', partnerDocID);
      await updateDoc(userRef, {
        beLiked: arrayUnion(myUid)
      });
      return;
    })
    // add partner UID to my Liked list.
    .then(() => {
      dispatch("getDocID", myUid)
      .then(async () => {
        myDocID = getters["docID"];
        const userRef = doc(db, 'users', myDocID);
        await updateDoc(userRef, {
          liked: arrayUnion(partnerUid)
        });
      })
      return;
    })// Match Check
    .then( async () => {
      commit("setIsMatched",false);
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("liked", "array-contains", myUid));
      const querySnapshot = await getDocs(q);
      let userRef;
      querySnapshot.forEach(async (docItem)=>{
        // console.log(docItem.id, " => ", docItem.data())
        if(docItem.data().uid === partnerUid){
          console.log("MATCHED!!!!!");
          // Create Chat Room
          let docRef = await addDoc(collection(db, 'chats'),{});
          // docRef = await addDoc(collection(db, 'chats', docRef.id, 'chat'),{});
          // Get chat room path on firestore
          const path = docRef.path;
          // Add uid to each user's matched array.
          // Add chat room path to each user's chatRoom array.
          // for Partner Array
          userRef = doc(db, 'users', partnerDocID);
          await updateDoc(userRef, {matched: arrayUnion(myUid), chatRoom: arrayUnion({[myUid]:path})});// '[key]' is deploy variant
          // for My Array
          userRef = doc(db, 'users', myDocID);
          await updateDoc(userRef, {matched: arrayUnion(partnerUid), chatRoom: arrayUnion({[partnerUid]:path})});

          commit("setIsMatched", true);
          
        }
      })
    })

  },
  async getDocID({ commit }, payload) {
    // Search User Info by uid
    const uid = payload;
    const db = getFirestore();
    const q = query(collection(db, 'users'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    let docID;
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, '=>', doc.data());
      docID = doc.id;
    });
    commit('setDocID', docID);
  },
  async checkLikedUser({commit, dispatch, getters, rootGetters}, payload){
    const uid = payload;
    let docID;
    dispatch("getDocID", uid)
    .then(()=>{
      docID = getters["docID"];
      return docID;
    })
    .then(async docID => {
      const myUid = rootGetters["auth/getUserUid"];
      const db = getFirestore();
      const docRef = doc(db, 'users', docID);
      const docSnap = await getDoc(docRef);
      let data = null;
      if(docSnap.exists()){
        data = docSnap.data();
        let result = data.beLiked.some(val => val === myUid);
        commit("setIsLiked", result)
      }else{
        console.log("No such document!")
      }
    })
  },
  // Get user data that has already been matched
  async matchedUsers({commit, getters, rootGetters, dispatch}){
    const myData = rootGetters["userData"];
    let matchedUserData = [];
    
    for(let uid of myData.matched){
      await dispatch("getPersonalData",uid)
      matchedUserData.push(getters["personalData"]);
    }
    commit('setMatchedUserData',matchedUserData);
  }
}

export const getters = {
  getDataSet: (state) => state.data,
  personalData: (state) => state.personalData,
  docID: (state) => state.docID,
  isLiked: (state) => state.isLiked,
  isMatched: (state) => state.isMatched,
  matchedUsers: (state) => state.matchedUsers,
}
