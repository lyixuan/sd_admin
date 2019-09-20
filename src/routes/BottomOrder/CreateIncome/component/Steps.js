import React, { Component } from 'react';
import { Modal, Button } from 'antd';

class Steps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      step1disabled: false,
      step2disabled: false,
    };
  }

  //   componentDidMount() {
  //     const { visible, step1disabled } = this.props.params;
  //     this.setState({ visible, step1disabled });
  //   }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.visible !== nextProps.params.visible) {
      this.setState({ visible: nextProps.params.visible });
      return true;
    }
    if (this.state.step1disabled !== nextProps.params.step1disabled) {
      this.setState({ step1disabled: nextProps.params.step1disabled });
      return true;
    }
    if (this.state.step2disabled !== nextProps.params.step2disabled) {
      this.setState({ step2disabled: nextProps.params.step2disabled });
      return true;
    }
    return false;
  }

  handleCancel = () => {
    this.props.onCancel();
  };

  next = () => {
    const { step1Fetch, step2Fetch, step3Fetch, current } = this.props.params;
    // editLoading(true);
    switch (current) {
      case 0:
        step1Fetch();
        break;
      case 1:
        step2Fetch();
        break;
      case 2:
        step3Fetch();
        break;
      default:
        break;
    }
  };
  prev = () => {
    const { current, editCurrent } = this.props.params;
    editCurrent(current - 1);
    // 需要一个防抖的方法。
  };

  render() {
    const { loading, visible, step1disabled, step2disabled } = this.state;
    const { current, steps } = this.props.params;

    const footer = [
      [
        <Button key="back" onClick={this.handleCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={this.next}
          disabled={step1disabled}
        >
          下一步
        </Button>,
      ],
      [
        <Button key="back" onClick={this.prev}>
          上一步
        </Button>,
        <Button
          disabled={step2disabled}
          key="submit"
          type="primary"
          loading={loading}
          onClick={this.next}
        >
          下一步
        </Button>,
      ],
      [
        <Button key="submit" type="primary" loading={loading} onClick={this.next}>
          知道了
        </Button>,
      ],
    ];

    return (
      <div>
        <Modal
          visible={visible}
          width="520px"
          title={steps[current].title}
          onCancel={this.handleCancel}
          footer={footer[current]}
        >
          {steps[current].content}
        </Modal>
      </div>
    );
  }
}

export default Steps;
