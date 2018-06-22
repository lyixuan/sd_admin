import React, { Component } from 'react';
import { Table, Button, Pagination, Form, Input, DatePicker } from 'antd';
import moment from 'moment';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
let propsVal = '';
const dateFormat = 'YYYY/MM/DD';

class ComplainList extends Component {
  constructor(props) {
    super(props);
    const params = this.props.getUrlParams();
    this.columns = [
      {
        title: '序号',
        dataIndex: 'key',
      },
      {
        title: '子订单编号',
        dataIndex: 'name',
      },
      {
        title: '投诉时间',
        dataIndex: 'role',
      },
      {
        title: '学生名称/id',
        dataIndex: 'email',
      },
      {
        title: '老师名称',
        dataIndex: 'status',
      },
      {
        title: '学院/家族/小组',
        dataIndex: 'status3',
      },
      {
        title: '编号',
        dataIndex: 'status2',
      },
      {
        title: '渠道',
        dataIndex: 'status1',
      },
    ];

    const dataSource = [
      {
        key: 1,
        name: `张三`,
        role: `院长`,
        status: `启用`,
        email: `hello@sunlands.com`,
      },
      {
        key: 2,
        name: `王五`,
        role: `学员`,
        status: `启用`,
        email: `hello@sunlands.com`,
      },
      {
        key: 3,
        name: `赵六`,
        role: `院长`,
        status: `禁止`,
        email: `hello@sunlands.com`,
      },
    ];

    this.state = {
      dataSource: !dataSource ? [] : dataSource,
      orderNo: params.orderNo || '',
    };
  }

  componentDidMount() {}

  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };

  handleSearch = e => {
    e.preventDefault();
    let val = {};
    propsVal.form.validateFields((err, values) => {
      val = values;
    });
    this.setState({
      orderNo: val.orderNo,
    });
    this.props.setCurrentUrlParams(val);
  };

  handleReset = () => {
    propsVal.form.resetFields();
    this.setState({
      orderNo: '',
    });
    this.props.setCurrentUrlParams({});
  };
  refundAdd = () => {
    this.props.history.push({
      pathname: '/refund/refundAdd',
      search: JSON.stringify({ type: 'add' }),
    });
  };
  refundDel = () => {
    this.props.history.push({
      pathname: '/refund/refundDel',
      search: JSON.stringify({ type: 'del' }),
    });
  };
  render() {
    const { dataSource } = this.state;
    const columns = !this.columns ? [] : this.columns;
    const formLayout = 'inline';
    const WrappedAdvancedSearchForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      return (
        <Form onSubmit={this.handleSearch} layout={formLayout}>
          <FormItem label="投诉时间">
            {getFieldDecorator('dateRange', {
              rules: [{ required: true, message: '请选择生效日期' }],
            })(
              <RangePicker
                defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                format={dateFormat}
                style={{ width: 230, height: 32 }}
              />
            )}
          </FormItem>
          <FormItem label="子订单编号" style={{ marginLeft: 119 }}>
            {getFieldDecorator('orderNo', {
              initialValue: this.state.orderNo,
              rules: [
                {
                  required: true,
                  message: '请输入搜索内容!',
                },
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
          <Table bordered dataSource={dataSource} columns={columns} pagination={false} />
        }
        contentPagination={
          <Pagination
            showSizeChanger
            onShowSizeChange={this.onShowSizeChange}
            defaultCurrent={3}
            total={100}
            className={common.paginationStyle}
          />
        }
      />
    );
  }
}
export default ComplainList;
