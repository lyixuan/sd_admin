import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Radio, Row, Col, Select, DatePicker } from 'antd';
import moment from 'moment';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import ModalDialog from '../../selfComponent/Modal/Modal';
import common from '../Common/common.css';
import { formatDate } from '../../utils/FormatDate';
import { appealType, appealTypeRest } from '../../utils/dataDictionary';
import { BOTTOM_TABLE_LIST } from '../../utils/constants';
import backTop from '../../assets/backTop.svg';
import packSucess from '../../assets/packSucess.svg';
import packError from '../../assets/packError.svg';
// import packing from '../../assets/packing.svg';
import compress from '../../assets/compress.svg';

const FormItem = Form.Item;
const { Option } = Select;
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
class BottomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      radioVal: 1,
    };
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

  onRadioChange = e => {
    this.setState({
      radioVal: e.target.value,
    });
  };
  getData = params => {
    const appealListParams = params;
    this.props.dispatch({
      type: 'appeal/appealList',
      payload: { appealListParams },
    });
  };

  // 模态框确定
  clickModalOK = () => {
    this.showModal(false);
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
        title: '底表名称',
        dataIndex: 'id',
        render: text => {
          return (
            <>
              <img src={compress} alt="compress" style={{ marginRight: '8px' }} />
              {text}
            </>
          );
        },
      },
      {
        title: '底表类型',
        dataIndex: 'type',
      },
      {
        title: '底表时间',
        dataIndex: 'stuId',
      },
      {
        title: '添加时间',
        dataIndex: 'countBeginTime',
      },
      {
        title: '任务状态',
        dataIndex: 'ordId',
        render: text => {
          return (
            <>
              <img
                src={text !== 3241729 ? packError : packSucess}
                alt="packError"
                style={{ marginRight: '8px' }}
              />
              {text}
            </>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        render: (text, record) => {
          return (
            <>
              {Number(record.ordId) !== 3241729 ? null : (
                <AuthorizedButton authority="/bottomTable/downloadBottomTable">
                  <span
                    style={{ color: '#52C9C2', marginRight: 16, cursor: 'pointer' }}
                    onClick={() => this.downloadTable(record)}
                  >
                    下载
                  </span>
                </AuthorizedButton>
              )}
            </>
          );
        },
      },
    ];
    return columns || [];
  };
  // 模态框显隐回调
  showModal = bol => {
    this.setState({
      visible: bol,
    });
  };
  // 添加任务
  addTasks = () => {
    this.setState({
      visible: true,
    });
  };
  downloadTable = record => {
    console.log(record);
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
  // 弹框
  modalContent = () => (
    <>
      <>
        <span>底表类型：</span>
        <Radio.Group
          onChange={this.onRadioChange}
          value={this.state.radioVal}
          style={{ width: '230px' }}
        >
          <Radio value={1} style={{ marginRight: '40px' }}>
            学分底表
          </Radio>
          <Radio value={2} style={{ marginRight: '0' }}>
            预估分底表
          </Radio>
        </Radio.Group>
      </>
      <div style={{ margin: '17px auto' }}>
        <span>底表时间：</span>
        <DatePicker
          format={dateFormat}
          style={{ width: 230, height: 32 }}
          onChange={this.onChange}
        />
      </div>
      <>
        <span>学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;院：</span>
        <Select placeholder="全部" style={{ width: 230, height: 32 }}>
          <Option value="全部">全部</Option>
        </Select>
      </>
    </>
  );
  backTop = () => {
    window.scrollTo(0, 0);
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
                <FormItem label="底表类型">
                  {getFieldDecorator('type', {
                    initialValue: !firstType ? null : firstType,
                  })(
                    <Select placeholder="全部" style={{ width: 230, height: 32 }}>
                      {BOTTOM_TABLE_LIST.map(item => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="底表时间">
                  {getFieldDecorator('countBeginTime', {
                    initialValue: !firstCountStart
                      ? null
                      : [moment(firstCountStart, dateFormat), moment(firstCountEnd, dateFormat)],
                  })(
                    <DatePicker
                      format={dateFormat}
                      style={{ width: 230, height: 32 }}
                      onChange={this.onChange}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
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
      <>
        <ContentLayout
          routerData={this.props.routerData}
          contentForm={<WrappedAdvancedSearchForm />}
          contentButton={
            <AuthorizedButton authority="/bottomTable/addBottomTable">
              <Button onClick={this.addTasks} type="primary" className={common.createButton}>
                添加任务
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
            />
          }
        />
        {/*  */}
        <div className="fixBox">
          <img src={backTop} alt="backTop" onClick={this.backTop} />
        </div>
        {/* 添加底表下载任务 */}
        <ModalDialog
          title="添加底表下载任务"
          visible={this.state.visible}
          modalContent={this.modalContent()}
          showModal={bol => this.showModal(bol)}
          clickOK={() => this.clickModalOK()}
        />
      </>
    );
  }
}

export default BottomList;
