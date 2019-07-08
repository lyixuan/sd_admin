import { getAuthority } from './authority';
import storage from './storage';

export function checkoutLogin() {
  const adminUser = storage.getItem('admin_user');
  if (adminUser && adminUser.userId && adminUser.mail && adminUser.userName) {
    return true;
  } else return false;
}

export function checkoutAuthRoute(authority) {
  const authData = getAuthority('admin_auth') || [];
  const isHasPath = authData.find(item => item.resourceUrl === authority);
  return isHasPath;
}
