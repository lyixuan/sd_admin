import React, { Component } from 'react';
import { Button, Input, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import { columnsFn } from './_selfColumn';
import ContentLayout from '../../layouts/ContentLayout';
import FormFilter from '../../selfComponent/FormFilter';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';
import styles from './goodStrudent.less';

const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ goodStudent, loading }) => ({
  goodStudent,
  loading: loading.models.goodStudent,
}))
class GoodStudentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collegeId: null,
      beginDate: null,
      endDate: null,
    };
  }
  componentDidMount() {
    this.getData({ size: 30 });
    this.getAllOrg();
  }

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    this.changePage(current, pageSize);
  };
  // 学院选择
  onSelectChange = val => {
    this.setState({ collegeId: val });
  };
  onChange = (dates, dateStrings) => {
    console.log(dateStrings);
    this.setState({
      beginDate: dateStrings[0],
      endDate: dateStrings[1],
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
    this.getData({
      pageSize: size,
      pageNum,
    });
  };
  // 表单搜索函数
  handleSearch = data => {
    const { endDate, beginDate, collegeId } = this.state;
    console.log(data);
    console.log(endDate, beginDate, collegeId);
    // e.preventDefault();
    // propsVal.form.validateFields((err, values) => {
    //   if (!err) {
    //     firstTeaName = !values.teaName ? undefined : values.teaName;
    //     firstQualityNum = !values.qualityNum ? undefined : values.qualityNum;
    //     firstPage = 0;
    //     const qualityListParams = {
    //       size: 30,
    //       number: 0,
    //       teaName: firstTeaName,
    //       qualityNum: firstQualityNum,
    //     };
    //     this.getData(qualityListParams);
    //   }
    // });
  };

  // 过滤数据
  selectOptions = () => {
    const { findAllOrg } = this.props.goodStudent;
    const hash = {};
    return findAllOrg.reduce((preVal, curVal) => {
      if (!hash[curVal.collegeId]) {
        hash[curVal.collegeId] = true;
        preVal.push(curVal);
      }
      return preVal;
    }, []);
  };
  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        id: item.id,
        collegeName: item.collegeName,
        familyName: item.familyName,
        groupName: item.groupName,
        teaName: item.teaName,
        stuName: item.stuName,
        countValue: item.countValue,
        qualityTypeName: item.qualityTypeName,
        qualityNum: item.qualityNum,
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

  render() {
    const options = this.selectOptions();

    const val = this.props.goodStudent.qualityList;
    const data = !val.response ? [] : !val.response.data ? [] : val.response.data;
    const totalNum = !data.totalElements ? 0 : data.totalElements;
    const dataSource = !data.content ? [] : this.fillDataSource(data.content);
    const columns = columnsFn();
    const WrappedAdvancedSearchForm = () => (
      <FormFilter onSubmit={this.handleSearch} isLoading={this.props.loading} modal={{ type: '' }}>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>报名日期：</span>
          <RangePicker
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
          >
            {options.map(item => (
              <Option key={item.collegeId} value={item.collegeId}>
                {item.collegeName}
              </Option>
            ))}
          </Select>
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>子订单编号：</span>
          <Input placeholder="请输入" maxLength={20} style={{ width: 230, height: 32 }} />
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>学院姓名：</span>
          <Input placeholder="请输入" maxLength={20} style={{ width: 230, height: 32 }} />
        </div>
        <div className={styles.u_div}>
          <span style={{ lineHeight: '32px' }}>老师姓名：</span>
          <Input placeholder="请输入" maxLength={20} style={{ width: 230, height: 32 }} />
        </div>
      </FormFilter>
    );
    return (
      <ContentLayout
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

export default GoodStudentList;
