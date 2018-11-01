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
        id:1,
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
    this.props.setRouteUrlParams('/performance/groupCoefficient/list', {});
  };

  render() {
    // const { loading } = this.props;
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentButton={
          <div>
            <span className={common.titleWord}>生效周期 ：2018.10 ～ 至今</span>
            <div className={common.rangeContent}>
              <div >
                <div className={common.rangeItemContent}>占位1</div>
                <div className={common.xSpin} />
                <div className={common.rangeItemContent}>占位2</div>
                <div className={common.xSpin} />
                <div className={common.rangeItemContent}>占位3</div>
              </div>
            </div>
            <div style={{textAlign:'right'}}>
              <AuthorizedButton authority="/account/createAccount">
                <Button onClick={this.cancel} type="primary" className={common.createButton}>
                  返回
                </Button>
              </AuthorizedButton>
            </div>
          </div>
        }
      />
    );
  }
}
export default Check;

