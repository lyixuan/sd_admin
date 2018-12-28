import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Select, DatePicker, Cascader } from 'antd';
import { assignUrlParams } from 'utils/utils';
import BaseUtils from './BaseUtils';
import ContentLayout from '../../layouts/ContentLayout';
import common from '../Common/common.css';
import styles from './styles/index.less';

const FRONT_ROLE_TYPE_LIST = window.Filter('FRONT_ROLE_TYPE_LIST');
const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;
const FormItem = Form.Item;
@connect(({ staff, user, loading }) => ({
  staff,
  user,
  loading: loading.effects['staff/getStaffDetail'],
  creatLoading: loading.effects['staff/addTransferPost'],
}))
class CreateTransJob extends Component {
  constructor(props) {
    const { urlParams = {} } = props;
    super(props);
    const initState = {
      paramsObj: {
        id: null,
        type: 2,
      },
      commitParams: {
        id: Number(urlParams.id),
        kpiUserPositionLogList: [
          {
            userId: Number(urlParams.id),
            type: 2, // 转岗
            positionType: '',
            collegeId: '',
            familyId: '',
            groupId: '',
          },
        ],
      },
      familyType: null, // 选择负责单位最小单位的familyType值
      employeeInfo: null,
      responseComList: [],
      orgList: [],
      positionType: '',
    };
    this.state = assignUrlParams(initState, urlParams);
  }

  componentDidMount() {
    this.getData();
    this.getGroupList();
  }
  UNSAFE_componentWillReceiveProps(nextprops) {
    if (
      JSON.stringify(nextprops.user.listOrg.response) !==
      JSON.stringify(this.props.user.listOrg.response)
    ) {
      const responseComList = nextprops.user.listOrg.response.data || [];
      this.handleOrgList(3, responseComList);
      this.setState({ responseComList });
    }
  }
  onChangeCascader = (val, ops) => {
    if (ops && ops.length > 0) {
      const { familyType } = ops.slice(-1)[0];
      this.setState({ familyType });
    }
  };
  getData = () => {
    const { paramsObj } = this.state;
    this.props.dispatch({
      type: 'staff/getEmployeeInfo',
      payload: paramsObj,
    });
  };
  getGroupList = () => {
    this.props.dispatch({
      type: 'user/listOrg',
      payload: {},
    });
  };
  handleSearch = e => {
    e.preventDefault();
    const { validateFields } = this.props.form;
    validateFields((err, values) => {
      const { effectDate, positionType, cascader } = values;
      if (!effectDate || !positionType) {
        return;
      }
      const groupObj = {};
      const groupArr = ['collegeId', 'familyId', 'groupId'];
      const isNoPassGroup = this.disabledGroupType(positionType) === 0;
      groupArr.forEach((item, index) => {
        groupObj[item] = !isNoPassGroup ? cascader[index] || null : null;
      });
      const params = {
        positionType,
        effectDate: effectDate.format(dateFormat),
        ...groupObj,
      };
      if (isNoPassGroup) {
        params.familyType = null; // 当时admin,boss,others,时familyType为空
      }
      this.commitCreateJob(params);
    });
  };
  handleSelectChange = value => {
    this.props.form.setFieldsValue({ cascader: [] });
    const positionType = value;
    // this.handleOrgList(value);
    this.handleGroupLevel(value);
    this.setState({ positionType });
  };
  handleGroupLevel = groupType => {
    const level = this.disabledGroupType(groupType);
    if (level !== 0) {
      this.handleOrgList(level);
    }
  };
  handleOrgList = (leveNum = 3, dataScore = null) => {
    const { responseComList = [] } = this.state;
    const handleData = dataScore || responseComList.slice(0);
    const splitOrgList = data => {
      if (!data) {
        return;
      }
      const newData = [];
      for (let i = 0; i < data.length; i += 1) {
        const children = data[i];
        if (children.sub && children.sub.length > 0) {
          children.list = splitOrgList(children.sub);
        }
        children.list = children.level < leveNum ? children.list : null;
        newData.push(children);
      }
      return newData;
    };
    const orgList = splitOrgList(handleData);
    this.setState({ orgList });
  };

  commitCreateJob = (params = {}) => {
    const { commitParams, familyType } = this.state;
    const newObj = Object.assign(
      {},
      commitParams.kpiUserPositionLogList[0],
      { familyType },
      params
    );
    commitParams.kpiUserPositionLogList = [newObj];
    this.props.dispatch({
      type: 'staff/addTransferPost',
      payload: commitParams,
    });
  };
  backToList = () => {
    this.props.history.goBack();
  };
  disabledGroupType = (type = '') => {
    const obj = FRONT_ROLE_TYPE_LIST.find(item => item.id === type);
    return obj ? Number(obj.level) : 3;
  };
  render() {
    const { staff = {}, creatLoading } = this.props;
    const employeeInfo = staff.employeeInfo || {};
    const { orgList, positionType } = this.state;
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
                  {BaseUtils.removeMailSymbal(employeeInfo.mail)}
                </span>
              </li>
              <li>
                <span className={styles.labelText}>现任岗位:</span>
                <span className={styles.labelItem}>
                  {BaseUtils.returnGroupType(employeeInfo.userType)}
                </span>
              </li>
              <li>
                <span className={styles.labelText}>现任负责单位:</span>
                <span className={styles.labelItem}>
                  {employeeInfo.showName || BaseUtils.returnOrganization(employeeInfo.userType)}
                </span>
              </li>
              <li className={styles.marB_24}>
                <span className={styles.labelText}>*转岗日期:</span>
                <span className={styles.labelItem}>
                  <FormItem>
                    {getFieldDecorator('effectDate', {
                      initialValue: null,
                      rules: [{ required: true, message: '请选择生效日期' }],
                    })(datePicker)}
                  </FormItem>
                </span>
              </li>
              <li className={styles.marB_24}>
                <span className={styles.labelText}>*转岗后岗位:</span>
                <span className={styles.labelItem}>
                  <FormItem>
                    {getFieldDecorator('positionType', {
                      initialValue: positionType,
                      rules: [{ required: true, message: '请选择有效岗位' }],
                    })(
                      <Select
                        placeholder="---"
                        style={{ width: 230, height: 32 }}
                        onChange={this.handleSelectChange}
                      >
                        <Option value="" key={1}>
                          ---{' '}
                        </Option>
                        {BaseUtils.groupTypeObj.map(item => (
                          <Option value={item.id} key={item.id}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </span>
              </li>
              <li className={styles.marB_24}>
                <span className={styles.labelText}>转岗后负责单位:</span>
                <span className={styles.labelItem}>
                  <FormItem>
                    {getFieldDecorator('cascader', {
                      initialValue: [],
                      rules: [
                        {
                          required: this.disabledGroupType(positionType) !== 0,
                          message: '请选择有效负责单位',
                        },
                      ],
                    })(
                      <Cascader
                        options={orgList}
                        onChange={this.onChangeCascader}
                        fieldNames={{ label: 'name', value: 'id', children: 'list' }}
                        style={{ width: 230, height: 32 }}
                        disabled={this.disabledGroupType(positionType) === 0}
                      />
                    )}
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
const WrappedDynamicRule = Form.create()(CreateTransJob);
export default WrappedDynamicRule;
