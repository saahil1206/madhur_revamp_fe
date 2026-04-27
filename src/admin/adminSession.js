export function clearAdminSession(reason = "") {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");

  if (reason) {
    sessionStorage.setItem("admin_logout_reason", reason);
  } else {
    sessionStorage.removeItem("admin_logout_reason");
  }
}

export function storeAdminSession(token, user) {
  localStorage.setItem("admin_token", token);
  localStorage.setItem("admin_user", JSON.stringify(user || {}));
  sessionStorage.removeItem("admin_logout_reason");
}

export function getAdminToken() {
  return localStorage.getItem("admin_token");
}
