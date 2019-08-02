import React, { PureComponent } from 'react';
import { Table } from 'antd';
import SelfPagination from '@/selfComponent/selfPagination/SelfPagination';
import styles from './table.less';
import { saveParamsInUrl, getUrlParams, pageObj } from './saveUrlParams';

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
  render() {
    const { dataSource, totalNum = 0, ...others } = this.props;
    const { pageNum } = this.state;
    return (
      <div>
        <p className={styles.totalNum}>总数：{totalNum}条</p>
        <Table
          {...others}
          dataSource={dataSource}
          pagination={false}
          className={styles.tableContentStyle}
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
