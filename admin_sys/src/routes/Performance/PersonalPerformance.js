import React, { Component } from 'react';
import { Table, Button, Form, Input, Row, Col, Select } from 'antd';
import { connect } from 'dva';
import { assignUrlParams } from 'utils/utils';
import Dict from 'utils/dictionaries';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';

const FormItem = Form.Item;
const { Option } = Select;
// let firstIdCard = '';
// let firstName = '';
// let firstActualKpi = 0;
// let firstPage = 0; // 分页的默认起开页面
@connect(({ performance, loading }) => ({
  performance,
  loading: loading.models.performance,
}))
class PersonalPerformance extends Component {
  constructor(props) {
    super(props);
    const params = this.props.getUrlParams();
    const initParams = {
      params: {
        name: '',
        idCard: '',
        collegeId: '',
        actualKpi: '',
        number: 0, // 翻页---当前页码
        size: 30, // 每页显示数据
      },
    };
    this.state = assignUrlParams(initParams, params);
    this.selectOptions = [
      { value: '', label: '----' },
      { value: '1', label: '有' },
      { value: '2', label: '无' },
    ];
    this.publickObj = {
      propsVal: '',
    };
  }

  componentDidMount() {
    // const initVal = this.props.getUrlParams();
    // firstIdCard = !initVal.firstIdCard ? '' : Number(initVal.firstPage);
    // firstName = !initVal.firstName ? '' : initVal.firstName;
    // firstActualKpi = !initVal.firstActualKpi ? '----' : Number(initVal.firstActualKpi);
    // firstPage = !initVal.firstPage ? '全部' : initVal.firstIdCard;
    // const name = !firstName ? undefined : firstName;
    // const actualKpi = !firstActualKpi ? undefined : firstActualKpi;
    // const number = !firstPage ? 0 : firstPage;
    // console.log({ size: 30, number, collegeId: initVal.collegeId, name, actualKpi })

    this.getData();
  }

  // componentWillUnmount() {
  //   firstName = null;
  //   firstActualKpi = null;
  // }

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    this.changePage(current, pageSize);
  };

  getData = (params = {}) => {
    // const getListParams = { ...this.props.performance.getListParams, ...params };
    const stateParams = this.state.params;
    const newParams = { ...stateParams, ...params };
    this.props.dispatch({
      type: 'performance/getPersonalList',
      payload: newParams,
    });
    this.saveParams(newParams);
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
    // this.getData({
    //   size: pageSize,
    //   number: firstPage,
    //   name: !firstName ? undefined : firstName,
    //   actualKpi: !firstActualKpi ? undefined : firstActualKpi,
    // });
  };

  // 表单搜索函数
  handleSearch = e => {
    e.preventDefault();
    this.publickObj.propsVal.form.validateFields((err, values) => {
      if (!err) {
        const { name, idCard } = values;
        const actualKpi = this.selectOptions.find(item => item.label === values.actualKpi).value;

        // firstIdCard = !values.idCard ? '----' : values.idCard;
        // firstName = !values.name ? undefined : values.name;
        // firstActualKpi = !values.actualKpi ? undefined : values.actualKpi;
        // firstPage = 0;
        // const qualityListParams = {
        //   size: 30,
        //   number: 0,
        //   idCard: firstIdCard,
        //   name: firstName,
        //   actualKpi: firstActualKpi,
        // };
        this.getData({ name, idCard, actualKpi });
        // this.props.setCurrentUrlParams({ firstName, firstActualKpi, firstPage });
      }
    });
  };
  // 表单重置
  handleReset = () => {
    this.publickObj.propsVal.form.resetFields();
    const params = {
      number: 0,
      name: '',
      idCard: '',
      actualKpi: '',
    };
    this.getData(params);
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
        groupType: Dict.groupTypeDict[item.groupType],
        collegeName: this.renderCollegeName(item),
        totalKpi: item.totalKpi,
        actualKpi: item.actualKpi,
        kpiEffectMonth: item.kpiEffectMonth.effectMonth,
        kpiPercent: Number(item.kpiPercent) * 100,
        userId: item.userId,
      })
    );
    return data;
  };
  checkDetail = record => {
    const { collegeId } = this.state.params;
    this.props.setRouteUrlParams('/performance/editPerformance', {
      userId: record.userId,
      collegeId,
    });
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
        dataIndex: 'groupType',
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
      // {
      //   title: '调整比例（%）',
      //   dataIndex: 'kpiPercent',
      // },
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
    const { number, size, name, idCard, actualKpi } = this.state.params;
    const { performance = {}, loading } = this.props;
    const dataPersonal = performance.dataPersonal || [];
    const dataSource = this.fillDataSource(dataPersonal);
    const totalNum = dataSource.length;
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
                    initialValue: name,
                    rules: [],
                  })(<Input placeholder="请输入姓名" style={{ height: 32 }} />)}
                </FormItem>
              </Col>
              <Col span={6} style={{ textAlign: 'center' }}>
                <FormItem label="身份证号">
                  {getFieldDecorator('idCard', {
                    initialValue: idCard,
                    rules: [],
                  })(<Input placeholder="请输入身份证号" maxLength={20} style={{ height: 32 }} />)}
                </FormItem>
              </Col>
              <Col span={6} style={{ textAlign: 'center' }}>
                <FormItem label="实发金额">
                  {getFieldDecorator('actualKpi', {
                    initialValue: this.selectOptions.find(item => item.value === actualKpi).label,
                    rules: [],
                  })(
                    <Select placeholder="请选择" style={{ width: 150, height: 32 }}>
                      {this.selectOptions.map(item => (
                        <Option value={item.label} key={item.label}>
                          {item.label}
                        </Option>
                      ))}
                      {/* <Option value="">----</Option>
                      <Option value="1">有</Option>
                      <Option value="2">无</Option> */}
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
              loading={loading}
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
            defaultCurrent={number + 1}
            total={totalNum}
            defaultPageSize={size}
          />
        }
      />
    );
  }
}

export default PersonalPerformance;
