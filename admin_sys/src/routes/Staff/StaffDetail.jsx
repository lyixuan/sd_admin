import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import { assignUrlParams } from 'utils/utils';
import moment from 'moment';
import { BaseUtils } from './BaseUtils';
import ContentLayout from '../../layouts/ContentLayout';
import styles from './styles/index.less';
import common from '../Common/common.css';

const dateFormat = 'YYYY-MM-DD';
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
    this.baseUtils = new BaseUtils();
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
  backToListPage = () => {
    this.props.history.goBack();
  };
  columnsData = () => {
    return [
      {
        title: '转岗日期',
        dataIndex: 'transferDate',
        // width: 120,
      },
      {
        title: '转岗前岗位',
        dataIndex: 'beforePostitonType',
      },
      {
        title: '转岗前负责单位',
        dataIndex: 'beforeOrganization',
      },
      {
        title: '转岗后岗位',
        dataIndex: 'afterPostitonType',
      },
      {
        title: '转岗后负责单位',
        dataIndex: 'afterOrganization',
      },
    ];
  };
  render() {
    const { staff = {}, loading } = this.props;
    const staffDetail = staff.staffDetail || {};
    const transfer = staffDetail.transfer || [];
    const columns = this.columnsData();
    const dataSource = transfer.map((item, index) => ({
      ...item,
      key: item.transferDate + index,
      beforeOrganization: item.beforeOrganization
        ? item.beforeOrganization
        : this.baseUtils.returnOrganization(item.beforePostitonType),
      beforePostitonType: this.baseUtils.returnGroupType(item.beforePostitonType),
      afterPostitonType: this.baseUtils.returnGroupType(item.afterPostitonType),
      afterOrganization:
        item.afterOrganization || this.baseUtils.returnOrganization(item.afterPostitonType),
    }));
    return (
      <ContentLayout routerData={this.props.routerData}>
        <div className={styles.detailContailer}>
          <ul className={styles.formContent}>
            <li>
              <span className={styles.labelText}>姓名:</span>
              <span className={styles.labelItem}>{staffDetail.name}</span>
            </li>
            <li>
              <span className={styles.labelText}>邮箱:</span>
              <span className={styles.labelItem}>{staffDetail.mail}</span>
            </li>
            <li>
              <span className={styles.labelText}>现任岗位:</span>
              <span className={styles.labelItem}>
                {this.baseUtils.returnGroupType(staffDetail.nowPositionType)}
              </span>
            </li>
            <li>
              <span className={styles.labelText}>现任负责单位:</span>
              <span className={styles.labelItem}>
                {staffDetail.nowOrgnization ||
                  this.baseUtils.returnOrganization(staffDetail.nowPositionType)}
              </span>
            </li>
            <li>
              <span className={styles.labelText}>入职日期:</span>
              <span className={styles.labelItem}>{staffDetail.joinDate}</span>
            </li>
            <li>
              <span className={styles.labelText}>请假时间:</span>
              <span className={styles.labelItem}>{staffDetail.vacationDuration}</span>
            </li>
            <li>
              <span className={styles.labelText}>离职日期  (非最后工作日期):</span>
              <span className={styles.labelItem}>
                {staffDetail.lastday ? moment(staffDetail.lastday).format(dateFormat) : null}
              </span>
            </li>

          </ul>
          <div className={styles.tableConent}>
            <h3 className={styles.tableTitle}>转岗信息:</h3>
            <Table
              bordered
              loading={loading}
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              className={common.tableContentStyle}
            />
            <div className={styles.backButton}>
              <Button type="primary" className={common.searchButton} onClick={this.backToListPage}>
                返回
              </Button>
            </div>
          </div>
        </div>
      </ContentLayout>
    );
  }
}
