import React, { Component } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import common from '../../routes/Common/common.css';
import styles from './RoleForm.css';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

let checkAllObj = {}; // 存储选中项
let isClick = false; // 区分创建和编辑
let initAllVal = []; // 传参数
let allIdsVal = {}; // 所有一级id

class RoleForm extends Component {
  constructor(props) {
    super(props);
    checkAllObj = {};
    isClick = false;
    initAllVal = [];
    allIdsVal = {};
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
    allIdsVal = null;
    initAllVal = null;
  }
  /*
  * 单选按钮事件
  * */
  onChange = (gid, pid, secList, key, listKey, checkedList) => {
    isClick = true;
    let len = 0;
    let checkLists = [];
    let hasCheck = false;
    secList.forEach(n => {
      checkedList.forEach(m => {
        if (n.id === m) {
          len += 1;
          hasCheck = true;
        }
      });
    });

    // 功能有勾选，则自动上传他上级id
    if (!hasCheck) {
      checkedList.forEach(m => {
        if (secList[0].parentId === m) {
          const index = checkedList.indexOf(secList[0].parentId);
          if (index > -1) {
            checkedList.splice(index, 1);
          }
        }
      });
      checkLists = checkedList;
    } else {
      checkLists = checkedList.concat(pid);
    }

    initAllVal = Array.from(new Set(checkLists));

    // 删除一级id
    let hasChildren = 0;
    allIdsVal[gid].forEach(k => {
      initAllVal.forEach(m => {
        if (k === m) {
          hasChildren += 1;
        }
      });
    });
    if (hasChildren === 0) {
      const index = initAllVal.indexOf(gid);
      if (index > -1) {
        initAllVal.splice(index, 1);
      }
    }
    checkAllObj[listKey] = initAllVal;
    checkAllObj[key] = len === secList.length;
  };
  /*
  * 全选按钮事件
  * */
  onCheckAllChange = (gid, pid, secList, allKey, listKey, e) => {
    const initVal = initAllVal.length > 0 ? initAllVal : this.props.getRoleIds;

    isClick = true;
    const nodeIDs = [];
    secList.forEach(key => {
      nodeIDs.push(key.id);
      nodeIDs.push(key.parentId);
    });

    // 取消全选的时候同时删除父级id
    if (!e.target.checked) {
      nodeIDs.forEach(n => {
        initVal.forEach(m => {
          if (n === m) {
            const index = initVal.indexOf(n);
            if (index > -1) {
              initVal.splice(index, 1);
            }
          }
        });
      });
      let hasChildren = 0;
      // 删除一级id
      allIdsVal[gid].forEach(k => {
        initVal.forEach(m => {
          if (k === m) {
            hasChildren += 1;
          }
        });
      });
      if (hasChildren === 0) {
        const index = initVal.indexOf(gid);
        if (index > -1) {
          initVal.splice(index, 1);
        }
      }
    }
    initAllVal = initVal;
    checkAllObj[listKey] = e.target.checked ? Array.from(new Set(nodeIDs.concat(pid))) : [];
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
        privilegeIds = privilegeIds.concat(initAllVal);
        this.props.submitInfo(values, Array.from(new Set(privilegeIds)));
      } else {
        console.error(err);
      }
    });
  };
  render() {
    const allIds = {};
    const { listAll, isShowFooter, getRoleIds, checkdIds, loading } = this.props;

    listAll.forEach(item => {
      allIds[item.id] = [];
      item.nodes.forEach(item1 => {
        allIds[item.id].push(item1.id);
        item1.nodes.forEach(item2 => {
          allIds[item.id].push(item2.id);
        });
      });
      allIdsVal = allIds;
      return allIdsVal;
    });

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
    const secLevel = (name, item, checkAllKey, listKey, gid, pid) => {
      const parentIds = [pid, gid];
      let len = 0;
      const plainOptions = [];
      item.forEach(key => {
        plainOptions.push({ label: key.name, value: key.id, parentId: pid });
      });
      const isCheckedAll = checkdIds && checkdIds.length > 0 ? checkdIds : getRoleIds;

      if (isCheckedAll) {
        plainOptions.forEach(n => {
          isCheckedAll.forEach(m => {
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
          {item.length === 0 ? null : (
            <div>
              <Checkbox
                onChange={this.onCheckAllChange.bind(
                  this,
                  gid,
                  parentIds,
                  item,
                  checkAllKey,
                  listKey
                )}
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
                onChange={this.onChange.bind(this, gid, parentIds, item, checkAllKey, listKey)}
                className={styles.checkboxGroup}
              />
            </div>
          )}
        </div>
      );
    };
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="*角色名称：">
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
              <Input
                maxLength={25}
                minLength={1}
                disabled={isDisabled}
                style={{ width: '220px', height: '32px' }}
              />
            )}
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
                                  checkedList,
                                  firNodes.id,
                                  nodes[item2].id
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
                <Button
                  loading={loading}
                  htmlType="submit"
                  type="primary"
                  className={common.submitButton}
                >
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
