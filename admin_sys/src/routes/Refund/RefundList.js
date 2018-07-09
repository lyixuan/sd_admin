import React, { Component } from 'react';
import { Table, Button, Form, Input, DatePicker } from 'antd';
import moment from 'moment';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
let propsVal = '';
const dateFormat = 'YYYY/MM/DD';

class RefundList extends Component {
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
    for (let i = 0; i < 30; i += 1) {
      data.push({
        key: i,
        ordId: i,
        complainTime: '2018-07-09',
        stuName:  '小当家',
        id: i,
        collegeName:'海产品',
        familyName:'海鲜',
        groupName: '虾',
        cpName:'吃货',
        bottomLineNum:i,
        complainChannel:'太平洋',
      });
    }
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
        title: '学生名称/id',
        dataIndex: 'stuName',
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
            <p className={common.totalNum}>总数：35条</p>
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
            total={31}
            defaultPageSize={30}
            pageSizeOptions={['30']}
          />
        }
      />
    );
  }
}
export default RefundList;
