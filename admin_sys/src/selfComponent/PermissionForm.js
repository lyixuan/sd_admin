import React, { Component } from 'react';
import { Form, Input, Cascader, Button } from 'antd';
import common from '../routes/Common/common.css';

const FormItem = Form.Item;
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
    const arrValue = this.props.jumpFunction.getUrlParams();
    const parentIdValues = this.props.jumpFunction.permission.permissionListAllName
    this.state = {
      parentIdList: !parentIdValues.data ? [] : parentIdValues.data,
      name: !arrValue.name ? '' : arrValue.name,
      level: !arrValue.level ? null : arrValue.level,
      resourceUrl: !arrValue.resourceUrl ? '' : arrValue.resourceUrl,
      parentId: !arrValue.parentId ? null : Number(arrValue.parentId),
      iconUrl: !arrValue.iconUrl ? '' : arrValue.iconUrl,
      sort: !arrValue.sort ? '' : arrValue.sort,
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleSubmit(values)
      }
    });
  };

  roleListFun = val => {
    const parentIdList = [];
    val.map(item =>
      parentIdList.push({
        value: item.id,
        label: item.name,
      })
    );
    return parentIdList;
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
    };
    const parentIdList = !this.state.parentIdList ? [] : this.roleListFun(this.state.parentIdList);
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="*权限名称">
            {getFieldDecorator('name', {
              initialValue: this.state.name,
              rules: [
                { min: 2, required: true, message: '权限名称为必填项，请填写!', whitespace: true },
              ],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*权限类型">
            {getFieldDecorator('level', {
              initialValue: [this.state.level],
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
            })(<Cascader options={residences} style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*权限路由">
            {getFieldDecorator('resourceUrl', {
              initialValue: this.state.resourceUrl,
              rules: [{ required: true, message: '权限路由为必填项，请填写!', whitespace: true }],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="上级权限">
            {getFieldDecorator('parentId', {
              initialValue: [this.state.parentId],
              rules: [
                {
                  validator(rule, value, callback) {
                    if (!value[0]) {
                      callback({ message: '请选择权上级！' });
                    }
                    callback();
                  },
                },
              ],
            })(<Cascader options={parentIdList} style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="一级页面图标">
            {getFieldDecorator('iconUrl', {
              initialValue: [this.state.iconUrl],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*权限排序">
            {getFieldDecorator('sort', {
              initialValue: this.state.sort,
              rules: [{ required: true, message: '权限排序为必填项，请填写!', whitespace: true }],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...tailFormItemLayout} />
          <FormItem>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={this.props.resetContent} type="primary" className={common.cancleButton}>
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
