import React, { Component } from 'react';
import { Form, Input, Cascader, Button, message } from 'antd';
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
      parentIdList: !this.props.permission.permissionListAllName.data
        ? []
        : this.props.permission.permissionListAllName.data,
      permissionName: !arrValue.permissionName ? '' : arrValue.permissionName,
      permissionType: !arrValue.permissionType ? null : arrValue.permissionType,
      permissionRoute: !arrValue.permissionRoute ? '' : arrValue.permissionRoute,
      parentId: !arrValue.parentId ? null : Number(arrValue.parentId),
      icon: !arrValue.icon ? '' : arrValue.icon,
      sort: !arrValue.sort ? '' : arrValue.sort,
      id: !arrValue.id ? '' : arrValue.id,
      from: !arrValue.from ? '' : arrValue.from,
    };
    console.log(this.state);
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        const type =
          values.permissionType[0] === '页面功能'
            ? 0
            : values.permissionType[0] === '一级页面' ? 1 : 2;
        const parentIdName = values.parentId[0];
        let newparentId = 0;
        this.state.parentIdList.map(item => {
          if (item.name === parentIdName) {
            newparentId = item.id;
          }
          return 0;
        });

        if (this.state.from === 'edit') {
          const updatePermissionParams = {
            name: values.permissionName,
            iconUrl: values.icon[0],
            id: Number(this.state.id),
            level: type,
            parentId: newparentId,
            sort: Number(values.sort),
            resourceUrl: values.permissionRoute,
          };
          console.log(updatePermissionParams);
          this.props.dispatch({
            type: 'permission/updatePermission',
            payload: { updatePermissionParams },
          });
        } else {
          const addPermissionParams = {
            name: values.permissionName,
            iconUrl: values.icon[0],
            level: type,
            parentId: newparentId,
            sort: Number(values.sort),
            resourceUrl: values.permissionRoute,
          };
          console.log(addPermissionParams);
          this.props.dispatch({
            type: 'permission/addPermission',
            payload: { addPermissionParams },
          });
        }
        const aa = this.state.from === 'edit' ? '权限编辑成功！' : '权限创建成功！';
        message.success(aa);
        this.props.jumpFunction.setRouteUrlParams('/permission/permissionList', {});
      }
    });
  };

  roleListFun = val => {
    console.log(val);
    const parentIdList = [];
    val.map(item =>
      parentIdList.push({
        value: item.id,
        label: item.name,
      })
    );
    // console.log(parentIdList)
    return parentIdList;
  };

  resetContent = () => {
    // console.log(this.props);
    this.props.form.resetFields([
      'permissionName',
      'permissionType',
      'permissionRoute',
      'parentId',
      'icon',
      'sort',
    ]);
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
    console.log(this.state.parentIdList);
    const parentIdList = !this.state.parentIdList ? [] : this.roleListFun(this.state.parentIdList);
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="*权限名称">
            {getFieldDecorator('permissionName', {
              initialValue: this.state.permissionName,
              rules: [
                { min: 2, required: true, message: '权限名称为必填项，请填写!', whitespace: true },
              ],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="*权限类型">
            {getFieldDecorator('permissionType', {
              initialValue: [this.state.permissionType],
              rules: [
                {
                  validator(rule, value, callback) {
                    console.log(value[0]);
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
            {getFieldDecorator('permissionRoute', {
              initialValue: this.state.permissionRoute,
              rules: [{ required: true, message: '权限路由为必填项，请填写!', whitespace: true }],
            })(<Input style={{ width: 380 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label="上级权限">
            {getFieldDecorator('parentId', {
              initialValue: [this.state.parentId],
              rules: [
                {
                  validator(rule, value, callback) {
                    console.log(value[0]);
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
            {getFieldDecorator('icon', {
              initialValue: [this.state.icon],
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
