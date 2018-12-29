import React, { Component } from 'react';
import { connect } from 'dva';
import { assignUrlParams } from 'utils/utils';
// import { Table, Button, Form, Input, Popconfirm, Row, Col, Select } from 'antd';
// import ContentLayout from '../../layouts/ContentLayout';
// import AuthorizedButton from '../../selfComponent/AuthorizedButton';
// import SelfPagination from '../../selfComponent/selfPagination/SelfPagination';
// import common from '../Common/common.css';
// import { BI_Filter } from '../../utils/global';
//
// const FormItem = Form.Item;
// const { Option } = Select;
// let propsVal = '';

@connect(({ user, loading }) => ({
  user,
  loading: loading.effects['user/userList'],
}))
class CertificationList extends Component {
  constructor(props) {
    super(props);
    const params = this.props.getUrlParams();
    const initParams = {
      params: {
        pageNum: 0, // 翻页---当前页码
        pageSize: 30, // 每页显示数据
      },
    };
    this.state = assignUrlParams(initParams, params);

  }



  render() {
    return (
      <div>rensdfjak</div>
    );
  }
}

export default CertificationList;
