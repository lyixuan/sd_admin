export function formatEmail(str) {
  // if(){
  //
  // }else{}
  const changeEmail = !str.substring(0, str.indexOf('@'))?str:str.substring(0, str.indexOf('@'));

  return changeEmail;
}
