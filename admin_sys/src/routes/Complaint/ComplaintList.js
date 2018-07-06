import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Pagination, Form, Input, DatePicker } from 'antd';
import moment from 'moment';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
let propsVal = '';
const dateFormat = 'YYYY/MM/DD';

@connect(({ blComplain, loading }) => ({
  blComplain,
  loading,
}))
class ComplainList extends Component {
  constructor(props) {
    super(props);
    const params = this.props.getUrlParams();
    this.state = {
      orderNo: params.orderNo || '',
    };
  }

  componentDidMount() {
    const getListParams = { size: 30, number: 0 };
    this.props.dispatch({
      type: 'blComplain/getList',
      payload: { getListParams },
    });
  }

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    const getListParams = { size: pageSize, number: current - 1 };
    this.props.dispatch({
      type: 'blComplain/getList',
      payload: { getListParams },
    });
  };

  // 点击某一页函数
  changePage = (current, pageSize) => {
    const getListParams = { size: pageSize, number: current - 1 };
    this.props.dispatch({
      type: 'blComplain/getList',
      payload: { getListParams },
    });
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
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        ordId: item.ordId,
        complainTime: item.complainTime,
        stuName: item.stuName, //   const newmail = `${values.mail}@sunlans.com`;
        id: item.id,
        groupName: item.groupName,
        cpName:item.cpName,
        cpId:item.cpId,
        complainChannel:item.complainChannel,
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
        title: '学生名称/id',
        dataIndex: 'stuName',
      },
      {
        title: '老师名称',
        dataIndex: 'cpName',
      },
      {
        title: '学院/家族/小组',
        dataIndex: 'groupName',
      },
      {
        title: '编号',
        dataIndex: 'cpId',
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
    console.log(this.props.blComplain);
    // const dataSource = !this.fillDataSource() ? [] : this.fillDataSource();
    // const columns = !this.columnsData() ? [] : this.columnsData();


    const data = !this.props.blComplain.getList.response
          ? []
          : !this.props.blComplain.getList.response.data
        ? []
        : this.props.blComplain.getList.response.data;
    const totalNum = !data.totalElements ? 0 : data.totalElements;
    const dataSource = !data.content ? [] : this.fillDataSource(data.content);
    const columns = !this.columnsData() ? [] : this.columnsData();
    console.log(totalNum)

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
        title="投诉列表"
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

export default ComplainList;
