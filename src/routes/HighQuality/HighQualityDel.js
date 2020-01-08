import React, { Component } from 'react';
import { connect } from 'dva';
import StepLayout from '../../layouts/stepLayout';
import StepInput from '../../selfComponent/setpForm/stepInput';
import StepSucess from '../../selfComponent/setpForm/stepSucess';
import StepTable from '../../selfComponent/setpForm/stepTable';
import CheckResult from '../../selfComponent/setpForm/checkResult';
import { trim } from '../../utils/utils';
import { clearConfirm, setConfirm } from '../../utils/reloadConfirm';

@connect(({ highQuality, loading }) => ({
  highQuality,
  loading,
}))
class RefundDel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisabled: true,
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
      type: 'highQuality/getNums',
      payload: nums,
    });
  };
  // 初始化一些值
  initParamsFn = (disableDel, nums) => {
    const num = !nums ? this.props.highQuality.nums : '';
    this.props.dispatch({
      type: 'highQuality/initParams',
      payload: { disableDel, nums: num },
    });
  };
  fetchPreDel = params => {
    this.props.dispatch({
      type: 'highQuality/UGCdeleteCheck',
      payload: { params },
    });
  };
  fetchDel = uniqueKey => {
    this.props.dispatch({
      type: 'highQuality/UGCdeleteRecommend',
      payload: { uniqueKey },
    });
  };
  editCurrent = current => {
    this.props.dispatch({
      type: 'highQuality/editCurrent',
      payload: { current },
    });
  };
  fetchCheckDel = uniqueKey => {
    this.props.dispatch({
      type: 'highQuality/UGCdeleteReview',
      payload: { uniqueKey },
    });
  };
  editLoading = isLoading => {
    this.props.dispatch({
      type: 'highQuality/editLoading',
      payload: { isLoading },
    });
  };
  historyFn() {
    this.props.history.push({
      pathname: '/highQuality/highQualityList',
    });
  }
  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index + 1,
        code: item.code,
        scoreDate: item.scoreDate,
        name:
          item.groupName && item.familyName
            ? `${item.collegeName} | ${item.familyName} | ${item.groupName}`
            : item.familyName ? `${item.collegeName} | ${item.familyName}` : `${item.collegeName}`,
        stuName: item.stuName,
        cpName: item.cpName,
        ugcType: this.otherUgcType(item.ugcType),
        countValue: item.countValue,
      })
    );
    return data;
  };
  // 优质帖类型回显
  otherUgcType = type => {
    if (type === 1) {
      return '社区优质帖';
    } else if (type === 2) {
      return '知乎优质帖';
    } else {
      return '知乎排名帖';
    }
  };
  columnsData = () => {
    const columns = [
      {
        title: '编号',
        dataIndex: 'code',
      },
      {
        title: '学分日期',
        dataIndex: 'scoreDate',
      },

      {
        title: '组织',
        dataIndex: 'name',
      },
      {
        title: '学员姓名',
        dataIndex: 'stuName',
      },
      {
        title: '老师姓名',
        dataIndex: 'cpName',
      },
      {
        title: '类型',
        dataIndex: 'ugcType',
      },
      {
        title: '学分',
        dataIndex: 'countValue',
      },
    ];

    return columns;
  };
  render() {
    const { preDelData, delData, nums, current, disableDel, isLoading } = this.props.highQuality;
    const { isDisabled } = this.state;
    const data = preDelData ? preDelData.data : null;

    const dataSource = !delData ? [] : this.fillDataSource(delData);
    const columns = !this.columnsData() ? [] : this.columnsData();

    const failNums = data ? data.failList : [];

    const successSize = data ? data.successCount : 0;
    const inputContent = data ? data.failCount > 0 : null;

    // 有数据之后刷新页面提示弹框
    if (!isDisabled) {
      setConfirm();
    } else {
      clearConfirm();
    }

    const tipSucess = `您已成功删除 ${successSize} 条数据！`;
    const checkRes = !data ? null : (
      <CheckResult totalSize={data.total} successSize={successSize} failSize={data.failCount} />
    );
    const steps = [
      {
        title: '输入编号',
        content: (
          <StepInput
            inputTitle="请输入想删除的 “编号”："
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
        ),
      },
      {
        title: '校验编号',
        content: (
          <StepInput
            inputInfo={checkRes}
            inputContent={inputContent}
            disabled
            faileData={failNums}
          />
        ),
      },
      {
        title: '复核数据',
        content: (
          <StepTable
            tableTitle="请确认是否删除以下数据："
            dataSource={dataSource}
            columns={columns}
          />
        ),
      },
      {
        title: '删除成功',
        content: <StepSucess isDelImg="true" tipSucess={tipSucess} />,
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
        step1Fetch={() => {
          this.fetchPreDel({ codeStr: trim(nums) });
        }}
        step2Fetch={() => {
          // this.editCurrent(2);
          this.fetchCheckDel(data.uniqueKey);
        }}
        step3Fetch={() => {
          this.fetchDel(data.uniqueKey);
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

export default RefundDel;
