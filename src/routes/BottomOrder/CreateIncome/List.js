/* eslint-disable radix */
import React, { Component } from 'react';
import { Button, Input, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
// import ContentLayoutNew from '../../../layouts/ContentLayoutNew';
import ContentLayout from '../../../layouts/ContentLayout';
import FormFilter from '../../../selfComponent/FormFilter';
import AuthorizedButton from '../../../selfComponent/AuthorizedButton';
import common from '../../Common/common.css';
import styles from './style.less';
import {
  filterEmptyUrlParams,
  getUrlParams,
  saveParamsInUrl,
} from '../../../selfComponent/FormFilter/saveUrlParams';

const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;
const { RangePicker } = DatePicker;

// 获取table列表头
const tablecolumns = [
  {
    title: '报名时间',
    dataIndex: 'registrationDate',
    width: 120,
    fixed: 'left',
    render: text => {
      return (
        <>
          {text === null ? (
            <span className={styles.unFind}>未获取到</span>
          ) : (
            moment(text).format('YYYY-MM-DD')
          )}
        </>
      );
    },
  },
  {
    title: '子订单ID',
    dataIndex: 'subOrderId',
    width: 100,
    fixed: 'left',
    render: text => {
      return <>{text === null ? <span className={styles.unFind}>未获取到</span> : text}</>;
    },
  },
  {
    title: '学员ID',
    dataIndex: 'studentId',
    width: 105,
    fixed: 'left',
    render: text => {
      return <>{text === null ? <span className={styles.unFind}>未获取到</span> : text}</>;
    },
  },
  {
    title: '组织架构',
    dataIndex: 'college',
    width: 180,
    fixed: 'left',
    render: (text, record) => {
      return (
        <>
          {`${
            record.collegeName ? (
              record.collegeName
            ) : (
              <span className={styles.unFind}>未获取到</span>
            )
          } ${record.familyName ? `| ${record.familyName}` : ''}  ${
            record.groupName ? `| ${record.groupName}` : ''
          }`}
        </>
      );
    },
  },
  {
    title: '推荐老师邮箱',
    dataIndex: 'teacherName',
    width: 110,
    render: text => {
      return <>{text === null ? <span className={styles.unFind}>未获取到</span> : text}</>;
    },
  },
  {
    title: '推荐老师',
    dataIndex: 'recommendedTeacher',
    width: 80,
  },
  {
    title: '重播听课',
    dataIndex: 'replayLecturesTime',
    width: 120,
  },
  {
    title: '直播听课',
    dataIndex: 'liveLecturesTime',
    width: 120,
  },
  {
    title: '判断逻辑',
    dataIndex: 'college',
    width: 100,
    render: (text, record) => {
      return <>{record.collegeName}</>;
    },
  },
  {
    title: '成单类型',
    dataIndex: 'orderType',
    width: 100,
    render: text => {
      return (
        <>
          {text === null ? (
            <span className={styles.unFind}>未获取到</span>
          ) : (
            window.BI_Filter(`BILL_TYPE|id:${text}`).name
          )}
        </>
      );
    },
  },
  {
    title: '是否提退',
    dataIndex: 'orderType',
    width: 100,
    render: text => {
      return <>{text === null ? 0 : text}</>;
    },
  },
  {
    title: '是否挽留成功',
    dataIndex: 'orderType',
    width: 100,
    render: text => {
      return <>{text === null ? 0 : text}</>;
    },
  },
  {
    title: '净流水',
    dataIndex: 'financeNetFlow',
    width: 90,
    render: text => {
      return <>{text === null ? '0.00' : text.toFixed(2)}</>;
    },
  },
  {
    title: '竞合比',
    dataIndex: 'saleoffJh',
    width: 110,
    render: (text, record) => {
      return <>{record.saleoffJh ? (record.saleoffJh * 100).toFixed(2) : '100.00'}</>;
    },
  },
  {
    title: '创收流水',
    dataIndex: 'saleoffJh',
    width: 120,
    render: text => {
      return <>{text === null ? '0.00' : text.toFixed(2)}</>;
    },
  },
  {
    title: '绩效流水',
    dataIndex: 'kpiFlow',
    width: 70,
    render: text => {
      return <>{text === null ? '0.00' : text.toFixed(2)}</>;
    },
  },
];

@connect(({ createIncome, loading }) => ({
  createIncome,
  loadingTime: loading.effects['createIncome/getDateRange'],
  loading: loading.effects['createIncome/recommendList'],
}))
class CreateList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlParams: {
        orderTypeList: [],
        registrationBeginDate: null,
        registrationEndDate: null,
      },
    };
  }
  componentDidMount() {
    const that = this;
    this.props
      .dispatch({
        type: 'createIncome/getDateRange',
        payload: {},
      })
      .then(response => {
        if (response) {
          const urlParams = {
            ...this.state.urlParams,
            registrationBeginDate: moment(response.beginDate).format('YYYY-MM-DD') || null,
            registrationEndDate: moment(response.endDate).format('YYYY-MM-DD') || null,
          };
          this.setState({
            urlParams,
          });
          const params = {
            registrationBeginDate: moment(response.beginDate).format('YYYY-MM-DD') || undefined,
            registrationEndDate: moment(response.endDate).format('YYYY-MM-DD') || undefined,
          };
          that.handleSearch(params);
          saveParamsInUrl(params);
        }
      });
  }
  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    this.changePage(current, pageSize);
  };
  onChange = (dates, dateStrings) => {
    const urlParams = {
      ...this.state.urlParams,
      registrationBeginDate: dateStrings[0] || null,
      registrationEndDate: dateStrings[1] || null,
    };
    this.setState({
      urlParams,
    });
  };
  onEdit = () => {
    console.log(111);
  };
  // 成单类型选择
  onSelectChange = val => {
    const urlParams = { ...this.state.urlParams, orderTypeList: val };
    this.setState({ urlParams });
  };

  getData = params => {
    const getListParams = { ...this.props.createIncome.getListParams, ...params };
    this.props.dispatch({
      type: 'createIncome/recommendList',
      payload: { getListParams },
    });
  };
  getParamsOnEnter = () => {
    const params = getUrlParams();
    const p = filterEmptyUrlParams(params);
    return p;
  };
  // 点击某一页函数
  changePage = (pageNum, size) => {
    const params = FormFilter.getParams();
    const newParams = this.handleParams({ ...params, pageNum, size });
    this.getData(this.filterEmptyParams(newParams));
  };
  // 表单搜索函数
  handleSearch = params => {
    const {
      registrationBeginDate = undefined,
      registrationEndDate = undefined,
      orderTypeList = [],
    } = params;
    const urlParams = {
      ...this.state.urlParams,
      registrationBeginDate,
      registrationEndDate,
      orderTypeList,
    };
    const newParams = this.handleParams(params);
    this.getData(this.filterEmptyParams(newParams));
    this.setState({ urlParams });
  };

  handleSearchEnter = () => {
    const params = this.getParamsOnEnter();
    const arr = params.morderTypeList ? params.morderTypeList.split(',') : [];
    arr.forEach((item, i) => {
      if (item === '') arr.splice(i, 1);
      arr[i] = Number(item);
    });
    params.orderTypeList = arr;

    if (params.registrationBeginDate) {
      params.registrationBeginDate = Number(params.registrationBeginDate);
      params.registrationEndDate = Number(params.registrationEndDate);
    }
    this.handleSearch(params);
  };

  handleParams = params => {
    const {
      registrationBeginDate = undefined,
      registrationEndDate = undefined,
      orgName = undefined,
      recommendedTeacher = undefined,
      orderTypeList = undefined,
      teacherName = undefined,
    } = params;
    const orderId = params.orderId ? parseInt(params.orderId) : undefined;
    const stuId = params.stuId ? parseInt(params.stuId) : undefined;
    const pageNum = params.pageNum ? Number(params.pageNum) : 0;
    const newParams = {
      registrationBeginDate,
      registrationEndDate,
      recommendedTeacher,
      teacherName,
      orgName,
      orderId,
      stuId,
      orderTypeList,
      pageNum,
    };
    return newParams;
  };
  filterEmptyParams = data => {
    const params = data;
    for (const i in params) {
      if (
        params[i] === undefined ||
        params[i] === null ||
        params[i] === '' ||
        params[i].length === 0
      ) {
        delete params[i];
      }
    }
    return params;
  };
  resetList = () => {
    const urlParams = { ...this.state.urlParams, orderTypeList: [] };
    this.setState({ urlParams });
  };
  // 删除数据
  createIncomeDel = () => {
    this.props.setRouteUrlParams('/bottomOrder/createIncomeDel');
  };

  // 添加数据
  createIncomeAdd = () => {
    this.props.setRouteUrlParams('/bottomOrder/createIncomeAdd');
  };

  disabledDate = current => {
    return current > moment(this.props.createIncome.endDate);
  };

  columnsAction = () => {
    const actionObj = [
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <>
              <span
                style={{ color: '#52C9C2', cursor: 'pointer' }}
                onClick={() => this.onEdit(record)}
              >
                编辑
              </span>
            </>
          );
        },
      },
      {
        title: '',
        dataIndex: 'duoyukuandu',
      },
    ];
    return [...tablecolumns, ...actionObj];
  };

  render() {
    const options = window.BI_Filter('BILL_TYPE');
    const { urlParams } = this.state;
    const val = this.props.createIncome.qualityList;
    const res = !val.response ? {} : !val.response.data ? {} : val.response.data;
    const data = res.pageInfo || {};
    const totalNum = !data.total ? 0 : data.total;
    const totalMoney = !res.kpiFlowTotal ? 0 : res.kpiFlowTotal;
    const pageNum = !data.pageNum ? 1 : data.pageNum;
    const dataSource = data.list;
    const { beginDate, endDate } = this.props.createIncome;
    const initData = {
      registrationBeginDate: beginDate || null,
      registrationEndDate: endDate || null,
    };
    const columns = this.columnsAction();
    const WrappedAdvancedSearchForm = () => (
      <FormFilter
        onSubmit={this.handleSearch}
        initData={initData}
        isLoading={this.props.loading}
        isCreateIncome={1}
        otherModal={urlParams}
        resetList={this.resetList}
      >
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>报名日期：</span>
          <RangePicker
            allowClear
            value={[urlParams.registrationBeginDate, urlParams.registrationEndDate].map(
              item => (item ? moment(item) : null)
            )}
            disabledDate={this.disabledDate}
            format={dateFormat}
            style={{ width: 230, height: 32 }}
            onChange={this.onChange}
          />
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>
            组&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;织：
          </span>
          <Input
            onPressEnter={this.handleSearchEnter}
            placeholder="请输入"
            maxLength={20}
            style={{ width: 230, height: 32 }}
            type="input"
            flag="orgName"
          />
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>成单类型：</span>
          <Select
            allowClear
            mode="multiple"
            showArrow
            maxTagCount={1}
            maxTagTextLength={7}
            placeholder="请选择"
            type="select"
            flag="orderTypeList"
            onChange={this.onSelectChange}
            style={{ width: 230, height: 32 }}
            value={urlParams.orderTypeList}
          >
            {options.map(item => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>学&nbsp;&nbsp;员&nbsp;&nbsp;ID：</span>
          <Input
            onPressEnter={this.handleSearchEnter}
            className="agc"
            placeholder="请输入数字"
            min={0}
            style={{ width: 230, height: 32 }}
            type="input"
            flag="stuId"
          />
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>推荐老师：</span>
          <Input
            onPressEnter={this.handleSearchEnter}
            placeholder="请输入"
            maxLength={20}
            style={{ width: 230, height: 32 }}
            type="input"
            flag="recommendedTeacher"
          />
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>推荐老师邮箱：</span>
          <Input
            onPressEnter={this.handleSearchEnter}
            placeholder="请输入"
            maxLength={20}
            style={{ width: 230, height: 32 }}
            type="input"
            flag="teacherName"
          />
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>子订单ID：</span>
          <Input
            onPressEnter={this.handleSearchEnter}
            className="agc"
            min={0}
            placeholder="请输入数字"
            style={{ width: 230, height: 32 }}
            type="input"
            flag="orderId"
          />
        </div>
        <div className={styles.u_div}>&nbsp;</div>
      </FormFilter>
    );
    // const getTab = () => {
    //   return [
    //     { name: '创收成单', path: '/bottomOrder/createIncome' },
    //     { name: 'KO成单', path: '/bottomOrder/koIncome' },
    //   ];
    // };
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentForm={WrappedAdvancedSearchForm()}
        contentButton={
          <div>
            <AuthorizedButton authority="/bottomOrder/createIncomeAdd">
              <Button onClick={this.createIncomeAdd} type="primary" className={common.newButton}>
                添加数据
              </Button>
            </AuthorizedButton>
            <span>&nbsp;&nbsp;</span>
            <AuthorizedButton authority="/bottomOrder/createIncomeDel">
              <Button
                onClick={this.createIncomeDel}
                type="primary"
                className={common.cancleButtonGray}
              >
                删除数据
              </Button>
            </AuthorizedButton>
          </div>
        }
        contentTable={
          <div style={{ padding: 10 }}>
            <FormFilter.Table
              scroll={{ x: 1910, y: 573 }}
              size="middle"
              className="circleTable"
              pageNum={pageNum}
              totalMoney={totalMoney}
              totalNum={totalNum}
              loading={this.props.loading}
              dataSource={dataSource}
              columns={columns}
              onChangePage={this.changePage}
            />
          </div>
        }
      />
    );
  }
}

export default CreateList;
