import React, { Component } from 'react';
import { Table, Pagination } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import ModalDialog from '../../selfComponent/Modal/Modal';
import common from '../Common/common.css';

class Family extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  // 编辑
  onEdit = () => {
    this.showModal(true);
  };

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };

  // 点击某一页函数
  changePage = (current, pageSize) => {
    console.log(current, pageSize);
  };

  // 初始化tabale 列数据
  fillDataSource = () => {
    const data = [];
    for (let i = 0; i < 50; i += 1) {
      data.push({
        key: i,
        name: `张三`,
        role: `院长`,
        status: `启用`,
        email: `hello${i}@sunlands.com`,
      });
    }
    return data;
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
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
    return columns;
  };

  showModal = bol => {
    this.setState({
      visible: bol,
    });
  };

  render() {
    const dataSource = !this.fillDataSource() ? [] : this.fillDataSource();
    const columns = !this.columnsData() ? [] : this.columnsData();
    const { visible } = this.state;
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
              onChange={this.changePage}
              onShowSizeChange={this.onShowSizeChange}
              defaultCurrent={1}
              total={100}
              className={common.paginationStyle}
            />
          }
        />
        <ModalDialog
          title="编辑小组简称"
          name="学院名称/家族名称/小组名称"
          visible={visible}
          showModal={bol => this.showModal(bol)}
        />
      </div>
    );
  }
}

export default Family;
