import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton'
class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  };
  createUser=()=>{
    this.props.setRouteUrlParams('/role/roleList',{a:3,b:4});
  }
  render() {
    return (
      <PageHeaderLayout>
        <div>
          <AuthorizedButton authority='/role/roleList'>
            <Button onClick={this.createUser} type="primary" style={{ marginBottom: 16, marginTop: 20 }}>测试</Button>
          </AuthorizedButton>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default CreateAccount;
