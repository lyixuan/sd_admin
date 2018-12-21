import React, { Component } from 'react';
import { connect } from 'dva';
import { message, Button, Select, DatePicker } from 'antd';
import moment from 'moment';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import ModalDialog from '../../selfComponent/Modal/Modal';
import common from '../Common/common.css';
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
  loading: loading.models.bottomTable,
  isLoading: loading.effects['bottomTable/getRange'],
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
        collegeId: null,
        type: null,
      },
      userId,
      type: null,
      bottomTime: '',
      pageNum: 0,
      pageSize: 30,
      visible: false,
    };
    this.dateAreaObj = {
      newTime: '',
      minTime: '',
      disabledDate: [],
    };
    this.dateArea = [];
  }
  componentDidMount() {
    const initVal = this.props.getUrlParams();
    const initParams = {};
    if (JSON.stringify(initVal) !== '{}') {
      initParams.bottomTime = initVal.bottomTime ? Date.parse(new Date(initVal.bottomTime)) : null;
      initParams.type = initVal.type && initVal.type !== '' ? Number(initVal.type) : '';
    }
    this.getDataList(initParams); // 列表数据
    this.getRange(); // 时间范围
    this.disDateList(); // 不可选时间
    this.getAllOrg(); // 所有学院列表
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.bottomTable) !== JSON.stringify(this.props.bottomTable)) {
      this.getDateRange(nextProps.bottomTable);
    }
  }

  onSubmit = data => {
    const bottomTime = data.bottomTime ? Date.parse(new Date(data.bottomTime)) : null;
    const type = data.type && data.type !== '' ? Number(data.type) : '';
    const pageNum = data.pageNum ? Number(data.pageNum) : 0;
    this.getDataList({ bottomTime, type, pageNum }); // 列表数据
  };

  // 获取最新时间和最小时间
  getDateRange = (bottomTable = {}) => {
    const { dateArea = {}, disDateList = [] } = bottomTable;
    const { content = [] } = disDateList;
    const { beginTime = '', endTime = '' } = dateArea;
    const disabledDate = content.map(item => moment(item.dateTime).format(dateFormat));
    const newTime = this.haddleMaxDate(endTime);
    this.dateArea = this.haddleDateArea(newTime, beginTime, disabledDate);
  };

  // 列表数据
  getDataList = paramObj => {
    const { userId, type, bottomTime, pageNum, pageSize } = this.state;
    const params = { userId, type, bottomTime, pageNum, pageSize, ...paramObj };
    this.props.dispatch({
      type: 'bottomTable/bottomTableList',
      payload: params,
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

  isDataAnalyst = false; // 是否是数据分析员
  haddleMaxDate = endTime => {
    const endDate = endTime || moment().valueOf;
    const taday_13 = moment().format('YYYY-MM-DD 13:30');
    const isBeforeTaday_13 = moment().isBefore(taday_13);
    let newDate = null;
    if (isBeforeTaday_13) {
      newDate = moment().subtract(2, 'd');
    } else {
      newDate = moment().subtract(1, 'd');
    }
    return Math.min(endDate, newDate.valueOf());
  };
  haddleDateArea = (maxTime, minTime, disabledDate) => {
    const dateArr = [];
    for (let i = maxTime; i >= minTime && dateArr.length < 10; i -= 86400000) {
      const isSameDate = disabledDate.find(
        item => moment(item).format(dateFormat) === moment(i).format(dateFormat)
      );
      if (!isSameDate) {
        dateArr.push(moment(i).format(dateFormat));
      }
    }
    return dateArr;
  };

  // 点击某一页函数
  changePage = (pageNum, size) => {
    this.getDataList({
      pageSize: size,
      pageNum,
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
    const { modalParam, type, userId, bottomTime, pageNum, pageSize } = this.state;
    if (modalParam.bottomDate === '') {
      message.error('请选择底表时间');
      return;
    } else if (this.isDataAnalyst && modalParam.collegeId === null) {
      message.error('请选择学院');
      return;
    }
    const sendParam = {
      addParams: { ...modalParam, userId },
      listParams: { userId, type, bottomTime, pageNum, pageSize },
    };
    this.props.dispatch({
      type: 'bottomTable/addTask',
      payload: sendParam,
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
      modalParam: {
        bottomDate: '',
        collegeId: null,
        type: 0,
      },
    });
  };
  downLoadBTable = record => {
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
    const currentDate = current || moment();
    const currentFormat = moment(currentDate.format(dateFormat));
    const disableData = this.dateArea.find(item => currentFormat.isSame(item));
    return !disableData;
  };
  isDataAnalystFn = bol => {
    this.isDataAnalyst = bol;
  };
  render() {
    const { bottomTable = {}, loading, isLoading } = this.props;
    const { dataList = [], findAllOrg = [], totalNum = 0 } = bottomTable;
    const columns = columnsFn(this.downLoadBTable);
    const WrappedAdvancedSearchForm = () => (
      <FormFilter onSubmit={this.onSubmit} isLoading={isLoading} modal={{ type: '' }}>
        <div>
          <span style={{ lineHeight: '32px' }}>底表类型：</span>
          <Select
            placeholder="底表类型"
            style={{ width: 230, height: 32 }}
            flag="type"
            type="select"
          >
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
            type="datePicker"
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
            <FormFilter.Table
              bordered
              totalNum={totalNum}
              loading={loading}
              dataSource={dataList}
              columns={columns}
              onChangePage={this.changePage}
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
              isDataAnalyst={bol => this.isDataAnalystFn(bol)}
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
