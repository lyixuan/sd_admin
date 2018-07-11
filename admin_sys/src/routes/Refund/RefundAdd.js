import React, { Component } from 'react';
import { connect } from 'dva';
import { qualityUpload } from '../../services/api';
import StepLayout from '../../layouts/stepLayout';
import StepUpload from '../../selfComponent/setpForm/stepUpload';
import StepTable from '../../selfComponent/setpForm/stepTable';
import StepSucess from '../../selfComponent/setpForm/stepSucess';

@connect(({ blRefund, loading }) => ({
  blRefund,
  loading,
}))
class RefundAdd extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '子订单编号',
        dataIndex: 'name',
        width: '93px',
      },
      {
        title: '编号已存在',
        dataIndex: 'role',
        width: '92px',
      },
      {
        title: '必填项缺失',
        dataIndex: 'email',
        width: '92px',
      },
      {
        title: '班主任组织关系匹配失败',
        dataIndex: 'status',
        width: '164px',
      },
      {
        title: '学院/家族/小组不存在',
        dataIndex: 'status2',
        width: '152px',
      },
      {
        title: '编号重复',
        dataIndex: 'status1',
        width: '82px',
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
  render() {
    const { current } = this.props.blRefund;
    const { dataSource, isDisabled } = this.state;
    const columns = !this.columns ? [] : this.columns;

    const tipSucess = '您已成功上传 1500 条数据！';
    const steps = [
      {
        title: '选择Excel',
        content: (
          <StepUpload
            uploadUrl={qualityUpload()}
            callBackParent={bol => {
              this.onChildChange(bol);
            }}
          />
        ),
      },
      {
        title: '校验文件',
        content: <StepTable onlyTable="true" dataSource={dataSource} columns={columns} />,
      },
      {
        title: '上传成功',
        content: <StepSucess isDelImg="false" tipSucess={tipSucess} />,
      },
    ];
    return (
      <StepLayout
        title="添加退费"
        steps={steps}
        tipSucess={tipSucess}
        isDisabled={isDisabled}
        goBack={() => {
          this.historyFn();
        }}
        step1Fetch={() => {
          this.editCurrent(1);
        }}
        step2Fetch={() => {
          this.editCurrent(2);
        }}
        current={current}
        editCurrent={param => {
          this.editCurrent(param);
        }}
      />
    );
  }
}

export default RefundAdd;
