export function redirectToLogin() {
  const { href, origin } = window.location;
  const serverUrl = `${origin}/tologin`;
  window.location.href = `${serverUrl}?originPage=${href}`;
}

export function casLogout() {
  const { origin } = window.location;
  const serverUrl = `${origin}/ew/caslogout`;
  window.location.href = `${serverUrl}`;
}
