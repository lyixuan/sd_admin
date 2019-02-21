import React, { Component } from 'react';
import { Form, Select, Button, Upload, message, Spin } from 'antd';
import UEditor from '../../../components/wangEditor';
import common from '../../../routes/Common/common.css';
import ModalDialog from '../../../selfComponent/Modal/Modal';
import { uploadAttachment, uploadPic } from '../../../services/api';
import styles from './common.less';
import selfStyles from '../ExcellentCase.css';
import { ADMIN_USER } from '../../../utils/constants';
import { getAuthority } from '../../../utils/authority';
import { checkoutToken } from '../../../utils/Authorized';

const headerObj = { authorization: checkoutToken() };
const FormItem = Form.Item;
const { Option } = Select;
let isLt10M = false;
let isZip = false;
// 请与wangEditor里的PlaceHolder保持一致
const PlaceHolder = '<p style="color:#aaa" class="mypleceholder">请输入...</p>';

class RoleForm extends Component {
  constructor(props) {
    super(props);
    const localStorage = getAuthority(ADMIN_USER);
    const userId = !localStorage ? null : localStorage.userId;
    this.state = {
      loading: false,
      visible: false,
      sendVal: '',
      fileList: this.props.fileList,
      userId,
    };
    this.applyNote = '';
    this.showattachment = null;
  }
  /*
  * 取消事件
  * */
  cancel = () => {
    window.history.go(-1);
  };
  /*
  * 提交事件
  * */
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          sendVal: values,
        });
        this.showModal(true);
      } else {
        console.error(err);
      }
    });
  };

  uploadFileChange = info => {
    // tip 目前支持上传一个文件
    let { fileList } = info;
    if (isLt10M) {
      fileList = fileList.slice(-1);
      if (isZip) {
        this.setState({ fileList });
      }
    }
    const { saveFileList } = this.props;
    if (info.file.response) {
      if (info.file.response.code === 2000) {
        if (saveFileList) {
          saveFileList(fileList);
        }
      } else {
        message.error(info.file.response.msg);
      }
    }
  };

  // 文件预上传判断
  beforeUpload = file => {
    const arr = file.name.split('.');
    isZip = arr[arr.length - 1] === 'zip' || arr[arr.length - 1] === 'rar';
    if (!isZip) {
      message.error('文件仅支持zip或rar格式!');
    }
    isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('文件不能大于10MB！');
    }
    return isZip && isLt10M;
  };

  // 模态框确定
  clickModalOK = () => {
    const { sendVal, userId, fileList } = this.state;
    const attachmentUrl = fileList.length > 0 ? fileList[0].response.data.path : '';
    this.props.jumpFunction.dispatch({
      type: 'excellent/excellentAdd',
      payload: { userId, attachmentUrl, ...sendVal },
    });
    this.showModal(false);
  };
  // 模态框显隐回调
  showModal = bol => {
    this.setState({
      visible: bol,
    });
  };
  editApplyNote = (val, w) => {
    this.applyNote = w.props.applynote;
    this.showattachment = w.props.showattachment;
  };
  renderApply = (val1, val2) => {
    return (
      <>
        <span>{val1}</span>
        <br />
        <span>{val2}</span>
      </>
    );
  };
  render() {
    const showInfo = this.props.jumpFunction.excellent.preInfo || {};
    const applyList = showInfo.certificationItemList ? showInfo.certificationItemList : [];
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const props = {
      beforeUpload: this.beforeUpload,
      onChange: this.uploadFileChange,
    };
    const { visible } = this.state;
    const uploadButton = (
      <Button
        type="primary"
        className={common.submitButton}
        style={{ margin: '0' }}
        loading={false}
      >
        上传附件
      </Button>
    );

    return (
      <Spin spinning={this.props.jumpFunction.getInfoLoading}>
        <div className={styles.formCls}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="申&nbsp;&nbsp;请&nbsp;&nbsp;人：">
              <div>
                {`${showInfo.name} ${
                  window.BI_Filter(`FRONT_ROLE_TYPE_LIST|id:${showInfo.userType}`).name
                } ${showInfo.org}`}
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label="认证项目：">
              {getFieldDecorator('certificationItemId', {
                rules: [
                  {
                    required: true,
                    message: '认证项目为必选项',
                  },
                ],
              })(
                <Select
                  placeholder="请选择"
                  style={{ width: 230, height: 32 }}
                  flag="type"
                  type="select"
                  onChange={(val, w) => this.editApplyNote(val, w)}
                >
                  {applyList.map(item => (
                    <Option
                      key={`ID_${item.id}`}
                      value={item.id}
                      applynote={this.renderApply(item.assessStandard, item.assessStyle)}
                      showattachment={item.allowUpdateAttachment ? 1 : 0}
                    >
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="申请说明：">
              <div>{this.applyNote}</div>
            </FormItem>
            {!this.showattachment ? null : (
              <FormItem {...formItemLayout} label="上传附件：">
                <div className={selfStyles.selfSty}>
                  <Upload
                    {...props}
                    headers={headerObj}
                    action={uploadAttachment()}
                    fileList={this.state.fileList}
                  >
                    {Array.isArray(this.state.fileList)
                      ? this.state.fileList.length >= 1 ? null : uploadButton
                      : null}
                  </Upload>
                  <span style={{ color: '#bfbfbf' }}>(文件不能超过10M，格式要求：.zip/.rar)</span>
                </div>
              </FormItem>
            )}
            <FormItem
              className="textAreaErrorSpan"
              {...formItemLayout}
              label="详&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;情："
            >
              {getFieldDecorator('detail', {
                rules: [
                  {
                    required: true,
                    message: '详情为必填项',
                  },
                  {
                    validator(rule, value, callback) {
                      if (value && (value === PlaceHolder || value === '<p><br></p>')) {
                        callback({ message: '详情为必填项' });
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              })(<UEditor path={uploadPic()} />)}
            </FormItem>
            <FormItem>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={this.cancel} type="primary" className={common.cancleButton}>
                  取消
                </Button>
                <Button
                  loading={this.state.loading}
                  htmlType="submit"
                  type="primary"
                  className={common.submitButton}
                >
                  提交
                </Button>
              </div>
            </FormItem>
          </Form>
          <ModalDialog
            title="提交申请"
            visible={visible}
            modalContent={<div style={{ textAlign: 'left' }}>是否确定提交认证申请？</div>}
            showModal={bol => this.showModal(bol)}
            clickOK={() => this.clickModalOK()}
          />
        </div>
      </Spin>
    );
  }
}

export default RoleForm;
