import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Select, DatePicker, Cascader, Radio } from 'antd';
import moment from 'moment';
import { assignUrlParams } from 'utils/utils';
import ConfirmModal from 'selfComponents/ConfirmModal';
import BaseUtils from './BaseUtils';
import ContentLayout from '../../layouts/ContentLayout';
import common from '../Common/common.css';
import styles from './styles/index.less';

const FRONT_ROLE_TYPE_LIST = window.Filter('FRONT_ROLE_TYPE_LIST');
const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
@connect(({ staff, user, loading }) => ({
  staff,
  user,
  loading: loading.effects['staff/getStaffDetail'],
  creatLoading: loading.effects['staff/updateTransferPost'],
}))
class EditTransJob extends Component {
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
            positionType: '',
            collegeId: '',
            familyId: '',
            groupId: '',
          },
        ],
      },
      employeeInfo: null,
      responseComList: [],
      orgList: [],
      positionType: '', // 岗位
      effectDate: null, // 转岗时间
      canceled: 1, // 是否撤销此次操作,1否,0是
      groupList: [], // 负责单位
      familyType: null, // 选择负责单位最小单位的familyType值
      isShowModal: false,
    };
    this.state = assignUrlParams(initState, urlParams);
  }

  componentDidMount() {
    this.getData();
    this.getGroupList();
    this.initParams();
  }
  UNSAFE_componentWillReceiveProps(nextprops) {
    if (
      JSON.stringify(nextprops.staff.employeeInfo) !== JSON.stringify(this.props.staff.employeeInfo)
    ) {
      const employeeInfo = nextprops.staff.employeeInfo || {};
      const kpiUserPositionLogList = employeeInfo.kpiUserPositionLogList || [];
      const kpiUserPositionObj = kpiUserPositionLogList[0] || {};
      this.initParams(kpiUserPositionObj);
    }
    if (
      JSON.stringify(nextprops.user.listOrg.response) !==
      JSON.stringify(this.props.user.listOrg.response)
    ) {
      const { positionType } = this.state;
      const responseComList = nextprops.user.listOrg.response.data || [];
      this.handleOrgList(positionType, responseComList);
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
  initParams = obj => {
    const employeeInfo = this.props.staff.employeeInfo || {};
    const kpiUserPositionLogList = employeeInfo.kpiUserPositionLogList || [];
    const kpiUserPositionObj = kpiUserPositionLogList[0] || {};
    const { collegeId, familyId, groupId, effectDate, positionType, canceled } =
      obj || kpiUserPositionObj;
    const groupList = [collegeId, familyId, groupId].filter(item => item);
    this.setState({
      canceled,
      effectDate,
      positionType,
      groupList,
    });
  };
  handleSearch = e => {
    e.preventDefault();
    const { validateFields } = this.props.form;
    validateFields((err, values) => {
      const { effectDate, positionType, cascader, canceled } = values;
      if (canceled !== 1) {
        if (!effectDate || !positionType) {
          return;
        }
      }

      const groupObj = {};
      const groupArr = ['collegeId', 'familyId', 'groupId'];
      const isNoPassGroup = this.disabledGroupType(positionType) === 0;
      groupArr.forEach((item, index) => {
        groupObj[item] = !isNoPassGroup ? cascader[index] || null : null;
      });
      const params = {
        canceled,
        positionType,
        effectDate: effectDate ? effectDate.format(dateFormat) : null,
        ...groupObj,
      };
      if (isNoPassGroup) {
        params.familyType = null; // 当时admin,boss,others,时familyType为空
      }
      if (canceled === 1) {
        // 当撤销此次操作的时候讲 数据存储,并弹框,否的话直接交互
        const isShowModal = canceled === 1;
        this.setState({ canceled, isShowModal });
        this.saveCommitParams(params);
      } else {
        this.commitCreateJob(params);
      }
    });
  };

  handleSelectChange = value => {
    const positionType = value;
    // this.handleOrgList(value);
    this.props.form.setFieldsValue({ cascader: [] });
    this.handleOrgList(value);
    this.setState({ positionType });
  };
  handleOrgList = (type = '', dataScore = null) => {
    const { responseComList = [] } = this.state;
    const leveNum = this.disabledGroupType(type);
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

  showModal = bol => {
    this.setState({ isShowModal: bol });
  };
  changeVideo = e => {
    const canceled = e.target.value;
    let { effectDate } = this.state;
    const { positionType, groupList } = this.state;
    effectDate = effectDate ? moment(effectDate) : null;
    this.props.form.setFieldsValue({ effectDate, positionType, cascader: groupList });
    this.setState({ canceled });
  };
  clickOK = () => {
    this.commitCreateJob();
  };
  saveCommitParams = (params = {}) => {
    const { commitParams, familyType } = this.state;
    const newObj = Object.assign(
      {},
      commitParams.kpiUserPositionLogList[0],
      { familyType },
      params
    );
    commitParams.kpiUserPositionLogList = [newObj];
    this.setState({ commitParams });
  };
  commitCreateJob = (params = {}) => {
    const { commitParams, familyType } = this.state;
    const familyTypeObj = familyType === null ? {} : { familyType };
    const employeeInfo = this.props.staff.employeeInfo || {};
    const kpiUserPositionLogList = employeeInfo.kpiUserPositionLogList || [];
    const kpiUserPositionObj = kpiUserPositionLogList[0] || {};
    const newObj = Object.assign(
      {},
      kpiUserPositionObj,
      commitParams.kpiUserPositionLogList[0],
      familyTypeObj,
      params
    );
    commitParams.kpiUserPositionLogList = [newObj];
    this.props.dispatch({
      type: 'staff/updateTransferPost',
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
    const { orgList, positionType, canceled, isShowModal, effectDate, groupList } = this.state;
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
              <li>
                <span className={styles.labelText}>*转岗日期:</span>
                <span className={styles.labelItem}>
                  <FormItem>
                    {getFieldDecorator('effectDate', {
                      initialValue: moment(effectDate),
                      rules: [{ required: canceled !== 1, message: '请选择生效日期' }],
                    })(datePicker)}
                  </FormItem>
                </span>
              </li>
              <li>
                <span className={styles.labelText}>*转岗后岗位:</span>
                <span className={styles.labelItem}>
                  <FormItem>
                    {getFieldDecorator('positionType', {
                      initialValue: positionType,
                      rules: [{ required: canceled !== 1, message: '请选择有效岗位' }],
                    })(
                      <Select
                        placeholder="---"
                        disabled={canceled === 1}
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
              <li>
                <span className={styles.labelText}>转岗后负责单位:</span>
                <span className={styles.labelItem}>
                  <FormItem>
                    {getFieldDecorator('cascader', {
                      initialValue: groupList,
                      rules: [
                        {
                          required: canceled !== 1 && this.disabledGroupType(positionType) !== 0,
                          message: '请选择有效负责单位',
                        },
                      ],
                    })(
                      <Cascader
                        options={orgList}
                        onChange={this.onChangeCascader}
                        fieldNames={{ label: 'name', value: 'id', children: 'list' }}
                        style={{ width: 230, height: 32 }}
                        disabled={this.disabledGroupType(positionType) === 0 || canceled === 1}
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
          <ConfirmModal visible={isShowModal} showModal={this.showModal} clickOK={this.clickOK}>
            <p style={{ marginTop: '20px' }}>您即将撤销{employeeInfo.name}的转岗,请确认.</p>
          </ConfirmModal>
        </div>
      </ContentLayout>
    );
  }
}
const WrappedDynamicRule = Form.create()(EditTransJob);
export default WrappedDynamicRule;
