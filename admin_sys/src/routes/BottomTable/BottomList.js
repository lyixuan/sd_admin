import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Row, Col, Select, DatePicker } from 'antd';
import moment from 'moment';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import ModalDialog from '../../selfComponent/Modal/Modal';
import common from '../Common/common.css';
import { formatDate } from '../../utils/FormatDate';
import { getAuthority } from '../../utils/authority';
import { BOTTOM_TABLE_LIST } from '../../utils/constants';
import { columnsFn } from './_selfColumn';
import ModalContent from './_modalContent';
import backTop from '../../assets/backTop.svg';

const FormItem = Form.Item;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

@connect(({ bottomTable, loading }) => ({
  bottomTable,
  loading: loading.effects['bottomTable/bottomTableList'],
}))
class BottomList extends Component {
  constructor(props) {
    super(props);
    const localStorage = getAuthority('admin_user');
    const userId = !localStorage ? null : localStorage.userId;
    this.state = {
      timeParams: {
        orderDirection: 'desc',
        orderType: 'dateTime',
      },
      modalParam: {
        bottomDate: '2018-12-14',
        collegeId: 0,
        type: 0,
        userId,
      },
      type: 0,
      bottomTime: '',
      pageNum: 0,
      pageSize: 30,
      visible: false,
    };
  }

  componentDidMount() {
    this.getDataList(); // 列表数据
    this.getRange(); // 时间范围
    this.disDateList(); // 不可选时间
  }

  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, size) => {
    this.changePage(current, size);
  };

  // 选择时间
  onDateChange = (date, bottomTime) => {
    this.setState({ bottomTime });
  };
  // 列表数据
  getDataList = () => {
    const { type, bottomTime, pageNum, pageSize } = this.state;
    this.props.dispatch({
      type: 'bottomTable/bottomTableList',
      payload: { type, bottomTime, pageNum, pageSize },
    });
  };
  // 初始化回显时间日期
  getRange = () => {
    this.props.dispatch({
      type: 'bottomTable/getRange',
    });
  };

  // 获取最新时间和最小时间
  getDateRange = () => {
    const { bottomTable = {} } = this.props;
    const { dateArea = {}, disDateList = [] } = bottomTable;
    const { content = [] } = disDateList;
    const disabledDate = content.map(item => moment.unix(item.dateTime / 1000).format(dateFormat));

    return {
      disabledDate,
      newTime: dateArea.endTime, // 最新可用时间
      minTime: Math.min(dateArea.beginTime, Number(dateArea.endTime) - 10 * 24 * 3600000), // 最小时间
    };
  };
  // 不可选时间
  disDateList = () => {
    const { timeParams, pageNum, pageSize } = this.state;
    this.props.dispatch({
      type: 'bottomTable/getDates',
      payload: { ...timeParams, pageNum, pageSize },
    });
  };
  // 表单搜索
  handleSearch = e => {
    e.preventDefault();
  };

  // 表单重置
  handleReset = () => {
    console.log('reset');
  };

  // 模态框确定
  clickModalOK = () => {
    const { modalParam } = this.state;
    this.props.dispatch({
      type: 'bottomTable/addTask',
      payload: { ...modalParam },
    });
    this.showModal(false);
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
  downLoadBTable = record => {
    console.log(record);
    this.props.dispatch({
      type: 'bottomTable/downLoadBT',
      payload: {
        id: record.id,
        taskName: record.taskName,
      },
    });
  };

  backTop = () => {
    window.scrollTo(0, 0);
  };

  updateModalData = modalParam => {
    this.setState({ modalParam });
  };
  // 时间控件可展示的时间范围
  disabledDate = current => {
    const time = this.getDateRange();
    return current > moment(formatDate(time.newTime)) || current < moment(formatDate(time.minTime));
  };
  render() {
    const { bottomTable = {}, loading } = this.props;
    const { dataList = [] } = bottomTable;
    const time = this.getDateRange();

    const columns = columnsFn(this.downLoadBTable);
    const WrappedAdvancedSearchForm = Form.create()(props => {
      const { getFieldDecorator } = props.form;
      return (
        <Form layout="inline" onSubmit={this.handleSearch}>
          <Row gutter={24}>
            <Col span={8}>
              <FormItem label="底表类型">
                {getFieldDecorator('type', {
                  initialValue: '',
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
                  initialValue: time.minTime ? moment(formatDate(time.minTime)) : null,
                })(
                  <DatePicker
                    format={dateFormat}
                    disabledDate={this.disabledDate}
                    style={{ width: 230, height: 32 }}
                    onChange={this.onDateChange}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                <>
                  <Button htmlType="submit" type="primary" className={common.searchButton}>
                    搜 索
                  </Button>
                  <Button onClick={this.handleReset} type="primary" className={common.resetButton}>
                    重 置
                  </Button>
                </>
              </FormItem>
            </Col>
          </Row>
        </Form>
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
              <p className={common.totalNum}>总数：0条</p>
              <Table
                bordered
                loading={loading}
                dataSource={dataList}
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
              total={30}
            />
          }
        />
        {/* 回到顶部 */}
        <div className="fixBox">
          <img src={backTop} alt="backTop" onClick={this.backTop} />
        </div>
        {/* 添加底表下载任务 */}
        <ModalDialog
          title="添加底表下载任务"
          visible={this.state.visible}
          modalContent={
            <ModalContent disabledDate={this.disabledDate} updateModalData={this.updateModalData} />
          }
          showModal={bol => this.showModal(bol)}
          clickOK={() => this.clickModalOK()}
        />
      </>
    );
  }
}

export default BottomList;
