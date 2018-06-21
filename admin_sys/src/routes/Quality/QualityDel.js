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

  render() {
    const { dataSource } = this.state;
    const columns = !this.columns ? [] : this.columns;

    const tipSucess = '您已成功删除 1500 条数据！';
    const steps = [
      {
        title: '输入编号',
        content: (
          <StepInput
            inputTitle="请输入想删除的 “子订单编号”："
            inputContent="1212"
            inputTip="true "
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
            tableTitle="请确认是否删除以下'质检'编号："
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
    return <StepLayout title="删除质检" steps={steps} tipSucess={tipSucess} />;
  }
}

export default RefundDel;
