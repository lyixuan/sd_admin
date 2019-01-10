/* eslint-disable no-undef,no-param-reassign */
import React, { Component } from 'react';
import { Form, Input, Select, DatePicker, Modal, Radio } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { MonthPicker } = DatePicker;
const RadioGroup = Radio.Group;
let propsVal = '';

class AuditListForm extends Component {
  constructor(props) {
    super(props);
    this.isMonth = true;
    this.canSignResult = false;
    this.state = {
      quarter: '',
    };
  }

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
    console.log(propsVal);
    console.log(data);
    propsVal.form.setFieldsValue({
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

  // 联动更新数据和可用状态
  changeState = (val, lv) => {
    if (lv === 1) {
      propsVal.form.setFieldsValue({
        signResult: null,
      });
      if (val === '1') {
        // 待审核
        this.canSignResult = true;
      } else {
        this.canSignResult = false;
      }
    }
  };

  handleOk = () => {
    propsVal.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
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
        const params = {
          assessCyc: values.assessCyc,
          applyTimeParamStart,
          applyTimeParamEnd,
          signStatus: values.signStatus,
          signResult: values.signResult,
        };
        console.log(params);
        this.props.onOk(params);
      }
    });
  };

  handleCancel = () => {
    this.isMonth = true;
    this.canSignResult = false;
    this.setState({
      quarter: '',
    });
    propsVal.form.resetFields();
    this.props.onCancel();
  };

  render() {
    const ModalForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      const formLayout = 'inline';
      return (
        <Form layout={formLayout}>
          {this.props.modelType === 2 ? (
            <FormItem label="底表类型">
              {getFieldDecorator('bottomType', {
                initialValue: '1',
              })(
                <RadioGroup style={{ width: 230, height: 32 }}>
                  <Radio value={1}>报名底表</Radio>
                  <Radio value={2}>认证底表</Radio>
                </RadioGroup>
              )}
            </FormItem>
          ) : null}
          {this.props.modelType === 2 || this.props.modelType === 1 ? (
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
          ) : null}
          {(this.props.modelType === 1 || this.props.modelType === 2) && this.isMonth ? (
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
          ) : (this.props.modelType === 1 || this.props.modelType === 2) && !this.isMonth ? (
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
          ) : null}
          {this.props.modelType === 2 ? (
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
          ) : null}
          {this.props.modelType === 2 ? (
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
          ) : null}

          {/* 认证审核 */}
          {this.props.modelType === 3 ? (
            <FormItem label="姓 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名">
              {getFieldDecorator('name', {
                initialValue: '',
              })(<div style={{ width: 230, height: 32 }}>{this.props.record.name}</div>)}
            </FormItem>
          ) : null}
          {this.props.modelType === 3 ? (
            <FormItem label="认证项目">
              {getFieldDecorator('audit', {
                initialValue: '',
              })(<div style={{ width: 230, height: 32 }}>{this.props.record.orgName}</div>)}
            </FormItem>
          ) : null}
          {this.props.modelType === 3 ? (
            <FormItem label="认证审核">
              {getFieldDecorator('audit', {
                initialValue: '1',
              })(
                <RadioGroup style={{ width: 230, height: 32 }}>
                  <Radio value={1}>通过</Radio>
                  <Radio value={2}>不通过</Radio>
                </RadioGroup>
              )}
            </FormItem>
          ) : null}
        </Form>
      );
    });

    return (
      <Modal
        wrapClassName="audit"
        title={this.props.title}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <ModalForm style={{ margin: 'auto' }} />
      </Modal>
    );
  }
}

export default AuditListForm;
