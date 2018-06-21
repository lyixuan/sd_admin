import React, { Component } from 'react';
import { Form } from 'antd';
// import styles from './Account.css';
import AdvancedSearchForm from '../../common/AdvancedSearchForm.js';
import ContentLayout from '../../layouts/ContentLayout';
// import AuthorizedButton from '../../selfComponent/AuthorizedButton';
// import common from '../Common/common.css';

const WrappedRegistrationForm = Form.create()(AdvancedSearchForm);
class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  createUser = () => {
    this.props.setRouteUrlParams('/account/accountList', {
      a: 2,
      b: 3,
    });
  };
  render() {
    return (
      <ContentLayout
        contentForm={<WrappedRegistrationForm />}
        // contentButton={
        //   <div className={styles.buttonWrapper}>
        //     <AuthorizedButton authority="/account/accountList">
        //       <Button onClick={this.createUser} type="primary" className={common.cancleButton}>
        //         取消
        //       </Button>
        //     </AuthorizedButton>
        //     <AuthorizedButton authority="/account/accountList">
        //       <Button onClick={this.createUser} type="primary" className={common.submitButton}>
        //         提交
        //       </Button>
        //     </AuthorizedButton>
        //   </div>
        // }
      />
    );
  }
}

export default Form.create({ userName: 123 })(CreateAccount);
