import React, { Component } from 'react';
import { Form, Select, Button } from 'antd';
import { BOTTOM_TABLE_LIST } from '../../../utils/constants';
import common from '../../../routes/Common/common.css';
import styles from './common.less';

const FormItem = Form.Item;
const { Option } = Select;

class RoleForm extends Component {
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
    console.log(e);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    return (
      <div className={styles.formCls}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="申&nbsp;&nbsp;请&nbsp;&nbsp;人：">
            <div>刘洋</div>
          </FormItem>
          <FormItem {...formItemLayout} label="认证项目：">
            {getFieldDecorator('name', {
              rules: [
                {
                  validator(rule, value, callback) {
                    const reg = !value ? '' : value.replace(/\s*/g, '');
                    if (!reg) {
                      callback({ message: '角色名称为必填项，请填写!' });
                    } else if (reg.length < 2 || reg.length > 20) {
                      callback({ message: '角色名称在2-20个字符之间，请填写!' });
                    } else {
                      callback();
                    }
                  },
                },
              ],
            })(
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
            <div>(文件不能超过10M，格式要求：.zip/.rar)</div>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="详&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;情："
          >
            <div>刘洋</div>
          </FormItem>
          <FormItem>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={this.cancel} type="primary" className={common.cancleButton}>
                取消
              </Button>
              <Button
                loading={false}
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
