import React, { Component } from 'react';
import { Table,Form ,Button,Popconfirm} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import EditUserForm from '../../selfComponent/UserForm/EditUserForm.js';
import ContentLayout from '../../layouts/ContentLayout';
import { userTypeDataReset } from '../../utils/dataDictionary';
import common from '../Common/common.css';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';

const WrappedRegistrationForm = Form.create()(EditUserForm);

@connect(({ user, loading }) => ({
  user,
  submit: loading.effects['user/updateUserInfo'],
  wechatList: loading.effects['user/wechatList'],
  listOrg: loading.effects['user/listOrg'],
  userList: loading.effects['user/userList'],
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
    const userListParams = { mail: this.state.mail };
    this.props.dispatch({
      type: 'user/userList',
      payload: { userListParams },
    });
  }

  handleSubmit = values => {
    const rname = values.wechatDepartmentName;
    const rUserType = values.userType;
    const len = values.responseCom.length;
    let typeId = rUserType === '家族' ? values.responseCom[1] : values.responseCom[len - 1];
    if (typeof typeId === 'string' || rUserType === '系统管理员' || rUserType === '高级管理员') {
      typeId = undefined;
    }
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
      mail: this.state.email,
      mobile: values.phone,
      id: Number(values.id),
      userType: userTypeDataReset[rUserType],
      userTypeId: !typeId ? undefined : typeId,
      wechatDepartmentId: Number(newRoleId),
      wechatDepartmentName: !rname ? undefined : rname,
    };
    // console.log(rUserType,updateUserInfoParams)
    this.props.dispatch({
      type: 'user/updateUserInfo',
      payload: { updateUserInfoParams },
    });
  };

  resetContent = () => {
    this.props.dispatch(routerRedux.goBack());
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '岗位',
        dataIndex: 'userType',

      },
      {
        title: '负责单位',
        dataIndex: 'showName',

      },
      {
        title: '类型',
        dataIndex: 'familyType',

      },
      {
        title: '绩效权限',
        dataIndex: 'privilege',


      },
      {
        title: '操作',
        dataIndex: 'operation',

        render: (text, record) => {
          return (
            <div>
              <AuthorizedButton authority="/user/updateUser">
                <span
                  style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  onClick={() => this.onUpdate(record)}
                >
                  更新
                </span>
              </AuthorizedButton>

              <AuthorizedButton authority="/user/editUser">
                <span
                  style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  onClick={() => this.onEdit(record)}
                >
                  编辑
                </span>
              </AuthorizedButton>
              <AuthorizedButton authority="/user/deleteUser">
                <Popconfirm title="是否确认删除该用户?" onConfirm={() => this.onDelete(record)}>
                  <span style={{ color: '#52C9C2', cursor: 'pointer' }}>删除</span>
                </Popconfirm>
              </AuthorizedButton>
            </div>
          );
        },
      },
    ];
    return columns || [];
  };



  render() {
    const columns = this.columnsData();
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentForm={
          <WrappedRegistrationForm
            jumpFunction={this.props || {}}
            resetContent={() => {
              this.resetContent();
            }}
            handleSubmit={values => {
              this.handleSubmit(values);
            }}
          />
        }
        contentButton={
          <Button
            style={{marginTop:'36px'}}
            type="primary"
            className={common.submitButton}
          >
            添加岗位
          </Button>
        }
        contentTable={
          <Table
            style={{marginTop:'24px'}}
            bordered
            dataSource={[]}
            columns={columns}
            pagination={false}
            className={common.tableContentStyle}
          />
        }
      />
    );
  }
}

export default EditUser;
