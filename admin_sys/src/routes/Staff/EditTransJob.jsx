import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Select, DatePicker, Cascader, Radio } from 'antd';
import { assignUrlParams } from 'utils/utils';
import { BaseUtils } from './BaseUtils';
import ContentLayout from '../../layouts/ContentLayout';
import common from '../Common/common.css';
import styles from './styles/index.less';

const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;
const RadioGroup = Radio.Group;
@connect(({ staff, user, loading }) => ({
  staff,
  user,
  loading: loading.effects['staff/getStaffDetail'],
  creatLoading: loading.effects['staff/addTransferPost'],
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
            type: 2, // 转岗
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
      positionType: '',
      canceled: 1, // 是否撤销此次操作,1否,0是
    };
    this.state = assignUrlParams(initState, urlParams);
    this.baseUtils = new BaseUtils();
  }

  componentDidMount() {
    this.getData();
    this.getGroupList();
  }
  componentWillReceiveProps(nextprops) {
    if (
      JSON.stringify(nextprops.user.listOrg.response) !==
      JSON.stringify(this.props.user.listOrg.response)
    ) {
      const responseComList = nextprops.user.listOrg.response.data || [];
      this.handleOrgList(3, responseComList);
      this.setState({ responseComList });
    }
  }
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
      groupArr.forEach((item, index) => {
        groupObj[item] = cascader[index] || null;
      });
      const params = {
        positionType,
        effectDate: effectDate.format(dateFormat),
        ...groupObj,
      };
      this.commitCreateJob(params);
    });
  };
  handleSelectChange = value => {
    const positionType = value;
    // this.handleOrgList(value);
    this.handleGroupLevel(value);
    this.setState({ positionType });
  };
  handleGroupLevel = groupType => {
    switch (groupType) {
      case 'college':
        this.handleOrgList(1);
        break;
      case 'family':
        this.handleOrgList(2);
        break;
      case 'class':
        this.handleOrgList(3);
        break;
      case 'group':
        this.handleOrgList(3);
        break;
      case 'others':
        break;
      default:
        this.handleOrgList(3);
        break;
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
  ChangeAudio = e => {
    const canceled = e.target.value;
    this.setState({ canceled });
  };
  commitCreateJob = (params = {}) => {
    const { commitParams } = this.state;
    const newObj = Object.assign({}, commitParams.kpiUserPositionLogList[0], params);
    commitParams.kpiUserPositionLogList = [newObj];
    this.props.dispatch({
      type: 'staff/addTransferPost',
      payload: commitParams,
    });
  };
  backToList = () => {
    this.props.history.goBack();
  };
  render() {
    const { staff = {}, creatLoading } = this.props;
    const employeeInfo = staff.employeeInfo || {};
    const { orgList, positionType, canceled } = this.state;
    const { FormItem, groupTypeObj } = this.baseUtils;
    const { getFieldDecorator } = this.props.form;
    const datePicker = (
      <DatePicker
        disabled={canceled === 0}
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
                      <RadioGroup onChange={this.ChangeAudio}>
                        <Radio value={0}>是</Radio>
                        <Radio value={1}>否</Radio>
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
                      initialValue: null,
                      rules: [{ required: true, message: '请选择生效日期' }],
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
                      rules: [{ required: true, message: '请选择有效岗位' }],
                    })(
                      <Select
                        placeholder="---"
                        disabled={canceled === 0}
                        style={{ width: 230, height: 32 }}
                        onChange={this.handleSelectChange}
                      >
                        <Option value="" key={1}>
                          ---{' '}
                        </Option>
                        {Object.keys(groupTypeObj).map(item => (
                          <Option value={item} key={item}>
                            {groupTypeObj[item]}
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
                      initialValue: [],
                    })(
                      <Cascader
                        options={orgList}
                        // onChange={this.onChangeCascader}
                        fieldNames={{ label: 'name', value: 'id', children: 'list' }}
                        style={{ width: 230, height: 32 }}
                        disabled={positionType === 'others' || canceled === 0}
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
const WrappedDynamicRule = Form.create()(EditTransJob);
export default WrappedDynamicRule;
