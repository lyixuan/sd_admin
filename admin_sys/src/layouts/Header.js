import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import { routerRedux } from 'dva/router';
import GlobalHeader from 'components/GlobalHeader';
import Modal from '@/selfComponent/Modal/Modal';

const { Header } = Layout;

export default class SelfHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
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
    }
  };
  renderChosePoleDialog = () => {};
  render() {
    const { visible } = this.state;
    return (
      <Header style={{ padding: 0 }}>
        <GlobalHeader {...this.props} onMenuClick={this.handleMenuClick} />
        <Modal
          visible={visible}
          title="切换角色"
          footButton={['确定']}
          showModal={this.showModal}
        />
      </Header>
    );
  }
}
