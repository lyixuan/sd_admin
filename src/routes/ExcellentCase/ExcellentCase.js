import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import ContentLayout from '../../layouts/ContentLayout';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';
import common from '../Common/common.css';
import { columnsFn } from './_selfColumn';
import FormFilter from '../../selfComponent/FormFilter';

@connect(({ excellent, loading }) => ({
  excellent,
  loading: loading.models.bottomTable,
}))
class ExcellentCase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 0,
      pageSize: 30,
    };
  }
  componentDidMount() {
    this.getDataList();
  }

  // 列表数据
  getDataList = paramObj => {
    const { pageNum, pageSize } = this.state;
    const params = { pageNum, pageSize, ...paramObj };
    this.props.dispatch({
      type: 'excellent/excellentList',
      payload: params,
    });
  };

  // 点击某一页函数
  changePage = (pageNum, size) => {
    this.getDataList({
      pageSize: size,
      pageNum,
    });
  };

  // 添加申请
  addTasks = () => {
    this.props.setRouteUrlParams('/excellent/addExcellentCase', {});
  };
  checkDetail = record => {
    this.props.setRouteUrlParams('/excellent/checkCertifiedDetail', {
      id: record.certificationDetailId,
    });
  };

  render() {
    const { excellent = {}, loading } = this.props;
    const { dataList = [], totalNum = 0 } = excellent;
    const columns = columnsFn(this.checkDetail);
    return (
      <>
        <ContentLayout
          routerData={this.props.routerData}
          contentButton={
            <AuthorizedButton authority="/excellent/addExcellentCase">
              <Button onClick={this.addTasks} type="primary" className={common.createButton}>
                添加申请
              </Button>
            </AuthorizedButton>
          }
          contentTable={
            <FormFilter.Table
              bordered
              totalNum={totalNum}
              loading={loading}
              dataSource={dataList}
              columns={columns}
              onChangePage={this.changePage}
            />
          }
        />
      </>
    );
  }
}

export default ExcellentCase;
