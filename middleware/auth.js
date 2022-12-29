export default function({ store, redirect, route }) {
  const userIsLoggedIn = !!store.getters["user"];
  console.log("userIsLoggedIn", userIsLoggedIn);
  if (!userIsLoggedIn) {
    return redirect("/");
  }
}
