import RenderAuthorized from '../components/Authorized';
import { getAuthority } from './authority';

let Authorized = RenderAuthorized(getAuthority()); // eslint-disable-line

// Reload the rights component
const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getAuthority());
};
// 获取token
const checkoutToken = () => {
  const tokenObj = getAuthority('admin_user') || {};
  const { userId = '', token = '' } = tokenObj;
  return `${userId}_${token}`;
};

export { reloadAuthorized, checkoutToken };
export default Authorized;
