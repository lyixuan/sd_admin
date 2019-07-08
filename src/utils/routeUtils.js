export function redirectToLogin() {
  const { href, origin } = window.location;
  const serverUrl = `${origin}/tologin`;
  window.location.href = `${serverUrl}?originPage=${href}`;
}

export function casLogout() {
  const { origin } = window.location;
  const logoutUrl = `${origin}/ew/caslogout?`;
  const pageUrl = `pageUrl?${origin}/tologin?originPage=${origin}`;

  window.location.href = `${logoutUrl}${pageUrl}`;
}
