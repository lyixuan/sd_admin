import React from 'react';
import { Form, Button } from 'antd';
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
          list: [
            { beginVal: null, isEqBeginVal: false, endVal: null, isEqEndVal: false, baseVal: null },
          ],
        },
        {
          name: '人均在服学员排名比(壁垒)',
          list: [
            { beginVal: null, isEqBeginVal: false, endVal: null, isEqEndVal: false, baseVal: null },
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
  render() {
    const { getFieldDecorator } = this.props.form;
    const { formItemList } = this.state;
    return (
      <div>
        <Form onSubmit={this.handleSubmit} layout="block">
          <FormItem>
            {getFieldDecorator('peopleSelf', {
              initialValue: formItemList[0],
              rules: [{ required: true }],
            })(<InputItem />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('peopleBarrier', {
              initialValue: formItemList[1],
              rules: [{ required: true }],
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
