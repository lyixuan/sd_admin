import React, { Component } from 'react';
import { Form, DatePicker, Button, Spin } from 'antd';
import moment from 'moment/moment';
import { formatDate } from '../../utils/FormatDate';
import common from '../../routes/Common/common.css';
import InputItem from '../../routes/Coefficient/component';
import styles from './CoefficientForm.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM';

export default class CoefficientForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      effectiveDate: '',
      expiryDate: '',
    };
  }
  // 生效周期
  onChangeDate = (dates, dateStrings) => {
    this.setState({
      effectiveDate: `${dateStrings[0]}-01`,
      expiryDate: `${dateStrings[1]}-30`,
    });
  };
  /*
  * 取消事件
  * */
  cancel = () => {
    window.history.go(-1);
  };
  checkPrice = (rule, value = {}) => {
    console.log(value);
    const list = Array.isArray(value.list) ? value.list : [];
    list.forEach(item => {
      if (!item.beginVal) {
        console.log('填写不完整');
        // return;
      }
    });
  };
  /*
  * 提交事件
  * */
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { effectiveDate, expiryDate } = this.state;
        const submintData = {
          effectiveDate,
          expiryDate,
          subMap: values,
        };
        this.props.submitFn(submintData);
      } else {
        console.error(err);
      }
    });
  };
  render() {
    const { loading, infoLoading = false, paramObj = {} } = this.props;

    const { subMap = {}, expiryDate = '', effectiveDate = '' } = paramObj;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 0 },
      wrapperCol: { span: 24 },
    };

    return (
      <Spin spinning={infoLoading}>
        <div className={styles.formWrap}>
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <FormItem label="生效周期">
              {getFieldDecorator('effectiveDate', {
                initialValue: !effectiveDate
                  ? null
                  : [
                      moment(formatDate(effectiveDate), dateFormat),
                      moment(formatDate(expiryDate), dateFormat),
                    ],
                rules: [
                  {
                    required: true,
                    message: '请输入生效周期',
                  },
                ],
              })(
                <RangePicker
                  format={dateFormat}
                  style={{ width: 230, height: 32 }}
                  onChange={this.onChangeDate}
                />
              )}
            </FormItem>
            <div className={styles.itemContent}>
              {subMap &&
                Object.keys(subMap).map(item => {
                  return (
                    <div className={styles.itemCls} key={item}>
                      <FormItem {...formItemLayout}>
                        {getFieldDecorator(item, {
                          initialValue: subMap[item],
                          rules: [
                            {
                              validator: this.checkPrice,
                            },
                          ],
                        })(<InputItem onChange={val => console.log(val)} />)}
                      </FormItem>
                    </div>
                  );
                })}
            </div>

            <div className={styles.selfButton}>
              <FormItem>
                <Button onClick={this.cancel} type="primary" className={common.cancleButton}>
                  取消
                </Button>
                <Button
                  loading={loading}
                  htmlType="submit"
                  type="primary"
                  className={common.submitButton}
                >
                  提交
                </Button>
              </FormItem>
            </div>
          </Form>
        </div>
      </Spin>
    );
  }
}
