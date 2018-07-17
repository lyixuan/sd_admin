import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import ContentLayout from '../../layouts/ContentLayout';
import PermissionForm from '../../selfComponent/PermissionForm';
import { levelDataReset } from '../../utils/dataDictionary';

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

  handleSubmit = values => {
    const parentIdName = values.parentId[0] || 0;
    const addPermissionParams = {
      name: values.name,
      iconUrl: values.iconUrl,
      level: levelDataReset[values.level[0]] || 1,
      parentId: parentIdName,
      sort: Number(values.sort),
      resourceUrl: values.resourceUrl,
    };
    this.props.dispatch({
      type: 'permission/addPermission',
      payload: { addPermissionParams },
    });
  };

  resetContent = () => {
    this.props.setRouteUrlParams('/permission/permissionList');
  };

  render() {
    return  (
      <ContentLayout
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
