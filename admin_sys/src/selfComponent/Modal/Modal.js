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
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = nextProps;
    if (nextProps.visible && !this.state.visible) {
      this.setState({
        visible,
      });
    }
  }

  handleOk = e => {
    const { clickOK } = this.props;
    if (clickOK) {
      clickOK(e);
    }
    this.setState({
      visible: false,
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { title, name, modalContent, footButton } = this.props;
    const defaultModal = (
      <div>
        <p className={styles.name}> {name} </p>
        <Input className={styles.shotName} />
      </div>
    );
    const defaultBtn = !footButton ? ['取消', '确定'] : footButton;
    return (
      <div>
        <Modal
          title={title}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" className={common.cancleButton} onClick={this.handleCancel}>
              {defaultBtn[0]}
            </Button>,
            <Button
              key="submit"
              type="primary"
              className={common.submitButton}
              onClick={this.handleOk}
            >
              {defaultBtn[1]}
            </Button>,
          ]}
        >
          {!modalContent ? defaultModal : <div style={{ textAlign: 'center' }}>{modalContent}</div>}
        </Modal>
      </div>
    );
  }
}

export default ModalDemo;
