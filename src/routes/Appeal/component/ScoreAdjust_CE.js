/* eslint-disable no-undef,no-param-reassign,no-unused-expressions */
import React, { Component } from 'react';
import { Form, Input, Select, DatePicker, Radio, Cascader, Spin, Row, Col, Button } from 'antd';
import { connect } from 'dva/index';
import common from '../../../routes/Common/common.css';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
let propsVal = '';

@connect(({ permission, loading }) => ({
  permission,
  loading: loading.effects['permission/permissionById'],
  submit: loading.effects['permission/updatePermission'],
}))
class ScoreAdjust_CE extends Component {
  constructor(props) {
    super(props);
    const urlParams = this.props.getUrlParams();
    this.state = {
      editId: urlParams && urlParams.id ? urlParams.id : null, // 编辑的id
    };
  }

  componentDidMount() {
    if (this.props.type === 'edit') {
      // 编辑 ,请求回显数据
      this.props.dispatch({
        type: 'permission/permissionById',
        payload: { a: this.state.editId },
      });
    }
  }

  handleSubmit = () => {
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
        if (this.props.type === 'edit') {
          // 编辑提交
          this.props.dispatch({
            type: 'audit/exportBottomTable',
            payload: { params },
          });
        }
        if (this.props.type === 'add') {
          // 新增提交
          this.props.dispatch({
            type: 'audit/auditPublish',
            payload: { params, callbackParams: this.params },
          });
        }
      }
    });
  };

  handleCancel = () => {
    this.props.setRouteUrlParams('/appeal/scoreAdjustList');
  };

  render() {
    const { loading, submit } = this.props;
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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const ModalForm = Form.create()(props => {
      propsVal = props;
      const { getFieldDecorator } = props.form;
      return (
        <Form onSubmit={this.handleSubmit} className="scoreadjust">
          <FormItem label="*学分日期" {...formItemLayout}>
            {getFieldDecorator('exportTableType', {
              initialValue: null,
              rules: [{ required: true, message: '请选择日期' }],
            })(<DatePicker style={{ width: 380 }} />)}
          </FormItem>
          <FormItem label="*调整类型" {...formItemLayout}>
            {getFieldDecorator('result', {
              initialValue: '',
              rules: [{ required: true, message: '请选择调整类型' }],
            })(
              <RadioGroup style={{ width: 380 }}>
                <Radio value={1}>调增学分</Radio>
                <Radio value={2}>调减学分</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="*均分" {...formItemLayout}>
            {getFieldDecorator('userName', {
              initialValue: '',
            })(<Input placeholder="请输入姓名" style={{ width: 380 }} />)}
          </FormItem>
          <FormItem
            label="*调整级别"
            {...formItemLayout}
            extra="仅影响选择的级别的学分，不影响其上下级组织的学分"
          >
            {getFieldDecorator('orgType', {
              initialValue: this.state.orgType,
            })(
              <Select
                placeholder="请选择级别"
                style={{ width: 380 }}
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
          <FormItem label="*调整组织" {...formItemLayout}>
            {getFieldDecorator('orgList', {
              initialValue: this.state.orgList,
            })(<Cascader options={this.orgOptions} style={{ width: 380 }} />)}
          </FormItem>
          <FormItem label="*组织类别" {...formItemLayout}>
            {getFieldDecorator('result', {
              initialValue: '',
              rules: [{ required: true, message: '请选择组织类别' }],
            })(
              <RadioGroup style={{ width: 380 }}>
                <Radio value={1}>自考</Radio>
                <Radio value={2}>壁垒</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            label="*调整原因"
            {...formItemLayout}
            extra="编辑后记得联系产研一组刷新缓存后生效哦"
          >
            {getFieldDecorator('result', {
              initialValue: '',
              rules: [{ required: true, message: '请填写调整原因' }],
            })(
              <TextArea
                onChange={e => this.onReasonChange(e, i)}
                placeholder="请填写调整原因"
                autosize={{ minRows: 3, maxRows: 3 }}
                style={{ width: 380 }}
              />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout} />
          <Row>
            <Col span={6} offset={7}>
              <FormItem>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    onClick={this.props.resetContent}
                    type="primary"
                    className={common.cancleButton}
                  >
                    取消
                  </Button>
                  <Button
                    htmlType="submit"
                    type="primary"
                    className={common.submitButton}
                    loading={submit}
                  >
                    提交
                  </Button>
                </div>
              </FormItem>
            </Col>
          </Row>
        </Form>
      );
    });

    return (
      <Spin spinning={loading || false}>
        <ModalForm style={{ margin: 'auto' }} />
      </Spin>
    );
  }
}

export default ScoreAdjust_CE;
