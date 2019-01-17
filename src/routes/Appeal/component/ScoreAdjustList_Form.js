/* eslint-disable no-undef,no-param-reassign,guard-for-in */
import React, { Component } from 'react';
import { Form, Button, Row, Col, Cascader, DatePicker } from 'antd';
import moment from 'moment/moment';
import common from '../../Common/common.css';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class AuditListForm extends Component {
  constructor(props) {
    super(props);
    this.listOrg = [];
    this.orgOptions = [];
    this.certificationList = [];
    this.state = {
      dateRange: [],
    };
    // 搜索还原
    const storageData = JSON.parse(sessionStorage.getItem('tempFrom'));
    if (storageData) {
      for (const key in storageData) {
        if (key === 'monthRange' || key === 'quarterRange') {
          this.state[key] = moment(storageData[key]);
        } else {
          this.state[key] = storageData[key];
        }
      }
      sessionStorage.removeItem('tempFrom');
    }
    this.initDate();
  }

  // 根据props初始化
  UNSAFE_componentWillMount() {
    const { auditData } = this.props;
    this.listOrg = auditData.listOrg;
    this.certificationList = auditData.certificationList;
  }

  componentDidMount() {
    this.submitSearch();
  }

  // 刷新初始化
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { auditData: auditData2 } = this.props;
    const { auditData } = nextProps;
    if (JSON.stringify(auditData.listOrg) !== JSON.stringify(auditData2.listOrg)) {
      this.listOrg = auditData.listOrg;
    }
    if (
      JSON.stringify(auditData.certificationList) !== JSON.stringify(auditData2.certificationList)
    ) {
      this.certificationList = auditData.certificationList;
    }
  }
  initDate() {
    this.startT = moment(new Date()).subtract(1, 'months');
    this.endT = moment(new Date());
  }

  // 表单重置
  handleReset = () => {
    this.props.form.resetFields();
    this.submitSearch();
  };

  // 搜索数据整理
  submitSearch = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // let applyTimeParamStart = null;
        // let applyTimeParamEnd = null;
        // if (values.assessCyc === 1) {
        //   const m = values.monthRange ? values.monthRange.clone() : null;
        //   applyTimeParamStart = m ? m.format('YYYY-MM') : null;
        //   applyTimeParamEnd = m ? m.format('YYYY-MM') : null;
        // } else if (values.assessCyc === 2) {
        //   const m = values.quarterRange ? values.quarterRange.clone() : null;
        //   applyTimeParamStart = m ? m.format('YYYY-MM') : null;
        //   applyTimeParamEnd = m ? m.add(2, 'month').format('YYYY-MM') : null;
        // }
        const subParams = {
          // orgType: values.orgType,
          // collegeId: values.orgList[0] ? values.orgList[0] : null,
          // familyId: values.orgList[1] ? values.orgList[1] : null,
          // groupId: values.orgList[2] ? values.orgList[2] : null,
          // name: values.name,
          // assessCyc: values.assessCyc,
          // applyTimeParamStart,
          // applyTimeParamEnd,
          // certificationItemId: values.certificationItemId,
          // signStatus: values.signStatus,
          // signResult: values.signResult,
          // examineStatus: values.examineStatus,
          // examineResult: values.examineResult,
        };
        this.props.handleSearch(subParams, values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formLayout = 'inline';
    return (
      <Form layout={formLayout}>
        <Row gutter={24} style={{ height: 54 }}>
          <Col span={8}>
            <FormItem label="学分日期">
              {getFieldDecorator('dateRange', {
                initialValue: this.state.dateRange,
              })(
                <RangePicker
                  allowClear={false}
                  defaultPickerValue={[this.startT, this.endT]}
                  style={{ width: 250, height: 32 }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="学 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;院">
              {getFieldDecorator('orgList', {
                initialValue: this.state.orgList,
              })(<Cascader options={this.listOrg} style={{ width: 230 }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              <div style={{ width: 300, textAlign: 'right' }}>
                <Button
                  htmlType="submit"
                  type="primary"
                  onClick={this.submitSearch}
                  className={common.searchButton}
                >
                  搜 索
                </Button>
                <Button onClick={this.handleReset} type="primary" className={common.resetButton}>
                  重 置
                </Button>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default AuditListForm;
