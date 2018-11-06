import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Spin } from 'antd';
import { assignUrlParams } from 'utils/utils';
import { formatYeatMonth } from 'utils/FormatDate';
import ContentLayout from '../../../layouts/ContentLayout';
import AuthorizedButton from '../../../selfComponent/AuthorizedButton';
import CoefficientDetail from '../../../selfComponent/Coefficient/CoefficientDetail';
import common from '../../Common/common.css';

@connect(({ coefficient, loading }) => ({
  coefficient,
  loading: loading.effects['coefficient/packageInfo'],
}))
class Check extends Component {
  constructor(props) {
    super(props);
    const params = this.props.getUrlParams();
    const initParams = {
      params: {
        packageId: null,
      },
    };
    this.state = assignUrlParams(initParams, params);
  }

  componentDidMount() {
    this.getData();
  }
  getData = () => {
    const userListParams = this.state.params;
    this.props.dispatch({
      type: 'coefficient/packageInfo',
      payload: { userListParams },
    });
  };

  // 格式化数据
  dataFormt = (data, key) => {
    const dataList = [];
    const { subMap = {} } = data;
    const dataValue = !subMap ? [] : !subMap[key] ? [] : subMap[key];
    dataValue.map((item, index) => {
      const val = {
        key: index,
        v1: item.levelLowerLimit,
        v2: item.lowerClose,
        v3: item.levelUpperLimit,
        v4: item.upperClose,
        v5: item.levelValue,
      };
      return dataList.push(val);
    });
    return dataList;
  };

  classFormt = (data, key) => {
    const dataList = [];
    const { subMap = {} } = data;
    const dataValue = !subMap ? [] : !subMap[key] ? [] : subMap[key];
    dataValue.map((item, index) => {
      const val = {
        key: index,
        v1: item.teacherCount,
        v2: item.groupKpi,
        v3: item.classKpi,
      };
      return dataList.push(val);
    });
    return dataList;
  };

  // 时间戳格式处理
  timeFormate = (effectiveDate = null, expiryDate = null) => {
    const startTime = !effectiveDate ? '2018.11' : formatYeatMonth(effectiveDate);
    const endTime1 = !expiryDate ? '2018.11' : formatYeatMonth(expiryDate);
    const endTime = endTime1 === '2099.12' ? '至今' : endTime1;
    return `${startTime} ～ ${endTime} `;
  };

  // 返回
  cancel = () => {
    this.props.setRouteUrlParams('/performance/familyCoefficient/list', {});
  };

  render() {
    const { coefficient = {}, loading } = this.props;
    const { data = {} } = coefficient;
    const { effectiveDate = null, expiryDate = null } = data;
    const timeArea = this.timeFormate(effectiveDate, expiryDate);
    const personRank = this.dataFormt(data, 6) || [];
    const dailyRank = this.dataFormt(data, 7) || [];
    const devicePer = this.classFormt(data, 8) || [];
    const data1 = { compo: 1, percent: 1, basic: 1, data: personRank };
    const data2 = { compo: 1, percent: 1, basic: 2, data: dailyRank };
    const data3 = { compo: 2, data: devicePer };
    return (
      <Spin spinning={loading}>
        <ContentLayout
          routerData={this.props.routerData}
          contentButton={
            <div>
              <span className={common.titleWord}>生效周期 ：{timeArea}</span>
              <div className={common.rangeContent}>
                <div>
                  <div className={common.rangeItemContent}>
                    <span className={common.titleWord}>人均在服学员排名比</span>
                    <CoefficientDetail dataSource={data1} />
                  </div>
                  <div className={common.xSpin} />
                  <div className={common.rangeItemContent}>
                    <span className={common.titleWord}>日均学分排名比</span>
                    <CoefficientDetail dataSource={data2} />
                  </div>
                  <div className={common.xSpin} />
                  <div className={common.rangeItemContent}>
                    <span className={common.titleWord}>绩效分配比例</span>
                    <CoefficientDetail dataSource={data3} />
                  </div>
                  <div style={{ height: '30px' }} />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <AuthorizedButton authority="/account/createAccount">
                  <Button onClick={this.cancel} type="primary" className={common.createButton}>
                    返回
                  </Button>
                </AuthorizedButton>
              </div>
            </div>
          }
        />
      </Spin>
    );
  }
}
export default Check;
