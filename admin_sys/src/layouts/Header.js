import React, { PureComponent } from 'react';
import { Layout, Radio, Spin } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import GlobalHeader from 'components/GlobalHeader';
import Modal from '@/selfComponent/Modal/Modal';
import { getAuthority } from '@/utils/authority';
import { ADMIN_USER } from '@/utils/constants';
import styles from './styles/header.less';

const { Header } = Layout;
const RadioGroup = Radio.Group;

@connect(({ login, loading }) => ({
  login,
  loading,
  getRoleListLoading: loading.effects['login/CurrentUserListRole'],
  roleList: login.roleList,
}))
export default class SelfHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      roleSelected: getAuthority(ADMIN_USER).userId,
    };
  }
  getRoleList = () => {
    this.props.dispatch({
      type: 'login/CurrentUserListRole',
      payload: { userId: getAuthority(ADMIN_USER).userId },
    });
  };
  handleMenuClick = ({ key }) => {
    switch (key) {
      case 'changePwd':
        this.props.dispatch(routerRedux.push('/changePwd/changePassword'));
        break;
      case 'logout':
        this.props.dispatch({ type: 'login/logout' });
        break;
      case 'changeRole':
        this.showModal(true);
        break;
      default:
        break;
    }
  };
  showModal = bol => {
    const { visible } = this.state;
    if (visible !== bol) {
      this.setState({ visible: bol });
      if (bol) {
        this.getRoleList();
      }
    }
  };
  choseRole = e => {
    const roleSelected = e.target.value;
    this.setState({ roleSelected });
  };
  sureChoseRole = () => {
    const { roleSelected } = this.state;
    const { roleList = [] } = this.props;
    if (getAuthority(ADMIN_USER).userId === roleSelected) {
      this.setState({ visible: false });
      return;
    }
    this.props.dispatch({
      type: 'login/changeRole',
      payload: roleList.find(item => item.userId === roleSelected) || {},
    });
    this.setState({ visible: false });
  };
  handleMenuList = () => {
    const selectedGroup = window.Filter('GLOBAL_HEADER_SELECT');
    const adminUser = getAuthority(ADMIN_USER) || {};
    const positionCount = adminUser.positionCount || 0;
    //  positionCount<=1  hide  changeRole selectItem
    return selectedGroup.filter(item => item.id !== 'changeRole' || positionCount > 1);
  };
  renderContent = () => {
    const { roleSelected } = this.state;
    const { roleList = [], getRoleListLoading } = this.props;
    return (
      <div className={styles.modalContent}>
        <Spin spinning={getRoleListLoading}>
          <RadioGroup value={roleSelected} onChange={this.choseRole}>
            {roleList.map(item => (
              <Radio style={radioStyle} value={item.userId} key={item.userId}>
                {item.roleName}
              </Radio>
            ))}
          </RadioGroup>
        </Spin>
      </div>
    );
  };
  render() {
    const { visible } = this.state;
    const selectedGroup = this.handleMenuList();
    return (
      <Header style={{ padding: 0 }}>
        <GlobalHeader
          {...this.props}
          onMenuClick={this.handleMenuClick}
          selectedGroup={selectedGroup}
        />
        <Modal
          visible={visible}
          title="切换角色"
          modalContent={this.renderContent()}
          clickOK={this.sureChoseRole}
          footButton={['取消', '确定']}
          showModal={this.showModal}
        />
      </Header>
    );
  }
}
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};
