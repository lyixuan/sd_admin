import React, { Component } from 'react';
import styles from './Refund.css';

import { Steps, Button, message, Upload, Icon } from 'antd';

const Step = Steps.Step;
let isJPG = false; /*限制只能上传excel格式*/

class EditRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      fileList: [],
    };
  }

  handleChange = info => {
    const fileList = info.fileList;
    isJPG && this.setState({ fileList });
  };

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  render() {
    const props = {
      action: '//jsonplaceholder.typicode.com/posts/',
      beforeUpload(file) {
        isJPG = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        if (!isJPG) {
          message.error('只能上传 Excel 文件哦！');
        }
        console.log(file);
        return isJPG;
      },
      onChange: this.handleChange,
      multiple: true,
    };
    /*上传组件*/
    const uploadExcel = (
      <Upload {...props} fileList={this.state.fileList}>
        <Button>
          <Icon type="upload" /> 上传Excel
        </Button>
      </Upload>
    );

    const steps = [
      {
        title: '选择Excel',
        content: uploadExcel,
      },
      {
        title: '校验文件',
        content: 'Second-content',
      },
      {
        title: '上传成功',
        content: 'Last-content',
      },
    ];
    const { current } = this.state;

    return (
      <div>
        <Steps current={current}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className={styles.stepsContent}>{steps[this.state.current].content}</div>
        <div className={styles.stepsAction}>
          {this.state.current < steps.length - 1 && (
            <Button type="primary" onClick={() => this.next()}>
              下一步
            </Button>
          )}
          {this.state.current === steps.length - 1 && (
            <Button type="primary" onClick={() => message.success('Processing complete!')}>
              完成
            </Button>
          )}
          {this.state.current > 0 && (
            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
              上一步
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default EditRole;
