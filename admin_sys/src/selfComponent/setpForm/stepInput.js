/*
* inputTitle，请输入想删除的 “子订单编号”
* inputContent, 文本框
* inputTip，注意事项，有的话传true
* */
import React, { Component } from 'react';
import { Input } from 'antd';
import styles from './step.css';

const { TextArea } = Input;

class stepInput extends Component {
  render() {
    const { inputTitle, inputInfo, inputContent, inputTip } = this.props;
    return (
      <div className={styles.wrap}>
        {inputTitle ? <div className={styles.inputTitle}>{inputTitle}</div> : null}
        {inputInfo ? <div className={styles.inputInfo}>{inputInfo}</div> : null}
        {inputContent ? (
          <div className={styles.inputContent}>
            {!inputTip ? <div className={styles.inputContent_title}>搜索失败的编号：</div> : null}
            <TextArea
              className={styles.inputTextArea}
              rows={5}
              placeholder="请输入编号，多个编号，请用空格隔开"
            />
          </div>
        ) : null}
        {inputTip ? (
          <div className={styles.inputTip}>
            <h1 className={styles.inputTip_txt}>注意事项：</h1>
            <p className={styles.inputTip_txt}>多个编号，请用空格隔开</p>
            <p className={styles.inputTip_txt}>
              每天13:20前删除的数据，当天13:30后前端更新。13:20之后删除的数据，隔天13:30后前端更新。
            </p>
            <p className={styles.inputTip_txt}>删除数据，仅限7天以内的数据</p>
          </div>
        ) : null}
      </div>
    );
  }
}

export default stepInput;
