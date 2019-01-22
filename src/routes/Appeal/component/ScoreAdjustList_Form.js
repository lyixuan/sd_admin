/* eslint-disable no-undef,no-param-reassign,guard-for-in */
import React, { Component } from 'react';
import { Form, Button, Row, Col, Select, DatePicker } from 'antd';
import moment from 'moment/moment';
import common from '../../Common/common.css';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

class AuditListForm extends Component {
  constructor(props) {
    super(props);
    this.listOrg = [];
    this.orgOptions = [];
    this.certificationList = [];
    this.state = {
      orgId: null,
      dateRange: [],
    };
    // 搜索还原
    const storageData = JSON.parse(sessionStorage.getItem('tempFrom'));
    if (storageData) {
      sessionStorage.removeItem('tempFrom');
    }
    this.initDate();
  }

  // 根据props初始化
  // UNSAFE_componentWillMount() {
  //   const { auditData } = this.props;
  //   this.listOrg = auditData.listOrg;
  //   this.certificationList = auditData.certificationList;
  // }

  componentDidMount() {
    this.submitSearch();
  }

  // 刷新初始化
  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   const { auditData: auditData2 } = this.props;
  //   const { auditData } = nextProps;
  //   if (JSON.stringify(auditData.listOrg) !== JSON.stringify(auditData2.listOrg)) {
  //     this.listOrg = auditData.listOrg;
  //   }
  //   if (
  //     JSON.stringify(auditData.certificationList) !== JSON.stringify(auditData2.certificationList)
  //   ) {
  //     this.certificationList = auditData.certificationList;
  //   }
  // }
  initDate() {
    this.startT = moment(new Date()).subtract(1, 'months');
    this.endT = moment(new Date());
  }

  // 表单重置
  handleReset = () => {
    this.props.form.resetFields();
    this.submitSearch(1);
  };

  // 搜索数据整理
  submitSearch = rs => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const subParams = {};
        if (values.dateRange) {
          const m1 = values.dateRange[0] ? values.dateRange[0].clone() : null;
          const m2 = values.dateRange[1] ? values.dateRange[1].clone() : null;
          const beginDate = m1 ? m1.format('YYYY-MM-DD') : null;
          const endDate = m2 ? m2.format('YYYY-MM-DD') : null;
          subParams.beginDate = beginDate;
          subParams.endDate = endDate;
        }
        subParams.collegeId = values.collegeId;
        if (rs === 1) {
          this.props.reset(subParams);
        } else {
          this.props.handleSearch(subParams, values);
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formLayout = 'inline';
    return (
      <Form layout={formLayout}>
        <Row gutter={24}>
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
              {getFieldDecorator('orgId', {
                initialValue: this.state.orgId,
              })(
                <Select placeholder="请选择" style={{ width: 230, height: 32 }} allowClear>
                  <Option value={null} key={null}>
                    全部
                  </Option>
                  {this.certificationList.map(item => (
                    <Option value={item.id} key={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
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
