import { getAuthority } from './authority';
export function checkoutLogin(){
  const userInfo=JSON.parse(getAuthority('userInfo'));
  return userInfo!==null;
}
export function checkoutAuthRoute(pathName){
  const authInfo=JSON.parse(getAuthority('authInfo'));
  return true
}
