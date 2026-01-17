export default function({ store, app, route, redirect }) {
  if (route.path === "/") {
      //  we are on a protected route
      if (!app.$fire.auth.currentUser) {
          //take them to sign in page
         // return redirect("/auth/account");
      } else {}
  } else if (route.path === "/auth/account") {
      if (!app.$fire.auth.currentUser) {
          //leave them on the sign in page
      } else {
         // return redirect("/");
      }
  // } else if (route.path === "/dashboard") {
  //     if (!app.$fire.auth.currentUser) {
  //         //leave them on the sign in page
  //         return redirect("/auth/login");
  //     } else {}
  // } else if (route.path === "/dashboard/EditEvent") {
  //     if (!app.$fire.auth.currentUser) {
  //         //leave them on the sign in page
  //         return redirect("/auth/login");
  //     } else {}
  // } else if (route.path === "/dashboard/scanqr/qr") {
  //     if (!app.$fire.auth.currentUser) {
  //         //leave them on the sign in page
  //         return redirect("/auth/login");
  //     } else {}
  // } else if (route.path === "/dashboard") {
  //     if (!app.$fire.auth.currentUser) {
  //         //leave them on the sign in page
  //         return redirect("/auth/login");
  //     } else {}
  // } else if (route.path === "/dashboard/uploadEvent") {
  //     if (!app.$fire.auth.currentUser) {
  //         //leave them on the sign in page
  //         return redirect("/auth/login");
  //     } else {}
   }
}
