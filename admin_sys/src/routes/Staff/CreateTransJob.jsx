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
      //   const { effectDate, positionType } = values;
      console.log(values);
    });
  };
  handleSelectChange = value => {
    const { commitParams } = this.state;
    commitParams.kpiUserPositionLogList.positionType = value;
    this.handleOrgList(value);
    this.setState({ commitParams });
  };
  handleOrgList = groupType => {
    console.log(groupType);
    const { responseComList } = this.state;
    const splitOrgList = data => {
      if (!data) {
        return;
      }
      for (let i = 0; i < data.length; i += 1) {
        const children = data[i];
        if (children.sub && children.sub.length > 0) {
          if (children.level <= 1) {
            splitOrgList(children.sub);
          } else {
            children.sub = [];
          }
        }

        return data;
      }
    };
    console.log(splitOrgList(responseComList));
  };

  backToList = () => {
    this.props.history.goBack();
  };
  render() {
    console.log(this.props.user);
    const employeeInfo = this.state.employeeInfo || {};
    const { commitParams, responseComList } = this.state;
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
                      initialValue: null,
                      rules: [],
                    })(
                      <Cascader
                        options={responseComList}
                        fieldNames={{ label: 'name', value: 'id', children: 'sub' }}
                        style={{ width: 280 }}
                        // disabled={flag === 'others' ? disabled : false}
                      />
                    )}
                  </FormItem>
                </span>
              </li>
            </ul>
          </Form>

          <div className={styles.tableConent}>
            <Button onClick={this.backToList} type="primary" className={common.cancleButton}>
              取消
            </Button>
            <Button
              onClick={this.handleSearch}
              type="primary"
              className={common.submitButton}
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
