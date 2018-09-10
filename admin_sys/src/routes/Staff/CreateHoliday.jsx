import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, DatePicker } from 'antd';
import { assignUrlParams } from 'utils/utils';
import { BaseUtils } from './BaseUtils';
import ContentLayout from '../../layouts/ContentLayout';
import common from '../Common/common.css';
import styles from './styles/index.less';

const dateFormat = 'YYYY-MM-DD';
@connect(({ staff, user, loading }) => ({
  staff,
  user,
  loading: loading.effects['staff/getStaffDetail'],
  creatLoading: loading.effects['staff/addDemissionPost'],
}))
class CreateHoliday extends Component {
  constructor(props) {
    const { urlParams = {} } = props;
    super(props);
    const initState = {
      paramsObj: {
        id: null,
        type: 3, // 休假
      },
      kpiUserPositionLogList: [
        {
          userId: Number(urlParams.id),
          type: 3, // 休假
          effectDate: '',
          endDate: '',
        },
      ],
    };
    this.state = assignUrlParams(initState, urlParams);
    this.baseUtils = new BaseUtils();
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { paramsObj } = this.state;
    this.props.dispatch({
      type: 'staff/getEmployeeInfo',
      payload: paramsObj,
    });
  };
  handleSearch = e => {
    e.preventDefault();
    const { validateFields } = this.props.form;
    const { urlParams = {} } = this.props;
    validateFields((err, values) => {
      const { effectDate, endDate } = values;
      if (!effectDate) {
        return;
      }
      const paramsObj = Object.assign({}, this.state.kpiUserPositionLogList[0], {
        effectDate: effectDate ? effectDate.format(dateFormat) : null,
        endDate: endDate ? endDate.format(dateFormat) : null,
      });
      const newObj = {
        id: Number(urlParams.id),
        kpiUserPositionLogList: [paramsObj],
      };
      this.props.dispatch({
        type: 'staff/addHoliday',
        payload: newObj,
      });
    });
  };

  backToList = () => {
    this.props.history.goBack();
  };
  render() {
    const { staff = {}, creatLoading } = this.props;
    const employeeInfo = staff.employeeInfo || {};
    const { FormItem } = this.baseUtils;
    const { getFieldDecorator } = this.props.form;
    const datePicker = <DatePicker format={dateFormat} style={{ width: 230, height: 32 }} />;
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
                <span className={styles.labelItem}>
                  {this.baseUtils.removeMailSymbal(employeeInfo.mail)}
                </span>
              </li>
              <li>
                <span className={styles.labelText}>现任岗位:</span>
                <span className={styles.labelItem}>
                  {this.baseUtils.returnGroupType(employeeInfo.userType)}
                </span>
              </li>
              <li>
                <span className={styles.labelText}>现任负责单位:</span>
                <span className={styles.labelItem}>
                  {employeeInfo.showName ||
                    this.baseUtils.returnOrganization(employeeInfo.userType)}
                </span>
              </li>
              <li className={styles.marB_24}>
                <span className={styles.labelText}>*休假开始日期:</span>
                <span className={styles.labelItem}>
                  <FormItem>
                    {getFieldDecorator('effectDate', {
                      initialValue: null,
                      rules: [{ required: true, message: '请选择生效开始日期' }],
                    })(datePicker)}
                  </FormItem>
                </span>
              </li>
              <li className={styles.marB_24}>
                <span className={styles.labelText}>休假结束日期:</span>
                <span className={styles.labelItem}>
                  <FormItem>
                    {getFieldDecorator('endDate', {
                      initialValue: null,
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
        </div>
      </ContentLayout>
    );
  }
}
const WrappedDynamicRule = Form.create()(CreateHoliday);
export default WrappedDynamicRule;
