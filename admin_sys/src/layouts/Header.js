import React, { PureComponent } from 'react';
import { Layout, Radio } from 'antd';
import { routerRedux } from 'dva/router';
import GlobalHeader from 'components/GlobalHeader';
import Modal from '@/selfComponent/Modal/Modal';
import styles from './header.less';

const { Header } = Layout;
const RadioGroup = Radio.Group;

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
  renderContent = () => {
    const plainOptions = ['Apple', 'Pear', 'Orange'];
    const value = 'Apple';
    return (
      <ul className={styles.modalContent}>
        <li className={styles.item}>
          <RadioGroup options={plainOptions} value={value} />
        </li>
      </ul>
    );
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
          modalContent={this.renderContent()}
          footButton={['取消', '确定']}
          showModal={this.showModal}
        />
      </Header>
    );
  }
}
