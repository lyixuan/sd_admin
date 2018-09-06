import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, DatePicker, Radio } from 'antd';
import { assignUrlParams } from 'utils/utils';
import moment from 'moment';
import ConfirmModal from 'selfComponents/ConfirmModal';
import { BaseUtils } from './BaseUtils.js';
import ContentLayout from '../../layouts/ContentLayout';
import common from '../Common/common.css';
import styles from './styles/index.less';

const dateFormat = 'YYYY-MM-DD';
const RadioGroup = Radio.Group;

@connect(({ staff, user, loading }) => ({
  staff,
  user,
  loading: loading.effects['staff/getStaffDetail'],
  creatLoading: loading.effects['staff/editDemissionPost'],
}))
class EditDimission extends Component {
  constructor(props) {
    const { urlParams = {} } = props;
    super(props);
    const initState = {
      paramsObj: {
        id: null,
        type: 4, // 离职
      },
      commitParams: {
        id: Number(urlParams.id),
        kpiUserPositionLogList: [
          {
            userId: Number(urlParams.id),
          },
        ],
      },
      isShowModal: false,
      canceled: 1, // 是否撤销此次操作,1否,0是
      effectDate: null, // 离职时间
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
    const { canceled, effectDate } = obj || kpiUserPositionObj;
    this.setState({
      canceled,
      effectDate,
    });
  };
  handleSearch = e => {
    e.preventDefault();
    const { validateFields } = this.props.form;
    validateFields((err, values) => {
      const { effectDate, canceled } = values;
      if (!effectDate) {
        return;
      }
      const params = {
        canceled,
        effectDate: effectDate.format(dateFormat),
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
      type: 'staff/editDemissionPost',
      payload: commitParams,
    });
  };
  ChangeAudio = e => {
    const canceled = e.target.value;
    this.setState({ canceled });
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
    const { canceled, effectDate, isShowModal } = this.state;
    const employeeInfo = staff.employeeInfo || {};
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
              <li className={styles.marB_24}>
                <span className={styles.labelText}>撤销此次操作:</span>
                <span className={styles.labelItem}>
                  <FormItem>
                    {getFieldDecorator('canceled', {
                      initialValue: canceled,
                    })(
                      <RadioGroup onChange={this.ChangeAudio}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </span>
              </li>
              <li className={styles.marB_24}>
                <span className={styles.labelText}>*最后工作日期:</span>
                <span className={styles.labelItem}>
                  <FormItem>
                    {getFieldDecorator('effectDate', {
                      initialValue: effectDate ? moment(effectDate) : null,
                      rules: [{ required: true, message: '请选择生效开始日期' }],
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
            <p style={{ marginTop: '20px' }}>您即将撤销{employeeInfo.name}的离职,请确认.</p>
          </ConfirmModal>
        </div>
      </ContentLayout>
    );
  }
}
const WrappedDynamicRule = Form.create()(EditDimission);
export default WrappedDynamicRule;
