import React, { Component } from 'react';
import { Table, Button, Form, Input, Row, Col, Select } from 'antd';
import { connect } from 'dva';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';

const FormItem = Form.Item;
const { Option } = Select;

let firstIdCard = '';
let firstName = '';
let firstActualKpi = 0;
let firstPage = 0; // 分页的默认起开页面
@connect(({ performance, loading }) => ({
  performance,
  loading: loading.models.performance,
}))
class PersonalPerformance extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const initVal = this.props.getUrlParams();
    firstIdCard = !initVal.firstIdCard ? '' : Number(initVal.firstPage);
    firstName = !initVal.firstName ? '' : initVal.firstName;
    firstActualKpi = !initVal.firstActualKpi ? '----' : Number(initVal.firstActualKpi);
    firstPage = !initVal.firstPage ? '全部' : initVal.firstIdCard;
    const name = !firstName ? undefined : firstName;
    const actualKpi = !firstActualKpi ? undefined : firstActualKpi;
    const number = !firstPage ? 0 : firstPage;
    this.getData({ size: 30, number, collegeId: initVal.collegeId, name, actualKpi });
  }

  componentWillUnmount() {
    firstName = null;
    firstActualKpi = null;
  }

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    this.changePage(current, pageSize);
  };

  getData = params => {
    const getListParams = { ...this.props.performance.getListParams, ...params };
    this.props.dispatch({
      type: 'performance/getPersonalList',
      payload: { getListParams },
    });
  };
  publickObj = {
    propsVal: '',
    firstIdCard: '',
    firstName: '',
    firstActualKpi: '',
  };
  // 点击某一页函数
  changePage = (current, pageSize) => {
    firstPage = current - 1;
    this.props.setCurrentUrlParams({ firstPage });
    this.getData({
      size: pageSize,
      number: firstPage,
      name: !firstName ? undefined : firstName,
      actualKpi: !firstActualKpi ? undefined : firstActualKpi,
    });
  };

  // 表单搜索函数
  handleSearch = e => {
    e.preventDefault();
    this.publickObj.propsVal.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        firstIdCard = !values.idCard ? '----' : values.idCard;
        firstName = !values.name ? undefined : values.name;
        firstActualKpi = !values.actualKpi ? undefined : values.actualKpi;
        firstPage = 0;
        const qualityListParams = {
          size: 30,
          number: 0,
          idCard: firstIdCard,
          name: firstName,
          actualKpi: firstActualKpi,
        };
        this.getData(qualityListParams);
        this.props.setCurrentUrlParams({ firstName, firstActualKpi, firstPage });
      }
    });
  };
  // 表单重置
  handleReset = () => {
    firstName = '';
    firstActualKpi = '';
    firstPage = 0;
    this.publickObj.propsVal.form.resetFields();
    this.props.setRouteUrlParams('/performance/personalPerformance');
    this.getData({ size: 30, number: 0 });
  };

  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        id: item.id,
        idCard: item.user.idCard,
        name: item.user.name,
        collegeName: this.renderCollegeName(item),
        totalKpi: item.totalKpi,
        actualKpi: item.actualKpi,
        kpiEffectMonth: item.kpiEffectMonth.effectMonth,
        kpiPercent: item.kpiPercent,
      })
    );
    return data;
  };
  checkDetail = record => {
    this.props.setRouteUrlParams('/performance/editPerformance', { id: record.id });
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
        dataIndex: 'idCard',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '岗位',
        dataIndex: 'groupName',
      },
      {
        title: '学院｜家族｜小组',
        dataIndex: 'collegeName',
      },
      {
        title: '月份',
        dataIndex: 'kpiEffectMonth',
      },
      {
        title: '总包金额',
        dataIndex: 'totalKpi',
      },
      {
        title: '实发金额',
        dataIndex: 'actualKpi',
      },
      {
        title: '调整比例（%）',
        dataIndex: 'kpiPercent',
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
  // 整合学院|家族|小组展示
  renderCollegeName = item => {
    if (item.collegeName && item.familyName && item.groupName) {
      return `${item.collegeName} | ${item.familyName} | ${item.groupName}`;
    } else if (item.collegeName && item.familyName) {
      return `${item.collegeName} | ${item.familyName}`;
    } else {
      return `${item.collegeName}`;
    }
  };
  render() {
    const val = this.props.performance.dataPersonal ? this.props.performance.dataPersonal : {};
    const data = !val ? [] : !val.response ? [] : val.response.data;
    const totalNum = data.length;

    const dataSource = !data ? [] : this.fillDataSource(data);
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
                  {getFieldDecorator('name', {
                    initialValue: firstName,
                    rules: [],
                  })(<Input placeholder="请输入姓名" style={{ height: 32 }} />)}
                </FormItem>
              </Col>
              <Col span={6} style={{ textAlign: 'center' }}>
                <FormItem label="身份证号">
                  {getFieldDecorator('idCard', {
                    initialValue: firstIdCard,
                    rules: [],
                  })(<Input placeholder="请输入身份证号" maxLength={20} style={{ height: 32 }} />)}
                </FormItem>
              </Col>
              <Col span={6} style={{ textAlign: 'center' }}>
                <FormItem label="实发金额">
                  {getFieldDecorator('actualKpi', {
                    initialValue: firstActualKpi,
                    rules: [],
                  })(
                    <Select placeholder="请选择" style={{ width: 150, height: 32 }}>
                      <Option value="0">----</Option>
                      <Option value="1">有</Option>
                      <Option value="2">无</Option>
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