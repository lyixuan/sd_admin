import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Select, DatePicker, Cascader } from 'antd';
import { assignUrlParams } from 'utils/utils';
// import { moment } from 'moment';
import { BaseUtils } from './BaseUtils';
import ContentLayout from '../../layouts/ContentLayout';
import common from '../Common/common.css';
import styles from './styles/index.less';

const dateFormat = 'YYYY-MM-DD';
const { Option } = Select;
@connect(({ staff, user, loading }) => ({
  staff,
  user,
  loading: loading.effects['staff/getStaffDetail'],
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
      commitParams: null,
      employeeInfo: null,
      responseComList: [],
      orgList: [],
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
      JSON.stringify(nextprops.staff.employeeInfo) !== JSON.stringify(this.props.staff.employeeInfo)
    ) {
      const { employeeInfo } = nextprops.staff;
      const commitParams = this.initCommitParams(employeeInfo);
      this.setState({ employeeInfo, commitParams });
    }
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
  selectedOrgData = () => {};
  initCommitParams = employeeInfo => {
    const { id } = employeeInfo;
    return {
      id,
      kpiUserPositionLogList: [
        {
          userId: id,
          type: 2, // 转岗
          positionType: '',
        },
      ],
    };
  };
  handleSearch = e => {
    e.preventDefault();
    const { validateFields } = this.props.form;
    validateFields((err, values) => {
      // const { effectDate, positionType } = values;
      console.log(values);
    });
  };
  handleSelectChange = value => {
    const { commitParams } = this.state;
    commitParams.kpiUserPositionLogList.positionType = value;
    // this.handleOrgList(value);
    this.handleGroupLevel(value);
    this.setState({ commitParams });
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
          children.list = children.level < leveNum ? splitOrgList(children.sub) : [];
          newData.push(children);
        }
      }

      return newData;
    };
    const orgList = splitOrgList(handleData);
    this.setState({ orgList });
  };

  backToList = () => {
    this.props.history.goBack();
  };
  render() {
    const employeeInfo = this.state.employeeInfo || {};
    const { commitParams, orgList } = this.state;
    const kpiUserPositionLogList = commitParams ? commitParams.kpiUserPositionLogList : {};
    const { FormItem, groupTypeObj } = this.baseUtils;
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
              <li>
                <span className={styles.labelText}>*转岗日期:</span>
                <span className={styles.labelItem}>
                  <FormItem>
                    {getFieldDecorator('effectDate', {
                      initialValue: null,
                      rules: [{ required: true, message: '请选择生效开始日期' }],
                    })(datePicker)}
                  </FormItem>
                </span>
              </li>
              <li>
                <span className={styles.labelText}>*转岗后岗位:</span>
                <span className={styles.labelItem}>
                  <FormItem>
                    {getFieldDecorator('positionType', {
                      initialValue: commitParams ? commitParams.positionType : '',
                      rules: [{ required: true, message: '请选择生效开始日期' }],
                    })(
                      <Select
                        placeholder="---"
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
                    {getFieldDecorator('responseCom', {
                      initialValue: [101, 502],
                    })(
                      <Cascader
                        options={orgList}
                        fieldNames={{ label: 'name', value: 'id', children: 'list' }}
                        style={{ width: 230, height: 32 }}
                        disabled={kpiUserPositionLogList.positionType === 'others'}
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
              // loading={submit}
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
