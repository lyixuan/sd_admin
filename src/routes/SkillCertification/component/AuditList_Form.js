/* eslint-disable no-undef,no-param-reassign */
import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Select, Cascader, DatePicker } from 'antd';
import common from '../../Common/common.css';
import { deepCopy } from '../../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker } = DatePicker;

class AuditListForm extends Component {
  constructor(props) {
    super(props);
    this.listOrg = [];
    this.orgOptions = [];
    this.certificationList = [];
    this.canSignResult = false;
    this.canExamineStatus = false;
    this.canExamineResult = false;
    this.isMonth = true;
    const storageData = JSON.parse(sessionStorage.getItem('tempFrom'));
    if (storageData) {
      // todo
      sessionStorage.removeItem('tempFrom');
    }
    this.state = {
      quarter: '',
    };
  }

  // 根据props初始化
  UNSAFE_componentWillMount() {
    const { auditData } = this.props;
    this.listOrg = auditData.listOrg;
    this.certificationList = auditData.certificationList;
    this.handleSelectChange('college');
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
      this.handleSelectChange('college');
    }
    if (
      JSON.stringify(auditData.certificationList) !== JSON.stringify(auditData2.certificationList)
    ) {
      this.certificationList = auditData.certificationList;
    }
  }
  // 级联选级
  handleSelectChange = value => {
    this.props.form.setFieldsValue({
      orgList: [],
    });
    this.orgOptions = deepCopy(this.listOrg);
    if (value === 'college') {
      this.orgOptions.forEach(v => {
        delete v.children;
      });
    } else if (value === 'family') {
      this.orgOptions.forEach(item => {
        item.children.forEach(v => {
          delete v.children;
        });
      });
    }
  };
  // 联动更新数据和可用状态
  changeState = (val, lv) => {
    if (lv === 1) {
      this.props.form.setFieldsValue({
        signResult: null,
        examineStatus: null,
        examineResult: null,
      });
      if (val === '1') {
        // 待审核
        this.canSignResult = true;
        this.canExamineStatus = true;
        this.canExamineResult = true;
      } else {
        this.canSignResult = false;
        this.canExamineStatus = false;
        this.canExamineResult = false;
      }
    }
    if (lv === 2) {
      this.props.form.setFieldsValue({
        examineStatus: null,
        examineResult: null,
      });
      if (val === '2') {
        // 报名结果未通过
        this.canExamineStatus = true;
        this.canExamineResult = true;
      } else {
        this.canExamineStatus = false;
        this.canExamineResult = false;
      }
    }
    if (lv === 3) {
      this.props.form.setFieldsValue({
        examineResult: null,
      });
      if (val === '1') {
        // 报名结果未通过
        this.canExamineResult = true;
      } else {
        this.canExamineResult = false;
      }
    }
  };

  // 季度月度切换
  handleCycleChange = val => {
    if (val === '1') {
      this.isMonth = true;
    } else {
      this.isMonth = false;
      this.setState({
        quarter: '',
      });
    }
  };

  // 月度组件改造为季度组件
  quarterRender = data => {
    const a = data.month();
    if (a === 0) {
      // 0 1 2
      return <div style={{ textAlign: 'center' }}>第一季度(1-3)</div>;
    }
    if (a === 3) {
      // 3 4 5
      return <div style={{ textAlign: 'center' }}>第二季度(4-6)</div>;
    }
    if (a === 6) {
      // 6 7 8
      return <div style={{ textAlign: 'center' }}>第三季度(7-9)</div>;
    }
    if (a === 9) {
      // 9 10 11
      return <div style={{ textAlign: 'center' }}>第四季度(10-12)</div>;
    }
  };
  // input与季度组件结合使用
  checkQuarter = data => {
    this.props.form.setFieldsValue({
      quarterRange: data,
    });
    const y = data ? data.year() : '';
    const a = data ? data.month() : null;
    if (a === 0) {
      this.setState({
        quarter: `${y} 第一季度(1-3)`,
      });
    }
    if (a === 3) {
      this.setState({
        quarter: `${y} 第二季度(4-6)`,
      });
    }
    if (a === 6) {
      this.setState({
        quarter: `${y} 第三季度(7-9)`,
      });
    }
    if (a === 9) {
      this.setState({
        quarter: `${y} 第四季度(10-12)`,
      });
    }
  };
  // 表单重置
  handleReset = () => {
    this.canSignResult = false;
    this.canExamineStatus = false;
    this.canExamineResult = false;
    this.isMonth = true;
    this.setState({
      quarter: '',
    });
    this.props.form.resetFields();
    this.submitSearch();
  };

  // 搜索数据整理
  submitSearch = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let applyTimeParamStart = null;
        let applyTimeParamEnd = null;
        if (values.assessCyc === '1') {
          const m = values.monthRange ? values.monthRange.clone() : null;
          applyTimeParamStart = m ? m.format('YYYY-MM') : null;
          applyTimeParamEnd = m ? m.format('YYYY-MM') : null;
        } else if (values.assessCyc === '2') {
          const m = values.quarterRange ? values.quarterRange.clone() : null;
          applyTimeParamStart = m ? m.format('YYYY-MM') : null;
          applyTimeParamEnd = m ? m.add(2, 'month').format('YYYY-MM') : null;
        }
        const subParams = {
          orgType: values.orgType,
          collegeId: values.orgList[0] ? values.orgList[0] : null,
          familyId: values.orgList[1] ? values.orgList[1] : null,
          groupId: values.orgList[2] ? values.orgList[2] : null,
          name: values.name,
          assessCyc: values.assessCyc,
          applyTimeParamStart,
          applyTimeParamEnd,
          certificationItemId: values.certificationItemId,
          signStatus: values.signStatus,
          signResult: values.signResult,
          examineStatus: values.examineStatus,
          examineResult: values.examineResult,
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
            <FormItem label="级 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别">
              {getFieldDecorator('orgType', {
                initialValue: 'college',
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
              {getFieldDecorator('orgList', {
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
                      if (reg.length > 56) {
                        callback({ message: '姓名最长为56个字符!' });
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
        <Row gutter={24} style={{ height: 54 }}>
          <Col span={8}>
            <FormItem label="考核周期">
              {getFieldDecorator('assessCyc', {
                initialValue: '1',
              })(
                <Select
                  placeholder="请选择考核周期"
                  style={{ width: 230, height: 32 }}
                  onChange={val => this.handleCycleChange(val)}
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
            {this.isMonth ? (
              <FormItem label="报名月份">
                {getFieldDecorator('monthRange', {
                  initialValue: null,
                })(
                  <MonthPicker
                    placeholder="选择月份"
                    format="YYYY-MM"
                    style={{ width: 230, height: 32 }}
                  />
                )}
              </FormItem>
            ) : (
              <FormItem label="报名季度">
                {getFieldDecorator('quarterRange', {
                  initialValue: null,
                })(
                  <div>
                    <Input
                      style={{ width: 230, height: 32 }}
                      value={this.state.quarter}
                      placeholder="选择季度"
                      readOnly
                    />
                    <MonthPicker
                      allowClear={false}
                      className="audit"
                      dropdownClassName="audit"
                      placeholder=""
                      onChange={(data, str) => this.checkQuarter(data, str)}
                      monthCellContentRender={this.quarterRender}
                      style={{
                        width: 230,
                        height: 32,
                        position: 'absolute',
                        left: 0,
                        zIndex: '1',
                        top: 4,
                      }}
                    />
                  </div>
                )}
              </FormItem>
            )}
          </Col>
          <Col span={8}>
            <FormItem label="认证项目">
              {getFieldDecorator('certificationItemId', {
                initialValue: null,
              })(
                <Select placeholder="请选择认证项目" style={{ width: 230, height: 32 }} allowClear>
                  {this.certificationList.map(item => (
                    <Option value={item.id} key={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24} style={{ height: 54 }}>
          <Col span={8}>
            <FormItem label="报名状态">
              {getFieldDecorator('signStatus', {
                initialValue: null,
              })(
                <Select
                  placeholder="请选择报名状态"
                  style={{ width: 230, height: 32 }}
                  onChange={value => {
                    this.changeState(value, 1);
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
              {getFieldDecorator('signResult', {
                initialValue: null,
              })(
                <Select
                  placeholder="请选择报名结果"
                  style={{ width: 230, height: 32 }}
                  onChange={value => {
                    this.changeState(value, 2);
                  }}
                  disabled={this.canSignResult}
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
        <Row gutter={24} style={{ height: 54 }}>
          <Col span={8}>
            <FormItem label="认证状态">
              {getFieldDecorator('examineStatus', {
                initialValue: null,
              })(
                <Select
                  placeholder="请选择认证状态"
                  style={{ width: 230, height: 32 }}
                  onChange={value => {
                    this.changeState(value, 3);
                  }}
                  disabled={this.canExamineStatus}
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
              {getFieldDecorator('examineResult', {
                initialValue: null,
              })(
                <Select
                  placeholder="请选择认证结果"
                  style={{ width: 230, height: 32 }}
                  disabled={this.canExamineResult}
                >
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
