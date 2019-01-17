/* eslint-disable no-undef,no-param-reassign,no-unused-expressions */
import React, { Component } from 'react';
import { Form, Input, Select, DatePicker, Radio, Cascader } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

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

class ScoreAdjust_CE extends Component {
  constructor(props) {
    super(props);
    this.quarter = '';
    this.state = {};
  }

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
        };
        this.props.onOk(params);
        this.isMonth = true;
        this.canSignResult = false;
        this.canSignState = false;
        this.canSignResult = false;
        this.quarter = '';
      }
    });
  };

  handleCancel = () => {
    this.props.onCancel();
    propsVal.form.resetFields();
  };

  render() {
    propsVal && propsVal.form.resetFields();
    const ModalForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      const formLayout = 'inline';
      return (
        <Form layout={formLayout}>
          {this.props.modelType === 1 ? (
            <FormItem label="*学分日期" {...formItemLayout}>
              {getFieldDecorator('exportTableType', {
                initialValue: null,
                rules: [{ required: true, message: '请选择日期' }],
              })(<DatePicker />)}
            </FormItem>
          ) : null}
          {this.props.modelType === 1 ? (
            <FormItem label="*调整类型" {...formItemLayout}>
              {getFieldDecorator('result', {
                initialValue: '',
                rules: [{ required: true, message: '请选择调整类型' }],
              })(
                <RadioGroup style={{ width: 250, height: 32 }}>
                  <Radio value={1}>调增学分</Radio>
                  <Radio value={2}>调减学分</Radio>
                </RadioGroup>
              )}
            </FormItem>
          ) : null}
          {this.props.modelType === 3 ? (
            <FormItem label="均 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分" {...formItemLayout}>
              {getFieldDecorator('userName', {
                initialValue: '',
              })(<Input placeholder="请输入姓名" style={{ width: 230, height: 32 }} />)}
            </FormItem>
          ) : null}
          <FormItem label="*调整级别">
            {getFieldDecorator('orgType', {
              initialValue: this.state.orgType,
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
          <FormItem label="*调整组织">
            {getFieldDecorator('orgList', {
              initialValue: this.state.orgList,
            })(<Cascader options={this.orgOptions} style={{ width: 230 }} />)}
          </FormItem>
          {this.props.modelType === 1 ? (
            <FormItem label="*组织类别" {...formItemLayout}>
              {getFieldDecorator('result', {
                initialValue: '',
                rules: [{ required: true, message: '请选择组织类别' }],
              })(
                <RadioGroup style={{ width: 250, height: 32 }}>
                  <Radio value={1}>自考</Radio>
                  <Radio value={2}>壁垒</Radio>
                </RadioGroup>
              )}
            </FormItem>
          ) : null}
          <FormItem label="*调整原因" {...formItemLayout}>
            {getFieldDecorator('result', {
              initialValue: '',
              rules: [{ required: true, message: '请填写调整原因' }],
            })(
              <TextArea
                onChange={e => this.onReasonChange(e, i)}
                value={1}
                placeholder="请填写调整原因"
                autosize={{ minRows: 3, maxRows: 3 }}
              />
            )}
          </FormItem>
        </Form>
      );
    });

    return <ModalForm style={{ margin: 'auto' }} />;
  }
}

export default ScoreAdjust_CE;
