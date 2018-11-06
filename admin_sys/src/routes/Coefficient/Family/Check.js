import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
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
    console.log(userListParams);
    this.props.dispatch({
      type: 'coefficient/packageInfo',
      payload: { userListParams },
    });
  };
  // 格式化数据
  dataFormt = data => {
    const list = [];
    data.map((item, index) => {
      const bb = {
        key: index,
        id: item.groupId,
        name: item.category,
      };
      list.push(bb);
      return 0;
    });
    return list;
  };

  // 时间戳格式处理
  timeFormate = val => {
    const { effectiveDate = null, expiryDate = null } = val;
    const startTime = formatYeatMonth(effectiveDate);
    const endTime1 = formatYeatMonth(expiryDate);
    const endTime = endTime1 === '2099.12' ? '至今' : endTime1;
    return `${startTime} ～ ${endTime} `;
  };

  // 返回
  cancel = () => {
    this.props.setRouteUrlParams('/performance/familyCoefficient/list', {});
  };

  render() {
    const { coefficient = {} } = this.props;
    console.log(coefficient);

    const data1 = {
      data: [
        { v1: 0, v2: false, v3: 0.2, v4: true, v5: 8000, key: 1 },
        { v1: 0.2, v2: false, v3: 0.4, v4: false, v5: 8000, key: 2 },
        { v1: 0.4, v2: true, v3: 1, v4: false, v5: 8000, key: 3 },
      ],
      compo: 1,
      percent: 1,
      basic: 1,
    };
    const data2 = {
      data: [
        { v1: 0, v2: false, v3: 0.2, v4: true, v5: 8000, key: 1 },
        { v1: 0.2, v2: false, v3: 0.4, v4: false, v5: 8000, key: 2 },
        { v1: 0.4, v2: true, v3: 1, v4: false, v5: 8000, key: 3 },
      ],
      compo: 1,
      percent: 1,
      basic: 1,
    };
    const data3 = {
      data: [
        { v1: 0, v2: false, v3: 0.2, v4: true, v5: 8, key: 1 },
        { v1: 0.2, v2: false, v3: 0.4, v4: false, v5: 8, key: 2 },
        { v1: 0.4, v2: true, v3: 1, v4: false, v5: 8, key: 3 },
      ],
      compo: 1,
      percent: 1,
      basic: 2,
    };
    const data4 = {
      data: [
        { v1: 0, v2: false, v3: 0.2, v4: true, v5: 8, key: 1 },
        { v1: 0.2, v2: false, v3: 0.4, v4: false, v5: 8, key: 2 },
        { v1: 0.4, v2: true, v3: 1, v4: false, v5: 8, key: 3 },
      ],
      compo: 1,
      percent: 1,
      basic: 3,
    };
    const data5 = {
      data: [
        { v1: 1, v2: false, v3: 20, v4: true, v5: 2, key: 1 },
        { v1: 20, v2: false, v3: 40, v4: false, v5: 1.5, key: 2 },
        { v1: 40, v2: true, v3: 100, v4: false, v5: 2, key: 3 },
      ],
      compo: 1,
      percent: 2,
      basic: 3,
    };
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentButton={
          <div>
            <span className={common.titleWord}>生效周期 ：2018.10 ～ 至今</span>
            <div className={common.rangeContent}>
              <div>
                <div className={common.rangeItemContent}>
                  <span className={common.titleWord}>人均在服学员排名比 (自考)</span>
                  <CoefficientDetail dataSource={data1} />
                </div>
                <div className={common.xSpin} />
                <div className={common.rangeItemContent}>
                  <span className={common.titleWord}>人均在服学员排名比 (壁垒)</span>
                  <CoefficientDetail dataSource={data2} />
                </div>
                <div className={common.xSpin} />
                <div className={common.rangeItemContent}>
                  <span className={common.titleWord}>日均学分排名比 (自考)</span>
                  {/* <Checkbox disabled className={common.checkBox}>
                    闭区间
                  </Checkbox> */}
                  <CoefficientDetail dataSource={data3} />
                </div>
                <div className={common.xSpin} />
                <div className={common.rangeItemContent}>
                  <span className={common.titleWord}>日均学分排名比 (壁垒)</span>
                  <CoefficientDetail dataSource={data4} />
                </div>
                <div className={common.xSpin} />
                <div className={common.rangeItemContent}>
                  <span className={common.titleWord}>管理规模</span>
                  <CoefficientDetail dataSource={data5} />
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
    );
  }
}
export default Check;
