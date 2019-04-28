import React, { Component } from 'react';
import { connect } from 'dva';
import { Route, Switch, Redirect } from 'dva/router';
import { Button, Form, DatePicker, message, Input } from 'antd';
import moment from 'moment';
import ModalDialog from '../../selfComponent/Modal/Modal';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';
import styles from './TimeList.css';

const { TextArea } = Input;
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';

@connect(({ time, loading }) => ({
  time,
  loading: loading.models.time,
  changeDateArea: loading.effects['time/updateKOAreaDate'],
  changeKOMessage: loading.effects['time/updateKOMessage'],
}))
class TimeList extends Component {
  constructor(props) {
    super(props);
    const { dateArea = {} } = this.props.time;

    this.state = {
      dateArea: {
        id: 1,
        beginTime: this.changeFormat(dateArea.beginTime),
        endTime: this.changeFormat(dateArea.endTime),
      },
      changeVisible: false,
      txtAreaObj: {
        message: '',
        saveTime: '',
      },
    };
  }

  componentDidMount() {
    this.getKoDateRange();
    this.getKOMessage();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log(43, this.props.time.dateArea);
    if (JSON.stringify(nextProps.time.dateArea) !== JSON.stringify(this.props.time.dateArea)) {
      const beginTime = this.changeFormat(nextProps.time.dateArea.beginTime);
      const endTime = this.changeFormat(nextProps.time.dateArea.endTime);
      const dateArea = { ...nextProps.time.dateArea, beginTime, endTime };
      const txtAreaObj = { ...nextProps.time.txtAreaObj };
      this.setState({ dateArea, txtAreaObj });
    }
  }
  // 初始化回显时间日期
  getKoDateRange = () => {
    this.props.dispatch({
      type: 'time/getKoDateRange',
    });
  };
  getKOMessage = () => {
    this.props.dispatch({
      type: 'time/getKOMessage',
    });
  };
  changeFormat = tmp => {
    return tmp ? moment.unix(tmp / 1000).format(dateFormat) : '';
  };

  closeErrorModal = () => {
    this.showHintModal(false);
  };
  showChangeDateModal = bol => {
    this.setState({
      changeVisible: bol,
    });
  };
  changeDate = () => {
    const { dateArea = {} } = this.state;
    this.props.dispatch({
      type: 'time/updateKOAreaDate',
      payload: {
        beginTime: moment(dateArea.beginTime).format('YYYY-MM-DD'),
        endTime: moment(dateArea.endTime).format('YYYY-MM-DD'),
        id: dateArea.id,
      },
    });
    this.showChangeDateModal(false);
  };
  performanceComponent = () => {
    const { routerData } = this.props;
    return routerData['/config/timeList/performance'].component;
  };
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const { beginTime, endTime = '' } = values;
      if (!beginTime) {
        message.error('开始日期为必选项，请选择');
        return;
      }
      if (!endTime) {
        message.error('结束日期为必选项，请选择');
        return;
      }
      if (
        !beginTime ||
        (endTime && typeof endTime === 'object' && moment(beginTime).isAfter(endTime))
      ) {
        const dateArea = { ...this.state.dateArea, endTime, beginTime };
        this.setState({
          dateArea,
        });
      } else {
        const dateArea = { ...this.state.dateArea, endTime, beginTime };
        this.setState({
          dateArea,
        });
        setTimeout(() => {
          this.changeDate();
        });
      }
    });
  };
  handleTxt(e) {
    this.state.txtAreaObj.message = e.target.value;
    const txtAreaObj = { ...this.state.txtAreaObj };
    this.setState({ txtAreaObj });
  }
  handleSaveTxt() {
    if (!this.state.txtAreaObj.message.trimRight(' ')) {
      message.error('文案为必选项，请选择');
      return;
    }
    this.props.dispatch({
      type: 'time/updateKOMessage',
      payload: {
        message: this.state.txtAreaObj.message,
        saveTime: null,
      },
    });
  }
  render() {
    const { dateArea, changeVisible } = this.state;
    const { changeDateArea, changeKOMessage } = this.props;
    const PerformanceComponent = this.performanceComponent();
    const dateAreaPicker = <DatePicker format={dateFormat} style={{ width: 230, height: 32 }} />;
    const { getFieldDecorator } = this.props.form;
    console.log(133, this.state.txtAreaObj);
    const CommonComponent = (
      <Form onSubmit={this.handleSearch} layout="inline">
        <h2 className={styles.modelTitle}>KO计划时间设置</h2>
        <p className={styles.formTitle}>“自定义时间”可选范围设置</p>
        <div className={styles.formCls}>
          <FormItem label="开始日期">
            {getFieldDecorator('beginTime', {
              initialValue: dateArea.beginTime ? moment(dateArea.beginTime, dateFormat) : null,
              rules: [{ required: false, message: '请选择开始日期' }],
            })(dateAreaPicker)}
          </FormItem>
          <FormItem label="结束日期">
            {getFieldDecorator('endTime', {
              initialValue: dateArea.endTime ? moment(dateArea.endTime, dateFormat) : null,
              rules: [{ required: false, message: '请选择结束日期' }],
            })(dateAreaPicker)}
          </FormItem>
          <FormItem style={{ marginLeft: 30 }}>
            <AuthorizedButton authority="/timeManage/updateArea">
              <Button
                type="primary"
                htmlType="submit"
                loading={changeDateArea}
                className={common.searchButton}
                style={{ marginRight: '10px', marginTop: 0, marginBottom: 0, marginLeft: 0 }}
              >
                保存
              </Button>
            </AuthorizedButton>
          </FormItem>
        </div>
      </Form>
    );
    return (
      <div>
        <ContentLayout
          routerData={this.props.routerData}
          contentForm={CommonComponent}
          contentTable={
            <div>
              <div className={styles.performanceContainer}>
                <hr className={styles.splitLine} />
                <h2 className={styles.performanceTitle}>KO计划文案设置</h2>
                <p className={styles.tableTitle}>设置KO计划可用时间范围的文案</p>
                <div className={styles.performanceTable}>
                  <div className={styles.titleTxt}>
                    <TextArea
                      rows={4}
                      value={this.state.txtAreaObj.message}
                      onChange={e => this.handleTxt(e)}
                      placeholder=""
                    />
                  </div>
                  <div className={styles.titleEdit}>
                    <Button
                      type="primary"
                      onClick={() => this.handleSaveTxt()}
                      loading={changeKOMessage}
                      className={common.searchButton}
                      style={{ margin: '0' }}
                    >
                      编辑
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          }
        >
          {/* 此区域为分发路由 */}
          <Switch>
            <Route path="/config/timeList/performance" component={PerformanceComponent} />
            <Redirect exact from="/config/timeList" to="/config/timeList/performance" />
          </Switch>
        </ContentLayout>
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

export default Form.create()(TimeList);
