import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Select, DatePicker } from 'antd';
import moment from 'moment';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
import ModalDialog from '../../selfComponent/Modal/Modal';
import common from '../Common/common.css';
import { formatDate } from '../../utils/FormatDate';
import { getAuthority } from '../../utils/authority';
import { BOTTOM_TABLE_LIST, ADMIN_AUTH_LIST, ADMIN_USER } from '../../utils/constants';
import { columnsFn } from './_selfColumn';
import ModalContent from './_modalContent';
import backTop from '../../assets/backTop.svg';
import FormFilter from '../../selfComponent/FormFilter';

const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

@connect(({ bottomTable, loading }) => ({
  bottomTable,
  loading: loading.effects['bottomTable/bottomTableList'],
}))
class BottomList extends Component {
  constructor(props) {
    super(props);
    const localStorage = getAuthority(ADMIN_USER);
    const userId = !localStorage ? null : localStorage.userId;
    this.state = {
      timeParams: {
        orderDirection: 'desc',
        orderType: 'dateTime',
      },
      modalParam: {
        bottomDate: '',
        collegeId: 0,
        type: 0,
      },
      userId,
      type: null,
      bottomTime: '',
      pageNum: 0,
      pageSize: 30,
      visible: false,
    };
  }

  componentDidMount() {
    const initVal = this.props.getUrlParams();
    const initParams = {};
    if (JSON.stringify(initVal) !== '{}') {
      initParams.bottomTime = initVal.bottomTime ? Date.parse(new Date(initVal.bottomTime)) : null;
      initParams.type = initVal.type ? Number(initVal.type) : null;
    }
    this.getDataList(initParams); // 列表数据
    this.getRange(); // 时间范围
    this.disDateList(); // 不可选时间
    this.getAllOrg(); // 所有学院列表
  }

  onSubmit = data => {
    const bottomTime = data.bottomTime ? Date.parse(new Date(data.bottomTime)) : null;
    this.getDataList({
      bottomTime,
      type: data.type ? Number(data.type) : null,
    }); // 列表数据
    console.log(data);
  };

  // 列表数据
  getDataList = paramObj => {
    const { type, bottomTime, pageNum, pageSize } = this.state;
    this.props.dispatch({
      type: 'bottomTable/bottomTableList',
      payload: { type, bottomTime, pageNum, pageSize, ...paramObj },
    });
  };
  // 所有学院列表
  getAllOrg = () => {
    this.props.dispatch({
      type: 'bottomTable/findAllOrg',
      payload: {},
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
    const disabledDate = content.map(item => (item.dateTime / 1000).format(dateFormat));

    return {
      disabledDate,
      newTime: dateArea.endTime, // 最新可用时间
      minTime: Math.min(dateArea.beginTime, Number(dateArea.endTime) - 10 * 24 * 3600000), // 最小时间
    };
  };

  // 点击某一页函数
  changePage = (current, size) => {
    this.getDataList({
      pageSize: size,
      pageNum: current - 1,
    });
  };
  // 不可选时间
  disDateList = () => {
    const { timeParams, pageNum, pageSize } = this.state;
    this.props.dispatch({
      type: 'bottomTable/getDates',
      payload: { ...timeParams, pageNum, pageSize },
    });
  };

  // 模态框确定
  clickModalOK = () => {
    const { modalParam, userId } = this.state;
    this.props.dispatch({
      type: 'bottomTable/addTask',
      payload: { ...modalParam, userId },
    });
    this.getDataList({}); // 列表数据
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
    const { dataList = [], findAllOrg = [], totalNum = 0 } = bottomTable;
    // const time = this.getDateRange();

    const columns = columnsFn(this.downLoadBTable);
    const WrappedAdvancedSearchForm = () => (
      <FormFilter onSubmit={this.onSubmit}>
        <div>
          <span style={{ lineHeight: '32px' }}>底表类型：</span>
          <Select placeholder="底表类型" style={{ width: 230, height: 32 }} flag="type">
            {BOTTOM_TABLE_LIST.map(item => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <span style={{ lineHeight: '32px' }}>底表时间：</span>
          <DatePicker
            format={dateFormat}
            disabledDate={this.disabledDate}
            style={{ width: 230, height: 32 }}
            flag="bottomTime"
          />
        </div>
      </FormFilter>
    );
    return (
      <>
        <ContentLayout
          routerData={this.props.routerData}
          contentForm={WrappedAdvancedSearchForm()}
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
              total={totalNum}
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
            <ModalContent
              disabledDate={this.disabledDate}
              updateModalData={this.updateModalData}
              selectOption={findAllOrg}
              authList={getAuthority(ADMIN_AUTH_LIST)}
            />
          }
          showModal={bol => this.showModal(bol)}
          clickOK={() => this.clickModalOK()}
        />
      </>
    );
  }
}

export default BottomList;
