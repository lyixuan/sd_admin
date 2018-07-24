import React, { Component } from 'react';
import { Form, Input, Cascader, Button, Row, Col, Select } from 'antd';
import common from '../routes/Common/common.css';
import { levelData, levelDataReset } from '../utils/dataDictionary';

const FormItem = Form.Item;
const { Option } = Select;
let parentList = [];
let parentListBackup = [];
let flag = '页面功能';
class PermissionForm extends Component {
  constructor(props) {
    super(props);
    const preList = this.props.jumpFunction;
    const fromWhere = preList.getUrlParams();
    const parentIdValues = !preList.permission.permissionListAllName
      ? []
      : preList.permission.permissionListAllName.data;
    this.state = {
      parentIdList: !parentIdValues ? [] : parentIdValues,
      id: !fromWhere.id ? '' : fromWhere.id,
      level: !fromWhere.level ? '' : fromWhere.level,
    };
  }

  componentDidMount() {
    parentListBackup = !this.state.parentIdList ? [] : this.fullListFun(this.state.parentIdList);
    parentList = this.roleListFun();
    flag = this.state.level;
  }

  componentWillUnmount() {
    flag = null;
    parentList = null;
    parentListBackup = null;
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleSubmit(values);
      }
    });
  };

  fullListFun = val => {
    const parentIdList = [];
    val.map(item =>
      parentIdList.push({
        value: item.id,
        label: item.name,
        level: item.level,
      })
    );
    return parentIdList;
  };

  roleListFun = () => {
    const parentIdList = [];
    const listValue = parentListBackup || [];
    const levelValue = !this.state.level ? '页面功能' : this.state.level;
    listValue.map(obj => {
      if (obj.level < levelDataReset[levelValue]) {
        parentIdList.push({
          value: obj.value,
          label: obj.label,
          level: obj.level,
        });
      }
      return 0;
    });
    return parentIdList;
  };

  handleSelectChange = value => {
    const level = !value ? flag : value;
    flag = level;
    // console.log(flag,value)
    const listValue = parentListBackup;
    const rObj = [];
    listValue.map(obj => {
      if (obj.level < levelDataReset[flag]) {
        rObj.push({
          value: obj.value,
          label: obj.label,
          level: obj.level,
        });
      }
      return 0;
    });
    parentList = rObj;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { submit } = this.props.jumpFunction;
    const disabled = true;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const getListValue = this.props.jumpFunction.permission;
    const arrValue = !getListValue.permissionById
      ? []
      : !getListValue.permissionById.response ? [] : getListValue.permissionById.response.data;
    const parentIdValues = !getListValue.permissionListAllName
      ? []
      : getListValue.permissionListAllName.data;
    parentListBackup = !parentIdValues ? [] : this.fullListFun(parentIdValues);
    parentList = !parentList || parentList.length === 0 ? parentListBackup : parentList;
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="*权限名称">
            {getFieldDecorator('name', {
              initialValue: !this.state.id ? '' : !arrValue.name ? '' : arrValue.name,
              rules: [
                {
                  validator(rule, value, callback) {
                    const reg = !value ? '' : value.replace(/\s*/g, ''); // 去除字符串中全局空格
                    if (!reg) {
                      callback({ message: '权限名称为必填项，请填写!' });
                    } else if (reg.length < 2 || reg.length > 20) {
                      callback({ message: '权限名称长度在2-20，请修改!' });
                    } else {
                      callback();
                    }
                  },
                },
              ],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*权限类型">
            {getFieldDecorator('level', {
              initialValue: !this.state.id ? '' : !arrValue.level ? '' : levelData[arrValue.level],
              rules: [
                {
                  validator(rule, value, callback) {
                    if (!value[0]) {
                      callback({ message: '权限类型为必填项，请选择！' });
                    }
                    callback();
                  },
                },
              ],
            })(
              <Select style={{ width: 380 }} onChange={this.handleSelectChange}>
                <Option value="一级页面">一级页面</Option>
                <Option value="二级页面">二级页面</Option>
                <Option value="页面功能">页面功能</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="*权限路由">
            {getFieldDecorator('resourceUrl', {
              initialValue: !this.state.id ? '' : !arrValue.level ? '' : arrValue.resourceUrl,
              rules: [
                { max: 50, message: '权限路由长度最多50个字节!' },
                { required: true, message: '权限路由为必填项，请填写!', whitespace: true },
              ],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="上级权限">
            {getFieldDecorator('parentId', {
              initialValue: [!this.state.id ? '' : !arrValue.parentId ? '' : arrValue.parentId],
              rules: [
                {
                  validator(rule, value, callback) {
                    if (!value[0] && flag !== '一级页面') {
                      callback({ message: '非一级页面,请选择上级权限！' });
                    }
                    callback();
                  },
                },
              ],
            })(
              <Cascader
                options={parentList}
                style={{ width: 380 }}
                disabled={
                  !this.state.id
                    ? flag === '一级页面' ? disabled : false
                    : flag === '一级页面' ? disabled : false
                }
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="一级页面图标">
            {getFieldDecorator('iconUrl', {
              initialValue: !this.state.id ? '' : !arrValue.iconUrl ? '' : arrValue.iconUrl,
              rules: [
                {
                  validator(rule, value, callback) {
                    if (!value && flag === '一级页面') {
                      callback({ message: '一级页面下的页面图标为必填项，请填写！' });
                    }
                    callback();
                  },
                },
                { max: 50, message: '字符长度最多50个字节!' },
              ],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*权限排序">
            {getFieldDecorator('sortFlag', {
              initialValue: !this.state.id ? '' : !arrValue.sortFlag ? 0 : arrValue.sortFlag,
              rules: [
                {
                  validator(rule, value, callback) {
                    // const re = /^[0-9]*[0-9]$/i; // 校验是否为数字
                    if (!value) {
                      callback({ message: '权限排序为必填项，请填写!' });
                    }
                    // else if (value.length > 10) {
                    //   callback({ message: '权限排序长度最长为10个字符，请填写!' });
                    // }
                    // if (flag === '一级页面') {
                    //   if (re.test(value) && value % 100 === 0) {
                    //     callback();
                    //   } else {
                    //     callback({ message: '一级页面排序应为100的整数倍！' });
                    //   }
                    // } else if (flag === '二级页面') {
                    //   if (re.test(value) && value % 10 === 0) {
                    //     callback();
                    //   } else {
                    //     callback({ message: '二级页面排序应为10的整数倍！' });
                    //   }
                    // }
                    callback();
                  },
                },
              ],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...tailFormItemLayout} />
          <Row>
            <Col span={6} offset={7}>
              <FormItem>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    onClick={this.props.resetContent}
                    type="primary"
                    className={common.cancleButton}
                  >
                    取消
                  </Button>
                  <Button
                    htmlType="submit"
                    type="primary"
                    className={common.submitButton}
                    loading={submit}
                  >
                    提交
                  </Button>
                </div>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default PermissionForm;
