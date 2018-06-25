import React, { Component } from 'react';
import { message, Upload } from 'antd';
import uploadImg from '../../assets/uploadImg.png';
import styles from './step.css';

let isExcel = false;
let isLt35M = false;
class stepUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleChange = info => {
    let { fileList } = info;
    if (isLt35M) {
      fileList = fileList.slice(-1);
      if (isExcel) {
        this.setState({ fileList });
      }
    }
  };
  render() {
    const props = {
      action: '//jsonplaceholder.typicode.com/posts/',
      beforeUpload(file) {
        isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        if (!isExcel) {
          message.error('只能上传 Excel 文件哦！');
        }

        isLt35M = file.size / 1024 / 1024 < 30;
        if (!isLt35M) {
          message.error('只能上传小于 35M 的文件哦！');
        }
        return isExcel && isLt35M;
      },
      onChange: this.handleChange,
      onRemove(e) {
        console.log(e);
      },
    };

    return (
      <div className={styles.wrap}>
        <div className={styles.upload}>
          <Upload {...props} fileList={this.state.fileList}>
            <img className={styles.uploadImg} src={uploadImg} alt="上传Excel" />
            <p className={styles.uploadTxt}> 选择文件 </p>
          </Upload>
        </div>

        <div className={styles.tip}>
          <h1 className={styles.title}>注意事项：</h1>
          <p className={styles.txt}>
            每天13:20前导入的数据，当天13:30后前端可见。13:20之后导入的数据，隔天13:30后前端可见。
          </p>
          <p className={styles.txt}>上传的数据限7天以内的数据</p>
        </div>
      </div>
    );
  }
}

export default stepUpload;
