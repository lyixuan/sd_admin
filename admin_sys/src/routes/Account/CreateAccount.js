import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton'
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;
class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkNick:false
    }
  };
  createUser=()=>{
    this.props.setRouteUrlParams('/role/roleList',{a:3,b:4});
  }
  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const userNameError = isFieldTouched('userName') && getFieldError('userName');
    return (
      <PageHeaderLayout>
        <div>
          <Form layout="inline">
            <FormItem label="Nickname">
              {getFieldDecorator('nickname', {
                initialValue: '123456',
                rules: [{
                  required: this.state.checkNick,
                  message: 'Please input your nickname',
                }],
              })(
                <Input placeholder="Please input your nickname"/>
              )}
            </FormItem>

          </Form>
          <AuthorizedButton authority='/role/roleList'>
            <Button onClick={this.createUser} type="primary" style={{ marginBottom: 16, marginTop: 20 }}>测试</Button>
          </AuthorizedButton>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default Form.create({userName:123})(CreateAccount);
