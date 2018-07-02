import React, { Component } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import common from '../../routes/Common/common.css';
import styles from './RoleForm.css';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

let privilegeIds = [];
let defaultValue = [];
let secChild = [];
let checkAll = false;
class RoleForm extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      checkedList: defaultValue,
    };
  }

  onChange = checkedList => {
    privilegeIds = checkedList;
    console.log(privilegeIds);
    this.setState({
      checkedList,
    });
    checkAll = checkedList.length === secChild.length;
  };
  onCheckAllChange = (o, e) => {
    const nodeIDs = [];
    secChild.forEach(key => {
      nodeIDs.push({ label: key.name, value: key.id });
    });
    console.log(nodeIDs);
    this.setState({
      checkedList: e.target.checked ? nodeIDs : [],
    });

    checkAll = e.target.checked;
  };
  cancel = () => {
    window.history.go(-1);
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.submitInfo(values, privilegeIds);
      } else {
        console.error(err);
      }
    });
  };
  render() {
    defaultValue = this.props.getRoleIds;
    console.log(defaultValue);
    const { listAll } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const secLevel = (name, item, bol) => {
      console.log(bol);
      secChild = item;
      const plainOptions = [];
      item.forEach(key => {
        plainOptions.push({ label: key.name, value: key.id });
      });
      return (
        <div>
          <p className={styles.littleTitle}>{name}</p>

          <Checkbox onChange={this.onCheckAllChange} checked={bol} className={styles.checkBox}>
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
              rules: [{ required: true, message: '请输入角色名称!', whitespace: true }],
            })(<Input style={{ width: '220px', height: '32px' }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label=" *角色权限：">
            {getFieldDecorator('privilegeIds', {})(
              <div>
                {listAll &&
                  Object.keys(listAll).map((key1, item1) => {
                    return (
                      <div key={listAll[item1].id} className={styles.modelList}>
                        <h1 className={styles.title}>{listAll[item1].name}</h1>
                        <div className={styles.content}>
                          {Object.keys(listAll[item1].nodes).map((key2, item2) => {
                            const secNodes = listAll[item1].nodes;
                            // checkAll = secNodes[item2].checkAll;
                            return (
                              <div key={secNodes[item2].id} className={styles.contentTxt}>
                                {secLevel(secNodes[item2].name, secNodes[item2].nodes, checkAll)}
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
