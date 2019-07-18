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
  // 初始化一些值
  initParamsFn = (disableDel, nums) => {
    const num = !nums ? this.props.quality.nums : '';
    this.props.dispatch({
      type: 'quality/initParams',
      payload: { disableDel, nums: num },
    });
  };
  verifyConsultIds = params => {
    this.props.dispatch({
      type: 'quality/verifyConsultIds',
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
      pathname: '/quality/qualityList',
    });
  }
  // 初始化tabale 列数据
  // fillDataSource = val => {
  //   const data = [];
  //   val.map((item, index) =>
  //     data.push({
  //       key: index + 1,
  //       qualityNum: item.qualityNum,
  //       countValue: item.countValue,
  //       qualityTypeName: item.qualityTypeName,
  //       teaName: item.teaName,
  //       name:
  //         item.groupName && item.familyName
  //           ? `${item.collegeName} | ${item.familyName} | ${item.groupName}`
  //           : item.familyName ? `${item.collegeName} | ${item.familyName}` : `${item.collegeName}`,
  //     })
  //   );
  //   return data;
  // };
  // columnsData = () => {
  //   const columns = [
  //     {
  //       title: '序号',
  //       dataIndex: 'key',
  //     },
  //     {
  //       title: '质检编号',
  //       dataIndex: 'qualityNum',
  //     },
  //     {
  //       title: '扣除学分',
  //       dataIndex: 'countValue',
  //     },
  //     {
  //       title: '质检等级',
  //       dataIndex: 'qualityTypeName',
  //     },
  //     {
  //       title: '老师名称',
  //       dataIndex: 'teaName',
  //     },
  //     {
  //       title: '学院 | 家族 | 小组',
  //       dataIndex: 'name',
  //     },
  //   ];

  //   return columns;
  // };
  render() {
    const { verifyConsultIdsData, nums, current, disableDel, isLoading } = this.props.quality;
    const { isDisabled, appealType } = this.state;
    const data = verifyConsultIdsData ? verifyConsultIdsData.data : null;
    let [successIdListLen, failIdListLen, totalLen] = [0, 0, 0];
    if (data) {
      successIdListLen = data.successIdList.length || 0;
      failIdListLen = data.failIdList.length || 0;
      totalLen = successIdListLen + failIdListLen;
    }
    const dataSource = !data || !data.successNums ? [] : data.successNums;
    // const columns = !this.columnsData() ? [] : this.columnsData();

    const successNums = [];
    if (dataSource.length > 0) {
      data.successNums.forEach(item => {
        successNums.push(item.qualityNum);
      });
    }
    // const failNums = data ? data.failNums : [];
    const successSize = data ? data.successSize : 0;
    // const inputCo，ntent = data ? data.failSize > 0 : null;

    // 有数据之后刷新页面提示弹框
    if (!isDisabled) {
      setConfirm();
    } else {
      clearConfirm();
    }

    const tipSucess = `您已成功删除 ${successSize} 条数据！`;
    // const checkRes = !data ? null : (
    //   <CheckResult totalSize={data.totalSize} successSize={successSize} failSize={data.failSize} />
    // );
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
              >
                <Option value="15">IM未回复</Option>
                <Option value="16">IM不满意</Option>
                <Option value="17">IM不及时</Option>
              </Select>
            </div>
            <StepInput
              inputTitle="请输入想删除的 “申诉ID”："
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
        title: '校验咨询ID',
        content: (
          <StepInput
            message="搜索失败的咨询ID: (可能原因: 匹配失败、申诉中、已申诉)"
            inputInfo={inputInfo}
            nums={nums}
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
          // /batchAppeal/verifyConsultIds
          this.verifyConsultIds({ consultIds: nums, appealType });
        }}
        step2Fetch={() => {
          this.editCurrent(2);
        }}
        step3Fetch={() => {
          this.fetchDel({ nums: successNums.join(' ') });
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
