import React, { Component } from 'react';
import { Form, Input, Cascader, Button } from 'antd';
import { connect } from 'dva';
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
@connect(({ permission, loading }) => ({
  permission,
  loading,
}))
class PermissionForm extends Component {
  constructor(props) {
    super(props);
    const arrValue = this.props.jumpFunction.getUrlParams();
    this.state = {
      permissionName: !arrValue.permissionName ? '' : arrValue.permissionName,
      permissionType: !arrValue.permissionType ? '' : arrValue.permissionType,
      permissionRoute: !arrValue.permissionRoute ? '' : arrValue.permissionRoute,
      parentId: !arrValue.parentId ? '' : arrValue.parentId,
      icon: !arrValue.icon ? '' : arrValue.icon,
      sort: !arrValue.sort ? '' : arrValue.sort,
      id: !arrValue.id ? '' : arrValue.id,
      from: !arrValue.from ? '' : arrValue.from,
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const type = values.permissionType ==='页面功能'?0: values.permissionType==='一级页面' ?1 : 2
        if (this.state.from === 'edit') {
          const updatePermissionParams = {
            name: values.permissionName,
            iconUrl:values.icon,
            id:Number(this.state.id),
            level:type,
            parentId:0, // values.parentId[0],
            sort:Number(values.sort),
            resourceUrl:values.permissionRoute,
          };
          console.log(updatePermissionParams);
          this.props.dispatch({
            type: 'permission/updatePermission',
            payload: { updatePermissionParams },
          });
        } else {
          const addPermissionParams = {
            name: values.permissionName,
            iconUrl:values.icon,
            level:type,
            parentId:0,// Number(values.parentId),
            sort:Number(values.sort),
            resourceUrl:values.permissionRoute,
          };
          console.log(addPermissionParams);
          this.props.dispatch({
            type: 'permission/addPermission',
            payload: { addPermissionParams },
          });
        }
        this.props.jumpFunction.setRouteUrlParams('/permission/permissionList', {});
      }
    });
  };


  resetContent = () => {
    console.log(this.props);
    this.props.form.resetFields(['permissionName', 'permissionType', 'permissionRoute','parentId','icon','sort']);
    this.props.jumpFunction.setRouteUrlParams('/permission/permissionList');
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
    return (
      <div>
        {/*
        <p style={{marginLeft:32,fontSize:24}}>账户信息</p>
        */}
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="*权限名称">
            {getFieldDecorator('permissionName', {
              initialValue: this.state.permissionName,
              rules: [
                { min: 2, required: true, message: '您输入权限名称不合法!', whitespace: true },
              ],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*权限类型">
            {getFieldDecorator('permissionType', {
              initialValue: [this.state.permissionType],
              rules: [{ type: 'array', required: true, message: '权限类型！' }],
            })(<Cascader options={residences} style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*权限路由">
            {getFieldDecorator('permissionRoute', {
              initialValue: this.state.permissionRoute,
              rules: [{ required: true, message: '请输入权限路由!', whitespace: true }],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="上级权限">
            {getFieldDecorator('parentId', {
              initialValue: [this.state.parentId],
            })(<Cascader options={residences} style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="一级页面图标">
            {getFieldDecorator('icon', {
              initialValue: [this.state.icon],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*权限排序">
            {getFieldDecorator('sort', {
              initialValue: this.state.sort,
              rules: [{ required: true, message: '请输入权限排序!', whitespace: true }],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...tailFormItemLayout} />
          <FormItem>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={this.resetContent} type="primary" className={common.cancleButton}>
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
