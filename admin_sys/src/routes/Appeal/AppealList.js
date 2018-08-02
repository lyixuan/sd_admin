import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Input, Row, Col, Select } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';

const FormItem = Form.Item;
const { Option } = Select;
let propsVal = '';


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
  fillDataSource = () => {
    const data = [{
      id: 1,
      appealtype: '测试',
      stuId: 111,
      contentId: 222, //   const newmail = `${values.mail}@sunlans.com`;
      countTime: '2018-08-02',
      orderId: 333,
      askId:555,
      opperationTime:'2018-08-02',
    }];
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
        dataIndex: 'appealtype',
      },
      {
        title: '学员id',
        dataIndex: 'stuId',
      },
      {
        title: '扣分时间',
        dataIndex: 'countTime',
      },
      {
        title: '订单id',
        dataIndex: 'orderId',
      },
      {
        title: '工单id',
        dataIndex: 'contentId',
      },
      {
        title: '咨询id',
        dataIndex: 'askId',
      },
      {
        title: '操作时间',
        dataIndex: 'opperationTime',
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
    const { loading } = this.props;
    const dataSource = this.fillDataSource();
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
                      <Option value="全部">全部</Option>
                      <Option value="1">工单减分</Option>
                      <Option value="2">优新减分-开班电话</Option>
                      <Option value="3">优新减分-随堂考</Option>
                      <Option value="4">IM减分-未回复会话</Option>
                      <Option value="5">IM减分-不满意会话</Option>
                      <Option value="6">IM减分-不及时信息</Option>
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
              <Col span={8} style={{ textAlign: 'right' }}>
                <FormItem label="扣分时间">
                  {getFieldDecorator('isUpdate', {
                  })(
                    <Select placeholder="全部" style={{ width: 230, height: 32 }}>
                      <Option value="全部">全部</Option>
                      <Option value="是">是</Option>
                      <Option value="否">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
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
          <AuthorizedButton authority="/user/createUser">
            <Button onClick={this.handleAdd} type="primary" className={common.createButton}>
              添加申诉
            </Button>
          </AuthorizedButton>
        }
        contentTable={
          <div>
            <p className={common.totalNum}>总数：40条</p>
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
            total={100}
            defaultPageSize={30}
            pageSizeOptions={['30']}
          />
        }
      />
    );
  }
}

export default AppealList;
