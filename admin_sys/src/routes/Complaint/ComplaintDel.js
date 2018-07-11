import React, { Component } from 'react';
import { connect } from 'dva';
import StepLayout from '../../layouts/stepLayout';
import StepInput from '../../selfComponent/setpForm/stepInput';
import StepSucess from '../../selfComponent/setpForm/stepSucess';
import StepTable from '../../selfComponent/setpForm/stepTable';
import CheckResult from '../../selfComponent/setpForm/checkResult';

@connect(({ blComplain, loading }) => ({
  blComplain,
  loading,
}))
class ComplaintDel extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '序号',
        dataIndex: 'role',
        width: '100px',
      },
      {
        title: '投诉时间',
        dataIndex: 'email',
        width: '100px',
      },
      {
        title: '学生名称/id',
        dataIndex: 'status1',
        width: '100px',
      },
      {
        title: '老师名称',
        dataIndex: 'status2',
        width: '150px',
      },
      {
        title: '学院/家族/小组',
        dataIndex: 'status',
        width: '100px',
      },
      {
        title: '扣分值',
        dataIndex: 'role3',
        width: '100px',
      },
      {
        title: '编号',
        dataIndex: 'role2',
        width: '100px',
      },
    ];

    const dataSource = [
      {
        key: 1,
        name: `张三`,
        role: `院长`,
        status: `启用`,
        email: `hello@sunlands.com`,
      },
      {
        key: 2,
        name: `王五`,
        role: `学员`,
        status: `启用`,
        email: `hello@sunlands.com`,
      },
      {
        key: 3,
        name: `赵六`,
        role: `院长`,
        status: `禁止`,
        email: `hello@sunlands.com`,
      },
    ];
    this.state = {
      dataSource: !dataSource ? [] : dataSource,
      isDisabled: true,
    };
  }

  componentDidMount() {
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
      type: 'blComplain/getNums',
      payload: nums,
    });
  };
  fetchPreDel = params => {
    this.props.dispatch({
      type: 'blComplain/preDelComplain',
      payload: { params },
    });
  };
  fetchDel = params => {
    this.props.dispatch({
      type: 'blComplain/delComplain',
      payload: { params },
    });
  };
  editCurrent = current => {
    this.props.dispatch({
      type: 'blComplain/editCurrent',
      payload: { current },
    });
  };
  historyFn() {
    this.props.history.push({
      pathname: '/complaint/complaintList',
    });
  }
  render() {
    const { preDelData, nums, current } = this.props.blComplain;
    const data = preDelData ? preDelData.data : null;

    const failNums = data ? data.failNums : 'ww';
    const successNums = data ? data.successNums : 'ww';
    const inputContent = data ? data.failSize > 0 : null;

    const { dataSource, isDisabled } = this.state;
    const columns = !this.columns ? [] : this.columns;

    const tipSucess = '您已成功删除 1500 条数据！';
    const checkRes = !data ? null : (
      <CheckResult
        totalSize={data.totalSize}
        successSize={data.successSize}
        failSize={data.failSize}
      />
    );
    const steps = [
      {
        title: '输入编号',
        content: (
          <StepInput
            inputTitle="请输入想删除的 “子订单编号”："
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
      <div>
        <StepLayout
          title="删除投诉"
          steps={steps}
          tipSucess={tipSucess}
          goBack={() => {
            this.historyFn();
          }}
          step1Fetch={() => {
            this.fetchPreDel({ nums });
          }}
          step2Fetch={() => {
            this.fetchDel({ nums: successNums });
          }}
          isDisabled={isDisabled}
          current={current}
          editCurrent={param => {
            this.editCurrent(param);
          }}
        />
      </div>
    );
  }
}

export default ComplaintDel;
