/* eslint-disable no-undef,no-param-reassign,no-unused-expressions,prefer-destructuring */
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
  initLoading2: loading.effects['scoreAdjust/organizationList'],
  submit: loading.effects['scoreAdjust/saveDetail'],
}))
class ScoreAdjust_CE extends Component {
  constructor(props) {
    super(props);
    const urlParams = this.props.getUrlParams();
    this.state = {
      editId: urlParams && urlParams.id ? urlParams.id : null, // 编辑的id
    };
    this.orgOptions = [];
    this.showFamily = true;
  }

  componentDidMount() {
    if (this.props.type === 'edit') {
      // 编辑 ,请求回显数据
      this.props.dispatch({
        type: 'scoreAdjust/getDetailById',
        payload: {
          id: this.state.editId,
          changeOption: value => {
            this.handleSelectChange(value, 1);
          },
        },
      });
    } else {
      const obj = {};
      this.props.dispatch({
        type: 'scoreAdjust/initDetail',
        payload: { obj },
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
      orgCheckList: [],
      familyType: null,
    });
  };

  // 级联选级
  handleSelectChange = (value, v2) => {
    if (v2 !== 1) {
      propsVal.form.setFieldsValue({
        orgCheckList: [],
        familyType: null,
      });
    }
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
    console.log(this.orgOptions);
  };

  orgChange = (val, obj) => {
    if (obj.length > 1) {
      this.props.dispatch({
        type: 'scoreAdjust/initFamilyType',
        payload: { familyType: obj[1].familyType },
      });
    }
  };

  handleSubmit = () => {
    propsVal.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const m = values.adjustDate ? values.adjustDate.clone() : undefined;
        const adjustDate = m ? m.format('YYYY-MM-DD') : undefined;
        const creditScore =
          values.creditScore && values.creditScore < 0
            ? 0 - values.creditScore
            : values.creditScore;
        const params = {
          adjustDate,
          type: values.type,
          creditScore: creditScore ? parseFloat(creditScore) : undefined,
          groupType: values.groupType,
          familyType:
            values.groupType === 'college' ? values.familyType : this.props.scoreAdjust.familyType,
          reason: values.reason,
        };

        if (values.orgCheckList[0]) {
          params.collegeId = values.orgCheckList[0];
          this.props.scoreAdjust.orgList.forEach(v => {
            if (v.value === values.orgCheckList[0]) {
              params.collegeName = v.label;

              if (values.orgCheckList[1]) {
                params.familyId = values.orgCheckList[1];
                v.children.forEach(v1 => {
                  if (v1.value === values.orgCheckList[1]) {
                    params.familyName = v1.label;

                    if (values.orgCheckList[2]) {
                      params.groupId = values.orgCheckList[2];
                      v1.children.forEach(v2 => {
                        if (v2.value === values.orgCheckList[2]) {
                          params.groupName = v2.label;
                        }
                      });
                    }
                  }
                });
              }
            }
          });
        }
        if (this.props.type === 'edit') {
          // 编辑提交
          params.id = Number(this.state.editId);
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
    const { initLoading = false, initLoading2 = false, submit } = this.props;
    const { getFieldDecorator } = this.props.form;
    propsVal = this.props;
    return (
      <Spin spinning={this.props.type === 'edit' ? initLoading || initLoading2 : initLoading2}>
        <Form style={{ margin: 'auto' }} className="scoreadjust">
          <FormItem label="*学分日期" {...formItemLayout}>
            {getFieldDecorator('adjustDate', {
              initialValue: this.props.scoreAdjust.adjustDate,
              rules: [{ required: true, message: '请选择学分日期' }],
            })(<DatePicker onChange={this.changeDate} style={{ width: 380 }} />)}
          </FormItem>
          <FormItem label="*调整类型" {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: this.props.scoreAdjust.type,
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
              initialValue: this.props.scoreAdjust.creditScore,
              rules: [
                {
                  validator(rule, value, callback) {
                    if (Number(value) === 0) {
                      callback({ message: '均分应为大于0的数字' });
                    } else if (!value) {
                      callback({ message: '请输入均分' });
                    } else if (
                      value &&
                      String(value).split('.')[1] &&
                      String(value).split('.')[1].length > 2
                    ) {
                      callback({ message: '最多保留两位小数' });
                    } else {
                      callback();
                    }
                  },
                },
              ],
            })(
              <InputNumber
                min={-9999999}
                max={9999999}
                step={0.01}
                formatter={value => String(value).replace(/-/g, '')}
                placeholder="请输入大于0的数字"
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
              initialValue: this.props.scoreAdjust.groupType,
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
            {getFieldDecorator('orgCheckList', {
              initialValue: this.props.scoreAdjust.orgCheckList,
              rules: [{ required: true, message: '请选择调整组织' }],
            })(
              <Cascader
                options={this.orgOptions}
                onChange={this.orgChange}
                style={{ width: 380 }}
              />
            )}
          </FormItem>
          {this.showFamily ? (
            <FormItem label="*组织类别" {...formItemLayout}>
              {getFieldDecorator('familyType', {
                initialValue: this.props.scoreAdjust.familyType,
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
              initialValue: this.props.scoreAdjust.reason,
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
