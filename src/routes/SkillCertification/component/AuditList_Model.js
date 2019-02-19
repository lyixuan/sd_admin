/* eslint-disable no-undef,no-param-reassign,no-unused-expressions */
import React, { Component } from 'react';
import { Form, Input, Select, DatePicker, Modal, Radio } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { MonthPicker } = DatePicker;
const RadioGroup = Radio.Group;
let propsVal = '';
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

class AuditListForm extends Component {
  constructor(props) {
    super(props);
    this.isMonth = true;
    this.canCycle = true;
    this.quarter = '';
    this.canSignResult = false;
    this.canSignState = false;
    this.state = {};
  }

  // 季度月度切换
  handleCycleChange = val => {
    if (val === 1) {
      this.isMonth = true;
    } else {
      this.isMonth = false;
      this.quarter = '';
    }
  };

  // 底表类型切换
  handleTypeChange = e => {
    if (e.target.value === 1) {
      this.isMonth = true;
      this.canCycle = false;
      this.canSignResult = false;
      this.canSignState = false;
      propsVal.form.setFieldsValue({
        assessCyc: 1,
        signStatus: null,
        signResult: null,
      });
    } else {
      this.canCycle = true;
      this.canSignResult = true;
      this.canSignState = true;
      propsVal.form.setFieldsValue({
        monthRange: null,
        signStatus: 2,
        signResult: 1,
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
    propsVal.form.setFieldsValue({
      quarterRange: data,
    });
    const y = data ? data.year() : '';
    const a = data ? data.month() : null;
    if (a === 0) {
      this.quarter = `${y} 第一季度(1-3)`;
    }
    if (a === 3) {
      this.quarter = `${y} 第二季度(4-6)`;
    }
    if (a === 6) {
      this.quarter = `${y} 第三季度(7-9)`;
    }
    if (a === 9) {
      this.quarter = `${y} 第四季度(10-12)`;
    }
  };

  // 联动更新数据和可用状态
  changeState = (val, lv) => {
    if (lv === 1) {
      propsVal.form.setFieldsValue({
        signResult: null,
      });
      if (val === 1) {
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
        let applyTimeParamStart = null;
        let applyTimeParamEnd = null;
        if (values.assessCyc === 2) {
          const m = values.quarterRange ? values.quarterRange.clone() : null;
          applyTimeParamStart = m ? m.format('YYYY-MM') : null;
          applyTimeParamEnd = m ? m.add(2, 'month').format('YYYY-MM') : null;
        } else {
          // values.assessCyc === 1 或 null
          const m = values.monthRange ? values.monthRange.clone() : null;
          applyTimeParamStart = m ? m.format('YYYY-MM') : null;
          applyTimeParamEnd = m ? m.format('YYYY-MM') : null;
        }
        const params = {
          exportTableType: values.exportTableType,
          assessCyc: values.exportTableType === 1 ? null : values.assessCyc,
          applyTimeParamStart,
          applyTimeParamEnd,
          signStatus: values.signStatus,
          signResult: values.signResult,
          certificationDetailInfoId: this.props.record ? this.props.record.id : null,
          result: values.result,
          remark: values.remark ? values.remark : '',
        };
        this.props.onOk(params);
      }
    });
  };

  handleCancel = () => {
    this.props.onCancel();
    propsVal.form.resetFields();
  };

  render() {
    const { visible } = this.props;
    if (!visible) {
      this.isMonth = true;
      this.canSignResult = false;
      this.canSignState = false;
      this.quarter = '';
      propsVal && propsVal.form.resetFields();
    }
    const ModalForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      const formLayout = 'inline';
      return (
        <Form layout={formLayout}>
          {this.props.modelType === 1 && (
            <FormItem className="SpecialAuditCSS">
              <div style={{ width: '100%', marginLeft: '25px' }}>
                批量发布认证结果（申请方式为手机端的认证）
              </div>
            </FormItem>
          )}
          {this.props.modelType === 2 ? (
            <FormItem label="*底表类型" {...formItemLayout} className="SpecialAuditCSS">
              {getFieldDecorator('exportTableType', {
                initialValue: null,
                rules: [{ required: true, message: '请选择底表类型' }],
              })(
                <RadioGroup
                  style={{ width: 230, height: 32 }}
                  onChange={e => this.handleTypeChange(e)}
                >
                  <Radio value={1}>报名底表</Radio>
                  <Radio value={2}>认证底表</Radio>
                </RadioGroup>
              )}
            </FormItem>
          ) : null}
          {(this.props.modelType === 2 && this.canCycle) || this.props.modelType === 1 ? (
            <FormItem label="*考核周期" {...formItemLayout}>
              {getFieldDecorator('assessCyc', {
                initialValue: 1,
                rules: [{ required: true, message: '请选择' }],
              })(
                <Select
                  placeholder="请选择考核周期"
                  style={{ width: 230, height: 32 }}
                  onChange={this.handleCycleChange}
                >
                  {BI_Filter('CHECK_CYCLE').map(item => (
                    <Option value={Number(item.id)} key={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          ) : null}
          {(this.props.modelType === 1 || this.props.modelType === 2) && this.isMonth ? (
            <FormItem label="*报名月份" {...formItemLayout}>
              {getFieldDecorator('monthRange', {
                initialValue: null,
                rules: [{ required: true, message: '请选择月份' }],
              })(
                <MonthPicker
                  placeholder="选择月份"
                  format="YYYY-MM"
                  style={{ width: 230, height: 32 }}
                />
              )}
            </FormItem>
          ) : (this.props.modelType === 1 || this.props.modelType === 2) && !this.isMonth ? (
            <FormItem label="*报名季度" {...formItemLayout}>
              {getFieldDecorator('quarterRange', {
                initialValue: null,
                rules: [{ required: true, message: '请选择季度' }],
              })(
                <div>
                  <Input
                    style={{ width: 230, height: 32 }}
                    value={this.quarter}
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
            <FormItem label="&nbsp;&nbsp;报名状态" {...formItemLayout}>
              {getFieldDecorator('signStatus', {
                initialValue: null,
              })(
                <Select
                  placeholder="请选择报名状态"
                  style={{ width: 230, height: 32 }}
                  onChange={value => {
                    this.changeState(value, 1);
                  }}
                  disabled={this.canSignState}
                >
                  {BI_Filter('APPLY_STATE').map(item => (
                    <Option value={Number(item.id) || item.id} key={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          ) : null}
          {this.props.modelType === 2 ? (
            <FormItem label="&nbsp;&nbsp;报名结果" {...formItemLayout}>
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
                    <Option value={Number(item.id) || item.id} key={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          ) : null}

          {/* 认证审核 */}
          {this.props.modelType === 3 ? (
            <FormItem
              label="&nbsp;&nbsp;姓 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名"
              {...formItemLayout}
            >
              {getFieldDecorator('userName', {
                initialValue: '',
              })(<div style={{ width: 280, height: 32 }}>{this.props.record.userName}</div>)}
            </FormItem>
          ) : null}
          {this.props.modelType === 3 ? (
            <FormItem label="&nbsp;&nbsp;认证项目" {...formItemLayout}>
              {getFieldDecorator('orgName', {
                initialValue: '',
              })(
                <div style={{ width: 280, height: 32 }}>
                  {this.props.record.certificationItemName}
                </div>
              )}
            </FormItem>
          ) : null}
          {this.props.modelType === 3 ? (
            <FormItem label="*认证审核" {...formItemLayout}>
              {getFieldDecorator('result', {
                initialValue: this.props.record.examineResult,
                rules: [{ required: true, message: '请选择审核结果' }],
              })(
                <RadioGroup style={{ width: 280, height: 32 }}>
                  <Radio value={1}>通过</Radio>
                  <Radio value={2}>不通过</Radio>
                </RadioGroup>
              )}
            </FormItem>
          ) : null}
          {this.props.modelType === 3 ? (
            <FormItem {...formItemLayout}>
              {getFieldDecorator('remark', {
                initialValue: this.props.record.remark,
                rules: [
                  {
                    validator(rule, value, callback) {
                      if (value && value.length > 200) {
                        callback({ message: '限制200字以内!' });
                      } else {
                        callback();
                      }
                    },
                  },
                ],
              })(
                <TextArea
                  placeholder="请输入通过/不通过原因，限制200字以内"
                  autosize={{ minRows: 3, maxRows: 3 }}
                  style={{ width: 380, marginLeft: '50px' }}
                />
              )}
            </FormItem>
          ) : null}
        </Form>
      );
    });

    return (
      <Modal
        wrapClassName="auditModel"
        title={this.props.title}
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        confirmLoading={this.props.publicSubmitting}
      >
        <ModalForm style={{ margin: 'auto' }} />
      </Modal>
    );
  }
}

export default AuditListForm;
