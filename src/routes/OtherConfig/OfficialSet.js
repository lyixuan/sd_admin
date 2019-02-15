import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Button } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';

let firstPage = 0; // 分页的默认起开页面

@connect(({ account, loading }) => ({
  account,
  loading: loading.effects['account/accountList'],
}))
class OfficialSet extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const initVal = this.props.getUrlParams();
    firstPage = !initVal.firstPage ? 0 : Number(initVal.firstPage);
    const accountListParams = { size: 30, number: !firstPage ? 0 : firstPage, orderType: 'name' };
    this.getData(accountListParams);
  }

  // 编辑账号函数
  onEdit = key => {
    this.props.setRouteUrlParams('/account/editAccount', {
      id: key.id,
    });
  };

  getData = accountListParams => {
    this.props.dispatch({
      type: 'account/accountList',
      payload: { accountListParams },
    });
  };

  render() {
    // const { loading } = this.props;
    const { TextArea } = Input;
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentButton={
          <>
            <p>报名通道文案设置</p>
            <p>设置手机端报名通道关闭页的文案</p>
            <TextArea style={{ width: '280px', height: '84px' }} />
            <AuthorizedButton authority="/otherConfig/officialSet">
              <Button onClick={this.handleAdd} type="primary" className={common.createButton}>
                编辑
              </Button>
            </AuthorizedButton>
          </>
        }
      />
    );
  }
}
export default OfficialSet;
