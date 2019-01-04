/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Select, Cascader, DatePicker } from 'antd';
import common from '../../routes/Common/common.css';

const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker } = DatePicker;
let responseComList = [];
let responseComListBackup = [];

class AuditListForm extends Component {
  constructor(props) {
    super(props);
    const { listOrg = {} } = this.props.propsData.user;
    const listOrgValues = !listOrg.response
      ? []
      : !listOrg.response.data ? [] : listOrg.response.data;
    this.state = {
      level: 'college',
      state1: '0',
      state2: '0',
      state3: '0',
      state4: '0',
      listOrgList: listOrgValues || [],
    };
  }

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

  fullListFun = val => {
    const value = [];
    val.map(item => {
      const firstChldren = [];
      const chldren1 = item.sub;
      chldren1.map(obj => {
        const chldren2 = obj.sub;
        const secondChldren = [];
        chldren2.map(list => {
          secondChldren.push({
            value: list.id,
            label: list.name,
            level: list.level,
          });
          return 0;
        });
        firstChldren.push({
          value: obj.id,
          label: obj.name,
          level: obj.level,
          children: secondChldren,
        });
        return 0;
      });
      value.push({
        value: item.id,
        label: item.name,
        level: item.level,
        children: firstChldren,
      });
      return 0;
    });
    return value;
  };

  handleCycleChange = () => {};
  handleSelectChange = value => {
    const responseValue = [];
    const { listOrg = {} } = this.props.propsData.user;
    const listOrgValues = !listOrg.response
      ? []
      : !listOrg.response.data ? [] : listOrg.response.data;
    responseComListBackup = !listOrgValues ? [] : this.fullListFun(listOrgValues);
    const newResponseComList = listOrgValues;

    if (value === 'family') {
      newResponseComList.map(item => {
        const firstChldren = [];
        const chldren1 = item.sub;
        chldren1.map(val => {
          firstChldren.push({
            value: val.id,
            label: val.name,
            level: val.level,
          });
          return 0;
        });
        responseValue.push({
          value: item.id,
          label: item.name,
          level: item.level,
          children: firstChldren,
        });
        return 0;
      });
    } else if (value === 'college') {
      newResponseComList.map(item => {
        responseValue.push({
          value: item.id,
          label: item.name,
          level: item.level,
        });
        return 0;
      });
    }
    responseComList = responseValue.length === 0 ? responseComListBackup : responseValue;
  };

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
              })(<Cascader options={responseComList} style={{ width: 230 }} />)}
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
