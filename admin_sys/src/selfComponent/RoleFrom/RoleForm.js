import React, { Component } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import common from '../../routes/Common/common.css';
import styles from './RoleForm.css';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const plainOptions = ['Apple', 'Pear', 'Orange'];
// const defaultCheckedList = ['Apple', 'Orange'];

class RoleForm extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      checkedList: [],
      checkAll: false,
    };
  }

  onChange = checkedList => {
    this.setState({
      checkedList,
      checkAll: checkedList.length === plainOptions.length,
    });
  };
  onCheckAllChange = e => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      checkAll: e.target.checked,
    });
  };
  cancel = () => {
    window.history.go(-1);
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.submitInfo(values);
      }
    });
  };
  render() {
    const { listAll } = this.props;
    const { firstChild, secChild } = listAll;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const secLevel = name => {
      return (
        <div>
          <p className={styles.littleTitle}>{name}</p>
          <Checkbox
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
      );
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
                {firstChild &&
                  Object.keys(firstChild).map((key1, item1) => {
                    return (
                      <div key={firstChild[item1].id} className={styles.modelList}>
                        <h1 className={styles.title}>{firstChild[item1].name}</h1>
                        <div className={styles.content}>
                          {secChild &&
                            Object.keys(secChild).map((key2, item2) => {
                              return (
                                <div key={secChild[item2].id} className={styles.contentTxt}>
                                  {secLevel(secChild[item2].name)}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </FormItem>
          <FormItem>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={this.cancel} type="primary" className={common.cancleButton}>
                取消
              </Button>
              <Button htmlType="submit" type="primary" className={common.submitButton}>
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
