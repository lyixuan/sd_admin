// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(key) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : value;
}

export function setAuthority(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}
