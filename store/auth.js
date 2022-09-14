import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
} from "firebase/auth";
export const state = () => ({
  token: null,
  userUid: null,
  email: null,
});

export const getters = {
  isLogined: (state) => !!state.token,
  getUserUid: (state) => state.userUid,
  getEmail: (state) => state.email,
};

export const mutations = {
  setLogin: (state, isLogin) => {
    state.token = !!isLogin;
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
        commit("setLogin", true);
        commit("setUserUid", userCredential.user.uid);
        commit("setEmail", userCredential.user.email);
        this.$router.push("/");
      })
      .catch((e) => {
        alert(e);
      });
  },
  async googleLogin({ dispatch }) {
    const auth = getAuth(this.$firebase);
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider).then((user) => {
      console.log(user)
      dispatch("addUserInfo", { uid: user.uid, email: user.email });
      this.$router.push("/");
    });
  },
  async twitterLogin({dispatch}){
    const auth = getAuth(this.$firebase);
    const provider = new TwitterAuthProvider();

    await signInWithPopup(auth, provider).then((user) => {
      dispatch("addUserInfo", { uid: user.uid, email: user.email });
      this.$router.push("/");
    })
    .catch(e=>{
      console.log(e.message)
    });
  },
  async signup({ dispatch }, payload) {
    const auth = getAuth(this.$firebase);
    await createUserWithEmailAndPassword(auth, payload.email, payload.password)
      .then((userCredential) => {
        dispatch("login", { email: payload.email, password: payload.password });
      })
      .catch((e) => {
        if (e.message === "Firebase: Error (auth/email-already-in-use).") {
          alert("このメールアドレスはすでに使用されています");
        }
      });
  },
  async logout({ commit }) {
    const auth = getAuth(this.$firebase);
    await signOut(auth)
      .then(() => {
        commit("setLogin", false);
        commit("setUserUid", "");
        commit("setEmail", "");
        this.$router.push("auth/login");
      })
      .catch((e) => {
        alert(e);
      });
  },
  addUserInfo({ commit }, payload) {
    commit("setLogin", true);
    commit("setUserUid", payload.uid);
    commit("setEmail", payload.email);
  },
};
