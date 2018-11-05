
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import { assignUrlParams } from 'utils/utils';
import { formatYeatMonth } from 'utils/FormatDate';
import ContentLayout from '../../../layouts/ContentLayout';
import AuthorizedButton from '../../../selfComponent/AuthorizedButton';
import SelfPagination from '../../../selfComponent/selfPagination/SelfPagination';
import common from '../../Common/common.css';

@connect(({ coefficient, loading }) => ({
  coefficient,
  loading: loading.effects['coefficient/packageList'],
}))
class List extends Component {
  constructor(props) {
    super(props);
    const params = this.props.getUrlParams();
    const initParams = {
      params: {
        packageType:2,
        pageNum: 0, // 翻页---当前页码
        pageSize: 30, // 每页显示数据
      },
    };
    this.state = assignUrlParams(initParams, params);
  }

  componentDidMount() {
    this.getData();
  }


  // 编辑
  onEdit = key => {
    this.props.setRouteUrlParams('/performance/familyCoefficient/editor', {
      id: key.id,
    });
  };



  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    this.changePage(current, pageSize);
  };

  getData = params => {
    const stateParams = this.state.params;
    const userListParams = { ...stateParams, ...params };
    this.props.dispatch({
      type: 'coefficient/packageList',
      payload:{userListParams},
    });
    this.saveParams(userListParams);
  };

  // 查看详情
  detail = key => {
    this.props.setRouteUrlParams('/performance/familyCoefficient/check', {
      id: key.id,
    });
  };

  saveParams = params => {
    this.setState({ params });
    this.props.setCurrentUrlParams(params);
  };

  // 点击某一页函数
  changePage = (current, size) => {
    const params = {
      number: current > 1 ? current - 1 : 0,
      size,
    };
    this.getData(params);
  };

  // 时间戳格式处理
  timeFormate = (val) => {
    const {effectiveDate=null,expiryDate=null} = val;
    const startTime = formatYeatMonth(effectiveDate)
    const endTime1 = formatYeatMonth(expiryDate)
    const endTime= endTime1==='2099.12'?'至今':endTime1;
    return `${startTime} ～ ${endTime} `;
  };

  // 初始化tabale 列数据
  fillDataSource = (val) => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        effectiveTime: this.timeFormate(item),
        id: item.id,
      })
    );
    return data;
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '生效周期',
        dataIndex: 'effectiveTime',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <AuthorizedButton authority="/account/editAccount">
                <span
                  style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  onClick={() => this.detail(record)}
                >
                  查看详情
                </span>
              </AuthorizedButton>
              <AuthorizedButton authority="/account/editAccount">
                <span
                  style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
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
    return columns || [];
  };

  // 创建账号函数
  handleAdd = () => {
    this.props.setRouteUrlParams('/performance/familyCoefficient/create', {});
  };

  render() {
    const { loading ,coefficient={}} = this.props;
    const { pageNum} = this.state.params;
    const {data={}} = coefficient
    const {totalElements=0,content=[]} = data;
    const dataSource =  this.fillDataSource(content);
    const columns = this.columnsData();
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentButton={
          <AuthorizedButton authority="/account/createAccount">
            <Button onClick={this.handleAdd} type="primary" className={common.createButton}>
              + 创建
            </Button>
          </AuthorizedButton>
        }
        contentTable={
          <div>
            <p className={common.totalNum}>总数：{totalElements}条</p>
            <Table
              bordered
              loading={loading}
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
            defaultCurrent={pageNum}
            total={totalElements}
            defaultPageSize={30}
            pageSizeOptions={['30']}
          />
        }
      />
    );
  }
}
export default List;

