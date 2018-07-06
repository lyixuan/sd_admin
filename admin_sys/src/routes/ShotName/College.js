import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Input } from 'antd';
// import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import ModalDialog from '../../selfComponent/Modal/Modal';
import common from '../Common/common.css';

@connect(({ shortName, loading }) => ({
  shortName,
  loading,
}))
class College extends Component {
  constructor(props) {
    super(props);
    const { visible } = props.shortName;
    this.state = {
      visible,
      collegeName: '',
      id: 0,
      name: '',
    };
  }
  componentDidMount() {
    this.getCollegeData({ size: 30, number: 0 });
  }

  // 编辑
  onEdit = record => {
    this.setState({
      collegeName: record.collegeName,
      id: record.id,
      visible: true,
    });
  };

  getCollegeData = params => {
    this.props.dispatch({
      type: 'shortName/collegeList',
      payload: { paramsObj: params },
    });
  };

  // 模态框回显
  clickModalOK = (id, collegeShortName) => {
    const paramsObj = {
      id,
      collegeShortName,
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
        title: '序号',
        dataIndex: 'id',
      },
      {
        title: '学院id',
        dataIndex: 'collegeId',
      },
      {
        title: '学院名称',
        dataIndex: 'collegeName',
      },
      {
        title: '学院简称',
        dataIndex: 'objShortName',
      },
      {
        title: '操作',
        key: 'operation',
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
    const { collegeList } = this.props.shortName;
    const dataSource = !collegeList ? [] : collegeList.data;
    const columns = !this.columnsData() ? [] : this.columnsData();
    const { visible, collegeName, id, name } = this.state;
    const modalContent = (
      <div>
        <p style={{ textAlign: 'center', marginBottom: '10px' }}> {collegeName} </p>
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
          title="学院"
          contentTable={
            <div>
              <p className={common.totalNum}>总数：{dataSource.length} 条</p>
              <Table
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
          title="编辑学院短名称"
          visible={visible}
          modalContent={modalContent}
          showModal={bol => this.showModal(bol)}
          clickOK={() => this.clickModalOK(id)}
        />
      </div>
    );
  }
}

export default College;
