/* eslint-disable no-undef,no-param-reassign */
import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Select, Cascader, DatePicker } from 'antd';
import common from '../../Common/common.css';
import { deepCopy } from '../../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker } = DatePicker;
let responseComList = [];
let responseComListBackup = [];

class AuditListForm extends Component {
  constructor(props) {
    super(props);
    this.orgOptions = [];
    this.state = {
      level: 'college',
      state1: '0',
      state2: '0',
      state3: '0',
      state4: '0',
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { auditData: auditData2 } = this.props;
    const { auditData } = nextProps;
    if (JSON.stringify(auditData.listOrg) !== JSON.stringify(auditData2.listOrg)) {
      this.listOrg = auditData.listOrg;
      this.handleSelectChange('college');
    }
  };
  handleSelectChange = value => {
    this.orgOptions = deepCopy(this.listOrg);
    if (value === 'college') {
      this.orgOptions.forEach((v) => {
        delete v.children;
      });
    } else if (value === 'family') {
      this.orgOptions.forEach((item) => {
        item.children.forEach((v)=>{
          delete v.children;
        })
      });
    }
  };

  changeState = lv => {
    if (lv === 1) {
      this.props.form.setFieldsValue({
        applyResult: '0',
        certifiState: '0',
        certifiResult: '0',
      });
    }
    if (lv === 2) {
      this.props.form.setFieldsValue({
        certifiState: '0',
        certifiResult: '0',
      });
    }
    if (lv === 3) {
      this.props.form.setFieldsValue({
        certifiResult: '0',
      });
    }
  };

  handleCycleChange = () => {};

  // 表单重置
  handleReset = () => {
    propsVal.form.resetFields();
    this.props.setRouteUrlParams('/skillCertification/auditList');
    this.getData({ size: 30, number: 0 });
  };

  submitSearch = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        this.props.handleSearch(values, '');
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formLayout = 'inline';
    const { level, state1, state2, state3, state4 } = this.state;
    responseComListBackup = !this.state.listOrgList ? [] : this.fullListFun(this.state.listOrgList);
    responseComList =
      !responseComList || responseComList.length === 0 ? responseComListBackup : responseComList;
    return (
      <Form layout={formLayout}>
        <Row gutter={24} style={{ height: 50 }}>
          <Col span={8}>
            <FormItem label="级 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别">
              {getFieldDecorator('level', {
                initialValue: level,
              })(
                <Select
                  placeholder="请选择级别"
                  style={{ width: 230, height: 32 }}
                  onChange={this.handleSelectChange}
                >
                  {BI_Filter('USER_LEVEL').map(item => (
                    <Option value={item.id} key={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="组 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;织">
              {getFieldDecorator('responseCom', {
                initialValue: [],
              })(<Cascader options={this.orgOptions} style={{ width: 230 }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="姓 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名">
              {getFieldDecorator('name', {
                initialValue: '',
                rules: [
                  {
                    validator(rule, value, callback) {
                      const reg = !value ? '' : value.replace(/(^\s*)|(\s*$)/g, '');
                      if (reg.length > 50) {
                        callback({ message: '姓名最长为50个字符!' });
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              })(<Input placeholder="请输入姓名" style={{ width: 230, height: 32 }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24} style={{ height: 50 }}>
          <Col span={8}>
            <FormItem label="考核周期">
              {getFieldDecorator('abc', {
                initialValue: '1',
              })(
                <Select
                  placeholder="请选择考核周期"
                  style={{ width: 230, height: 32 }}
                  onChange={this.handleCycleChange}
                >
                  {BI_Filter('CHECK_CYCLE').map(item => (
                    <Option value={item.id} key={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="报名月份">
              {getFieldDecorator('month', {
                initialValue: null,
              })(
                <MonthPicker
                  placeholder="选择月份"
                  format="YYYY-MM"
                  style={{ width: 230, height: 32 }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="认证项目">
              {getFieldDecorator('name', {
                initialValue: '',
                rules: [
                  {
                    validator(rule, value, callback) {
                      const reg = !value ? '' : value.replace(/(^\s*)|(\s*$)/g, '');
                      if (reg.length > 50) {
                        callback({ message: '姓名最长为50个字符!' });
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              })(
                <Select placeholder="请选择认证项目" style={{ width: 230, height: 32 }}>
                  {BI_Filter('CHECK_CYCLE').map(item => (
                    <Option value={item.id} key={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24} style={{ height: 50 }}>
          <Col span={8}>
            <FormItem label="报名状态">
              {getFieldDecorator('applyState', {
                initialValue: state1,
              })(
                <Select
                  placeholder="请选择报名状态"
                  style={{ width: 230, height: 32 }}
                  onChange={() => {
                    this.changeState(1);
                  }}
                >
                  {BI_Filter('APPLY_STATE').map(item => (
                    <Option value={item.id} key={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="报名结果">
              {getFieldDecorator('applyResult', {
                initialValue: state2,
              })(
                <Select
                  placeholder="请选择报名结果"
                  style={{ width: 230, height: 32 }}
                  onChange={() => {
                    this.changeState(2);
                  }}
                >
                  {BI_Filter('APPLY_RESULT').map(item => (
                    <Option value={item.id} key={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>&nbsp;</Col>
        </Row>
        <Row gutter={24} style={{ height: 50 }}>
          <Col span={8}>
            <FormItem label="认证状态">
              {getFieldDecorator('certifiState', {
                initialValue: state3,
              })(
                <Select
                  placeholder="请选择认证状态"
                  style={{ width: 230, height: 32 }}
                  onChange={() => {
                    this.changeState(3);
                  }}
                >
                  {BI_Filter('CERTIFICATION_STATE').map(item => (
                    <Option value={item.id} key={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="认证结果">
              {getFieldDecorator('certifiResult', {
                initialValue: state4,
              })(
                <Select placeholder="请选择认证结果" style={{ width: 230, height: 32 }}>
                  {BI_Filter('CERTIFICATION_RESULT').map(item => (
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
