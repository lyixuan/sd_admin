import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, DatePicker, Radio } from 'antd';
import { assignUrlParams } from 'utils/utils';
import ConfirmModal from 'selfComponents/ConfirmModal';
import moment from 'moment';
import { BaseUtils } from './BaseUtils';
import ContentLayout from '../../layouts/ContentLayout';
import common from '../Common/common.css';
import styles from './styles/index.less';

const dateFormat = 'YYYY-MM-DD';
const RadioGroup = Radio.Group;
@connect(({ staff, user, loading }) => ({
  staff,
  user,
  loading: loading.effects['staff/getStaffDetail'],
  creatLoading: loading.effects['staff/updateHoliday'],
}))
class EditHoliday extends Component {
  constructor(props) {
    const { urlParams = {} } = props;
    super(props);
    const initState = {
      paramsObj: {
        id: null,
        type: 3, // 休假
      },
      canceled: 0, // 是否撤销此次操作,1否,0是
      commitParams: {
        id: Number(urlParams.id),
        kpiUserPositionLogList: [
          {
            userId: Number(urlParams.id),
            positionType: '',
            collegeId: '',
            familyId: '',
            groupId: '',
          },
        ],
      },
    };
    this.state = assignUrlParams(initState, urlParams);
    this.baseUtils = new BaseUtils();
  }

  componentDidMount() {
    this.getData();
    this.initParams();
  }
  componentWillReceiveProps(nextprops) {
    if (
      JSON.stringify(nextprops.staff.employeeInfo) !== JSON.stringify(this.props.staff.employeeInfo)
    ) {
      const employeeInfo = nextprops.staff.employeeInfo || {};
      const kpiUserPositionLogList = employeeInfo.kpiUserPositionLogList || [];
      const kpiUserPositionObj = kpiUserPositionLogList[0] || {};
      this.initParams(kpiUserPositionObj);
    }
  }
  getData = () => {
    const { paramsObj } = this.state;
    this.props.dispatch({
      type: 'staff/getEmployeeInfo',
      payload: paramsObj,
    });
  };
  initParams = obj => {
    const employeeInfo = this.props.staff.employeeInfo || {};
    const kpiUserPositionLogList = employeeInfo.kpiUserPositionLogList || [];
    const kpiUserPositionObj = kpiUserPositionLogList[0] || {};
    const { canceled } = obj || kpiUserPositionObj;
    this.setState({
      canceled,
    });
  };
  changeVideo = e => {
    const canceled = e.target.value;
    this.setState({ canceled });
  };
  handleSearch = e => {
    e.preventDefault();
    const { validateFields } = this.props.form;
    validateFields((err, values) => {
      const { effectDate, endDate, canceled } = values;
      if (!effectDate || !endDate) {
        return;
      }
      const params = {
        canceled,
        effectDate: effectDate.format(dateFormat),
        endDate: endDate.format(dateFormat),
      };
      if (canceled === 1) {
        // 当撤销此次操作的时候讲 数据存储,并弹框,否的话直接交互
        const isShowModal = canceled === 1;
        this.setState({ isShowModal });
        this.saveCommitParams(params);
      } else {
        this.commitCreateJob(params);
      }
    });
  };
  saveCommitParams = (params = {}) => {
    const { commitParams } = this.state;
    const newObj = Object.assign({}, commitParams.kpiUserPositionLogList[0], params);
    commitParams.kpiUserPositionLogList = [newObj];
    this.setState({ commitParams });
  };
  commitCreateJob = (params = {}) => {
    const { commitParams } = this.state;
    const employeeInfo = this.props.staff.employeeInfo || {};
    const kpiUserPositionLogList = employeeInfo.kpiUserPositionLogList || [];
    const kpiUserPositionObj = kpiUserPositionLogList[0] || {};
    const newObj = Object.assign(
      {},
      kpiUserPositionObj,
      commitParams.kpiUserPositionLogList[0],
      params
    );
    commitParams.kpiUserPositionLogList = [newObj];
    this.props.dispatch({
      type: 'staff/updateHoliday',
      payload: commitParams,
    });
  };
  showModal = bol => {
    this.setState({ isShowModal: bol });
  };
  clickOK = () => {
    this.commitCreateJob();
  };

