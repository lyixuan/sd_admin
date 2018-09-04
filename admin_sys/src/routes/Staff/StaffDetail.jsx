import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import { assignUrlParams } from 'utils/utils';
import ContentLayout from '../../layouts/ContentLayout';
import styles from './styles/index.less';
import common from '../Common/common.css';

@connect(({ staff, loading }) => ({
  staff,
  loading: loading.effects['staff/getStaffDetail'],
}))
export default class StaffDetail extends Component {
  constructor(props) {
    const { urlParams = {} } = props;
    super(props);
    const initState = {
      paramsObj: {
        id: 813,
      },
    };
    this.state = assignUrlParams(initState, urlParams);
  }
  componentDidMount() {
    this.getData();
  }
  getData = () => {
    const { paramsObj } = this.state;
    this.props.dispatch({
      type: 'staff/getStaffDetail',
      payload: paramsObj,
    });
  };
  columnsData = () => {
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '状态',
        dataIndex: 'currentStateName',
        width: 120,
        key: 'currentStateName',
      },
      {
        title: '邮箱',
        dataIndex: 'mail',
        width: 150,
        key: 'mail',
      },
      {
        title: '岗位',
        dataIndex: 'userType',
        width: 110,
        key: 'userType',
      },
      {
        title: '负责单位',
        dataIndex: 'showName',
        width: 170,
        key: 'showName',
      },
    ];
    return columns || [];
  };
  render() {
    const { staff = {} } = this.props;
    // const { staffDetail } = staff;
    console.log(staff);
    return (
      <ContentLayout routerData={this.props.routerData}>
        <div className={styles.detailContailer}>
          <ul className={styles.formContent}>
            <li>
              <span className={styles.labelText}>姓名:</span>
              <span className={styles.labelItem}>张三</span>
            </li>
            <li>
              <span className={styles.labelText}>邮箱:</span>
              <span className={styles.labelItem}>zangsan</span>
            </li>
            <li>
              <span className={styles.labelText}>现任岗位:</span>
              <span className={styles.labelItem}>家族长</span>
            </li>
            <li>
              <span className={styles.labelText}>现任负责单位:</span>
              <span className={styles.labelItem}>芝士学院 | 北京人力本科</span>
            </li>
            <li>
              <span className={styles.labelText}>入职日期:</span>
              <span className={styles.labelItem}>2018-01-01</span>
            </li>
            <li>
              <span className={styles.labelText}>请假时间:</span>
              <span className={styles.labelItem}>
                2018-01-01~2018-03-02 , 2018-07-01~2018-08-31
              </span>
            </li>
            <li>
              <span className={styles.labelText}>最后工作日:</span>
              <span className={styles.labelItem}>2018-07-01</span>
            </li>
          </ul>
          <div className={styles.tableConent}>
            <h3 className={styles.tableTitle}>转岗信息:</h3>
            <Table
              bordered
              // loading={loading}
              // dataSource={dataSource}
              columns={this.columnsData()}
              pagination={false}
              className={common.tableContentStyle}
            />
          </div>
        </div>
      </ContentLayout>
    );
  }
}
