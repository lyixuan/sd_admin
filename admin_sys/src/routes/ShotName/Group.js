import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input } from 'antd';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import ModalDialog from '../../selfComponent/Modal/Modal';
import common from '../Common/common.css';

@connect(({ shortName, loading }) => ({
  shortName,
  loading,
}))
class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      groupName: '',
      objId: 0,
      name: '',
    };
  }

  componentDidMount() {
    this.getGroupData({ size: 30, number: 0 });
  }

  // 编辑
  onEdit = record => {
    this.setState({
      groupName: record.groupName,
      objId: record.objId,
      visible: true,
    });
  };

  // 获取小组列表数据
  getGroupData = params => {
    this.props.dispatch({
      type: 'shortName/groupList',
      payload: { paramsObj: params },
    });
  };

  // 点击某一页函数
  changePage = (current, pageSize) => {
    console.log(current, pageSize);
  };
  // 模态框回显
  editName = (id, groupShortName) => {
    const paramsObj = {
      id,
      groupShortName,
    };
    this.props.dispatch({
      type: 'shortName/editCollege',
      payload: { paramsObj },
    });
  };
  // input双向绑定
  handelChange(e) {
    this.setState({
      name: e.target.value,
    });
  }
  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: '序号',
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
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <AuthorizedButton authority="/account/editAccount">
                <span style={{ color: '#52C9C2' }} onClick={() => this.onEdit(record)}>
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
    const { dataList } = this.props.shortName;
    const dataSource = !dataList ? [] : dataList.data;
    const columns = !this.columnsData() ? [] : this.columnsData();
    const { visible, groupName, objId, name } = this.state;
    const modalContent = (
      <div>
        <p style={{ textAlign: 'center', marginBottom: '10px' }}> {groupName} </p>
        <Input
          style={{ width: '300px', margin: '0 100px' }}
          onChange={e => {
            this.handelChange(e);
          }}
          value={name}
        />
      </div>
    );
    return (
      <div>
        <ContentLayout
          pageHeraderUnvisible="unvisible"
          title="小组"
          contentTable={
            <div>
              <p className={common.totalNum}>总数：500条</p>
              <Table
                bordered
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                className={common.tableContentStyle}
              />
            </div>
          }
          contentPagination={
            <SelfPagination
              onChange={(current, pageSize) => {
                this.changePage(current, pageSize);
              }}
              total={100}
            />
          }
        />
        <ModalDialog
          title="编辑小组短名称"
          visible={visible}
          modalContent={modalContent}
          clickOK={() => this.editName(objId, name)}
        />
      </div>
    );
  }
}
export default Group;
