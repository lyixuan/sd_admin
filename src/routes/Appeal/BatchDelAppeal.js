import React, { Component } from 'react';
import { connect } from 'dva';
import { Select, Icon, message } from 'antd';
import StepLayout from '../../layouts/stepLayout';
import StepInput from '../../selfComponent/setpForm/stepInput';
import StepSucess from '../../selfComponent/setpForm/stepSucess';
// import CheckResult from '../../selfComponent/setpForm/checkResult';
import { clearConfirm, setConfirm } from '../../utils/reloadConfirm';

const { Option } = Select;
@connect(({ quality, loading }) => ({
  quality,
  loading,
}))
class BatchDelAppeal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: true,
      appealType: null,
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

  // IM工单选择
  onSelectChange = val => {
    this.setState({ appealType: val });
  };

  getNums = nums => {
    this.props.dispatch({
      type: 'quality/getNums',
      payload: nums,
    });
  };
  getAppealType = appealType => {
    this.props.dispatch({
      type: 'quality/getAppealType',
      payload: appealType,
    });
  };
  // 初始化一些值
  initParamsFn = (disableDel, nums) => {
    const num = !nums ? this.props.quality.nums : '';
    this.props.dispatch({
      type: 'quality/initParams',
      payload: { disableDel, nums: num },
    });
  };
  // 第一步，验证咨询id
  verifyConsultIds = params => {
    this.props.dispatch({
      type: 'quality/verifyConsultIds',
      payload: { params },
    });
  };
  // 第二步 批量申诉 id
  batchSave = params => {
    this.props.dispatch({
      type: 'quality/batchSave',
      payload: { params },
    });
  };
  fetchDel = params => {
    this.props.dispatch({
      type: 'quality/delQuality',
      payload: { params },
    });
  };
  editCurrent = current => {
    this.props.dispatch({
      type: 'quality/editCurrent',
      payload: { current },
    });
  };
  editLoading = isLoading => {
    const { appealType } = this.state;
    if (!appealType) {
      return;
    }
    this.props.dispatch({
      type: 'quality/editLoading',
      payload: { isLoading },
    });
  };
  historyFn() {
    this.props.history.push({
      pathname: '/appeal/appealList',
    });
  }

  render() {
    const { verifyConsultIdsData, nums, current, isLoading } = this.props.quality;
    const { appealType } = this.state;
    let { disableDel } = this.props.quality;
    let { isDisabled } = this.state;
    const data = verifyConsultIdsData ? verifyConsultIdsData.data : null;
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
    const dataSource = !data || !data.successNums ? [] : data.successNums;

    const successNums = [];
    if (dataSource.length > 0) {
      data.successNums.forEach(item => {
        successNums.push(item.qualityNum);
      });
    }
    const failNums = data ? data.failIdList : [];
    const successSize = data ? successIdListLen : 0;
    // const inputCo，ntent = data ? data.failSize > 0 : null;
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
        title: '输入咨询ID',
        content: (
          <div>
            <div style={{ width: '590px', margin: '20px auto 0' }}>
              <span style={{ marginRight: '20px' }}>*申诉类型</span>
              <Select
                onChange={this.onSelectChange}
                placeholder="请选择"
                style={{ width: 230, height: 32 }}
                defaultValue={appealType}
              >
                <Option value="15">IM未回复</Option>
                <Option value="16">IM不满意</Option>
                <Option value="17">IM不及时</Option>
              </Select>
            </div>
            <StepInput
              inputTitle="请输入想删除的 “咨询ID”："
              inputContent="true"
              inputTip="true"
              nums={nums}
              appealType={appealType}
              getNums={param => {
                this.getNums(param);
              }}
              getAppealType={param => {
                this.getAppealType(param);
              }}
              callBackParent={bol => {
                this.onChildChange(bol);
              }}
            />
          </div>
        ),
      },
      {
        title: '校验咨询ID',
        content: (
          <StepInput
            message="搜索失败的咨询ID: (可能原因: 匹配失败、申诉中、已申诉)"
            inputInfo={inputInfo}
            nums={nums}
            faileData={failNums}
            appealType={appealType}
            getAppealType={param => {
              this.getAppealType(param);
            }}
            inputContent="false"
            disabled
          />
        ),
      },
      {
        title: '操作成功',
        content: <StepSucess isDelImg="true" tipSucess={successTips} />,
      },
    ];
    return (
      <StepLayout
        routerData={this.props.routerData}
        title="删除质检"
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
          if (!appealType) {
            message.error('申诉类型不能为空');
            return;
          }
          this.verifyConsultIds({ consultIds: nums, appealType });
        }}
        step2Fetch={() => {
          this.editCurrent(2);
          this.batchSave({ appealType, successIdList: data.successIdList });
        }}
        editLoading={loading => {
          this.editLoading(loading);
        }}
        appealType={appealType}
        getAppealType={param => {
          this.getAppealType(param);
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
