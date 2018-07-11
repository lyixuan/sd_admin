import React, { Component } from 'react';
import { Form, Input, Cascader, Button } from 'antd';
import common from '../routes/Common/common.css';
import {levelData, levelDataReset} from '../utils/dataDictionary';

const FormItem = Form.Item;
let parentList = [];
let parentListBackup = [];
let flag = '页面功能';
const residences = [
  {
    value: '一级页面',
    label: '一级页面',
  },
  {
    value: '二级页面',
    label: '二级页面',
  },
  {
    value: '页面功能',
    label: '页面功能',
  },
];
class PermissionForm extends Component {
  constructor(props) {
    super(props);
    const fromWhere = this.props.jumpFunction.getUrlParams();
    const parentIdValues = this.props.jumpFunction.permission.permissionListAllName;
    this.state = {
      parentIdList: !parentIdValues.data ? [] : parentIdValues.data,
      id: !fromWhere.id ? '' : fromWhere.id,
    };
    console.log(this.state)
  }

  componentDidMount() {
    parentListBackup = !this.state.parentIdList ? [] : this.fullListFun(this.state.parentIdList);
    parentList = this.roleListFun();
    const arrValue = !this.props.jumpFunction.permission.permissionById?[]:!this.props.jumpFunction.permission.permissionById.response?[]:this.props.jumpFunction.permission.permissionById.response.data;
    flag = levelData[arrValue.level];
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('进入提交函数');
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
    const listValue = parentListBackup;
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
    const level = value[0];
    flag = level;
    const listValue = parentListBackup;
    const rObj = [];
    listValue.map(obj => {
      if (obj.level < levelDataReset[level]) {
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
    }
    const arrValue = !this.props.jumpFunction.permission.permissionById?[]:!this.props.jumpFunction.permission.permissionById.response?[]:this.props.jumpFunction.permission.permissionById.response.data;
    const disabled = true;
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="*权限名称">
            {getFieldDecorator('name', {
              initialValue: !this.state.id?'':!arrValue.name?'':arrValue.name,
              rules: [
                { min: 2, max: 50, message: '权限名称长度在2-50!', whitespace: true },
                { required: true, message: '权限名称为必填项，请填写!', whitespace: true },
              ],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*权限类型">
            {getFieldDecorator('level', {
              initialValue: [!this.state.id?'':!arrValue.level?'':levelData[arrValue.level]],
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
              <Cascader
                options={residences}
                onChange={this.handleSelectChange}
                style={{ width: 380 }}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="*权限路由">
            {getFieldDecorator('resourceUrl', {
              initialValue: !this.state.id?'':!arrValue.level?'':arrValue.resourceUrl,
              rules: [
                { max: 50, message: '权限路由长度最多50个字节!' },
                { required: true, message: '权限路由为必填项，请填写!', whitespace: true }],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="上级权限">
            {getFieldDecorator('parentId', {
              initialValue: [!this.state.id?'':!arrValue.parentId?'':arrValue.parentId],
              // rules: [
              //   {
              //     validator(rule, value, callback) {
              //       if (!value[0]) {
              //         callback({ message: '请选择权上级！' });
              //       }
              //       callback();
              //     },
              //   },
              // ],
            })(
              <Cascader
                options={parentList}
                style={{ width: 380 }}
                disabled={flag === '一级页面' ? disabled : false}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="一级页面图标">
            {getFieldDecorator('iconUrl', {
              initialValue: [!this.state.id?'':!arrValue.iconUrl?'':arrValue.iconUrl],
              rules: [{ max: 50, message: '权限路由长度最多50个字节!' },
                {
                  validator(rule, value, callback) {
                    console.log(value)
                    if (!value) {
                      callback({ message: '一级页面下的页面图标为必填项，请填写！' });
                    }
                    callback();
                  },
                },
              ],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*权限排序">
            {getFieldDecorator('sort', {
              initialValue: !this.state.id?'':arrValue.sort===0?'0':arrValue.sort,
              rules: [{ required: true, message: '权限排序为必填项，请填写!', whitespace: true },
                { max: 10, message: '权限排序长度最多10个字节!' },
                {
                    validator(rule, value, callback) {
                      const re = /^[0-9]*[0-9]$/i; // 校验是否为数字
                      if (flag === '一级页面') {
                        if(re.test(value) && value%100===0){
                          callback();
                        }
                        callback({ message: '一级页面排序应为100的整数倍！' });
                      }else if(flag === '二级页面'){
                        if(re.test(value) && value%10===0){
                          callback();
                        }
                        callback({ message: '二级页面排序应为10的整数倍！' });
                      }
                      callback();
                    },
                  },
              ],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...tailFormItemLayout} />
          <FormItem>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                onClick={this.props.resetContent}
                type="primary"
                className={common.cancleButton}
              >
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

export default PermissionForm;
