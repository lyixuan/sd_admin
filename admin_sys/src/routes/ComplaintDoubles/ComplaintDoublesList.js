import React, { Component } from 'react';
import { connect } from 'dva';
import { Table} from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';

@connect(({ complaintDoubles, loading }) => ({
  complaintDoubles,
  loading,
}))
class ComplaintDoublesList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log("进入did")
    const complaintDoublesListParams = { size: 30, number: 0 };
    this.props.dispatch({
      type: 'complaintDoubles/complaintDoublesList',
      payload: { complaintDoublesListParams },
    });
  }

  // 编辑账号函数
  onEdit = key => {
    console.log(key);

  };

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    console.log(pageSize, current);

  };

  // 点击某一页函数
  changePage = (current, pageSize) => {
    console.log(pageSize, current);

  };

  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        collegeName: item.collegeName,
        multiplePoints: item.multiplePoints,
        id: item.id,
        effectiveDate: item.effectiveDate,
      })
    );
    return data;
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: '学院id',
        dataIndex: 'id',
      },
      {
        title: '学院名称',
        dataIndex: 'collegeName',
      },
      {
        title: '生效月份',
        dataIndex: 'effectiveDate',
      },
      {
        title: '投诉扣分倍数',
        dataIndex: 'multiplePoints',
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
    console.log(this.props)
    const data = !this.props.complaintDoubles.complaintDoublesList.response
      ? []
      : !this.props.complaintDoubles.complaintDoublesList.response.data
        ? []
        : this.props.complaintDoubles.complaintDoublesList.response.data;
    const totalNum = !data.totalElements ? 0 : data.totalElements;
    const dataSource = !data.content ? [] : this.fillDataSource(data.content);
    const columns = !this.columnsData() ? [] : this.columnsData();

    return(
      <ContentLayout
        pageHeraderUnvisible="unvisible"
        title="投诉翻倍"
        contentTable={
          <div>
            <p className={common.totalNum}>总数：{totalNum}条</p>
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
            onShowSizeChange={(current, pageSize) => {
              this.onShowSizeChange(current, pageSize);
            }}
            defaultCurrent={1}
            total={totalNum}
            defaultPageSize={30}
            pageSizeOptions={['30']}
          />
        }
      />)
  }
}
export default ComplaintDoublesList;
