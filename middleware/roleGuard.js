// middleware/roleGuard.js
import axios from "axios";

const API_BASE = "https://yayalinkserver-production-b920.up.railway.app/api";

const EMPLOYER_ONLY = ["/employer", "/candidate_info" ,"/selection"];
const BUREAU_ONLY = ["/bureau"];
const SHARED = ["/"]; // accessible by both

export default async function ({ redirect, route, $fire }) {
  if (!$fire || !$fire.auth) return;

  const user = $fire.auth.currentUser;
  if (!user) {
    return redirect("/login");
  }

  const path = route.path;

  // Only guard the pages we care about
  const isEmployerPage = EMPLOYER_ONLY.some((p) => path.startsWith(p));
  const isBureauPage = BUREAU_ONLY.some((p) => path.startsWith(p));

  if (!isEmployerPage && !isBureauPage) return;

  // Look up role
  let role = null;
  try {
    const res = await axios.get(`${API_BASE}/user-role/${user.uid}`);
    role = res.data.role;
  } catch (err) {
    console.error("roleGuard: role lookup failed", err);
    return redirect("/");
  }

  if (!role) {
    // Not registered as either
    return redirect("/register");
  }

  if (isEmployerPage && role !== "employer") {
    return redirect("/bureau");
  }

  if (isBureauPage && role !== "bureau") {
    return redirect("/employer");
  }
}