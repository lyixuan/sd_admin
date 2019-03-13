import { getAuthority } from './authority';

export function checkoutLogin() {
  console.log(getAuthority('admin_user'));
  const adminUser = getAuthority('admin_user');
  if (adminUser && adminUser.password && adminUser.mail) {
    return true;
  } else return false;
}

export function checkoutAuthRoute(authority) {
  const authData = getAuthority('admin_auth') || [];
  const isHasPath = authData.find(item => item.resourceUrl === authority);
  return isHasPath;
}
