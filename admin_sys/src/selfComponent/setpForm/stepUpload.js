import React, { Component } from 'react';
import { message, Upload } from 'antd';
import uploadImg from '../../assets/uploadImg.png';
import styles from './step.css';

let isExcel = false;
let isLt10M = false;
class stepUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleChange = info => {
    // todo 目前支持上传一个文件
    let { file } = info;
    if (file.response.code === 2000) {
      // todo 上传成功，更改下一步状态
      console.log(1);
    }
    if (isLt10M) {
      file = file.slice(-1);
      if (isExcel) {
        this.setState({ file });
      }
    }
  };
  render() {
    const { uploadUrl } = this.props;
    const props = {
      action: `http://172.16.117.65:8084${uploadUrl}`,
      beforeUpload(file) {
        isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        if (!isExcel) {
          message.error('请上传 Excel 文件！');
        }

        isLt10M = file.size / 1024 / 1024 < 30;
        if (!isLt10M) {
          message.error('文件不能大于 10MB！');
        }
        return isExcel && isLt10M;
      },
      onChange: this.handleChange,
      onRemove(e) {
        console.log(e);
      },
    };

    return (
      <div className={styles.wrap}>
        <div className={styles.upload}>
          <Upload {...props} fileList={this.state.file}>
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
