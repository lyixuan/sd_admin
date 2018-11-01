import React, { Component } from 'react';
import { Form, DatePicker, Button, Spin } from 'antd';
import common from '../../routes/Common/common.css';
import InputItem from '../../routes/Coefficient/component';
import styles from './CoefficientForm.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

export default class CoefficientForm extends Component {
  onChange = (dates, dateStrings) => {
    console.log(dates, dateStrings);
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
        console.log(values);
      } else {
        console.error(err);
      }
    });
  };
  render() {
    const { loading } = this.props;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 0 },
      wrapperCol: { span: 24 },
    };
    const list = [
      {
        id: 0,
        name: '人均在服人员排名',
      },
      {
        id: 1,
        name: '日均在服人员排名',
      },
      {
        id: 2,
        name: '绩效管理',
      },
    ];
    return (
      <Spin spinning={false}>
        <div className={styles.formWrap}>
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <FormItem label="生效周期">
              {getFieldDecorator('countBeginTime', {
                initialValue: null,
              })(
                <RangePicker
                  format={dateFormat}
                  style={{ width: 230, height: 32 }}
                  onChange={this.onChange}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout}>
              {getFieldDecorator('privilegeIds', {})(
                <div className={styles.itemContent}>
                  {list.map(item => {
                    return (
                      <div key={item.id} className={styles.itemCls}>
                        <InputItem />
                      </div>
                    );
                  })}
                </div>
              )}
            </FormItem>
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
