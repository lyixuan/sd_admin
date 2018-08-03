import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Input, Row, Col, Select,DatePicker } from 'antd';
import moment from 'moment';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';
import { formatDate } from '../../utils/FormatDate';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
let propsVal = '';
const dateFormat = 'YYYY-MM-DD';


@connect(({ appeal, loading }) => ({
  appeal,
  loading: loading.effects['appeal/appealList'],
}))
class AppealList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 页面render之前需要请求的接口
  componentDidMount() {
    const appealListParams = {
      pageSize: 30,
      pageNum: 0 ,
    };
    this.props.dispatch({
      type: 'appeal/appealList',
      payload: { appealListParams },
    });

  }
  // 组件卸载时清除声明的变量
  componentWillUnmount() {

  }


  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, size) => {
    console.log(current,size)
  };

  // 点击某一页函数
  changePage = (current, size) => {
    console.log(current,size)
  };

  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        id: item.id,
        type: item.type,
        stuId: item.stuId,
        countBeginTime: formatDate(item.countBeginTime),
        ordId: item.ordId,
        workorderId: item.workorderId,
        consultId: item.consultId,
        modifyTime: formatDate(item.modifyTime),
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
      },
      {
        title: '申诉类型',
        dataIndex: 'type',
      },
      {
        title: '学员id',
        dataIndex: 'stuId',
      },
      {
        title: '扣分时间',
        dataIndex: 'countBeginTime',
      },
      {
        title: '订单id',
        dataIndex: 'ordId',
      },
      {
        title: '工单id',
        dataIndex: 'workorderId',
      },
      {
        title: '咨询id',
        dataIndex: 'consultId',
      },
      {
        title: '操作时间',
        dataIndex: 'modifyTime',
      },
    ];
    return columns || [];
  };

  // 表单重置
  handleReset = () => {
  };

  // 表单搜索
  handleSearch = e => {
    e.preventDefault();
    propsVal.form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
      }
    });
  };

  // 添加申诉
  handleAdd = () => {
    this.props.setRouteUrlParams('/appeal/addAppeal');
  };

  render() {
    const appealList = this.props.appeal.appealListData
    const { loading } = this.props;
    const totalNum = !appealList ? 0 : !appealList.data ? 0 : !appealList.data.totalElements?0:appealList.data.totalElements;
    const dataSource = !appealList ? [] : !appealList.data ? [] : this.fillDataSource(!appealList.data.content?[]:appealList.data.content);
    const columns = this.columnsData();
    const formLayout = 'inline';
    const WrappedAdvancedSearchForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      return (
        <div>
          <Form layout={formLayout} onSubmit={this.handleSearch}>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem label="申诉类型">
                  {getFieldDecorator('type', {
                  })(
                    <Select placeholder="全部" style={{ width: 230, height: 32 }}>
                      <Option value="0">全部</Option>
                      <Option value="1">优新减分-开班电话</Option>
                      <Option value="2">优新减分-随堂考</Option>
                      <Option value="3">IM减分-未回复会话</Option>
                      <Option value="4">IM减分-不及时信息</Option>
                      <Option value="5">IM减分-不满意会话</Option>
                      <Option value="6">工单24</Option>
                      <Option value="7">工单48</Option>
                      <Option value="8">工单72</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <FormItem label="学员id">
                  {getFieldDecorator('stuId', {
                  })(<Input placeholder="请输入手机号" style={{ width: 230, height: 32 }} />)}
                </FormItem>
              </Col>
              <div style={{display:'flex',justifyContent: 'flex-end'}}>
                <FormItem label="投诉时间" >
                  {getFieldDecorator('dateRange', {
                    initialValue:[moment('2018-07-30', dateFormat), moment('2018-08-03', dateFormat)],
                  })(
                    <RangePicker
                      format={dateFormat}
                      style={{ width: 230, height: 32 }}
                      onChange={this.onChange}
                    />
                  )}
                </FormItem>
              </div>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right', marginTop: '12px' }}>
                <FormItem>
                  <div>
                    <Button htmlType="submit" type="primary" className={common.searchButton}>
                      搜 索
                    </Button>
                    <Button
                      onClick={this.handleReset}
                      type="primary"
                      className={common.resetButton}
                    >
                      重 置
                    </Button>
                  </div>
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
        contentButton={
          <AuthorizedButton authority="/appeal/addAppeal">
            <Button onClick={this.handleAdd} type="primary" className={common.createButton}>
              添加申诉
            </Button>
          </AuthorizedButton>
        }
        contentTable={
          <div>
            <p className={common.totalNum}>总数：{totalNum}条</p>
            <Table
              bordered
              loading={loading}
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

export default AppealList;
