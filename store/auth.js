import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

export const state = () => ({
  isLogin: null,
  userUid: null,
  email: null,
  isNew: false,
});

export const getters = {
  isLogined: (state) => !!state.isLogin,
  getUserUid: (state) => state.userUid,
  getEmail: (state) => state.email,
};

export const mutations = {
  setLogin: (state, isLogin) => {
    state.isLogin = !!isLogin;
  },
  setUserUid: (state, userUid) => {
    state.userUid = userUid;
  },
  setEmail: (state, email) => {
    state.email = email;
  },
};

export const actions = {
  async login({ commit }, payload) {
    const auth = getAuth(this.$firebase);
    await signInWithEmailAndPassword(auth, payload.email, payload.password)
      .then((userCredential) => {
        commit('setLogin', true);
        commit('setUserUid', userCredential.user.uid);
        commit('setEmail', userCredential.user.email);
        this.$router.push('/');
      })
      .catch((e) => {
        alert(e);
      });
  },
  async socialLogin({ dispatch, rootGetters }, payload) {
    const auth = getAuth(this.$firebase);
    let provider;
    if (payload === 'twitter') {
      provider = new TwitterAuthProvider();
    } else if (payload === 'google') {
      provider = new GoogleAuthProvider();
    }
    await signInWithPopup(auth, provider).then((userCredential) => {
      const [uid, email] = [userCredential.user.uid, userCredential.user.email];
      // Add User Info to vuex store
      dispatch('addUserInfo', { uid, email }).then((res) => {
        // Check new user
        dispatch('getDocID', null, { root: true })
          .then((res) => {
            // console.log("path",rootGetters.docID)
            if (rootGetters.docID == null) {
              dispatch('addUser2DB', { uid, email }, { root: true });
            }
          })
          .then((res) => {
            this.$router.push('/');
          });
      });
    });
  },
  async signup({ dispatch }, payload) {
    // Email Sign Up
    const auth = getAuth(this.$firebase);
    await createUserWithEmailAndPassword(auth, payload.email, payload.password)
      .then((userCredential) => {
        const [uid, email] = [userCredential.user.uid, userCredential.user.email];
        // Add user info to vuex store.
        dispatch('addUserInfo', { uid, email }).then((res) => {
          // Add user info to firestore.
          dispatch('addUser2DB', { uid, email }, { root: true });
        });
      })
      .catch((e) => {
        if (e.message === 'Firebase: Error (auth/email-already-in-use).') {
          alert('このメールアドレスはすでに使用されています');
        } else {
          alert(e);
        }
      });
  },
  async logout({ commit }) {
    const auth = getAuth(this.$firebase);
    await signOut(auth)
      .then(() => {
        commit('setLogin', false);
        commit('setUserUid', '');
        commit('setEmail', '');
        this.$router.replace('/auth/login');
      })
      .catch((e) => {
        alert(e);
      });
  },
  addUserInfo({ commit }, payload) {
    commit('setLogin', true);
    commit('setUserUid', payload.uid);
    commit('setEmail', payload.email);
  },
};
