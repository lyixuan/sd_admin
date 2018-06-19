// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(key) {
  return localStorage.getItem(key);
}

export function setAuthority(key,value) {
  return localStorage.setItem(key,JSON.stringify(value));
}
