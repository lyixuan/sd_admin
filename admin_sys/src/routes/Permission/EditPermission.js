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
class EditPermission extends Component {
  constructor(props) {
    super(props);
    const arrValue = this.props.getUrlParams();
    this.state = {
      id: !arrValue.id ? '' : arrValue.id,
    };
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
    const type = values.permissionType[0] === '页面功能'
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
    message.success('权限编辑成功！');
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

export default EditPermission;
