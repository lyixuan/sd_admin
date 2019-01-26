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
    this.orgOptions = [];
    this.state = {
      collegeId: null,
      dateRange: [],
    };
    // 搜索还原
    const storageData = JSON.parse(sessionStorage.getItem('tempFrom'));
    if (storageData) {
      this.state.collegeId = storageData.collegeId ? storageData.collegeId : null;
      this.state.dateRange =
        storageData.dateRange.length > 0
          ? [moment(storageData.dateRange[0]), moment(storageData.dateRange[1])]
          : [];
    }
    this.initDate();
    sessionStorage.removeItem('tempFrom');
  }

  UNSAFE_componentWillMount() {
    const { propData } = this.props;
    this.listOrg = propData.college;
  }

  componentDidMount() {
    this.submitSearch(2);
  }

  // 刷新初始化
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { propData: propData2 } = this.props;
    const { propData } = nextProps;
    if (JSON.stringify(propData.college) !== JSON.stringify(propData2.college)) {
      this.listOrg = propData.college;
    }
  }
  initDate() {
    this.startT = moment(new Date()).subtract(1, 'months');
    this.endT = moment(new Date());
  }

  // 表单重置
  handleReset = () => {
    this.setState(
      {
        collegeId: null,
        dateRange: [],
      },
      () => {
        this.props.form.resetFields();
        this.submitSearch(1);
      }
    );
  };

  // 搜索数据整理
  submitSearch = rs => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const subParams = {};
        if (values.dateRange) {
          const m1 = values.dateRange[0] ? values.dateRange[0].clone() : undefined;
          const m2 = values.dateRange[1] ? values.dateRange[1].clone() : undefined;
          const beginDate = m1 ? m1.format('YYYY-MM-DD') : undefined;
          const endDate = m2 ? m2.format('YYYY-MM-DD') : undefined;
          subParams.beginDate = beginDate;
          subParams.endDate = endDate;
        }
        if (values.collegeId) {
          subParams.collegeId = values.collegeId;
        }
        if (rs === 1) {
          this.props.reset(subParams, values);
        } else {
          this.props.handleSearch(subParams, values, rs || 1);
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
          <Col span={8} style={{ textAlign: 'center' }}>
            <FormItem label="学 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;院">
              {getFieldDecorator('collegeId', {
                initialValue: this.state.collegeId,
              })(
                <Select placeholder="请选择" style={{ width: 230, height: 32 }} allowClear>
                  <Option value={null} key={null}>
                    全部
                  </Option>
                  {this.listOrg.map(item => (
                    <Option value={item.collegeId} key={item.collegeName}>
                      {item.collegeName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
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
