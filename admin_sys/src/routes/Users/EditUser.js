import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import EditUserForm from '../../selfComponent/UserForm/EditUserForm.js';
import ContentLayout from '../../layouts/ContentLayout';
import EditUserTable from './EditUserTable';

const propsVal = '';

const WrappedRegistrationForm = Form.create()(EditUserForm);

@connect(({ user, loading }) => ({
  user,
  submit: loading.effects['user/updateUserbasicInfo'],
  wechatList: loading.effects['user/wechatList'],
  listOrg: loading.effects['user/listOrg'],
  userList: loading.effects['user/getUserlist'],
  addPosi: loading.effects['user/addPosition'],
}))
class EditUser extends Component {
  constructor(props) {
    super(props);
    const arrValue = this.props.getUrlParams();
    this.state = {
      mail: !arrValue.mail ? null : arrValue.mail,
    };
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
    const getUserlistParams = { mail: this.state.mail };
    this.props.dispatch({
      type: 'user/getUserlist',
      payload: { getUserlistParams },
    });
  }

  handleSubmit = (values, data) => {
    const rname = values.wechatDepartmentName;
    let newRoleId = 0;
    const roleList = this.props.user.wechatList.response.data.department;
    roleList.map(item => {
      if (item.name === rname) {
        newRoleId = item.id;
      }
      return 0;
    });
    const updateUserInfoParams = {
      name: values.name.replace(/\s*/g, ''),
      mail: values.mail,
      mobile: values.phone,
      sex: Number(values.sex),
      idCard: values.idCard,
      joinDate: data,
      // privilegeView: values.privilegeView === 1,
      positionList: {
        wechatDepartmentId: Number(newRoleId),
        wechatDepartmentName: !rname ? undefined : rname,
      },
    };
    this.props.dispatch({
      type: 'user/updateUserbasicInfo',
      payload: { updateUserInfoParams },
    });
  };

  resetContent = () => {
    this.props.dispatch(routerRedux.goBack());
  };

  handleSearch = (e, arrValue) => {
    e.preventDefault();
    propsVal.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.getData(values, arrValue);
      }
    });
  };

  render() {
    return (
      <div>
        <ContentLayout
          routerData={this.props.routerData}
          contentForm={
            <WrappedRegistrationForm
              jumpFunction={this.props || {}}
              resetContent={() => {
                this.resetContent();
              }}
              handleSubmit={(values, data) => {
                this.handleSubmit(values, data);
              }}
            />
          }
        />
        <EditUserTable mail={this.state.mail} />
      </div>
    );
  }
}

export default EditUser;
