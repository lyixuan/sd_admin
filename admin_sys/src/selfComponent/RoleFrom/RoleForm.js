import React, { Component } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import common from '../../routes/Common/common.css';
import styles from './RoleForm.css';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

let checkAllObj = {};
let isClick = false;

class RoleForm extends Component {
  constructor(props) {
    super(props);
    checkAllObj = {};
    isClick = false;
  }
  // getCheckObj = {
  //   checkAllObj:{},
  //   get:()=>{
  //     return this.checkAllObj;
  //   },
  //   set:(checkAllObj)=>{
  //     this.checkAllObj = checkAllObj;
  //   }
  // };

  componentWillUnmount() {
    checkAllObj = null;
    isClick = null;
  }
  /*
  * 单选按钮事件
  * */
  onChange = (secList, key, listKey, checkedList) => {
    isClick = true;
    let len = 0;
    secList.forEach(n => {
      checkedList.forEach(m => {
        if (n.id === m) {
          len += 1;
        }
      });
    });
    checkAllObj[listKey] = checkedList;
    checkAllObj[key] = len === secList.length;
  };
  /*
  * 全选按钮事件
  * */
  onCheckAllChange = (secList, allKey, listKey, e) => {
    isClick = true;
    const nodeIDs = [];
    secList.forEach(key => {
      nodeIDs.push(key.id);
    });

    checkAllObj[listKey] = e.target.checked ? nodeIDs : [];
    checkAllObj[allKey] = e.target.checked;
  };
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
    let privilegeIds = [];
    Object.keys(checkAllObj).map(key => {
      if (key.indexOf('checkedList') > -1) {
        privilegeIds = [...privilegeIds, ...checkAllObj[key]];
      }
      return privilegeIds;
    });

    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (privilegeIds.length === 0) {
          privilegeIds = this.props.getRoleIds;
        }
        this.props.submitInfo(values, Array.from(new Set(privilegeIds)));
      } else {
        console.error(err);
      }
    });
  };
  render() {
    const { listAll, isShowFooter, getRoleIds } = this.props;
    const { getFieldDecorator } = this.props.form;
    let isDisabled = true;
    if (isShowFooter) isDisabled = false;

    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    /*
    * 复选框
    * */
    const secLevel = (name, item, checkAllKey, listKey) => {
      let len = 0;
      const plainOptions = [];
      item.forEach(key => {
        plainOptions.push({ label: key.name, value: key.id });
      });
      if (getRoleIds) {
        plainOptions.forEach(n => {
          getRoleIds.forEach(m => {
            if (n.value === m) {
              len += 1;
            }
          });
        });
        if (!isClick && len === plainOptions.length) {
          checkAllObj[checkAllKey] = true;
        }
      }

      return (
        <div>
          <p className={styles.littleTitle}>{name}</p>
          <Checkbox
            onChange={this.onCheckAllChange.bind(this, item, checkAllKey, listKey)}
            checked={checkAllObj[checkAllKey]}
            disabled={isDisabled}
            className={styles.checkBox}
          >
            全选
          </Checkbox>
          <CheckboxGroup
            options={plainOptions}
            value={!checkAllObj[listKey] ? getRoleIds : checkAllObj[listKey]}
            disabled={isDisabled}
            onChange={this.onChange.bind(this, item, checkAllKey, listKey)}
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
            })(<Input disabled={isDisabled} style={{ width: '220px', height: '32px' }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label=" *角色权限：">
            {getFieldDecorator('privilegeIds', {})(
              <div>
                {listAll &&
                  Object.keys(listAll).map((key1, item1) => {
                    const firNodes = listAll[item1];
                    return (
                      <div key={firNodes.id} className={styles.modelList}>
                        <h1 className={styles.title}>{firNodes.name}</h1>
                        <div className={styles.content}>
                          {Object.keys(firNodes.nodes).map((key2, item2) => {
                            const { nodes } = firNodes;
                            const { checkAll } = nodes[item2];
                            const { checkedList } = nodes[item2];
                            return (
                              <div key={nodes[item2].id} className={styles.contentTxt}>
                                {secLevel(
                                  nodes[item2].name,
                                  nodes[item2].nodes,
                                  checkAll,
                                  checkedList
                                )}
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
          {!isShowFooter ? null : (
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
          )}
        </Form>
      </div>
    );
  }
}

export default RoleForm;
