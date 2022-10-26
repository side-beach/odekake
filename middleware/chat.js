// redirect to root page if unknown user access to the individual chat page.
export default async function({store, redirect, route}){
  const partnerUid = route.params.id;
  const myUid = store.getters["auth/getUserUid"];
  let myData;
  await store.dispatch("user/getPersonalData",myUid)
  .then(()=>{
    myData = store.getters["user/personalData"];  
  });
  
  const isExist = myData.matched.some(val => val === partnerUid);
  if(!isExist){
    redirect("/");
  }
}