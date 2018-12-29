/*
* title：字符串，弹框标题
* visible：布尔值，弹框显隐
* showModal：函数，控制弹框显隐
* modalContent：html，弹框中间内容
* clickOK点击确认按钮回调
* footButton：数组，['是'，'否']
* */
import React from 'react';
import { Modal, Button } from 'antd';
import common from '../../routes/Common/common.css';
import styles from './index.less';

class ModalDemo extends React.Component {
  handleOk = e => {
    const { clickOK } = this.props;
    if (clickOK) {
      clickOK(e);
    }
  };
  handleCancel = () => {
    if (this.props.showModal) {
      this.props.showModal(false);
    } else {
      console.warn('传入showModal方法');
    }
  };
  checkoutFootButton = footButton => {
    if (footButton && typeof footButton === 'object' && !Array.isArray(footButton)) {
      // 判断传入的是node
      return footButton;
    } else {
      const buttonArray = !footButton ? ['取消', '确定'] : footButton;
      if (Array.isArray(buttonArray) && buttonArray.length === 1) {
        return [
          <Button key={0} className={common.searchButton} onClick={this.handleOk}>
            {buttonArray[0]}
          </Button>,
        ];
      } else if (Array.isArray(buttonArray) && buttonArray.length === 2) {
        return [
          <Button key={0} className={common.cancleButton} onClick={this.handleCancel}>
            {buttonArray[0]}
          </Button>,
          <Button key={1} className={common.searchButton} onClick={this.handleOk}>
            {buttonArray[1]}
          </Button>,
        ];
      } else {
        console.warn('传入数组');
      }
    }
  };

  render() {
    const { title, footButton, visible, children = [] } = this.props;
    return !visible ? null : (
      <Modal
        width={400}
        title={title}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel.bind(this, false)}
        footer={this.checkoutFootButton(footButton)}
        wrapClassName={styles.confirmModal}
      >
        <div style={{ textAlign: 'center' }} className={styles.modalContent}>
          {children && { ...children }}
        </div>
      </Modal>
    );
  }
}

export default ModalDemo;
