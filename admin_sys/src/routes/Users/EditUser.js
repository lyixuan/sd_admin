import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import UserForm from '../../selfComponent/UserForm.js';
import ContentLayout from '../../layouts/ContentLayout';

const WrappedRegistrationForm = Form.create()(UserForm);
@connect(({ user, loading }) => ({
  user,
  loading,
}))
class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const wechatListParams = {};
    this.props.dispatch({
      type: 'user/wechatList',
      payload: { wechatListParams },
    });

    const listOrgParams = {};
    this.props.dispatch({
      type: 'user/listOrg',
      payload: { listOrgParams },
    });
  }

  handleSubmit = (values) => {
    console.log(values)
    // const type = values.level[0] === '页面功能'
    //   ? 3
    //   : values.level[0] === '一级页面' ? 1 : 2;
    // const parentIdName = !values.parentId[0]?'未选择':values.parentId[0];
    // let newparentId = 1;
    // const parentIdList = this.props.permission.permissionListAllName.data
    // parentIdList.map(item => {
    //   if (item.name === parentIdName) {
    //     newparentId = item.id;
    //   }
    //   return 0;
    // });
    // const updatePermissionParams = {
    //   name: values.name,
    //   iconUrl: values.iconUrl[0],
    //   id: Number(this.state.id),
    //   level: type,
    //   parentId: newparentId,
    //   sort: Number(values.sort),
    //   resourceUrl: values.resourceUrl,
    // };
    // this.props.dispatch({
    //   type: 'permission/updatePermission',
    //   payload: { updatePermissionParams },
    // });
  };

  resetContent = () => {
    this.props.setRouteUrlParams('/user/userList', {});
  };
  render() {
    const aa = this.props.user.listOrg.response // ? [] : !this.props.user.listOrg.response.data ?[]:this.props.user.wechatList.response.data.department
    console.log(aa)
    return (!this.props.user.wechatList.response ? [] : !this.props.user.wechatList.response.data ? <div /> :
        (
          <ContentLayout
            contentForm={<WrappedRegistrationForm
              jumpFunction={this.props}
              resetContent={()=>{this.resetContent()}}
              handleSubmit={(values)=>{this.handleSubmit(values)}}
            />}
          />
        )
    );}
}


export default EditUser;