  backToList = () => {
    this.props.history.goBack();
  };
  render() {
    const { staff = {}, creatLoading } = this.props;
    const employeeInfo = staff.employeeInfo || {};
    const kpiUserPositionLogList = employeeInfo.kpiUserPositionLogList || [];
    const kpiUserPositionLog = kpiUserPositionLogList[0] || {};
    const { effectDate = '', endDate = '' } = kpiUserPositionLog;
    const { isShowModal, canceled } = this.state;
    const { FormItem } = this.baseUtils;
    const { getFieldDecorator } = this.props.form;
    const datePicker = (
      <DatePicker
        disabled={canceled === 1}
        format={dateFormat}
        style={{ width: 230, height: 32 }}
      />
    );
    return (
      <ContentLayout routerData={this.props.routerData}>
        <div className={styles.detailContailer}>
          <Form onSubmit={this.handleSearch} layout="inline">
            <ul className={styles.formContent}>
              <li>
                <span className={styles.labelText}>姓名:</span>
                <span className={styles.labelItem}>{employeeInfo.name}</span>
              </li>
              <li>
                <span className={styles.labelText}>邮箱:</span>
                <span className={styles.labelItem}>{employeeInfo.mail}</span>
              </li>
              <li>
                <span className={styles.labelText}>现任岗位:</span>
                <span className={styles.labelItem}>
                  {this.baseUtils.returnGroupType(employeeInfo.userType)}
                </span>
              </li>
              <li>
                <span className={styles.labelText}>现任负责单位:</span>
                <span className={styles.labelItem}>{employeeInfo.showName}</span>
              </li>
              <li>
                <span className={styles.labelText}>撤销此次操作:</span>
                <span className={styles.labelItem}>
                  <FormItem>
                    {getFieldDecorator('canceled', {
                      initialValue: canceled,
                    })(
                      <RadioGroup onChange={this.changeVideo}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </span>
              </li>
              <li className={styles.marB_24}>
                <span className={styles.labelText}>*休假开始日期:</span>
                <span className={styles.labelItem}>
                  <FormItem>
                    {getFieldDecorator('effectDate', {
                      initialValue: effectDate ? moment(effectDate) : null,
                      rules: [{ required: true, message: '请选择生效开始日期' }],
                    })(datePicker)}
                  </FormItem>
                </span>
              </li>
              <li className={styles.marB_24}>
                <span className={styles.labelText}>*休假结束日期:</span>
                <span className={styles.labelItem}>
                  <FormItem>
                    {getFieldDecorator('endDate', {
                      initialValue: endDate ? moment(endDate) : null,
                      rules: [{ required: true, message: '请选择生效结束日期' }],
                    })(datePicker)}
                  </FormItem>
                </span>
              </li>
            </ul>
          </Form>

          <div className={styles.buttonConent}>
            <Button
              onClick={this.backToList}
              type="primary"
              className={`${common.cancleButton} ${styles.buttonConnel}`}
            >
              取消
            </Button>
            <Button
              onClick={this.handleSearch}
              type="primary"
              className={`${common.submitButton} ${styles.buttonSure}`}
              loading={creatLoading}
            >
              提交
            </Button>
          </div>
          <ConfirmModal visible={isShowModal} showModal={this.showModal} clickOK={this.clickOK}>
            <p style={{ marginTop: '20px' }}>您即将撤销{employeeInfo.name}的休假,请确认.</p>
          </ConfirmModal>
        </div>
      </ContentLayout>
    );
  }
}
const WrappedDynamicRule = Form.create()(EditHoliday);
export default WrappedDynamicRule;
