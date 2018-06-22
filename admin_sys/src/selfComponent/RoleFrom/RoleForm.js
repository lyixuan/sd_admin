import React, { Component } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import common from '../../routes/Common/common.css';
import styles from './RoleForm.css';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const plainOptions = ['Apple', 'Pear', 'Orange'];
const defaultCheckedList = ['Apple', 'Orange'];

class AccountForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedList: defaultCheckedList,
      indeterminate: true,
      checkAll: false,
    };
  }

  onChange = checkedList => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
      checkAll: checkedList.length === plainOptions.length,
    });
  };
  onCheckAllChange = e => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };
  resetContent = () => {
    // console.log(this.props.form.resetFields(['name', 'email', 'role']));
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="*角色名称：">
            {getFieldDecorator('name', {
              // rules: [{ required: true, message: '请输入角色名称!', whitespace: true }],
            })(<Input style={{ width: '220px', height: '32px' }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label=" *角色权限：">
            {getFieldDecorator('name', {})(
              <div>
                <div className={styles.modelList}>
                  <h1 className={styles.title}>质检</h1>
                  <div className={styles.content}>
                    <div className={styles.contentTxt}>
                      <p className={styles.littleTitle}>质检管理</p>
                      <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={this.state.checkAll}
                        className={styles.checkBox}
                      >
                        全选
                      </Checkbox>
                      <CheckboxGroup
                        options={plainOptions}
                        value={this.state.checkedList}
                        onChange={this.onChange}
                        className={styles.checkboxGroup}
                      />
                    </div>
                    <div className={styles.contentTxt}>
                      <p className={styles.littleTitle}>质检管理</p>
                      <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={this.state.checkAll}
                        className={styles.checkBox}
                      >
                        全选
                      </Checkbox>
                      <CheckboxGroup
                        options={plainOptions}
                        value={this.state.checkedList}
                        onChange={this.onChange}
                        className={styles.checkboxGroup}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.modelList}>
                  <h1 className={styles.title}>质检</h1>
                  <div className={styles.content}>
                    <div className={styles.contentTxt}>
                      <p className={styles.littleTitle}>质检管理</p>
                      <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={this.state.checkAll}
                        className={styles.checkBox}
                      >
                        全选
                      </Checkbox>
                      <CheckboxGroup
                        options={plainOptions}
                        value={this.state.checkedList}
                        onChange={this.onChange}
                        className={styles.checkboxGroup}
                      />
                    </div>
                    <div className={styles.contentTxt}>
                      <p className={styles.littleTitle}>质检管理</p>
                      <Checkbox
                        indeterminate={this.state.indeterminate}
                        onChange={this.onCheckAllChange}
                        checked={this.state.checkAll}
                        className={styles.checkBox}
                      >
                        全选
                      </Checkbox>
                      <CheckboxGroup
                        options={plainOptions}
                        value={this.state.checkedList}
                        onChange={this.onChange}
                        className={styles.checkboxGroup}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </FormItem>
          <FormItem>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={this.resetContent} type="primary" className={common.cancleButton}>
                取消
              </Button>
              <Button onClick={this.resetContent} type="primary" className={common.submitButton}>
                提交
              </Button>
            </div>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default AccountForm;
