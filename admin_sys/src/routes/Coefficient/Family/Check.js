import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
// import moment from 'moment';
import { assignUrlParams } from 'utils/utils';
import ContentLayout from '../../../layouts/ContentLayout';
import AuthorizedButton from '../../../selfComponent/AuthorizedButton';
import CoefficientDetail from '../../../selfComponent/Coefficient/CoefficientDetail';
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
        id: 1,
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

  // 返回
  cancel = () => {
    this.props.setRouteUrlParams('/performance/familyCoefficient/list', {});
  };

  render() {
    // const { loading } = this.props;

    // 时间处理
    // const formate = 'YYYY-MM';
    // const formateDate = dateTime.replace(/\./g, '-');
    // const nowDate = moment().format(formate);
    // console.log(formateDate,nowDate)

    const data1={data:[{v1:0,v2:false,v3:0.2,v4:true,v5:8000},{v1:0.2,v2:false,v3:0.4,v4:false,v5:8000},{v1:0.4,v2:true,v3:1,v4:false,v5:8000}],
      key:1,percent:1,basic:1}
    const data2={data:[{v1:0,v2:false,v3:0.2,v4:true,v5:8000},{v1:0.2,v2:false,v3:0.4,v4:false,v5:8000},{v1:0.4,v2:true,v3:1,v4:false,v5:8000}],
      key:1,percent:1,basic:1}
    const data3={data:[{v1:0,v2:false,v3:0.2,v4:true,v5:8},{v1:0.2,v2:false,v3:0.4,v4:false,v5:8},{v1:0.4,v2:true,v3:1,v4:false,v5:8}],
      key:1,percent:1,basic:2}
    const data4={data:[{v1:0,v2:false,v3:0.2,v4:true,v5:8},{v1:0.2,v2:false,v3:0.4,v4:false,v5:8},{v1:0.4,v2:true,v3:1,v4:false,v5:8}],
      key:1,percent:1,basic:3}
    const data5={data:[{v1:1,v2:false,v3:20,v4:true,v5:2},{v1:20,v2:false,v3:40,v4:false,v5:1.5},{v1:40,v2:true,v3:100,v4:false,v5:2}],
      key:1,percent:2,basic:3}
    return (
      <ContentLayout
        routerData={this.props.routerData}
        contentButton={
          <div>
            <span className={common.titleWord}>生效周期 ：2018.10 ～ 至今</span>
            <div className={common.rangeContent}>
              <div >
                <div className={common.rangeItemContent}>
                  <span className={common.titleWord}>人均在服学员排名比 (自考)</span>
                  <CoefficientDetail dataSource={data1}  />
                </div>
                <div className={common.xSpin} />
                <div className={common.rangeItemContent}>
                  <span className={common.titleWord}>人均在服学员排名比 (壁垒)</span>
                  <CoefficientDetail dataSource={data2} />
                </div>
                <div className={common.xSpin} />
                <div className={common.rangeItemContent}>
                  <span className={common.titleWord}>日均学分排名比 (自考)</span>
                  <CoefficientDetail dataSource={data3} />
                </div>
                <div className={common.xSpin} />
                <div className={common.rangeItemContent}>
                  <span className={common.titleWord}>日均学分排名比 (壁垒)</span>
                  <CoefficientDetail dataSource={data4}  />
                </div>
                <div className={common.xSpin} />
                <div className={common.rangeItemContent}>
                  <span className={common.titleWord}>管理规模</span>
                  <CoefficientDetail dataSource={data5} />
                </div>
                <div style={{height:'30px'}} />
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
