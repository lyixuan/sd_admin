/* eslint-disable radix */
import React, { Component } from 'react';
import { Button, Input, Select, DatePicker, InputNumber } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { columnsFn } from './_selfColumn';
// import ContentLayoutNew from '../../../layouts/ContentLayoutNew';
import ContentLayout from '../../../layouts/ContentLayout';
import FormFilter from '../../../selfComponent/FormFilter';
import AuthorizedButton from '../../../selfComponent/AuthorizedButton';
import common from '../../Common/common.css';
import styles from './style.less';
import { saveParamsInUrl } from '../../../selfComponent/FormFilter/saveUrlParams';

const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;
const { RangePicker } = DatePicker;

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
  handleParams = params => {
    const {
      registrationBeginDate = undefined,
      registrationEndDate = undefined,
      orgName = undefined,
      recommendedTeacher = undefined,
      orderTypeList = undefined,
    } = params;
    const orderId = params.orderId ? parseInt(params.orderId) : undefined;
    const stuId = params.stuId ? parseInt(params.stuId) : undefined;
    const pageNum = params.pageNum ? Number(params.pageNum) : 0;
    const newParams = {
      registrationBeginDate,
      registrationEndDate,
      recommendedTeacher,
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
  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        ...item,
        key: index,
        id: item.id,
        saleoffJh: item.saleoffJh * 100,
        registrationDate: moment(item.registrationDate).format('YYYY-MM-DD'),
        fullLecturesFlag: item.fullLecturesFlag ? '是' : '否',
        orderType: window.BI_Filter(`BILL_TYPE|id:${item.orderType}`).name,
      })
    );
    return data;
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

  splitOrgName = (...argument) => {
    return argument.filter(item => item).join(' | ');
  };

  disabledDate = current => {
    return current > moment(this.props.createIncome.endDate);
  };

  render() {
    const options = window.BI_Filter('BILL_TYPE');
    const { urlParams } = this.state;
    const val = this.props.createIncome.qualityList;
    const data = !val.response ? [] : !val.response.data ? [] : val.response.data;
    const totalNum = !data.total ? 0 : data.total;
    const pageNum = !data.pageNum ? 1 : data.pageNum;
    const dataSource = !data.list ? [] : this.fillDataSource(data.list);
    const { beginDate, endDate } = this.props.createIncome;
    const initData = {
      registrationBeginDate: beginDate,
      registrationEndDate: endDate,
    };
    const columns = columnsFn();
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
            mode="multiple"
            allowClear
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
          <InputNumber
            className="agc"
            placeholder="请输入"
            min={0}
            style={{ width: 230, height: 32 }}
            type="inputnumber"
            flag="stuId"
          />
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>推荐老师：</span>
          <Input
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
            placeholder="请输入"
            maxLength={20}
            style={{ width: 230, height: 32 }}
            type="input"
            flag="teacherName"
          />
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>子订单ID：</span>
          <InputNumber
            className="agc"
            min={0}
            placeholder="请输入"
            style={{ width: 230, height: 32 }}
            type="inputnumber"
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
              scroll={{ x: 1660, y: 573 }}
              size="middle"
              className="circleTable"
              pageNum={pageNum}
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
