import {getAuth, onAuthStateChanged} from 'firebase/auth'
export default function ({ $firebase, redirect, store, route }) {
  const isLogined = store.getters["auth/isLogined"];
  const auth = getAuth($firebase)
  if (!isLogined) {
    onAuthStateChanged(auth,user=>{
      if(user){
        store.dispatch('auth/addUserInfo',user)
      }else if(!route.path.match(/\/auth\//)){
        redirect("/auth/login");
      }
    })
  }
}
