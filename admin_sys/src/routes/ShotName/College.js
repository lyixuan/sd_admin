import React, { Component } from 'react';
import { Table, Pagination } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import ModalDialog from '../../selfComponent/Modal/Modal';
import common from '../Common/common.css';

class College extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '学院id',
        dataIndex: 'status',
      },
      {
        title: '学院名称',
        dataIndex: 'role',
      },
      {
        title: '学院简称',
        dataIndex: 'status2',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <AuthorizedButton authority="/account/editAccount">
                <span style={{ color: '#52C9C2' }} onClick={() => this.onEdit(record.key)}>
                  编辑
                </span>
              </AuthorizedButton>
            </div>
          );
        },
      },
    ];

    const dataSource = [
      {
        key: 1,
        name: `张三`,
        role: `院长`,
        status: `启用`,
        email: `hello@sunlands.com`,
      },
      {
        key: 2,
        name: `王五`,
        role: `学员`,
        status: `启用`,
        email: `hello@sunlands.com`,
      },
      {
        key: 3,
        name: `赵六`,
        role: `院长`,
        status: `禁止`,
        email: `hello@sunlands.com`,
      },
    ];

    this.state = {
      dataSource: !dataSource ? [] : dataSource,
      visible: false,
    };
  }
  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };

  onEdit = () => {
    this.showModal(true);
  };
  showModal = bol => {
    this.setState({
      visible: bol,
    });
  };

  render() {
    const { dataSource, visible } = this.state;
    const columns = !this.columns ? [] : this.columns;
    return (
      <div>
        <ContentLayout
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
              onShowSizeChange={this.onShowSizeChange}
              defaultCurrent={1}
              total={100}
              className={common.paginationStyle}
            />
          }
        />
        <ModalDialog
          title="编辑学院简称"
          name="学院名称"
          visible={visible}
          showModal={bol => this.showModal(bol)}
        />
      </div>
    );
  }
}
export default College;
