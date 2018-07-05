import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Pagination, Input } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import ModalDialog from '../../selfComponent/Modal/Modal';
import common from '../Common/common.css';
import styles from '../../selfComponent/Modal/Modal.css';

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
      objId: 0,
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
      objId: record.objId,
      visible: true,
    });
  };

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };

  getCollegeData = params => {
    this.props.dispatch({
      type: 'shortName/collegeList',
      payload: { paramsObj: params },
    });
  };
  // 点击某一页函数
  changePage = (current, pageSize) => {
    console.log(current, pageSize);
  };
  // 模态框回显
  editName = objId => {
    const paramsObj = {
      objId,
      name: this.state.name,
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
    const { collegeList } = this.props.shortName;
    const dataSource = !collegeList ? [] : collegeList.data;
    const columns = !this.columnsData() ? [] : this.columnsData();
    const { visible, collegeName, objId, name } = this.state;
    const modalContent = (
      <div>
        <p className={styles.name}> {collegeName} </p>
        <Input
          className={styles.shotName}
          // ref="name"
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
            <Pagination
              showSizeChanger
              onChange={this.changePage}
              onShowSizeChange={this.onShowSizeChange}
              defaultCurrent={1}
              total={100}
              className={common.paginationStyle}
            />
          }
        />
        <ModalDialog
          title="编辑学院短名称"
          visible={visible}
          modalContent={modalContent}
          clickOK={() => this.editName(objId)}
        />
      </div>
    );
  }
}

export default College;
