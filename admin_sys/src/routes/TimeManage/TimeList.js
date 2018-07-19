import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Form, Popconfirm, DatePicker, message } from 'antd';
import moment from 'moment';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import ModalDialog from '../../selfComponent/Modal/Modal';
import common from '../Common/common.css';
import styles from './TimeList.css';
import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';

const FormItem = Form.Item;
let propsVal = '';
const dateFormat = 'YYYY-MM-DD';

@connect(({ time, loading }) => ({
  time,
  loading: loading.models.time,
  addDisabileTime: loading.effects['time/addDisableTime'],
  changeDateArea: loading.effects['time/updateAreaDate'],
}))
class TimeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      params: {
        orderDirection: 'desc',
        orderType: 'dateTime',
        pageNum: 0,
        pageSize: 30,
      },
      dateArea: {
        beginTime: '',
        endTime: '',
        id: 1,
      },
      visible: false,
      dateTime: '',
      hintVisible: false,
      changeVisible: false,
    };
  }

  componentDidMount() {
    this.fillDataSource();
    this.getRange();
    console.log(this);
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.time.dateArea) !== JSON.stringify(this.props.time.dateArea)) {
      const beginTime = this.changeFormat(nextProps.time.dateArea.beginTime);
      const endTime = this.changeFormat(nextProps.time.dateArea.endTime);
      const dateArea = { ...nextProps.time.dateArea, beginTime, endTime };
      this.setState({ dateArea });
    }
  }

  // 添加
  onAdd = () => {
    this.setState({ dateTime: '' });
    this.showModal(true);
  };

  // 删除账号函数  删除后数据更新？
  onDelete = key => {
    const id = key.key;
    const { params } = this.state;
    this.props.dispatch({
      type: 'time/deleteTime',
      payload: { id, params },
    });
  };
  // 点击显示每页多少条数据函数
  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };
  // 初始化回显时间日期
  getRange = () => {
    this.props.dispatch({
      type: 'time/getRange',
    });
  };
  addDisableTime = () => {
    const { dateTime = '', params } = this.state;
    const { dateListObj = {} } = this.props.time;
    const { content = [] } = dateListObj;
    const isHasDate = content.find(item => {
      const formatDate = moment.unix(item.dateTime / 1000).format(dateFormat);
      return formatDate === dateTime;
    });
    if (isHasDate) {
      message.error('添加失败,日期不可重复');
    } else if (!dateTime) {
      message.error('添加失败,日期不可为空');
    } else {
      this.props.dispatch({
        type: 'time/addDisableTime',
        payload: { dateTime, params },
      });
      this.showModal(false);
    }
  };
  showModal = bol => {
    this.setState({
      visible: bol,
    });
  };
  showHintModal = bol => {
    this.setState({
      hintVisible: bol,
    });
  };
  showChangeDateModal = bol => {
    this.setState({
      changeVisible: bol,
    });
  };
  // 点击某一页函数
  changePage = (current, pageSize) => {
    console.log(current, pageSize);
  };

  // 表单搜索
  handleSearch = e => {
    e.preventDefault();
    propsVal.form.validateFields((err, values) => {
      const { beginTime, endTime = '' } = values;
      if (
        !beginTime ||
        (endTime && typeof endTime === 'object' && moment(beginTime).isAfter(endTime))
      ) {
        const dateArea = { ...this.state.dateArea, endTime, beginTime };
        this.setState({
          hintVisible: true,
          dateArea,
        });
      } else {
        const dateArea = { ...this.state.dateArea, endTime, beginTime };
        this.setState({
          changeVisible: true,
          dateArea,
        });
      }
    });
  };
  changeDate = () => {
    const { dateArea = {} } = this.state;
    this.props.dispatch({
      type: 'time/updateAreaDate',
      payload: {
        ...dateArea,
      },
    });
    this.showChangeDateModal(false);
  };
  changeFormat = tmp => {
    return tmp ? moment.unix(tmp / 1000).format(dateFormat) : '';
  };

  // 点击选择添加不可选时间
  selectDisableTime = (date, dateString) => {
    this.setState({ dateTime: dateString });
  };
  closeErrorModal = () => {
    this.showHintModal(false);
  };
  // 初始化tabale 列数据
  fillDataSource = value => {
    const { params } = this.state;
    this.props.dispatch({
      type: 'time/getDates',
      payload: { ...params, value },
    });
  };

  // 获取table列表头
  columnsData = () => {
    const columns = [
      {
        title: '时间',
        dataIndex: 'dateTime',
        width: 400,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <div>
              <AuthorizedButton authority="/timeManage/deleteDate">
                <Popconfirm title="是否确认删除时间?" onConfirm={() => this.onDelete(record)}>
                  <span style={{ color: '#52C9C2', marginLeft: 12, cursor: 'pointer' }}>删除</span>
                </Popconfirm>
              </AuthorizedButton>
            </div>
          );
        },
      },
    ];
    return columns;
  };

  render() {
    const { visible, hintVisible, changeVisible, dateArea } = this.state;
    const { dateListObj = {} } = this.props.time;
    const { loading, addDisabileTime, changeDateArea } = this.props;
    const { content = [], size = 0 } = dateListObj;
    const columns = !this.columnsData() ? [] : this.columnsData();
    const formLayout = 'inline';
    const dataSorce = content.map(item => ({
      key: item.id,
      dateTime: moment.unix(item.dateTime / 1000).format(dateFormat),
    }));
    const datePicker = (
      <DatePicker
        initialValue={[moment('2015-01-01', dateFormat)]}
        onChange={this.selectDisableTime}
        format={dateFormat}
        style={{ width: 230, height: 32 }}
      />
    );
    const dateAreaPicker = <DatePicker format={dateFormat} style={{ width: 230, height: 32 }} />;

    const WrappedAdvancedSearchForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      return (
        <Form onSubmit={this.handleSearch} layout={formLayout}>
          <p className={styles.formTitle}>“自定义时间”可选范围设置</p>
          <div className={styles.formCls}>
            <FormItem label="开始日期">
              {getFieldDecorator('beginTime', {
                initialValue: dateArea.beginTime ? moment(dateArea.beginTime, dateFormat) : null,
                rules: [{ required: false, message: '请选择生效开始日期' }],
              })(dateAreaPicker)}
            </FormItem>
            <FormItem label="结束日期">
              {getFieldDecorator('endTime', {
                initialValue: dateArea.endTime ? moment(dateArea.endTime, dateFormat) : null,
                rules: [{ required: false, message: '请选择生效结束日期' }],
              })(dateAreaPicker)}
            </FormItem>
            <FormItem style={{ marginLeft: 30 }}>
              <AuthorizedButton authority="/timeManage/updateArea">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={changeDateArea}
                  className={common.searchButton}
                  style={{ margin: '0' }}
                >
                  保存
                </Button>
              </AuthorizedButton>
            </FormItem>
          </div>
        </Form>
      );
    });
    return (
      <div>
        <ContentLayout
          pageHeraderUnvisible="unvisible"
          title="时间管理"
          contentForm={<WrappedAdvancedSearchForm />}
          contentButton={
            <div>
              <p className={styles.tableTitle}>“不可用日期”设置</p>
              <p className={styles.content}>
                <span className={styles.txt}>设置不可用的日期（指定日期将不参与学分计算）</span>
                <AuthorizedButton authority="/timeManage/unAddDate">
                  <Button
                    loading={addDisabileTime}
                    onClick={this.onAdd}
                    type="primary"
                    className={common.searchButton}
                    style={{ margin: '0 14px' }}
                  >
                    添加
                  </Button>
                </AuthorizedButton>
              </p>
            </div>
          }
          contentTable={
            <div style={{ width: '590px' }}>
              <Table
                bordered
                loading={loading}
                dataSource={dataSorce}
                columns={columns}
                useFixedHeader
                scroll={{ y: 600 }}
                pagination={false}
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
              total={size}
              defaultPageSize={30}
              pageSizeOptions={['30']}
            />
          }
        />
        <ModalDialog
          title="添加不可用时间"
          visible={visible}
          modalContent={datePicker}
          showModal={bol => this.showModal(bol)}
          clickOK={this.addDisableTime}
        />
        <ModalDialog
          title="自定义时间"
          visible={hintVisible}
          modalContent="时间可选范围有误"
          showModal={bol => this.showHintModal(bol)}
          clickOK={this.closeErrorModal}
        />
        <ModalDialog
          title="修改&quot;自定义时间&quot;可选范围"
          visible={changeVisible}
          modalContent="修改的可选范围将被更新,是否确定修改"
          showModal={bol => this.showChangeDateModal(bol)}
          clickOK={this.changeDate}
        />
      </div>
    );
  }
}

export default TimeList;
