import React, { Component } from 'react';
import memoizeOne from 'memoize-one';
import { Button, Input, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { columnsFn } from './_selfColumn';
import ContentLayoutNew from '../../../layouts/ContentLayoutNew';
import FormFilter from '../../../selfComponent/FormFilter';
import AuthorizedButton from '../../../selfComponent/AuthorizedButton';
import common from '../../Common/common.css';
import styles from './style.less';

const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ goodStudent, loading }) => ({
  goodStudent,
  loading: loading.models.goodStudent,
}))
class List extends Component {
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
      type: 'goodStudent/findAllOrg',
      payload: {},
    });
  };

  getData = params => {
    const getListParams = { ...this.props.goodStudent.getListParams, ...params };
    this.props.dispatch({
      type: 'goodStudent/recommendList',
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
    const collegeId = params.collegeId ? Number(params.collegeId) : null;
    const urlParams = { ...this.state.urlParams, collegeId, beginDate, endDate };
    const newParams = this.handleParams(params);
    this.getData(this.filterEmptyParams(newParams));
    this.setState({ urlParams });
  };
  handleParams = params => {
    const { beginDate = null, endDate = null, studentName = null, teacherName = null } = params;
    const collegeId = params.collegeId ? Number(params.collegeId) : null;
    const orderId = params.orderId ? Number(params.orderId) : null;
    const pageIndex = params.pageNum ? Number(params.pageNum) : 0;
    const newParams = {
      collegeId,
      beginDate,
      endDate,
      orderId,
      studentName,
      teacherName,
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
  // 删除数据
  goodStudentDel = () => {
    this.props.setRouteUrlParams('/goodStudent/goodStudentDel');
  };

  // 添加数据
  goodStudentAdd = () => {
    this.props.setRouteUrlParams('/goodStudent/goodStudentAdd');
  };
  splitOrgName = (...argument) => {
    return argument.filter(item => item).join(' | ');
  };

  render() {
    const { findAllOrg } = this.props.goodStudent;
    const options = this.memoizedFilter(findAllOrg);

    const { urlParams } = this.state;
    const val = this.props.goodStudent.qualityList;
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
          <span style={{ lineHeight: '32px' }}>报名日期：</span>
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
            flag="studentName"
          />
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>老师姓名：</span>
          <Input
            placeholder="请输入"
            maxLength={20}
            style={{ width: 230, height: 32 }}
            type="input"
            flag="teacherName"
          />
        </div>
      </FormFilter>
    );
    const getTab = () => {
      return [
        { name: '家族', path: '/koDailyReport' },
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
            <AuthorizedButton authority="/goodStudent/goodStudentAdd">
              <Button
                onClick={this.goodStudentAdd}
                type="primary"
                className={common.addQualityButton}
              >
                添加数据
              </Button>
            </AuthorizedButton>
            <AuthorizedButton authority="/goodStudent/goodStudentDel">
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
              onChangePage={this.changePage}
            />
          </div>
        }
      />
    );
  }
}

export default List;
