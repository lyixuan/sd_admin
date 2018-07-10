/*
* title,
* steps,
* baseLayout,
* isDisabled，
* step1Fetch, 第一步接口请求
* step2Fetch, 第二步接口请求
* step3Fetch, 第三步接口请求
* nums,       所有的nums
* successNums 校验成功的nums
* */
import React, { Component } from 'react';
import { Steps, Button } from 'antd';
import styles from './stepLayout.css';
import common from '../routes/Common/common.css';

const { Step } = Steps;

class StepLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }

  // 下一页
  next() {
    const current = this.state.current + 1;
    const { step1Fetch, step2Fetch, step3Fetch, nums, successNums } = this.props;
    this.setState({ current });
    console.log(current);
    if (current === 1) {
      if (step1Fetch) {
        step1Fetch({ nums });
      } else {
        console.warn('添加step1Fetch方法');
      }
    } else if (current === 2) {
      if (step2Fetch) {
        step2Fetch({ nums: successNums });
      } else {
        console.warn('添加step2Fetch方法');
      }
    } else if (current === 3) {
      if (step3Fetch) {
        step3Fetch({ nums: successNums });
      } else {
        console.warn('添加step3Fetch方法');
      }
    } else {
      console.log('4');
    }
  }
  // 上一页
  prev() {
    const current = this.state.current - 1;
    console.log(current);
    this.setState({ current });
  }
  // 取消---回到列表页
  cancel = () => {
    window.history.go(-1);
  };
  // 确定---回到列表页
  clickOk = () => {
    this.props.goBack();
  };
  render() {
    const { title, steps, baseLayout, isDisabled } = this.props;
    const { current } = this.state;

    const stepBlock = (
      <div>
        {steps ? (
          <div>
            <Steps current={current} progressDot>
              {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
            <div>{steps[this.state.current].content}</div>
            <div className={styles.stepsAction}>
              {this.state.current === 0 && (
                <Button onClick={() => this.cancel()} className={common.cancleButton}>
                  取消
                </Button>
              )}
              {this.state.current > 0 &&
                this.state.current !== steps.length - 1 && (
                  <Button onClick={() => this.prev()} className={common.cancleButton}>
                    上一步
                  </Button>
                )}
              {this.state.current < steps.length - 1 && (
                <Button
                  className={common.submitButton}
                  type="primary"
                  onClick={() => this.next()}
                  disabled={isDisabled}
                >
                  下一步
                </Button>
              )}
              {this.state.current === steps.length - 1 && (
                <Button type="primary" onClick={this.clickOk} className={common.submitButton}>
                  确定
                </Button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
    return (
      <div className={styles.normal}>
        <div className={styles.title}>{title}</div>
        <div className={styles.content}>{!baseLayout ? stepBlock : baseLayout}</div>
      </div>
    );
  }
}

export default StepLayout;
