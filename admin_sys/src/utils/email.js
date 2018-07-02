export function formatEmail(str) {
  const changeEmail = !str.substring(0, str.indexOf('@'))
    ? str
    : str.substring(0, str.indexOf('@'));

  return changeEmail;
}
