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
    this.state = {
      orderNo: params.orderNo || '',
    };
  }

  componentDidMount() {}

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };

  // 点击某一页函数
  changePage = (current, pageSize) => {
    console.log(current, pageSize);
  };

  // 表单搜索
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

  // 表单重置
  handleReset = () => {
    propsVal.form.resetFields();
    this.setState({
      orderNo: '',
    });
    this.props.setCurrentUrlParams({});
  };

  // 初始化tabale 列数据
  fillDataSource = () => {
    const data = [];
    for (let i = 0; i < 50; i += 1) {
      data.push({
        key: i,
        name: `张三`,
        role: `院长`,
        status: `启用`,
        email: `hello${i}@sunlands.com`,
      });
    }
    return data;
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
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
    return columns;
  };

  // 添加退费
  refundAdd = () => {
    this.props.history.push({
      pathname: '/complaint/complaintAdd',
      search: JSON.stringify({ type: 'add' }),
    });
  };

  // 删除退费
  refundDel = () => {
    this.props.history.push({
      pathname: '/complaint/complaintDel',
      search: JSON.stringify({ type: 'del' }),
    });
  };

  render() {
    const dataSource = !this.fillDataSource() ? [] : this.fillDataSource();
    const columns = !this.columnsData() ? [] : this.columnsData();
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
        title="退费列表"
        contentForm={<WrappedAdvancedSearchForm />}
        contentButton={
          <div>
            <AuthorizedButton authority="/complaint/complaintAdd">
              <Button onClick={this.refundAdd} type="primary" className={common.addQualityButton}>
                添加投诉
              </Button>
            </AuthorizedButton>
            <AuthorizedButton authority="/complaint/complaintDel">
              <Button
                onClick={this.refundDel}
                type="primary"
                className={common.deleteQualityButton}
              >
                删除投诉
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
            onChange={this.changePage}
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
