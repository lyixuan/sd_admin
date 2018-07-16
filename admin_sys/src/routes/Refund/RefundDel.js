import React, { Component } from 'react';
import { connect } from 'dva';
import StepLayout from '../../layouts/stepLayout';
import StepInput from '../../selfComponent/setpForm/stepInput';
import StepSucess from '../../selfComponent/setpForm/stepSucess';
import StepTable from '../../selfComponent/setpForm/stepTable';
import CheckResult from '../../selfComponent/setpForm/checkResult';
import { setConfirm, clearConfirm } from '../../utils/reloadConfirm';

@connect(({ blRefund, loading }) => ({
  blRefund,
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
  componentWillUnmount() {
    clearConfirm();
  }
  // 回调
  onChildChange = bol => {
    console.log(bol);
    this.setState({
      isDisabled: bol,
    });
  };
  getNums = nums => {
    this.props.dispatch({
      type: 'blRefund/getNums',
      payload: nums,
    });
  };
  fetchPreDel = params => {
    this.props.dispatch({
      type: 'blRefund/preDelRefund',
      payload: { params },
    });
  };
  fetchDel = params => {
    this.props.dispatch({
      type: 'blRefund/delRefund',
      payload: { params },
    });
  };
  editCurrent = current => {
    this.props.dispatch({
      type: 'blRefund/editCurrent',
      payload: { current },
    });
  };
  historyFn() {
    this.props.history.push({
      pathname: '/refund/refundList',
    });
  }
  // 初始化tabale 列数据
  fillDataSource = val => {
    const data = [];
    val.map((item, index) =>
      data.push({
        key: index + 1,
        bottomLineType: item.bottomLineType,
        bottomLineNum: item.bottomLineNum,
        complainTime: item.complainTime,
        stuName: `${item.stuName}/${item.stuId}`,
        cpName: item.cpName,
        name: `${item.collegeName} / ${item.familyName} / ${item.groupName}`,
      })
    );
    return data;
  };
  columnsData = () => {
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        width: '70px',
      },
      {
        title: '扣分类型',
        dataIndex: 'bottomLineType',
        width: '90px',
      },
      {
        title: '子订单编号',
        dataIndex: 'bottomLineNum',
        width: '100px',
      },
      {
        title: '投诉时间',
        dataIndex: 'complainTime',
        width: '100px',
      },
      {
        title: '学生名称/id',
        dataIndex: 'stuName',
        width: '100px',
      },
      {
        title: '老师名称',
        dataIndex: 'cpName',
        width: '90px',
      },
      {
        title: '学院/家族/小组',
        dataIndex: 'name',
        width: '250px',
      },
    ];
    return columns;
  };
  render() {
    const { preDelData, nums, current } = this.props.blRefund;
    const { isDisabled } = this.state;
    const data = preDelData ? preDelData.data : null;

    const dataSource = !data || !data.successNums ? [] : this.fillDataSource(data.successNums);
    const columns = !this.columnsData() ? [] : this.columnsData();

    const successArr = [];
    if (dataSource.length > 0) {
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
            inputTitle="请输入想删除的 “退费编号”："
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
            tableTitle="请确认是否删除以下数据："
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
        title="删除退费"
        steps={steps}
        tipSucess={tipSucess}
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
        isDisabled={isDisabled}
        current={current}
        editCurrent={param => {
          this.editCurrent(param);
        }}
      />
    );
  }
}

export default RefundDel;
