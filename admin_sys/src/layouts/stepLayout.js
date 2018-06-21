import React, { Component } from 'react';
import { Steps, Button, message } from 'antd';
import styles from './stepLayout.css';

const { Step } = Steps;

class StepLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }
  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  render() {
    const { title, steps } = this.props;
    const { current } = this.state;
    return (
      <div className={styles.normal}>
        <div className={styles.title}>{title}</div>
        <div className={styles.content}>
          <Steps current={current} progressDot>
            {steps.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
          <div className={styles.stepsContent}>{steps[this.state.current].content}</div>
          <div className={styles.stepsAction}>
            {this.state.current > 0 &&
              this.state.current !== steps.length - 1 && (
                <Button onClick={() => this.prev()}>上一步</Button>
              )}
            {this.state.current < steps.length - 1 && (
              <Button style={{ marginLeft: 8 }} type="primary" onClick={() => this.next()}>
                下一步
              </Button>
            )}
            {this.state.current === steps.length - 1 && (
              <Button type="primary" onClick={() => message.success('Processing complete!')}>
                确定
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default StepLayout;
