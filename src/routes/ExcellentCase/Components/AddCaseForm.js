import React, { Component } from 'react';
import { Form, Select, Button, Upload, message, Spin } from 'antd';
import UEditor from '../../../components/wangEditor';
import common from '../../../routes/Common/common.css';
import ModalDialog from '../../../selfComponent/Modal/Modal';
import { uploadAttachment } from '../../../services/api';
import styles from './common.less';
import selfStyles from '../ExcellentCase.css';
import { ADMIN_USER } from '../../../utils/constants';
import { getAuthority } from '../../../utils/authority';

const FormItem = Form.Item;
const { Option } = Select;

class RoleForm extends Component {
  constructor(props) {
    super(props);
    const localStorage = getAuthority(ADMIN_USER);
    const userId = !localStorage ? null : localStorage.userId;
    this.state = {
      loading: false,
      visible: false,
      sendVal: '',
      fileList: [],
      userId,
    };
    this.applyNote = '';
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
    const { fileList } = this.state;
    if (fileList.length === 0) {
      message.error('请上传附件');
    } else {
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
    }
  };

  uploadFileChange = info => {
    const { fileList = [], file = {} } = info;
    const isZip = file.type === 'application/zip' || file.type === 'application/x-rar';
    const isLt10M = file.size / 1024 / 1024 < 30;
    if (!isZip) {
      message.error('文件仅支持zip或rar格式!');
      return;
    } else if (!isLt10M) {
      message.error('文件不支持不大于10MB文件!');
      return;
    }
    if (file.response) {
      if (file.response.code === 2000) {
        this.setState({ fileList });
      } else {
        message.error(file.response.msg);
      }
    }
  };
  // 模态框确定
  clickModalOK = () => {
    const { sendVal, userId, fileList } = this.state;
    this.props.jumpFunction.dispatch({
      type: 'excellent/excellentAdd',
      payload: { userId, attachmentUrl: fileList[0].response.data.path, ...sendVal },
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
      name: 'file',
      headers: {
        authorization: 'authorization-text',
      },
      beforeUpload(file) {
        const isZip = file.type === 'application/zip' || file.type === 'application/x-rar';
        if (!isZip) {
          message.error('文件仅支持zip或rar格式!');
        }
        const isLt10M = file.size / 1024 / 1024 < 30;
        if (!isLt10M) {
          message.error('文件不能大于10MB！');
        }
        return isZip && isLt10M;
      },
    };
    const { fileList, visible } = this.state;
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
            <FormItem {...formItemLayout} label="上传附件：">
              <div className={selfStyles.selfSty}>
                <Upload {...props} action={uploadAttachment()} onChange={this.uploadFileChange}>
                  {Array.isArray(fileList) ? (fileList.length >= 1 ? null : uploadButton) : null}
                </Upload>
                <span style={{ color: '#bfbfbf' }}>(文件不能超过10M，格式要求：.zip/.rar)</span>
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="详&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;情："
            >
              {getFieldDecorator('detail', {
                rules: [
                  {
                    required: true,
                    message: '详情为必填项',
                  },
                ],
              })(<UEditor />)}
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
