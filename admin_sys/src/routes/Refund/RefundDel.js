import React, { Component } from 'react';
import StepLayout from '../../layouts/stepLayout';
import StepInput from '../../selfComponent/setpForm/stepInput';
import StepSucess from '../../selfComponent/setpForm/stepSucess';
import StepTable from '../../selfComponent/setpForm/stepTable';

class RefundDel extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '序号',
        dataIndex: 'key',
        width: '100px',
      },
      {
        title: '子订单编号',
        dataIndex: 'name',
        width: '100px',
      },
      {
        title: '投诉时间',
        dataIndex: 'role',
        width: '100px',
      },
      {
        title: '学生名称/id',
        dataIndex: 'email',
        width: '100px',
      },
      {
        title: '老师名称',
        dataIndex: 'status',
        width: '100px',
      },
      {
        title: '学院/家族/小组不存在',
        dataIndex: 'status2',
        width: '152px',
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
  // 回调
  onChildChange = bol => {
    this.setState({
      isDisabled: bol,
    });
  };
  historyFn() {
    this.props.history.push({
      pathname: '/refund/refundList',
    });
  }
  render() {
    const { dataSource, isDisabled } = this.state;
    const columns = !this.columns ? [] : this.columns;

    const tipSucess = '您已成功删除 1500 条数据！';
    const steps = [
      {
        title: '输入编号',
        content: (
          <StepInput
            inputTitle="请输入想删除的 “子订单编号”："
            inputContent="1212"
            inputTip="true"
            callBackParent={bol => {
              this.onChildChange(bol);
            }}
          />
        ),
      },
      {
        title: '校验编号',
        content: <StepInput inputInfo="校验数据总数：5000 条数据 " inputContent="1212" />,
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
        isDisabled={isDisabled}
      />
    );
  }
}

export default RefundDel;
