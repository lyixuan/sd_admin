import React, { Component } from 'react';
import { Form, Input, Button, Spin } from 'antd';
import CheckBoxComponent from './CheckBoxForm';
import common from '../../routes/Common/common.css';
import styles from './RoleForm.css';

const FormItem = Form.Item;

class RoleForm extends Component {
  getCheckObj = data => {
    this.checkAllObj = data;
  };
  checkAllObj = {}; // 存储选中项
  // 数据格式整理
  filterAllIdsFn = data => {
    const allIds = {};
    data.forEach(item => {
      item.nodes.forEach(item1 => {
        allIds[`checkedList${item1.id}`] = {};
        allIds[`checkedList${item1.id}`].grandId = item.id;
        allIds[`checkedList${item1.id}`].parentId = item1.id;
        allIds[`checkedList${item1.id}`].child = [];
        item1.nodes.forEach(item2 => {
          allIds[`checkedList${item1.id}`].child.push(item2.id);
        });
      });
    });
    return allIds;
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
    Object.keys(this.checkAllObj).map(key => {
      if (key.indexOf('checkedList') > -1) {
        // 全选
        privilegeIds = [...privilegeIds, ...this.checkAllObj[key]];
      }
      return privilegeIds;
    });

    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.submitInfo(values, Array.from(new Set(privilegeIds)));
      } else {
        console.error(err);
      }
    });
  };

  render() {
    const { listAll, isShowFooter, loading, getRoleIds } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { rolePrivileges } = this.props.selfProps;

    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    return (
      <Spin spinning={rolePrivileges}>
        <div className={styles.formCls}>
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
                  disabled={!(isShowFooter === 'true')}
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
                              const { checkedList } = nodes[item2];
                              return (
                                <div key={nodes[item2].id} className={styles.contentTxt}>
                                  <CheckBoxComponent
                                    dataSource={nodes[item2]}
                                    grandId={firNodes.id}
                                    getRoleIds={getRoleIds}
                                    isShowFooter={isShowFooter}
                                    filterIds={this.filterAllIdsFn(listAll)[checkedList]}
                                    checkAllObj={this.checkAllObj}
                                    getCheckObj={data => {
                                      this.getCheckObj(data);
                                    }}
                                  />
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
      </Spin>
    );
  }
}

export default RoleForm;
