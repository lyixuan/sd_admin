import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Input, DatePicker, Row, Col } from 'antd';
import moment from 'moment';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
let propsVal = '';
let firstBeginTime = '';
let firstEndTime = '';
let firstOrdId = '';
let firstPage = 0; // 分页的默认起开页面
const dateFormat = 'YYYY-MM-DD';

@connect(({ blRefund, loading }) => ({
  blRefund,
  loading: loading.models.blRefund,
}))
class RefundList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const initVal = this.props.getUrlParams();
    firstPage = !initVal.firstPage ? 0 : Number(initVal.firstPage);
    firstBeginTime = !initVal.firstBeginTime ? undefined : initVal.firstBeginTime;
    firstEndTime = !initVal.firstEndTime ? undefined : initVal.firstEndTime;
    firstOrdId = !initVal.firstOrdId ? undefined : Number(initVal.firstOrdId);
    this.getData({
      size: 30,
      number: firstPage,
      beginTime: firstBeginTime,
      endTime: firstEndTime,
      ordId: firstOrdId,
    });
  }
  componentWillUnmount() {
    firstBeginTime = null;
    firstEndTime = null;
    firstOrdId = null;
    firstPage = null;
  }

  onChange = (dates, dateStrings) => {
    const aa = dateStrings[0];
    const bb = dateStrings[1];
    firstBeginTime = aa;
    firstEndTime = bb;
  };

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    this.changePage(current, pageSize);
  };
  getData = params => {
    const getListParams = { ...this.props.blRefund.getListParams, ...params };
    this.props.dispatch({
      type: 'blRefund/refundList',
      payload: { getListParams },
    });
  };

  savaParams = params => {
    this.props.setCurrentUrlParams(params);
  };
  // 点击某一页函数
  changePage = (current, pageSize) => {
    firstPage = current - 1;
    this.getData({
      size: pageSize,
      number: firstPage,
    });
  };

  // 表单搜索
  handleSearch = e => {
    e.preventDefault();
    propsVal.form.validateFields((err, values) => {
      firstOrdId = values.ordId;
      firstPage = 0;
      const beginTime = firstBeginTime;
      const endTime = firstEndTime;
      this.savaParams({
        firstOrdId,
        firstBeginTime,
        firstEndTime,
        firstPage,
      });
      const params = {
        size: 30,
        number: 0,
        beginTime: !values.dateRange ? undefined : beginTime,
        endTime: !values.dateRange ? undefined : endTime,
        ordId: values.ordId,
      };
      this.getData(params);
    });
  };

  // 表单重置
  handleReset = () => {
    firstBeginTime = '';
    firstEndTime = '';
    firstOrdId = '';
    firstPage = 0;
    propsVal.form.resetFields();
    this.props.setRouteUrlParams('/bottomLine/refundList');
    this.getData({ size: 30, number: 0 });
  };

  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    const BOTTOM_LINE_TYPE = window.BI_Filter('BOTTOM_LINE_TYPE');

    val.map((item, index) =>
      data.push({
        key: index,
        ordId: item.ordId,
        bottomLineType: BOTTOM_LINE_TYPE.find(ls => ls.id === item.bottomLineType)
          ? BOTTOM_LINE_TYPE.find(ls => ls.id === item.bottomLineType).name
          : null,
        complainTime: item.complainTime,
        id: item.id,
        collegeName: item.collegeName,
        familyName: item.familyName,
        groupName: item.groupName,
        cpName: item.cpName,
        bottomLineNum: item.bottomLineNum,
        complainChannel: item.complainChannel,
        collegeScore: item.collegeScore,
        familyScore: item.familyScore,
        groupScore: item.groupScore,
      })
    );
    return data;
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      // {
      //   title: 'id',
      //   dataIndex: 'id',
      //   width: '90px',
      // },
      {
        title: '底线类型',
        dataIndex: 'bottomLineType',
      },
      {
        title: '子订单编号',
        dataIndex: 'ordId',
      },
      {
        title: '投诉时间',
        dataIndex: 'complainTime',
        render: text => {
          return <>{text.split(' ')[0]}</>;
        },
      },
      {
        title: '老师名称',
        dataIndex: 'cpName',
      },
      {
        title: '学院',
        dataIndex: 'collegeName',
      },
      {
        title: '家族',
        dataIndex: 'familyName',
      },
      {
        title: '小组',
        dataIndex: 'groupName',
      },
      {
        title: '编号',
        dataIndex: 'bottomLineNum',
      },
      {
        title: '学院得分',
        dataIndex: 'collegeScore',
      },
      {
        title: '家族得分',
        dataIndex: 'familyScore',
      },
      {
        title: '小组得分',
        dataIndex: 'groupScore',
      },
    ];
    return columns;
  };

  // 添加退费
  refundAdd = () => {
    this.props.history.push({
      pathname: '/refund/refundAdd',
      search: '?1',
    });
  };

  // 删除退费
  refundDel = () => {
    this.props.history.push({
      pathname: '/refund/refundDel',
      search: '?1',
    });
  };
  // 添加退挽
  returnAdd = () => {
    this.props.history.push({
      pathname: '/refund/returnAdd',
      search: '?2',
    });
  };

  // 删除退挽
  returnDel = () => {
    this.props.history.push({
      pathname: '/refund/returnDel',
      search: '?2',
    });
  };
  render() {
    const data = !this.props.blRefund.listData
      ? null
      : !this.props.blRefund.listData.data ? null : this.props.blRefund.listData.data;
    const totalNum = !data ? null : !data.totalElements ? 0 : data.totalElements;
    const dataSource = !data ? null : !data.content ? [] : this.fillDataSource(data.content);
    const columns = !this.columnsData() ? [] : this.columnsData();
    const WrappedAdvancedSearchForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      return (
        <Form layout="inline" onSubmit={this.handleSearch}>
          <Row gutter={24}>
            <Col span={8}>
              <FormItem label="投诉时间">
                {getFieldDecorator('dateRange', {
                  initialValue: !firstEndTime
                    ? null
                    : [moment(firstBeginTime, dateFormat), moment(firstEndTime, dateFormat)],
                })(
                  <RangePicker
                    format={dateFormat}
                    style={{ width: 230, height: 32 }}
                    onChange={this.onChange}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{ textAlign: 'center' }}>
              <FormItem label="子订单编号">
                {getFieldDecorator('ordId', {
                  initialValue: firstOrdId,
                  rules: [
                    { min: 2, message: '编号长度不得低于2!' },
                    { max: 20, message: '编号长度不得高于20!' },
                  ],
                })(
                  <Input
                    maxLength={20}
                    minLength={2}
                    placeholder="请输入子订单编号"
                    style={{ width: 230, height: 32 }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <FormItem>
                <Button type="primary" htmlType="submit" className={common.searchButton}>
                  搜索
                </Button>
                <Button onClick={this.handleReset} className={common.resetButton}>
                  重置
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      );
    });
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentForm={<WrappedAdvancedSearchForm />}
        contentButton={
          <div>
            <AuthorizedButton authority="/refund/refundAdd">
              <Button onClick={this.refundAdd} type="primary" className={common.addQualityButton}>
                添加退费
              </Button>
            </AuthorizedButton>
            <AuthorizedButton authority="/refund/refundDel">
              <Button
                onClick={this.refundDel}
                type="primary"
                className={common.deleteQualityButton}
              >
                删除退费
              </Button>
            </AuthorizedButton>
            <AuthorizedButton authority="/refund/returnAdd">
              <Button onClick={this.returnAdd} type="primary" className={common.addQualityButton}>
                添加退挽
              </Button>
            </AuthorizedButton>
            <AuthorizedButton authority="/refund/returnDel">
              <Button
                onClick={this.returnDel}
                type="primary"
                className={common.deleteQualityButton}
              >
                删除退挽
              </Button>
            </AuthorizedButton>
          </div>
        }
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
            pageSizeOptions={['30']}
          />
        }
      />
    );
  }
}
export default RefundList;
