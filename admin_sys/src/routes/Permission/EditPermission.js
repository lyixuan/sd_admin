import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import ContentLayout from '../../layouts/ContentLayout';
import PermissionForm from '../../selfComponent/PermissionForm';
import {levelDataReset} from '../../utils/dataDictionary';

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

    const permissionByIdParams = {id:this.state.id};
    this.props.dispatch({
      type: 'permission/permissionById',
      payload: { permissionByIdParams },
    });
  }

  handleSubmit = (values) => {
    const parentIdName = values.parentId[0] || 0;
    // console.log(parentIdName)
    // let newparentId = 1;
    // const parentIdList = this.props.permission.permissionListAllName.data
    // console.log(parentIdList)
    // parentIdList.map(item => {
    //   if (item.name === parentIdName) {
    //     newparentId = item.id;
    //   }
    //   return 0;
    // });
    const updatePermissionParams = {
      name: values.name,
      iconUrl: values.iconUrl,
      id: Number(this.state.id),
      level: levelDataReset[values.level[0]]||1,
      parentId: parentIdName,
      sort: Number(values.sort),
      resourceUrl: values.resourceUrl,
    };
    this.props.dispatch({
      type: 'permission/updatePermission',
      payload: { updatePermissionParams },
    });
  };

  resetContent = () => {
    this.props.setRouteUrlParams('/permission/permissionList');
  };

  render() {
    const permissionVal = this.props.permission;
    return (!permissionVal.permissionById.response?null:
      !permissionVal.permissionById.response.data?null: (
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
