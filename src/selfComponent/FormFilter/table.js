import React, { PureComponent } from 'react';
import { Table, Button, Icon } from 'antd';
import SelfPagination from '@/selfComponent/selfPagination/SelfPagination';
import styles from './table.less';
import common from '../../routes/Common/common.css';
import { saveParamsInUrl, getUrlParams, pageObj } from './saveUrlParams';
import AuthorizedButton from '../../selfComponent/AuthorizedButton';

/*
*isShowPagination    boolean   是否展示分页组件
*pageSize            number    每页展示的数量
*pageNum             number    页码数
*onChangePage        function   切换页码的回调
*/

export default class SelfTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: this.getPageNum(),
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.pageNum) !== JSON.stringify(this.props.pageNum)) {
      this.setState({ pageNum: nextProps.pageNum - 1 });
    }
  }
  getPageNum = () => {
    const params = getUrlParams();
    return params[pageObj.key] ? Number(params[pageObj.key]) : pageObj.value;
  };
  changePage = (current, pageSize) => {
    if (this.props.onChangePage) {
      this.props.onChangePage(current - 1, pageSize);
    }
    const paramsObj = {};
    paramsObj[pageObj.key] = current - 1;
    this.setState({
      pageNum: current - 1,
    });
    saveParamsInUrl(paramsObj);
  };

  createIncomeAdd = () => {
    this.props.createIncomeAdd();
  };
  createIncomeDel = () => {
    this.props.createIncomeDel();
  };
  render() {
    // totalMoney 创收成单页面进入有绩效流水
    const { dataSource, totalNum = 0, className = '', totalMoney = 0, ...others } = this.props;
    const { pageNum } = this.state;
    return (
      <div>
        {totalMoney > 0 && (
          <p className={styles.totalNum1}>
            <p>
              绩效流水：<i className={styles.green}>{totalMoney}</i> &nbsp;&nbsp;&nbsp;总条数：
              <i className={styles.green}>{totalNum}</i>
            </p>
            <div>
              <AuthorizedButton authority="/bottomOrder/createIncomeAdd">
                <Button onClick={this.createIncomeAdd} type="primary" className={common.newButton}>
                  <Icon type="plus" />
                  批量添加
                </Button>
              </AuthorizedButton>
              <span>&nbsp;&nbsp;</span>
              <AuthorizedButton authority="/bottomOrder/createIncomeDel">
                <Button onClick={this.createIncomeDel} type="primary" className={common.newButton}>
                  <Icon type="edit" />
                  批量编辑
                </Button>
              </AuthorizedButton>
            </div>
          </p>
        )}
        {totalMoney === 0 && <p className={styles.totalNum}>总数：{totalNum}条</p>}
        <Table
          {...others}
          dataSource={dataSource}
          pagination={false}
          className={className}
          style={{ margin: 0 }}
        />
        <SelfPagination
          total={totalNum}
          current={pageNum + 1}
          defaultCurrent={pageNum + 1}
          onChange={(current, pageSize) => {
            this.changePage(current, pageSize);
          }}
        />
      </div>
    );
  }
}
