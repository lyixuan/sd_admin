import React, { Component } from 'react';
import { Table, Button, Form, Input, Row, Col, Select } from 'antd';
import { connect } from 'dva';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';

const FormItem = Form.Item;
const { Option } = Select;

let firstTeaName = '';
let firstQualityNum = '';
let firstPage = 0; // 分页的默认起开页面
@connect(({ quality, loading }) => ({
  quality,
  loading: loading.models.quality,
}))
class PersonalPerformance extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const initVal = this.props.getUrlParams();
    firstTeaName = !initVal.firstTeaName ? '' : initVal.firstTeaName;
    firstQualityNum = !initVal.firstQualityNum ? '' : Number(initVal.firstQualityNum);
    firstPage = !initVal.firstPage ? 0 : Number(initVal.firstPage);
    const teaName = !firstTeaName ? undefined : firstTeaName;
    const qualityNum = !firstQualityNum ? undefined : firstQualityNum;
    const number = !firstPage ? 0 : firstPage;
    this.getData({ size: 30, number, teaName, qualityNum });
  }

  componentWillUnmount() {
    firstTeaName = null;
    firstQualityNum = null;
  }

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    this.changePage(current, pageSize);
  };

  getData = params => {
    const getListParams = { ...this.props.quality.getListParams, ...params };
    this.props.dispatch({
      type: 'quality/getQualityList',
      payload: { getListParams },
    });
  };
  publickObj = {
    propsVal: '',
  };
  // 点击某一页函数
  changePage = (current, pageSize) => {
    firstPage = current - 1;
    this.props.setCurrentUrlParams({ firstPage });
    this.getData({
      size: pageSize,
      number: firstPage,
      teaName: !firstTeaName ? undefined : firstTeaName,
      qualityNum: !firstQualityNum ? undefined : firstQualityNum,
    });
  };

  // 表单搜索函数
  handleSearch = e => {
    e.preventDefault();
    this.publickObj.propsVal.form.validateFields((err, values) => {
      if (!err) {
        firstTeaName = !values.teaName ? undefined : values.teaName;
        firstQualityNum = !values.qualityNum ? undefined : values.qualityNum;
        firstPage = 0;
        const qualityListParams = {
          size: 30,
          number: 0,
          teaName: firstTeaName,
          qualityNum: firstQualityNum,
        };
        this.getData(qualityListParams);
        this.props.setCurrentUrlParams({ firstTeaName, firstQualityNum, firstPage });
      }
    });
  };
  // 表单重置
  handleReset = () => {
    firstTeaName = '';
    firstQualityNum = '';
    firstPage = 0;
    this.publickObj.propsVal.form.resetFields();
    this.props.setRouteUrlParams('/quality/qualityList');
    this.getData({ size: 30, number: 0 });
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

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        width: '65px',
      },
      {
        title: '身份证号',
        dataIndex: 'collegeName',
      },
      {
        title: '姓名',
        dataIndex: 'familyName',
      },
      {
        title: '岗位',
        dataIndex: 'groupName',
      },
      {
        title: '学院｜家族｜小组',
        dataIndex: 'teaName',
      },
      {
        title: '月份',
        dataIndex: 'stuName',
      },
      {
        title: '总包金额',
        dataIndex: 'qualityTypeName',
      },
      {
        title: '实发金额',
        dataIndex: 'countValue',
      },
      {
        title: '调整比例（%）',
        dataIndex: 'qualityNum',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <AuthorizedButton authority="/performance/personalPerformance">
                <span
                  style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                  onClick={() => this.checkDetail(record)}
                >
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
    const val = this.props.quality.qualityList;
    const data = !val.response ? [] : !val.response.data ? [] : val.response.data;
    const totalNum = !data.totalElements ? 0 : data.totalElements;
    const dataSource = !data.content ? [] : this.fillDataSource(data.content);
    const columns = !this.columnsData() ? [] : this.columnsData();
    const formLayout = 'inline';
    const WrappedAdvancedSearchForm = Form.create()(props => {
      this.publickObj.propsVal = props;
      const { getFieldDecorator } = props.form;
      return (
        <div>
          <Form layout={formLayout} onSubmit={this.handleSearch}>
            <Row gutter={24}>
              <Col span={6}>
                <FormItem label="姓名">
                  {getFieldDecorator('teaName', {
                    initialValue: firstTeaName,
                    rules: [],
                  })(<Input placeholder="请输入姓名" style={{ height: 32 }} />)}
                </FormItem>
              </Col>
              <Col span={6} style={{ textAlign: 'center' }}>
                <FormItem label="身份证号">
                  {getFieldDecorator('qualityNum', {
                    initialValue: firstQualityNum,
                    rules: [],
                  })(<Input placeholder="请输入身份证号" maxLength={20} style={{ height: 32 }} />)}
                </FormItem>
              </Col>
              <Col span={6} style={{ textAlign: 'center' }}>
                <FormItem label="实发金额">
                  {getFieldDecorator('qualityNum', {
                    initialValue: firstQualityNum,
                    rules: [],
                  })(
                    <Select placeholder="----" style={{ width: 150, height: 32 }}>
                      <Option value="1">有</Option>
                      <Option value="0">无</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <FormItem>
                  <Button
                    onClick={this.handleSearch}
                    type="primary"
                    className={common.searchButton}
                  >
                    搜 索
                  </Button>
                  <Button onClick={this.handleReset} type="primary" className={common.resetButton}>
                    重 置
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      );
    });
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentForm={<WrappedAdvancedSearchForm />}
        contentTable={
          <div>
            <p className={common.totalNum}>总数：{totalNum}条</p>
            <Table
              loading={this.props.loading}
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
            defaultCurrent={firstPage + 1}
            total={totalNum}
            defaultPageSize={30}
          />
        }
      />
    );
  }
}

export default PersonalPerformance;
