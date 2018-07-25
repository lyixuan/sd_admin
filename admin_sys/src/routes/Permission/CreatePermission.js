import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import ContentLayout from '../../layouts/ContentLayout';
import PermissionForm from '../../selfComponent/PermissionForm';
import { levelDataReset } from '../../utils/dataDictionary';

const WrappedRegistrationForm = Form.create()(PermissionForm);
@connect(({ permission, loading }) => ({
  permission,
  loading: false,
  submit: loading.effects['permission/addPermission'],
  permissionListAllName: loading.effects['permission/permissionListAllName'],
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

  handleSubmit = values => {
    const parentIdName = values.parentId || 0;
    const addPermissionParams = {
      name: values.name.replace(/\s*/g, ''),
      iconUrl: values.iconUrl,
      level: levelDataReset[values.level] || 1,
      parentId: parentIdName,
      sortFlag: Number(values.sortFlag),
      resourceUrl: values.resourceUrl,
    };
    // console.log(values,addPermissionParams)
    this.props.dispatch({
      type: 'permission/addPermission',
      payload: { addPermissionParams },
    });
  };

  resetContent = () => {
    this.props.setRouteUrlParams('/config/permissionList');
  };

  render() {
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentForm={
          <WrappedRegistrationForm
            jumpFunction={this.props}
            resetContent={() => {
              this.resetContent();
            }}
            handleSubmit={values => {
              this.handleSubmit(values);
            }}
          />
        }
      />
    );
  }
}

export default CreatePermission;
