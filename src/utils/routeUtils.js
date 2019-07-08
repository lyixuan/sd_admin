export function redirectToLogin() {
  const { href, origin } = window.location;
  const serverUrl = `${origin}/tologin`;
  window.location.href = `${serverUrl}?originPage=${href}`;
}
