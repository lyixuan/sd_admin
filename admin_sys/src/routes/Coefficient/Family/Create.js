import React from 'react';
import { Form, Button, message } from 'antd';
import AuthorizedButton from 'selfComponents/AuthorizedButton';
import common from '../../Common/common.css';
import InputItem from '../component';

const FormItem = Form.Item;
class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formItemList: [
        {
          name: '人均在服学员排名比(自考)',
          list: null,
        },
        {
          name: '人均在服学员排名比(壁垒)',
          list: [
            {
              levelUpperLimit: null,
              upperClose: false,
              levelLowerLimit: null,
              lowerClose: false,
              levelValue: null,
            },
          ],
        },
      ],
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  checkPrice = (rule, value = {}) => {
    const list = Array.isArray(value.list) ? value.list : [];
    list.forEach(item => {
      if (!item.beginVal) {
        console.log('填写不完整');
        // return;
      }
    });
  };
  renderError = () => {
    message.faild('填写信息不完整');
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { formItemList } = this.state;
    return (
      <div>
        <Form onSubmit={this.handleSubmit} layout="vertical">
          <FormItem>
            {getFieldDecorator('additionalProp1', {
              initialValue: formItemList[0],
              // rules: [{ validator: this.checkPrice }],
            })(<InputItem />)}
          </FormItem>

          <AuthorizedButton authority="/performance/familyCoefficient/create">
            <Button
              type="primary"
              htmlType="submit"
              //   loading={changeDateArea}
              className={common.searchButton}
              style={{ margin: '0' }}
            >
              提交
            </Button>
          </AuthorizedButton>
        </Form>
      </div>
    );
  }
}
const WrappedHorizontalLoginForm = Form.create()(Create);
export default WrappedHorizontalLoginForm;
