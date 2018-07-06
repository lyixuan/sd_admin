/*
* title：字符串，弹框标题
* visible：布尔值，弹框显隐
* showModal：函数，控制弹框显隐
* modalContent：html，弹框中间内容
* clickOK点击确认按钮回调
* footButton：数组，['是'，'否']
* */
import React from 'react';
import { Modal, Input, Button } from 'antd';
import common from '../../routes/Common/common.css';
import styles from './Modal.css';

class ModalDemo extends React.Component {
  handleOk = e => {
    const { clickOK } = this.props;
    if (clickOK) {
      clickOK(e);
    }
    this.handleCancel(false);
  };
  handleCancel = bol => {
    if (this.props.showModal) {
      this.props.showModal(bol);
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
          <Button key={0} className={common.submitButton} onClick={this.handleOk}>
            {buttonArray[0]}
          </Button>,
        ];
      } else if (Array.isArray(buttonArray) && buttonArray.length === 2) {
        return [
          <Button key={0} className={common.cancleButton} onClick={this.handleCancel}>
            {buttonArray[0]}
          </Button>,
          <Button key={1} className={common.submitButton} onClick={this.handleOk}>
            {buttonArray[1]}
          </Button>,
        ];
      } else {
        console.warn('传入数组');
      }
    }
  };

  render() {
    const { title, name, modalContent, footButton, visible } = this.props;
    const defaultModal = (
      <div>
        <p className={styles.name}> {name} </p>
        <Input className={styles.shotName} />
      </div>
    );
    return !visible ? null : (
      <div>
        <Modal
          title={title}
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel.bind(this, false)}
          footer={this.checkoutFootButton(footButton)}
        >
          {!modalContent ? defaultModal : <div style={{ textAlign: 'center' }}>{modalContent}</div>}
        </Modal>
      </div>
    );
  }
}

export default ModalDemo;
