import React, { Component } from 'react';
import { connect } from 'dva';
import StepLayout from '../../layouts/stepLayout';
import StepInput from '../../selfComponent/setpForm/stepInput';
import StepSucess from '../../selfComponent/setpForm/stepSucess';
import StepTable from '../../selfComponent/setpForm/stepTable';

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
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'blComplain/testUpload',
      payload: { params: '' },
    });
  }

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
  // 回调
  historyFn() {
    this.props.history.push({
      pathname: '/complaint/complaintList',
    });
  }
  render() {
    const { preDelData, nums } = this.props.blComplain;
    const data = preDelData ? preDelData.data : null;

    const failNums = data ? data.failNums : 'ww';
    const successNums = data ? data.successNums : 'ww';
    const inputContent = data ? data.failSize > 0 : null;
    console.log({ inputContent });
    const { dataSource } = this.state;
    const columns = !this.columns ? [] : this.columns;

    const tipSucess = '您已成功删除 1500 条数据！';
    const checkRes = !data ? null : (
      <div>
        <span>校验数据总数：</span>
        <span style={{ color: '#00A3FF' }}>{data.totalSize} </span>
        <span style={{ marginRight: '50px' }}>条数据</span>
        <span>成功：</span>
        <span style={{ color: '#00A3FF' }}>{data.successSize} </span>
        <span style={{ marginRight: '50px' }}>条</span>
        <span>失败：</span>
        <span style={{ color: '#F5212D' }}>{data.failSize} </span>
        <span>条</span>
      </div>
    );
    const steps = [
      {
        title: '输入编号',
        content: (
          <StepInput
            inputTitle="请输入想删除的 “子订单编号”："
            inputContent="true"
            inputTip="true"
            disabled={false}
            getNums={param => {
              this.getNums(param);
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
          step1Fetch={param => {
            this.fetchPreDel(param);
          }}
          step2Fetch={param => {
            this.fetchDel(param);
          }}
          nums={nums}
          successNums={successNums}
        />
      </div>
    );
  }
}

export default ComplaintDel;
