import React, { PureComponent } from 'react';
import { Layout, Radio } from 'antd';
import { routerRedux } from 'dva/router';
import GlobalHeader from 'components/GlobalHeader';
import Modal from '@/selfComponent/Modal/Modal';
import styles from './styles/header.less';

const { Header } = Layout;
const RadioGroup = Radio.Group;

export default class SelfHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      roleSelected: 'Apple',
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
  choseRole = e => {
    const roleSelected = e.target.value;
    this.setState({ roleSelected });
  };
  sureChoseRole = () => {
    console.log('qingqiu');
  };
  renderContent = () => {
    const plainOptions = ['Apple', 'Pear', 'Orange'];
    const { roleSelected } = this.state;
    return (
      <div className={styles.modalContent}>
        <RadioGroup value={roleSelected} onChange={this.choseRole}>
          {plainOptions.map(item => (
            <Radio style={radioStyle} value={item} key={item}>
              {item}
            </Radio>
          ))}
        </RadioGroup>
      </div>
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
