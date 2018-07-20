/*
* title,
* steps,
* baseLayout,
* isDisabled，
* step1Fetch, 第一步接口请求
* step2Fetch, 第二步接口请求
* step3Fetch, 第三步接口请求
* current,    当前步骤下标
* editCurrent 修改步骤
* */
import React, { Component } from 'react';
import { Steps, Button } from 'antd';
import common from '../routes/Common/common.css';
import ContentLayout from './ContentLayout';
import styles from './stepLayout.css';

const { Step } = Steps;

class StepLayout extends Component {
  // 下一页
  next() {
    const { step1Fetch, step2Fetch, step3Fetch, current, editLoading } = this.props;
    editLoading(true);
    if (current === 0) {
      if (step1Fetch) {
        step1Fetch();
      } else {
        console.warn('添加step1Fetch方法');
      }
    } else if (current === 1) {
      if (step2Fetch) {
        step2Fetch();
      } else {
        console.warn('添加step2Fetch方法');
      }
    } else if (current === 2) {
      if (step3Fetch) {
        step3Fetch();
      } else {
        console.warn('添加step3Fetch方法');
      }
    } else {
      console.log('4');
    }
  }
  // 上一页
  prev() {
    const { editCurrent, current, callBackParent, initParamsFn } = this.props;
    editCurrent(current - 1);
    callBackParent(false);
    if (current === 1 && initParamsFn) {
      initParamsFn(null);
    }
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
    const {
      title,
      steps,
      baseLayout,
      isDisabled,
      disableDel,
      current,
      isLoading,
      routerData,
    } = this.props;
    const dis = disableDel === null ? isDisabled : disableDel;

    const stepBlock = (
      <div>
        {steps ? (
          <div>
            <Steps current={current} progressDot>
              {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
            <div>{steps[current] ? steps[current].content : null}</div>
            <div className={styles.stepsAction}>
              {current === 0 && (
                <Button onClick={() => this.cancel()} className={common.cancleButton}>
                  取消
                </Button>
              )}
              {current > 0 &&
                current !== steps.length - 1 && (
                  <Button onClick={() => this.prev()} className={common.cancleButton}>
                    上一步
                  </Button>
                )}
              {current < steps.length - 1 && (
                <Button
                  className={common.submitButton}
                  type="primary"
                  onClick={() => this.next()}
                  disabled={dis}
                  loading={isLoading}
                >
                  下一步
                </Button>
              )}
              {current === steps.length - 1 && (
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
      <ContentLayout
        routerData={routerData}
        title={title}
        bottomLine={<div className={styles.content}>{!baseLayout ? stepBlock : baseLayout}</div>}
      />
      // <div className={styles.normal}>
      //   <div className={styles.title}>{title}</div>
      //   <div className={styles.content}>{!baseLayout ? stepBlock : baseLayout}</div>
      // </div>
    );
  }
}

export default StepLayout;
