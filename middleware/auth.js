import { getAuth, onAuthStateChanged } from 'firebase/auth';
export default function ({ $firebase, redirect, store, route }) {
  const isLogined = store.getters['auth/isLogined'];
  const auth = getAuth($firebase);
  // ページクローズ、更新などでローカルのログイン状態がfalseにもどったら
  if (!isLogined) {
    // firebase側のログイン状態を持ってくる
    onAuthStateChanged(auth, (user) => {
      // console.log('midleware', user);
      // user情報が返ってくる(ログイン状態)だったら
      if (user) {
        // ローカルのログイン状態をTRUEに更新
        store.dispatch('auth/addUserInfo', user);
        // 初回登録が済んでいるかチェック
        store
          .dispatch('getDocID')
          .then((res) => {
            return store.getters.docID;
          })
          .then((docID) => {
            store.dispatch('checkNewUser', docID);
          });
          // ラストログインをサーバーに記録
          store.dispatch("addLastLoginTimeStamp")
      } else if (!route.path.match(/\/auth\//)) {
        redirect('/auth/login');
      }
    });
  }
}
