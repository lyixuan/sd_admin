import React, { Component } from 'react';
import { Form, Select, Button, Upload, message } from 'antd';
import { BOTTOM_TABLE_LIST } from '../../../utils/constants';
import UEditor from './UEditor';
import common from '../../../routes/Common/common.css';
import styles from './common.less';
import selfStyles from '../ExcellentCase.css';

const FormItem = Form.Item;
const { Option } = Select;

class RoleForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '请输入',
      loading: false,
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
        console.log(values);
      } else {
        console.error(err);
      }
    });
    // this.props.setRouteUrlParams('/excellent/excellentCaseList');
  };
  handleChange = content => {
    this.setState({
      content,
    });
  };

  uploadFileChange = info => {
    const { fileList = [], file = {} } = info;
    if (file.response) {
      if (file.response.code === 2000) {
        this.setState({ fileList });
      } else {
        message.error(file.response.msg);
      }
    }
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
        const isPNG = file.type === 'application/zip' || 'application/rar';
        if (!isPNG) {
          message.error('文件仅仅支持zip或rar格式!');
        }
        return isPNG;
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
          // this.setState({ fileList });
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    const { fileList } = this.state;
    console.log(fileList);
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
              <Upload {...props}>
                {Array.isArray(fileList) ? (fileList.length >= 1 ? null : uploadButton) : null}
              </Upload>
              <span style={{ color: '#bfbfbf' }}>(文件不能超过10M，格式要求：.zip/.rar)</span>
            </div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="详&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;情："
          >
            {getFieldDecorator('detail', {})(
              <UEditor content={this.state.content} onChange={this.handleChange} />
            )}
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
      </div>
    );
  }
}

export default RoleForm;
