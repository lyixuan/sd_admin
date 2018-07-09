import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Input, DatePicker } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
let propsVal = '';
let firstBeginTime = '';
let firstEndTime = '';
const dateFormat = 'YYYY-MM-DD';

@connect(({ blComplain, loading }) => ({
  blComplain,
  loading,
}))
class ComplainList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const getListParams = { size: 30, number: 0 };
    this.props.dispatch({
      type: 'blComplain/getList',
      payload: { getListParams },
    });
  }

  onChange=(dates, dateStrings)=> {
    console.log(dates)
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    const aa = dateStrings[0]
    const bb = dateStrings[1]
    firstBeginTime = aa;
    firstEndTime = bb;
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
    propsVal.form.validateFields((err, values) => {
      if (!values.dateRange){
          const getListParams = { size: 30, number: 0,bottomLineNum:values.bottomLineNum};
          console.log(getListParams)
          this.props.dispatch({
            type: 'blComplain/getList',
            payload: { getListParams },
          });
      }else{
        const beginTime= firstBeginTime;
        const endTime = firstEndTime;
          const getListParams = { size: 30, number: 0,beginTime, endTime,bottomLineNum:values.bottomLineNum};
          console.log(getListParams)
          this.props.dispatch({
            type: 'blComplain/getList',
            payload: { getListParams },
          });
        }
    });
  };

  // 表单重置
  handleReset = () => {
    propsVal.form.resetFields();
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
        stuName:  `${item.stuName}/${item.id}`,
        id: item.id,
        collegeName:item.collegeName,
        familyName:item.familyName,
        groupName: item.groupName,
        cpName:item.cpName,
        bottomLineNum:item.bottomLineNum,
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
    const data = !this.props.blComplain.getList.response
          ? []
          : !this.props.blComplain.getList.response.data
        ? []
        : this.props.blComplain.getList.response.data;
    const totalNum = !data.totalElements ? 0 : data.totalElements;
    const dataSource = !data.content ? [] : this.fillDataSource(data.content);
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
            })(
              <RangePicker
                // defaultValue={[moment('2018-07-01', dateFormat), moment('2018-07-09', dateFormat)]}
                format={dateFormat}
                style={{ width: 230, height: 32 }}
                onChange={this.onChange}
              />
            )}
          </FormItem>
          <FormItem label="编号" style={{ marginLeft: 119 }}>
            {getFieldDecorator('bottomLineNum', {
              rules: [
                { min: 2, message: '编号长度不得低于2!' },
                { mix: 20, message: '编号长度不得高于20!' },
                ],
            })(<Input placeholder="请输入编号" style={{ width: 230, height: 32 }} />)}
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
