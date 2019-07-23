import React, { Component } from 'react';
import { Button, Input, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { columnsFn } from './_selfColumn';
import ContentLayoutNew from '../../../layouts/ContentLayoutNew';
import FormFilter from '../../../selfComponent/FormFilter';
import AuthorizedButton from '../../../selfComponent/AuthorizedButton';
import common from '../../Common/common.css';
import styles from './style.less';

const dateFormat = 'YYYY-MM-DD';
const { RangePicker } = DatePicker;

@connect(({ koIncome, loading }) => ({
  koIncome,
  loading: loading.models.koIncome,
}))
class KoIncome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlParams: {
        registrationBeginDate: null,
        registrationEndDate: null,
      },
    };
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

  getData = params => {
    const getListParams = { ...this.props.koIncome.getListParams, ...params };
    this.props.dispatch({
      type: 'koIncome/recommendList',
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
    const { registrationBeginDate = undefined, registrationEndDate = undefined } = params;
    const urlParams = { ...this.state.urlParams, registrationBeginDate, registrationEndDate };
    const newParams = this.handleParams(params);
    this.getData(this.filterEmptyParams(newParams));
    this.setState({ urlParams });
  };
  handleParams = params => {
    const {
      registrationBeginDate = undefined,
      registrationEndDate = undefined,
      orgName = undefined,
    } = params;
    const orderId = params.orderId ? Number(params.orderId) : undefined;
    const stuId = params.stuId ? Number(params.stuId) : undefined;
    const pageIndex = params.pageNum ? Number(params.pageNum) : 1;
    const newParams = {
      registrationBeginDate,
      registrationEndDate,
      orgName,
      orderId,
      stuId,
      pageIndex,
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
    const RECOMMEND_LEVEL = window.BI_Filter('RECOMMEND_LEVEL');
    val.map((item, index) =>
      data.push({
        ...item,
        key: index,
        id: item.id,
        upFlag: item.upFlag ? '是' : '否',
        recommendLevel: RECOMMEND_LEVEL.find(ls => ls.id === item.recommendLevel)
          ? RECOMMEND_LEVEL.find(ls => ls.id === item.recommendLevel).name
          : null,
        orgName: this.splitOrgName(item.collegeName, item.familyName, item.groupName),
      })
    );
    return data;
  };
  // 删除数据
  koIncomeDel = () => {
    this.props.setRouteUrlParams('/bottomOrder/koIncomeDel');
  };

  // 添加数据
  koIncomeAdd = () => {
    this.props.setRouteUrlParams('/bottomOrder/koIncomeAdd');
  };

  splitOrgName = (...argument) => {
    return argument.filter(item => item).join(' | ');
  };

  render() {
    const { urlParams } = this.state;
    const val = this.props.koIncome.qualityList;
    const data = !val.response ? [] : !val.response.data ? [] : val.response.data;
    const totalNum = !data.totalElements ? 1 : data.totalElements;
    const dataSource = !data.content ? [] : this.fillDataSource(data.content);
    const columns = columnsFn();
    const WrappedAdvancedSearchForm = () => (
      <FormFilter
        onSubmit={this.handleSearch}
        isLoading={this.props.loading}
        otherModal={urlParams}
      >
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>报名日期：</span>
          <RangePicker
            value={[urlParams.registrationBeginDate, urlParams.registrationEndDate].map(
              item => (item ? moment(item) : null)
            )}
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
          <span style={{ lineHeight: '32px' }}>学&nbsp;&nbsp;员&nbsp;&nbsp;ID：</span>
          <Input
            placeholder="请输入"
            maxLength={20}
            style={{ width: 230, height: 32 }}
            type="input"
            flag="stuId"
          />
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>子订单ID：</span>
          <Input
            placeholder="请输入"
            maxLength={20}
            style={{ width: 230, height: 32 }}
            type="input"
            flag="orderId"
          />
        </div>
      </FormFilter>
    );
    const getTab = () => {
      return [
        { name: '创收成单', path: '/bottomOrder/createIncome' },
        { name: 'KO成单', path: '/bottomOrder/koIncome' },
      ];
    };
    return (
      <ContentLayoutNew
        {...this.props}
        tab={getTab()}
        routerData={this.props.routerData}
        contentForm={WrappedAdvancedSearchForm()}
        contentButton={
          <div>
            <AuthorizedButton authority="/bottomOrder/koIncomeAdd">
              <Button onClick={this.koIncomeAdd} type="primary" className={common.addQualityButton}>
                添加数据
              </Button>
            </AuthorizedButton>
            <AuthorizedButton authority="/bottomOrder/koIncomeDel">
              <Button
                onClick={this.koIncomeDel}
                type="primary"
                className={common.deleteQualityButton}
              >
                删除数据
              </Button>
            </AuthorizedButton>
          </div>
        }
        contentTable={
          <div>
            <FormFilter.Table
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

export default KoIncome;
