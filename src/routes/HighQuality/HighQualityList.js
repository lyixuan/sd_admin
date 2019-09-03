import React, { Component } from 'react';
import memoizeOne from 'memoize-one';
import { Button, Input, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { columnsFn } from './_selfColumn';
import ContentLayout from '../../layouts/ContentLayout';
import FormFilter from '../../selfComponent/FormFilter';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';
import styles from './HighQuality.less';

const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ highQuality, loading }) => ({
  highQuality,
  loading: loading.models.highQuality,
}))
class HighQualityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlParams: {
        collegeId: null,
        // familyId:null,
        // groupId:null,
        beginDate: null,
        endDate: null,
      },
    };
  }
  componentDidMount() {
    this.getAllOrg();
    console.log(36, this.props.highQuality);
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
      type: 'highQuality/findAllOrg',
      payload: {},
    });
  };

  getData = params => {
    const getListParams = { ...this.props.highQuality.getListParams, ...params };
    this.props.dispatch({
      type: 'highQuality/highQualityList',
      payload: { getListParams },
    });
  };
  // 点击某一页函数
  changePage = (pageNum, size) => {
    const params = FormFilter.getParams();
    const currentPageNum = pageNum + 1;
    const newParams = this.handleParams({ ...params, pageNum: currentPageNum, size });
    this.getData(this.filterEmptyParams(newParams));
  };
  // 表单搜索函数
  handleSearch = params => {
    const { beginDate = null, endDate = null } = params;
    const collegeId = params.collegeId ? Number(params.collegeId) : null;
    const urlParams = { ...this.state.urlParams, collegeId, beginDate, endDate };
    const newParams = this.handleParams(params);
    this.getData(this.filterEmptyParams(newParams));
    this.setState({ urlParams });
  };
  handleParams = params => {
    const {
      beginDate = null,
      endDate = null,
      stuName = null,
      cpName = null,
      code = null,
      pageSize = 15,
    } = params;
    const collegeId = params.collegeId ? Number(params.collegeId) : null;
    const orderId = params.orderId ? Number(params.orderId) : null;
    const page = params.pageNum ? Number(params.pageNum) : 1;
    const newParams = {
      collegeId,
      beginDate,
      endDate,
      orderId,
      stuName,
      cpName,
      page,
      code,
      pageSize,
    };
    console.log(102, newParams);
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
  clickUrl = () => {
    console.log(90909);
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
    // const RECOMMEND_LEVEL = window.BI_Filter('RECOMMEND_LEVEL');
    val.map((item, index) =>
      data.push({
        ...item,
        key: index,
        code: item.code,
        scoreDate: item.scoreDate,
        ordId: item.ordId,
        stuName: item.stuName,
        cpName: item.cpName,
        orgName: this.splitOrgName(item.collegeName, item.familyName, item.groupName),
        ugcType: this.otherUgcType(item.ugcType),
        kolFlag: item.kolFlag === 1 ? '是' : '否',
        countValue: item.countValue,
        postUrl: item.postUrl,
      })
    );
    return data;
  };
  // 优质帖类型回显
  otherUgcType = type => {
    if (type === 1) {
      return '社区优质帖';
    } else if (type === 2) {
      return '知乎优质帖';
    } else {
      return '知乎排名帖';
    }
  };
  // 删除数据
  goodStudentDel = () => {
    this.props.setRouteUrlParams('/highQuality/highQualityDel');
  };

  // 添加数据
  goodStudentAdd = () => {
    this.props.setRouteUrlParams('/highQuality/highQualityAdd');
  };
  splitOrgName = (...argument) => {
    return argument.filter(item => item).join(' | ');
  };
  clickUrl = url => {
    window.open(url);
  };

  render() {
    const { findAllOrg } = this.props.highQuality;
    const options = this.memoizedFilter(findAllOrg);

    const { urlParams } = this.state;
    const val = this.props.highQuality.qualityList;
    const data = !val.response ? [] : !val.response.data ? [] : val.response.data;
    const totalNum = !data.total ? 0 : data.total;
    const dataSource = !data.list ? [] : this.fillDataSource(data.list);
    const columns = columnsFn(this.clickUrl);
    const WrappedAdvancedSearchForm = () => (
      <FormFilter
        onSubmit={this.handleSearch}
        isLoading={this.props.loading}
        otherModal={urlParams}
      >
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>学分日期：</span>
          <RangePicker
            value={[urlParams.beginDate, urlParams.endDate].map(
              item => (item ? moment(item) : null)
            )}
            format={dateFormat}
            style={{ width: 230, height: 32 }}
            onChange={this.onChange}
          />
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>
            学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;院：
          </span>
          <Select
            placeholder="请选择学院"
            onChange={this.onSelectChange}
            style={{ width: 230, height: 32 }}
            value={urlParams.collegeId}
          >
            <Option value={null}>全部</Option>
            {options.map(item => (
              <Option key={item.collegeId} value={item.collegeId}>
                {item.collegeName}
              </Option>
            ))}
          </Select>
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>子订单编号：</span>
          <Input
            placeholder="请输入"
            maxLength={20}
            style={{ width: 230, height: 32 }}
            type="input"
            flag="orderId"
          />
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>学员姓名：</span>
          <Input
            placeholder="请输入"
            maxLength={20}
            style={{ width: 230, height: 32 }}
            type="input"
            flag="stuName"
          />
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>班主任姓名：</span>
          <Input
            placeholder="请输入"
            maxLength={20}
            style={{ width: 230, height: 32 }}
            type="input"
            flag="cpName"
          />
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>编号：</span>
          <Input
            placeholder="请输入"
            maxLength={20}
            style={{ width: 230, height: 32 }}
            type="input"
            flag="code"
          />
        </div>
      </FormFilter>
    );
    console.log(265, data);
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentForm={WrappedAdvancedSearchForm()}
        contentButton={
          <div>
            <AuthorizedButton authority="/highQuality/highQualityAdd">
              <Button
                onClick={this.goodStudentAdd}
                type="primary"
                className={common.addQualityButton}
              >
                添加数据
              </Button>
            </AuthorizedButton>
            <AuthorizedButton authority="/highQuality/highQualityDel">
              <Button
                onClick={this.goodStudentDel}
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
              bordered
              totalNum={totalNum}
              loading={this.props.loading}
              dataSource={dataSource}
              columns={columns}
              defaultPageSize={15}
              showPageSize={15}
              onChangePage={this.changePage}
            />
          </div>
        }
      />
    );
  }
}

export default HighQualityList;
