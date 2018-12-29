import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import ContentLayout from '../../layouts/ContentLayout';
import PermissionForm from '../../selfComponent/PermissionForm';
import { levelDataReset } from '../../utils/dataDictionary';

const WrappedRegistrationForm = Form.create()(PermissionForm);
@connect(({ permission, loading }) => ({
  permission,
  loading: loading.effects['permission/permissionById'],
  submit: loading.effects['permission/updatePermission'],
  permissionListAllName: loading.effects['permission/permissionListAllName'],
}))
class EditPermission extends Component {
  constructor(props) {
    super(props);
    const arrValue = this.props.getUrlParams();
    this.state = {
      id: !arrValue.id ? '' : arrValue.id,
      // parentIdList:[],
    };
  }
  componentDidMount() {
    const permissionListAllNameParams = {};
    this.props.dispatch({
      type: 'permission/permissionListAllName',
      payload: { permissionListAllNameParams },
    });

    const permissionByIdParams = { id: this.state.id };
    this.props.dispatch({
      type: 'permission/permissionById',
      payload: { permissionByIdParams },
    });
  }

  handleSubmit = values => {
    const parentIdName = values.parentId || 0;
    const updatePermissionParams = {
      name: values.name.replace(/\s*/g, ''),
      iconUrl: values.iconUrl,
      id: Number(this.state.id),
      level: levelDataReset[values.level] || 1,
      parentId: parentIdName,
      sortFlag: Number(values.sortFlag),
      resourceUrl: values.resourceUrl,
    };
    // console.log(values,updatePermissionParams)
    this.props.dispatch({
      type: 'permission/updatePermission',
      payload: { updatePermissionParams },
    });
  };

  resetContent = () => {
    this.props.dispatch(routerRedux.goBack());
  };

  render() {
    // const parentIdList=!this.state.parentIdList?[]:this.reloadNum()
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

export default EditPermission;
