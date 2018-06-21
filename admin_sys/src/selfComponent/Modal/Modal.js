import React from 'react';
import { Modal, Input } from 'antd';
import styles from './Modal.css';

class ModalDemo extends React.Component {
  handleOk = e => {
    console.log(e);
    this.props.showModal(false);
  };
  handleCancel = e => {
    console.log(e);
    this.props.showModal(false);
  };
  render() {
    const { title, visible, name } = this.props;
    return (
      <div>
        <Modal title={title} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <p className={styles.name}> {name} </p>
          <Input className={styles.shotName} />
        </Modal>
      </div>
    );
  }
}

export default ModalDemo;
