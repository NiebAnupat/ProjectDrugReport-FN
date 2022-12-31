export default function({ store, redirect, route }) {
  const userIsLoggedIn = !!store.getters["user"];
  if (!userIsLoggedIn) {
    return redirect("/");
  }
}
