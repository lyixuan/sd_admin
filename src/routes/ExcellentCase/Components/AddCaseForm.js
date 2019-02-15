import React, { Component } from 'react';
import { Form, Select, Button, Upload, message } from 'antd';
import { BOTTOM_TABLE_LIST } from '../../../utils/constants';
import UEditor from './wangEditor';
import common from '../../../routes/Common/common.css';
import ModalDialog from '../../../selfComponent/Modal/Modal';
import styles from './common.less';
import selfStyles from '../ExcellentCase.css';

const FormItem = Form.Item;
const { Option } = Select;

class RoleForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      visible: false,
      sendVal: '',
      fileList: [],
    };
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
    // const { fileList = [], file = {} } = info;
    const { fileList = [] } = info;
    this.setState({ fileList });
    // if (file.response) {
    //   if (file.response.code === 2000) {
    //     this.setState({ fileList });
    //   } else {
    //     message.error(file.response.msg);
    //   }
    // }
  };
  // 模态框确定
  clickModalOK = () => {
    // this.props.dispatch({
    //   type: 'shortName/editGroup',
    //   payload: { paramsObj },
    // });
    console.log(this.state.sendVal);
    this.showModal(false);
    this.props.jumpFunction.setRouteUrlParams('/excellent/excellentCaseList');
  };
  // 模态框显隐回调
  showModal = bol => {
    this.setState({
      visible: bol,
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const props = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      beforeUpload(file) {
        const isZip = file.type === 'application/zip' || 'application/rar';
        if (!isZip) {
          message.error('文件仅仅支持zip或rar格式!');
        }
        const isLt10M = file.size / 1024 / 1024 < 30;
        if (!isLt10M) {
          message.error('文件不能大于 10MB！');
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
      <div className={styles.formCls}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="申&nbsp;&nbsp;请&nbsp;&nbsp;人：">
            <div>刘洋</div>
          </FormItem>
          <FormItem {...formItemLayout} label="认证项目：">
            {getFieldDecorator('name', {})(
              <Select
                placeholder="优秀案例"
                style={{ width: 230, height: 32 }}
                flag="type"
                type="select"
              >
                {BOTTOM_TABLE_LIST.map(item => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="申请说明：">
            <div>业务方法论</div>
          </FormItem>
          <FormItem {...formItemLayout} label="上传附件：">
            <div className={selfStyles.selfSty}>
              <Upload {...props} onChange={this.uploadFileChange}>
                {Array.isArray(fileList) ? (fileList.length >= 1 ? null : uploadButton) : null}
              </Upload>
              <span style={{ color: '#bfbfbf' }}>(文件不能超过10M，格式要求：.zip/.rar)</span>
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="详&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;情："
          >
            {getFieldDecorator('editorContent', {
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
    );
  }
}

export default RoleForm;
