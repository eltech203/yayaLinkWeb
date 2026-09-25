// middleware/roleGuard.js
import axios from "axios";

const API_BASE = "https://yayalinkserver-production-b920.up.railway.app/api";

const EMPLOYER_ONLY = ["/employer", "/candidate_info", "/selection"];
const BUREAU_ONLY = ["/bureau"];
const PUBLIC_PATHS = ["/login", "/register"];

// Simple in-memory cache so we don't hammer the API on every navigation
// (cleared on full page reload — good enough for a session)
let roleCache = { uid: null, role: null, at: 0 };
const ROLE_CACHE_TTL = 60 * 1000; // 60 seconds

export default async function ({ redirect, route, $fire }) {
  if (!$fire || !$fire.auth) return;

  const user = $fire.auth.currentUser;
  if (!user) {
    // Only redirect to login if they're on a guarded page
    const path = route.path;
    const isGuarded =
      EMPLOYER_ONLY.some((p) => path.startsWith(p)) ||
      BUREAU_ONLY.some((p) => path.startsWith(p));

    if (isGuarded) return redirect("/login");
    return;
  }

  const path = route.path;

  // Skip auth pages entirely
  if (PUBLIC_PATHS.some((p) => path.startsWith(p))) return;

  const isEmployerPage = EMPLOYER_ONLY.some((p) => path.startsWith(p));
  const isBureauPage = BUREAU_ONLY.some((p) => path.startsWith(p));

  // Not a guarded page — let it through
  if (!isEmployerPage && !isBureauPage) return;

  /* ─── Look up role (with cache) ─── */
  let role = null;

  try {
    const now = Date.now();
    if (roleCache.uid === user.uid && now - roleCache.at < ROLE_CACHE_TTL) {
      role = roleCache.role;
    } else {
      const res = await axios.get(`${API_BASE}/user-role/${user.uid}`);
      // ⚠️ Normalize — backend may return "BUREAU", "Bureau", or "bureau"
      role = (res.data && res.data.role)
        ? String(res.data.role).trim().toLowerCase()
        : null;

      roleCache = { uid: user.uid, role, at: now };
    }
  } catch (err) {
    console.error("roleGuard: role lookup failed", err);

    // Don't loop — send them to the home page instead
    if (path !== "/") return redirect("/");
    return;
  }

  /* ─── No role at all ─── */
  if (!role) {
    // Already on register — don't redirect again
    if (path.startsWith("/register")) return;

    // Send to register based on which section they were trying to access
    if (isBureauPage) return redirect("/register/bureau");
    return redirect("/register/employer");
  }

  /* ─── Role guards ─── */
  if (isEmployerPage && role !== "employer") {
    // Only redirect if we're not already going to the right place
    if (path !== "/bureau") return redirect("/bureau");
    return;
  }

  if (isBureauPage && role !== "bureau") {
    if (path !== "/employer") return redirect("/employer");
    return;
  }

  // ✅ Role matches — allow
  return;
}