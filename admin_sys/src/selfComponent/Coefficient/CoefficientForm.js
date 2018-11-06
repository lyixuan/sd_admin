import React, { Component } from 'react';
import { Form, DatePicker, Button, Spin } from 'antd';
import common from '../../routes/Common/common.css';
import InputItem from '../../routes/Coefficient/component';
import styles from './CoefficientForm.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

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
      effectiveDate: dateStrings[0],
      expiryDate: dateStrings[1],
    });
  };
  /*
  * 取消事件
  * */
  cancel = () => {
    window.history.go(-1);
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
    const { loading, subMap } = this.props;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 0 },
      wrapperCol: { span: 24 },
    };

    return (
      <Spin spinning={false}>
        <div className={styles.formWrap}>
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <FormItem label="生效周期">
              {getFieldDecorator('effectiveDate', {
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
              <div className={styles.itemCls}>
                {Object.keys(subMap).map(item => {
                  return (
                    <FormItem {...formItemLayout} key={item}>
                      {getFieldDecorator(item, {
                        initialValue: subMap[item],
                      })(<InputItem onChange={val => console.log(val)} />)}
                    </FormItem>
                  );
                })}
              </div>
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
