export default function ({ redirect, store, route }) {
  const isLogined = store.getters["auth/isLogined"];

  if (
    !isLogined &&
    route.path !== "/auth/login" &&
    route.path !== "/auth/signup"
  ) {
    redirect("/auth/login");
  }
}
