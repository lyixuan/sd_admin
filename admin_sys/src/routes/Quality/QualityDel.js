import React, { Component } from 'react';
import { connect } from 'dva';
import StepLayout from '../../layouts/stepLayout';
import StepInput from '../../selfComponent/setpForm/stepInput';
import StepSucess from '../../selfComponent/setpForm/stepSucess';
import StepTable from '../../selfComponent/setpForm/stepTable';
import CheckResult from '../../selfComponent/setpForm/checkResult';
import { clearConfirm, setConfirm } from '../../utils/reloadConfirm';

@connect(({ quality, loading }) => ({
  quality,
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
  // 回调
  onChildChange = bol => {
    this.setState({
      isDisabled: bol,
    });
  };
  getNums = nums => {
    this.props.dispatch({
      type: 'quality/getNums',
      payload: nums,
    });
  };
  fetchPreDel = params => {
    this.props.dispatch({
      type: 'quality/preDelQuality',
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
  historyFn() {
    this.props.history.push({
      pathname: '/quality/qualityList',
    });
  }
  columnsData = () => {
    const columns = [
      {
        title: '子订单编号',
        dataIndex: 'name',
        width: '100px',
      },
      {
        title: '编号已存在',
        dataIndex: 'role',
        width: '100px',
      },
      {
        title: '必填项缺失',
        dataIndex: 'email',
        width: '100px',
      },
      {
        title: '班主任组织关系匹配失败',
        dataIndex: 'status',
        width: '100px',
      },
      {
        title: '学院/家族/小组不存在',
        dataIndex: 'status2',
        width: '150px',
      },
      {
        title: '编号重复',
        dataIndex: 'status1',
        width: '100px',
      },
    ];

    return columns;
  };
  render() {
    const { preDelData, checkDelList, nums, current } = this.props.quality;
    const { isDisabled } = this.state;

    const dataSource = !checkDelList ? null : checkDelList;
    const columns = !this.columnsData() ? [] : this.columnsData();

    const data = preDelData ? preDelData.data : null;
    const successArr = [];
    if (data && data.successNums.length > 0) {
      data.successNums.forEach(item => {
        successArr.push(item.ordId);
      });
    }
    const failNums = data ? data.failNums : [];
    const successSize = data ? data.successSize : 0;
    const inputContent = data ? data.failSize > 0 : null;

    // 有数据之后刷新页面提示弹框
    if (!isDisabled) {
      setConfirm();
    } else {
      clearConfirm();
    }

    const tipSucess = `您已成功删除 ${successSize} 条数据！`;
    const checkRes = !data ? null : (
      <CheckResult totalSize={data.totalSize} successSize={successSize} failSize={data.failSize} />
    );
    const steps = [
      {
        title: '输入编号',
        content: (
          <StepInput
            inputTitle="请输入想删除的 “质检编号”："
            inputContent="true"
            inputTip="true"
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
            tableTitle="请确认是否删除以下'质检'编号："
            dataSource={dataSource}
            columns={columns}
            scroll={{ y: 264 }}
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
        title="删除质检"
        steps={steps}
        tipSucess={tipSucess}
        isDisabled={isDisabled}
        goBack={() => {
          this.historyFn();
        }}
        step1Fetch={() => {
          this.fetchPreDel({ nums });
        }}
        step2Fetch={() => {
          this.editCurrent(2);
        }}
        step3Fetch={() => {
          this.fetchDel({ nums: successArr.join(' ') });
        }}
        current={current}
        editCurrent={param => {
          this.editCurrent(param);
        }}
      />
    );
  }
}

export default RefundDel;
