import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Input, DatePicker } from 'antd';
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
const dateFormat = 'YYYY-MM-DD';

@connect(({ blRefund, loading }) => ({
  blRefund,
  loading,
}))
class RefundList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const params = { size: 30, number: 0 };
    this.props.dispatch({
      type: 'blRefund/refundList',
      payload: { params },
    });
  }
  componentWillUnmount() {
    firstBeginTime = null;
    firstEndTime = null;
    firstOrdId = null;
  }

  onChange = (dates, dateStrings) => {
    const aa = dateStrings[0];
    const bb = dateStrings[1];
    firstBeginTime = aa;
    firstEndTime = bb;
  };

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    const params = { size: pageSize, number: current - 1 };
    this.props.dispatch({
      type: 'blRefund/refundList',
      payload: { params },
    });
  };

  // 点击某一页函数
  changePage = (current, pageSize) => {
    const params = { size: pageSize, number: current - 1 };
    this.props.dispatch({
      type: 'blRefund/refundList',
      payload: { params },
    });
  };

  // 表单搜索
  handleSearch = e => {
    e.preventDefault();
    propsVal.form.validateFields((err, values) => {
      firstOrdId = values.ordId;
      if (!values.dateRange) {
        const params = { size: 30, number: 0, ordId: values.ordId };
        this.props.dispatch({
          type: 'blRefund/refundList',
          payload: { params },
        });
      } else {
        const beginTime = firstBeginTime;
        const endTime = firstEndTime;
        const params = {
          size: 30,
          number: 0,
          beginTime,
          endTime,
          ordId: values.ordId,
        };
        this.props.dispatch({
          type: 'blRefund/refundList',
          payload: { params },
        });
      }
    });
  };

  // 表单重置
  handleReset = () => {
    firstBeginTime = '';
    firstEndTime = '';
    firstOrdId = '';
    propsVal.form.resetFields();
    this.props.setCurrentUrlParams({});
  };

  // 初始化tabale 列数据
  fillDataSource = (val) => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        ordId: item.ordId,
        complainTime: item.complainTime,
        id: item.id,
        collegeName:item.collegeName,
        familyName: item.familyName,
        groupName: item.groupName,
        cpName: item.cpName,
        bottomLineNum: item.bottomLineNum,
        complainChannel: item.complainChannel,
      })
    );
    return data;
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
      },
      {
        title: '子订单编号',
        dataIndex: 'ordId',
      },
      {
        title: '投诉时间',
        dataIndex: 'complainTime',
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
        title: '渠道',
        dataIndex: 'complainChannel',
      },
    ];
    return columns;
  };

  // 添加退费
  refundAdd = () => {
    this.props.history.push({
      pathname: '/refund/refundAdd',
      search: JSON.stringify({ type: 'add' }),
    });
  };

  // 删除退费
  refundDel = () => {
    this.props.history.push({
      pathname: '/refund/refundDel',
      search: JSON.stringify({ type: 'del' }),
    });
  };

  render() {
    const data = !this.props.blRefund.listData?null:!this.props.blRefund.listData.data
        ? null
        : this.props.blRefund.listData.data;
    const totalNum = !data?null:!data.totalElements ? 0 : data.totalElements;
    const dataSource = !data?null:!data.content ? [] : this.fillDataSource(data.content);
    const columns = !this.columnsData() ? [] : this.columnsData();
    const formLayout = 'inline';
    const WrappedAdvancedSearchForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      return (
        <Form onSubmit={this.handleSearch} layout={formLayout}>
          <FormItem label="投诉时间">
            {getFieldDecorator('dateRange', {
              // rules: [{ required: true, message: '请选择生效日期' }],
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
          <FormItem label="子订单编号" style={{ marginLeft: 119 }}>
            {getFieldDecorator('ordId', {
              initialValue: firstOrdId,
              rules: [
                { min: 2, message: '编号长度不得低于2!' },
                { max: 20, message: '编号长度不得高于20!' },
              ],
            })(<Input placeholder="请输入子订单编号" style={{ width: 230, height: 32 }} />)}
          </FormItem>
          <FormItem style={{ marginLeft: 119 }}>
            <Button type="primary" htmlType="submit" className={common.searchButton}>
              搜索
            </Button>
            <Button onClick={this.handleReset} className={common.cancleButton}>
              重置
            </Button>
          </FormItem>
        </Form>
      );
    });
    return (
      <ContentLayout
        pageHeraderUnvisible="unvisible"
        title="退费列表"
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
          </div>
        }
        contentTable={
          <div>
            <p className={common.totalNum}>总数：{totalNum}条</p>
            <Table
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
            defaultCurrent={1}
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
