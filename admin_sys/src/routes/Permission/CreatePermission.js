import React, { Component } from 'react';
import { Form ,message} from 'antd';
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
      values.permissionType[0] === '页面功能'
        ? 0
        : values.permissionType[0] === '一级页面' ? 1 : 2;
    const parentIdName = values.parentId[0];
    let newparentId = 0;
    const parentIdList = this.props.permission.permissionListAllName.data
    parentIdList.map(item => {
      if (item.name === parentIdName) {
        newparentId = item.id;
      }
      return 0;
    });
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
    message.success('权限创建成功！');
    this.props.setRouteUrlParams('/permission/permissionList', {});
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
