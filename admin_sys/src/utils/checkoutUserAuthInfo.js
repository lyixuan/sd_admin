import { getAuthority } from './authority';

export function checkoutLogin() {
  const adminUser = getAuthority('admin_user');

  if (adminUser && adminUser.password && adminUser.mail) {
    return true;
  } else return false;
}

export function checkoutAuthRoute() {
  // const authInfo = JSON.parse(getAuthority('authInfo'));
  return true;
}
