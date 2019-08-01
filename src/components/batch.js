import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import StepLayout from '../layouts/stepLayout';
import StepInput from '../selfComponent/setpForm/stepInput';
import StepSucess from '../selfComponent/setpForm/stepSucess';
import { clearConfirm, setConfirm } from '../utils/reloadConfirm';

@connect(({ batch, loading }) => ({
  batch,
  loading,
}))
class BatchDelAppeal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: true,
      stepLayoutTitle: this.props.stepLayoutTitle || '删除数据',
      step1Tile: this.props.step1Tile || '输入子订单',
      step1Msg: this.props.step1Msg || '请输入想删除的 “子订单ID”：',
      step2Tile: this.props.step2Tile || '校验子订单',
      step2Msg: this.props.step2Msg || '搜索失败的子订单ID:',
      step3Tile: '删除成功',
      name: this.props.name || 'batch',
      gotoUrl: this.props.gotoUrl || '/appeal/appealList',
    };
  }

  componentDidMount() {
    // init current
    this.editCurrent(0);
  }

  // 离开页面的时候，把disableDel，nums恢复默认值null
  componentWillUnmount() {
    clearConfirm();
    this.initParamsFn(null, 'clear');
  }
  // 回调
  onChildChange = bol => {
    this.setState({
      isDisabled: bol,
    });
  };

  getNums = nums => {
    this.props.dispatch({
      type: `${this.state.name}/getNums`,
      payload: nums,
    });
  };
  // 初始化一些值
  initParamsFn = (disableDel, nums) => {
    const num = !nums ? this.props.batch.nums : '';
    this.props.dispatch({
      type: `${this.state.name}/initParams`,
      payload: { disableDel, nums: num },
    });
  };
  // 第一步，验证子订单id
  verifyOrdIdsFn = params => {
    this.props.dispatch({
      type: `${this.state.name}/verifyOrdIds`,
      payload: { params },
    });
  };
  // 第二步 删除子订单id
  deleteOrdIdsFn = params => {
    this.props.dispatch({
      type: `${this.state.name}/deleteOrdIds`,
      payload: { params },
    });
  };
  editCurrent = current => {
    this.props.dispatch({
      type: `${this.state.name}/editCurrent`,
      payload: { current },
    });
  };
  editLoading = isLoading => {
    this.props.dispatch({
      type: `${this.state.name}/editLoading`,
      payload: { isLoading },
    });
  };
  historyFn() {
    this.props.history.push({
      pathname: this.state.gotoUrl,
    });
  }

  render() {
    const { verifyOrdIdsData, nums, current, isLoading } = this.props.batch;
    const { stepLayoutTitle, step1Tile, step2Tile, step3Tile, step1Msg, step2Msg } = this.state;
    let { disableDel } = this.props.batch;
    let { isDisabled } = this.state;
    const data = verifyOrdIdsData ? verifyOrdIdsData.data : null;
    let [successIdListLen, failIdListLen, totalLen] = [0, 0, 0];
    if (data) {
      successIdListLen = data.successIdList.length || 0;
      failIdListLen = data.failIdList.length || 0;
      totalLen = successIdListLen + failIdListLen;
      // 判断 大于一条走下一步
      if (successIdListLen) {
        isDisabled = true;
        disableDel = false;
      }
    }

    const failNums = data ? data.failIdList : [];
    const successSize = data ? successIdListLen : 0;
    // 有数据之后刷新页面提示弹框
    if (!isDisabled) {
      setConfirm();
    } else {
      clearConfirm();
    }

    const tipSucess = `您已成功删除 ${successSize} 条数据！`;
    const successTips = <p>删除数据成功，请在申诉管理列表页查看最新的更新状态。</p>;

    const inputInfo = (
      <div style={{ width: '100%', paddingLeft: '26px' }}>
        检验数据总数: {totalLen} 条数据
        <span style={{ marginLeft: '100px' }}>
          <Icon
            style={{ fontSize: '16px', color: '#52c9c2', marginRight: '10px' }}
            type="check-circle"
          />
          {successIdListLen}条
        </span>
        <span style={{ marginLeft: '30px' }}>
          <Icon
            style={{ fontSize: '16px', color: '#C40404', marginRight: '10px' }}
            type="close-circle"
          />
          {failIdListLen}条
        </span>
      </div>
    );
    const steps = [
      {
        title: step1Tile,
        content: (
          <div>
            <StepInput
              inputTitle={step1Msg}
              inputContent="true"
              inputTip="true"
              nums={nums}
              getNums={param => {
                this.getNums(param);
              }}
              callBackParent={bol => {
                this.onChildChange(bol);
              }}
            />
          </div>
        ),
      },
      {
        title: step2Tile,
        content: (
          <StepInput
            message={step2Msg}
            inputInfo={inputInfo}
            nums={nums}
            faileData={failNums}
            inputContent="false"
            disabled
          />
        ),
      },
      {
        title: step3Tile,
        content: <StepSucess isDelImg="true" tipSucess={successTips} />,
      },
    ];
    return (
      <StepLayout
        routerData={this.props.routerData}
        title={stepLayoutTitle}
        steps={steps}
        tipSucess={tipSucess}
        isDisabled={isDisabled}
        disableDel={disableDel}
        goBack={() => {
          this.historyFn();
        }}
        callBackParent={bol => {
          this.onChildChange(bol);
        }}
        initParamsFn={dis => {
          this.initParamsFn(dis);
        }}
        // 第一步step 点击下一步的操作
        step1Fetch={() => {
          this.verifyOrdIdsFn({ ordIds: nums });
        }}
        step2Fetch={() => {
          this.editCurrent(2);
          this.deleteOrdIdsFn({ successIdList: data.successIdList });
        }}
        editLoading={loading => {
          this.editLoading(loading);
        }}
        isLoading={isLoading}
        current={current}
        editCurrent={param => {
          this.editCurrent(param);
        }}
      />
    );
  }
}

export default BatchDelAppeal;
