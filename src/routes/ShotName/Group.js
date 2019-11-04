import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input, message } from 'antd';
// import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import ModalDialog from '../../selfComponent/Modal/Modal';
import common from '../Common/common.css';

@connect(({ shortName, loading }) => ({
  shortName,
  loading: loading.models.shortName,
}))
class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      collegeName: '学院名字',
      familyName: '家族名字',
      groupName: '小组名字',
      id: 0,
      name: '',
      sort: '',
    };
  }

  componentDidMount() {
    this.getGroupData({ size: 30, number: 0 });
  }

  // 编辑
  onEdit = record => {
    this.setState({
      collegeName: record.collegeName,
      familyName: record.familyName,
      groupName: record.groupName,
      id: record.shortId,
      objId: record.groupId,
      objName: record.groupName,
      objType: 'group',
      visible: true,
      name: record.objShortName,
      sort: record.sort,
    });
  };

  // 获取小组列表数据
  getGroupData = params => {
    this.props.dispatch({
      type: 'shortName/groupList',
      payload: { paramsObj: params },
    });
  };

  // 模态框确定
  clickModalOK = (id, groupShortName, sort, objId, objName, objType) => {
    if (!groupShortName) {
      message.error('小组简称不可为空');
      this.showModal(true);
    } else {
      const { groupName = null } = this.state;
      const paramsObj = {
        id,
        groupShortName,
        sort,
        objId,
        objName,
        objType,
        orgName: groupName,
      };
      this.props.dispatch({
        type: 'shortName/editGroup',
        payload: { paramsObj },
      });
      this.showModal(false);
    }
  };
  // input双向绑定
  handelChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  handelSortChange(e) {
    this.setState({
      sort: e.target.value,
    });
  }
  // 模态框显隐回调
  showModal = bol => {
    this.setState({
      visible: bol,
    });
  };
  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '学院名称',
        dataIndex: 'collegeName',
      },
      {
        title: '家族名称',
        dataIndex: 'familyName',
      },
      {
        title: '小组id',
        dataIndex: 'groupId',
      },
      {
        title: '小组名称',
        dataIndex: 'groupName',
      },
      {
        title: '小组简称',
        dataIndex: 'objShortName',
      },
      {
        title: '拼音名称',
        dataIndex: 'sort',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <AuthorizedButton authority="/group/editeGroupShortName">
                <span
                  style={{ color: '#52C9C2', cursor: 'pointer' }}
                  onClick={() => this.onEdit(record)}
                >
                  编辑
                </span>
              </AuthorizedButton>
            </div>
          );
        },
      },
    ];
    return columns;
  };

  render() {
    const { loading, shortName } = this.props;
    const { groupList } = shortName;
    const dataSource = !groupList ? [] : groupList.data;
    const columns = !this.columnsData() ? [] : this.columnsData();
    const {
      visible,
      collegeName,
      familyName,
      groupName,
      id,
      name,
      sort,
      objId,
      objName,
      objType,
    } = this.state;
    const modalTitle = `${collegeName} | ${familyName} | ${groupName}`;
    const modalContent = (
      <div>
        <p style={{ textAlign: 'center', marginBottom: '10px' }}> {modalTitle} </p>
        <div
          style={{
            width: '100%',
            height: '32px',
            lineHeight: ' 32px',
            marginBottom: '10px',
          }}
        >
          <span
            style={{
              width: '100px',
              float: 'left',
            }}
          >
            短名称：
          </span>
          <Input
            maxLength={30}
            style={{ width: '300px', float: 'left' }}
            onChange={e => {
              this.handelChange(e);
            }}
            value={name}
          />
        </div>
        <div
          style={{
            width: '100%',
            height: '32px',
            lineHeight: ' 32px',
          }}
        >
          <span
            style={{
              width: '100px',
              float: 'left',
            }}
          >
            拼音名称：
          </span>
          <Input
            maxLength={30}
            style={{ width: '300px', float: 'left' }}
            onChange={e => {
              this.handelSortChange(e);
            }}
            value={sort}
          />
        </div>
      </div>
      // <div>
      //   <p style={{ textAlign: 'center', marginBottom: '10px' }}>{modalTitle}</p>
      //   <Input
      //     maxLength={20}
      //     style={{ width: '300px', margin: '0 100px' }}
      //     onChange={e => {
      //       this.handelChange(e);
      //     }}
      //     value={name}
      //   />
      // </div>
    );
    return (
      <div>
        <ContentLayout
          routerData={this.props.routerData}
          contentTable={
            <div>
              <p className={common.totalNum}>总数：{dataSource.length} 条</p>
              <Table
                loading={loading}
                bordered
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                className={common.tableContentStyle}
              />
            </div>
          }
          // contentPagination={
          //   <SelfPagination
          //     onChange={(current, pageSize) => {
          //       this.changePage(current, pageSize);
          //     }}
          //     total={dataSource.length}
          //   />
          // }
        />
        <ModalDialog
          title="编辑小组短名称"
          visible={visible}
          modalContent={modalContent}
          showModal={bol => this.showModal(bol)}
          clickOK={() => this.clickModalOK(id, name, sort, objId, objName, objType)}
        />
      </div>
    );
  }
}
export default Group;
