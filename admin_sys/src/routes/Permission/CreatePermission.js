import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import ContentLayout from '../../layouts/ContentLayout';
import PermissionForm from '../../selfComponent/PermissionForm';

const WrappedRegistrationForm = Form.create()(PermissionForm);
@connect(({ permission, loading }) => ({
  permission,
  loading,
}))
class CreatePermission extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const permissionListAllNameParams = {};
    this.props.dispatch({
      type: 'permission/permissionListAllName',
      payload: { permissionListAllNameParams },
    });
  }


  handleSubmit = (values) => {
    console.log(values);
    const type =
      values.level[0] === '页面功能'
        ? 3
        : values.level[0] === '一级页面' ? 1 : 2;
    const parentIdName = values.parentId[0];
    let newparentId = 1;
    const parentIdList = this.props.permission.permissionListAllName.data
    parentIdList.map(item => {
      if (item.name === parentIdName) {
        newparentId = item.id;
      }
      return 0;
    });
    const addPermissionParams = {
      name: values.name,
      iconUrl: values.iconUrl[0],
      level: type,
      parentId: newparentId,
      sort: Number(values.sort),
      resourceUrl: values.resourceUrl,
    };
    console.log(addPermissionParams);
    this.props.dispatch({
      type: 'permission/addPermission',
      payload: { addPermissionParams },
    });
  };

  resetContent = () => {
    this.props.setRouteUrlParams('/permission/permissionList');
  };


  render() {
    return (!this.props.permission.permissionListAllName ? [] : !this.props.permission.permissionListAllName.data ? <div /> : (
      <ContentLayout
        contentForm={<WrappedRegistrationForm
          jumpFunction={this.props}
          resetContent={()=>{this.resetContent()}}
          handleSubmit={(values)=>{this.handleSubmit(values)}}
        />}
      />
    ));
  }
}

export default CreatePermission;
