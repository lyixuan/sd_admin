import React, { Component } from 'react';
import { connect } from 'dva';
import { qualityUpload } from '../../services/api';
import { setConfirm, clearConfirm } from '../../utils/reloadConfirm';
import StepLayout from '../../layouts/stepLayout';
import StepUpload from '../../selfComponent/setpForm/stepUpload';
import StepTable from '../../selfComponent/setpForm/stepTable';
import StepSucess from '../../selfComponent/setpForm/stepSucess';

@connect(({ blComplain, loading }) => ({
  blComplain,
  loading,
}))
class ComplaintAdd extends Component {
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
      isDisabled: true,
      checkParams: '',
    };
  }

  componentDidMount() {
    this.editCurrent(0);
  }
  // 回调
  onChildChange = (bol, checkParams) => {
    this.setState({
      isDisabled: bol,
      checkParams,
    });
  };
  // 校验excel文件
  fetchCheckData = params => {
    this.props.dispatch({
      type: 'blComplain/checkComplain',
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
    const { current } = this.props.blComplain;
    const { dataSource, isDisabled, checkParams } = this.state;

    // 有数据之后刷新页面提示弹框
    if (!isDisabled) {
      setConfirm();
    } else {
      clearConfirm();
    }

    const columns = !this.columns ? [] : this.columns;

    const tipSucess = '您已成功上传 1500 条数据！';
    const steps = [
      {
        title: '选择Excel',
        content: (
          <StepUpload
            uploadUrl={qualityUpload()}
            callBackParent={(bol, params) => {
              this.onChildChange(bol, params);
            }}
          />
        ),
      },
      {
        title: '校验文件',
        content: (
          <StepTable
            onlyTable="true"
            dataSource={dataSource}
            columns={columns}
            scroll={{ y: 264 }}
          />
        ),
      },
      {
        title: '上传成功',
        content: <StepSucess isDelImg="false" tipSucess={tipSucess} />,
      },
    ];
    return (
      <StepLayout
        title="添加投诉"
        steps={steps}
        tipSucess={tipSucess}
        isDisabled={isDisabled}
        goBack={() => {
          this.historyFn();
        }}
        step1Fetch={() => {
          this.fetchCheckData({ additionalProp1: checkParams });
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

export default ComplaintAdd;
