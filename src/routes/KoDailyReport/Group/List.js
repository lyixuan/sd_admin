import React, { Component } from 'react';
import memoizeOne from 'memoize-one';
import { Button, Select } from 'antd';
import { connect } from 'dva';
import { columnsFn } from './_selfColumn';
import ContentLayoutNew from '../../../layouts/ContentLayoutNew';
import FormFilter from '../../../selfComponent/FormFilter';
import AuthorizedButton from '../../../selfComponent/AuthorizedButton';
import common from '../../Common/common.css';
import styles from './style.less';

const { Option } = Select;

@connect(({ koDailyReportGroup, loading }) => ({
  koDailyReportGroup,
  loading: loading.models.koDailyReportGroup,
}))
class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlParams: {
        beginDate: null,
        endDate: null,
      },
    };
  }
  componentDidMount() {
    this.getAllOrg();
  }
  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    this.changePage(current, pageSize);
  };
  // 学院选择
  onSelectChange = val => {
    const urlParams = { ...this.state.urlParams, collegeId: val };
    this.setState({ urlParams });
  };
  onChange = (dates, dateStrings) => {
    const urlParams = {
      ...this.state.urlParams,
      beginDate: dateStrings[0] || null,
      endDate: dateStrings[1] || null,
    };
    this.setState({
      urlParams,
    });
  };
  // 所有学院列表
  getAllOrg = () => {
    this.props.dispatch({
      type: 'koDailyReportGroup/findAllOrg',
      payload: {},
    });
  };

  getData = params => {
    const getListParams = { ...this.props.koDailyReportGroup.getListParams, ...params };
    this.props.dispatch({
      type: 'koDailyReportGroup/recommendList',
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
    const { beginDate = null, endDate = null } = params;
    const urlParams = { ...this.state.urlParams, beginDate, endDate };
    const newParams = this.handleParams(params);
    this.getData(this.filterEmptyParams(newParams));
    this.setState({ urlParams });
  };
  handleParams = params => {
    const { beginDate = null, endDate = null } = params;
    const pageIndex = params.pageNum ? Number(params.pageNum) : 1;
    const newParams = {
      beginDate,
      endDate,
      pageIndex,
    };
    return newParams;
  };
  filterEmptyParams = data => {
    const params = data;
    for (const i in params) {
      if (params[i] === undefined || params[i] === null || params[i] === '') {
        delete params[i];
      }
    }
    return params;
  };
  // 过滤数据
  memoizedFilter = memoizeOne(findAllOrg => {
    const hash = {};
    return findAllOrg.reduce((preVal, curVal) => {
      if (!hash[curVal.collegeId]) {
        hash[curVal.collegeId] = true;
        preVal.push(curVal);
      }
      return preVal;
    }, []);
  });
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
  // 添加数据
  koDailyReportGroupAdd = () => {
    this.props.setRouteUrlParams('/koDailyReport/groupAdd');
  };
  splitOrgName = (...argument) => {
    return argument.filter(item => item).join(' | ');
  };

  render() {
    const { findAllOrg } = this.props.koDailyReportGroup;
    const options = this.memoizedFilter(findAllOrg);

    const { urlParams } = this.state;
    const val = this.props.koDailyReportGroup.qualityList;
    const data = !val.response ? [] : !val.response.data ? [] : val.response.data;
    const totalNum = !data.totalElements ? 0 : data.totalElements;
    const dataSource = !data.content ? [] : this.fillDataSource(data.content);
    const columns = columnsFn();
    const WrappedAdvancedSearchForm = () => (
      <FormFilter
        onSubmit={this.handleSearch}
        isLoading={this.props.loading}
        otherModal={urlParams}
      >
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>绩效周期：</span>
          <Select
            placeholder="请选择"
            onChange={this.onSelectChange}
            style={{ width: 230, height: 32 }}
            value={urlParams.collegeId}
          >
            {options.map(item => (
              <Option key={item.collegeId} value={item.collegeId}>
                {item.collegeName}
              </Option>
            ))}
          </Select>
        </div>
      </FormFilter>
    );
    const getTab = () => {
      return [
        { name: '家族', path: '/koDailyReport/family' },
        { name: '运营小组', path: '/koDailyReport/group' },
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
            <AuthorizedButton authority="/koDailyReport/groupAdd">
              <Button
                onClick={this.koDailyReportGroupAdd}
                type="primary"
                className={common.addQualityButton}
              >
                添加数据
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

export default List;
