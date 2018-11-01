import React, { Component } from 'react';
import { connect } from 'dva';
import {  Button } from 'antd';
import { assignUrlParams } from 'utils/utils';
import ContentLayout from '../../../layouts/ContentLayout';
import AuthorizedButton from '../../../selfComponent/AuthorizedButton';
import common from '../../Common/common.css';


@connect(({ account, loading }) => ({
  account,
  loading: loading.effects['account/accountList'],
}))
class Check extends Component {
  constructor(props) {
    super(props);
    const params = this.props.getUrlParams();
    const initParams = {
      params: {

      },
    };
    this.state = assignUrlParams(initParams, params);

  }

  componentDidMount() {
    this.getData();
  }
  getData = () => {
    // const stateParams = this.state.params;
    // const userListParams = { ...stateParams, ...params };
    // this.props.dispatch({
    //   type: 'user/userList',
    //   payload:{userListParams},
    // });
  };

  // 编辑
  cancel = () => {
    this.props.setRouteUrlParams('/performance/familyCoefficient/list', {});
  };

  render() {
    // const { loading } = this.props;
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentButton={
          <AuthorizedButton authority="/account/createAccount">
            <Button onClick={this.cancel} type="primary" className={common.createButton}>
              返回
            </Button>
          </AuthorizedButton>
        }
      />
    );
  }
}
export default Check;

