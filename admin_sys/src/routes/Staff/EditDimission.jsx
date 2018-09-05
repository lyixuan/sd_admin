import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, DatePicker, Radio } from 'antd';
import { assignUrlParams } from 'utils/utils';
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
      kpiUserPositionLogList: {
        userId: Number(urlParams.id),
        type: 4, // 离职
        effectDate: '',
      },
      canceled: 1, // 是否撤销此次操作,1否,0是
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
      const { effectDate, canceled } = values;
      const paramsObj = Object.assign({}, this.state.kpiUserPositionLogList, {
        effectDate: effectDate.format(dateFormat),
        canceled,
      });
      const newObj = {
        id: Number(urlParams.id),
        kpiUserPositionLogList: [paramsObj],
      };
      console.log(newObj);
      this.props.dispatch({
        type: 'staff/editDemissionPost',
        payload: newObj,
      });
    });
  };
  ChangeAudio = e => {
    const canceled = e.target.value;
    this.setState({ canceled });
  };
  backToList = () => {
    this.props.history.goBack();
  };
  render() {
    const { staff = {}, creatLoading } = this.props;
    const { canceled } = this.state;
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
                        <Radio value={0}>是</Radio>
                        <Radio value={1}>否</Radio>
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
                      initialValue: null,
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
        </div>
      </ContentLayout>
    );
  }
}
const WrappedDynamicRule = Form.create()(EditDimission);
export default WrappedDynamicRule;
