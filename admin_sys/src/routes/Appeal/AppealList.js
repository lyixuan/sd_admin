import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Input, Row, Col, Select, DatePicker } from 'antd';
import moment from 'moment';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import common from '../Common/common.css';
import { formatDate } from '../../utils/FormatDate';
import { appealType, appealTypeRest } from '../../utils/dataDictionary';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
let propsVal = '';
const dateFormat = 'YYYY-MM-DD';

// 添加全局变量 ，记录搜索或是跳转到某一页到编辑页面之后返回到list页面回显所用。
let firstType = '全部'; // 搜索框的申诉类型
let firstStuId = null; // 搜索框的学员id
let firstCountStart = null;
let firstCountEnd = null; //
let firstPage = 0; // 分页的默认起开页面

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
    const initVal = this.props.getUrlParams();
    firstType = !initVal.firstType ? '全部' : initVal.firstType;
    firstStuId = !initVal.firstStuId ? null : Number(initVal.firstStuId);
    firstCountStart = !initVal.firstCountStart ? null : initVal.firstCountStart;
    firstCountEnd = !initVal.firstCountEnd ? null : initVal.firstCountEnd;
    firstPage = !initVal.firstPage ? 0 : Number(initVal.firstPage);
    const appealListParams = {
      pageSize: 30,
      pageNum: !firstPage ? 0 : firstPage,
      type: !firstType
        ? undefined
        : appealType[firstType] === 0 ? undefined : appealType[firstType],
      stuId: !firstStuId ? undefined : firstStuId,
      countStart: !firstCountStart ? undefined : `${firstCountStart} 00:00:00`,
      countEnd: !firstCountEnd ? undefined : `${firstCountEnd} 00:00:00`,
    };
    this.getData(appealListParams);
  }
  // 组件卸载时清除声明的变量
  componentWillUnmount() {
    firstType = null;
    firstStuId = null;
    firstCountStart = null;
    firstCountEnd = null;
    firstPage = null;
  }

  onChange = (dates, dateStrings) => {
    const aa = dateStrings[0];
    const bb = dateStrings[1];
    firstCountStart = aa;
    firstCountEnd = bb;
  };

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, size) => {
    this.changePage(current, size);
  };

  getData = params => {
    const appealListParams = params;
    this.props.dispatch({
      type: 'appeal/appealList',
      payload: { appealListParams },
    });
  };

  // 表单搜索
  handleSearch = e => {
    e.preventDefault();
    propsVal.form.validateFields((err, values) => {
      if (!err) {
        firstType = !values.type ? '全部' : values.type;
        firstStuId = !values.stuId ? undefined : Number(values.stuId);
        firstPage = 0;
        this.savaParams({
          firstType,
          firstStuId,
          firstCountStart,
          firstCountEnd,
          firstPage,
        });
        const appealListParams = {
          pageSize: 30,
          pageNum: 0,
          type: !firstType
            ? undefined
            : appealType[firstType] === 0 ? undefined : appealType[firstType],
          stuId: !firstStuId ? undefined : Number(firstStuId),
          countStart: !values.countBeginTime ? undefined : `${firstCountStart} 00:00:00`,
          countEnd: !values.countBeginTime ? undefined : `${firstCountEnd} 00:00:00`,
        };
        this.getData(appealListParams);
      }
    });
  };

  savaParams = params => {
    this.props.setCurrentUrlParams(params);
  };

  // 点击某一页函数
  changePage = (current, size) => {
    firstPage = current - 1;
    this.savaParams({
      firstPage: !firstPage ? 0 : firstPage,
    });
    const appealListParams = {
      pageSize: size,
      pageNum: current - 1,
      type: !firstType
        ? undefined
        : appealType[firstType] === 0 ? undefined : appealType[firstType],
      stuId: !firstStuId ? undefined : Number(firstStuId),
      countStart: !firstCountStart ? undefined : `${firstCountStart} 00:00:00`,
      countEnd: !firstCountEnd ? undefined : `${firstCountEnd} 00:00:00`,
    };
    this.getData(appealListParams);
  };

  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index,
        id: item.id,
        type: !appealTypeRest[item.type] ? null : appealTypeRest[item.type],
        stuId: item.stuId,
        countBeginTime: formatDate(item.countBeginTime),
        ordId: item.ordId,
        workorderId: item.workorderId,
        consultId: item.consultId,
        countValue: item.countValue,
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
        title: '申诉个数',
        dataIndex: 'countValue',
      },
      {
        title: '操作时间',
        dataIndex: 'modifyTime',
      },
    ];
    return columns || [];
  };

  // 添加申诉
  handleAdd = () => {
    this.props.setRouteUrlParams('/appeal/addAppeal');
  };

  // 表单重置
  handleReset = () => {
    firstType = '全部';
    firstStuId = null;
    firstCountStart = null;
    firstCountEnd = null;
    firstPage = 0;
    propsVal.form.resetFields();
    this.props.setRouteUrlParams('/appeal/appealList');
    this.getData({ pageSize: 30, pageNum: 0 });
  };

  render() {
    const appealList = this.props.appeal.appealListData;
    const { loading } = this.props;
    const totalNum = !appealList
      ? 0
      : !appealList.data ? 0 : !appealList.data.totalElements ? 0 : appealList.data.totalElements;
    const dataSource = !appealList
      ? []
      : !appealList.data
        ? []
        : this.fillDataSource(!appealList.data.content ? [] : appealList.data.content);
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
                    initialValue: !firstType ? null : firstType,
                  })(
                    <Select placeholder="全部" style={{ width: 230, height: 32 }}>
                      <Option value="全部">全部</Option>
                      <Option value="优新开班电话">优新减分-开班电话</Option>
                      <Option value="优新随堂考">优新减分-随堂考</Option>
                      <Option value="IM未回复">IM减分-未回复</Option>
                      <Option value="IM不及时">IM减分-不及时</Option>
                      <Option value="IM不满意">IM减分-不满意</Option>
                      <Option value="工单24">工单初次减分</Option>
                      <Option value="工单48">工单二次减分</Option>
                      <Option value="工单72">工单三次减分</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <FormItem label="学员id">
                  {getFieldDecorator('stuId', {
                    initialValue: !firstStuId ? null : firstStuId,
                    rules: [
                      {
                        validator(rule, value, callback) {
                          if (value && isNaN(value)) {
                            callback({ message: '学员id需要是数字组成' });
                          } else if (value && value.length > 9) {
                            callback({ message: '学员id长度不得大于9位数字' });
                          }
                          callback();
                        },
                      },
                    ],
                  })(<Input placeholder="请输入学员id" style={{ width: 230, height: 32 }} />)}
                </FormItem>
              </Col>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <FormItem label="扣分时间">
                  {getFieldDecorator('countBeginTime', {
                    initialValue: !firstCountStart
                      ? null
                      : [moment(firstCountStart, dateFormat), moment(firstCountEnd, dateFormat)],
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

export default AppealList;
