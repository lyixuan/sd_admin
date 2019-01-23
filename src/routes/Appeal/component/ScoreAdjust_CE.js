/* eslint-disable no-undef,no-param-reassign,no-unused-expressions */
import React, { Component } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Cascader,
  Spin,
  Row,
  Col,
  Button,
  InputNumber,
} from 'antd';
import { connect } from 'dva/index';
import common from '../../../routes/Common/common.css';
import { deepCopy } from '../../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
let propsVal = '';

@connect(({ scoreAdjust, loading }) => ({
  scoreAdjust,
  initLoading: loading.effects['scoreAdjust/getDetailById'],
  submit: loading.effects['scoreAdjust/saveDetail'],
}))
class ScoreAdjust_CE extends Component {
  constructor(props) {
    super(props);
    const urlParams = this.props.getUrlParams();
    this.state = {
      editId: urlParams && urlParams.id ? urlParams.id : null, // 编辑的id
      adjustDate: undefined,
      type: undefined,
      creditScore: undefined,
      groupType: undefined,
      orgList: [],
      familyType: undefined,
      reason: undefined,
    };
    this.orgOptions = [];
    this.showFamily = true;
  }

  componentDidMount() {
    if (this.props.type === 'edit') {
      // 编辑 ,请求回显数据
      this.props.dispatch({
        type: 'scoreAdjust/getDetailById',
        payload: { id: this.state.editId },
      });
    }
  }

  changeDate = val => {
    this.props.dispatch({
      type: 'scoreAdjust/organizationList',
      payload: { bizDate: val.format('YYYY-MM-DD') },
    });
    propsVal.form.setFieldsValue({
      groupType: null,
      orgList: [],
      familyType: null,
    });
  };

  // 级联选级
  handleSelectChange = value => {
    propsVal.form.setFieldsValue({
      orgList: [],
      familyType: null,
    });
    this.orgOptions = deepCopy(this.props.scoreAdjust.orgList);
    if (value === 'college') {
      this.orgOptions.forEach(v => {
        delete v.children;
      });
      this.showFamily = true;
    } else if (value === 'family') {
      this.orgOptions.forEach(item => {
        item.children.forEach(v => {
          delete v.children;
        });
      });
      this.showFamily = false;
    } else {
      this.showFamily = false;
    }
  };

  handleSubmit = () => {
    propsVal.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const m = values.adjustDate ? values.adjustDate.clone() : undefined;
        const adjustDate = m ? m.format('YYYY-MM-DD') : undefined;
        const params = {
          adjustDate,
          type: values.type,
          creditScore: values.creditScore ? parseFloat(values.creditScore) : undefined,
          groupType: values.groupType,
          collegeId: values.orgList[0] ? values.orgList[0] : undefined,
          familyId: values.orgList[1] ? values.orgList[1] : undefined,
          groupId: values.orgList[2] ? values.orgList[2] : undefined,
          reason: values.reason,
        };

        if (this.props.type === 'edit') {
          // 编辑提交
          params.id = this.state.editId;
        }
        this.props.dispatch({
          type: 'scoreAdjust/saveDetail',
          payload: { params },
        });
      }
    });
  };

  goBack = () => {
    this.props.setRouteUrlParams('/appeal/scoreAdjustList');
  };

  render() {
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
    const { initLoading, submit } = this.props;
    const { getFieldDecorator } = this.props.form;
    propsVal = this.props;
    return (
      <Spin spinning={this.props.type === 'edit' ? initLoading : false}>
        <Form style={{ margin: 'auto' }} className="scoreadjust">
          <FormItem label="*学分日期" {...formItemLayout}>
            {getFieldDecorator('adjustDate', {
              initialValue: this.state.adjustDate,
              rules: [{ required: true, message: '请选择学分日期' }],
            })(<DatePicker onChange={this.changeDate} style={{ width: 380 }} />)}
          </FormItem>
          <FormItem label="*调整类型" {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: this.state.type,
              rules: [{ required: true, message: '请选择调整类型' }],
            })(
              <RadioGroup style={{ width: 380 }}>
                <Radio value={1}>调增学分</Radio>
                <Radio value={2}>调减学分</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="*均 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分" {...formItemLayout}>
            {getFieldDecorator('creditScore', {
              initialValue: this.state.creditScore,
              rules: [
                {
                  validator(rule, value, callback) {
                    if (Number(value) === 0) {
                      callback({ message: '均分不能为0' });
                    } else if (!value) {
                      callback({ message: '请输入均分' });
                    } else {
                      callback();
                    }
                  },
                },
              ],
            })(
              <InputNumber
                min={0}
                max={9999999}
                step={0.01}
                placeholder="请输入"
                style={{ width: 380 }}
              />
            )}
          </FormItem>
          <FormItem
            label="*调整级别"
            {...formItemLayout}
            extra="仅影响选择的级别的学分，不影响其上下级组织的学分"
          >
            {getFieldDecorator('groupType', {
              initialValue: this.state.groupType,
              rules: [{ required: true, message: '请选择调整级别' }],
            })(
              <Select
                placeholder="请选择"
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
              rules: [{ required: true, message: '请选择调整组织' }],
            })(<Cascader options={this.orgOptions} style={{ width: 380 }} />)}
          </FormItem>
          {this.showFamily ? (
            <FormItem label="*组织类别" {...formItemLayout}>
              {getFieldDecorator('familyType', {
                initialValue: this.state.familyType,
                rules: [{ required: true, message: '请选择组织类别' }],
              })(
                <RadioGroup style={{ width: 380 }}>
                  <Radio value={0}>自考</Radio>
                  <Radio value={1}>壁垒</Radio>
                </RadioGroup>
              )}
            </FormItem>
          ) : null}
          <FormItem
            label="*调整原因"
            {...formItemLayout}
            extra="编辑后记得联系产研一组产品经理刷新缓存后生效哦"
          >
            {getFieldDecorator('reason', {
              initialValue: this.state.reason,
              rules: [
                { required: true, message: '请填写原因' },
                {
                  validator(rule, value, callback) {
                    if (value && value.length > 500) {
                      callback({ message: '限制500字以内!' });
                    } else {
                      callback();
                    }
                  },
                },
              ],
            })(
              <TextArea
                placeholder="限制500字以内"
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
                  <Button onClick={this.goBack} type="primary" className={common.cancleButton}>
                    取消
                  </Button>
                  <Button
                    htmlType="submit"
                    type="primary"
                    className={common.submitButton}
                    loading={submit}
                    onClick={this.handleSubmit}
                  >
                    提交
                  </Button>
                </div>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Spin>
    );
  }
}

const ModalForm = Form.create()(ScoreAdjust_CE);
export default ModalForm;
